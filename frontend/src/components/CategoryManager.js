import React, { useState } from 'react';
import { createCategory, updateCategoryBudget } from '../services/api';
import { FaPlus, FaTag, FaWallet } from 'react-icons/fa';

function CategoryManager({ categories, onCategoryAdded, onError, summary }) {
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetValue, setBudgetValue] = useState('');
  const [savingBudget, setSavingBudget] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      setError('Category name cannot be empty');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await createCategory({ name: newCategory });
      onCategoryAdded(response.data);
      setNewCategory('');
    } catch (err) {
      console.error('Error creating category:', err);
      const errorMsg = err.response?.data?.error || 'Failed to create category';
      setError(errorMsg);
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleBudgetClick = (cat) => {
    setEditingBudget(cat.id);
    setBudgetValue(cat.budget || '');
  };

  const handleBudgetSave = async (categoryId) => {
    setSavingBudget(true);
    try {
      await updateCategoryBudget(categoryId, budgetValue ? parseFloat(budgetValue) : null);
      setEditingBudget(null);
      onError(null);
      window.location.reload();
    } catch (err) {
      console.error('Error updating budget:', err);
      onError('Failed to update budget');
    } finally {
      setSavingBudget(false);
    }
  };

  const getSpentAmount = (categoryName) => {
    if (!summary || !summary.category_breakdown) return 0;
    return summary.category_breakdown[categoryName] || 0;
  };

  const getBudgetStatus = (spent, budget) => {
    if (!budget) return null;
    const percent = (spent / budget) * 100;
    if (percent >= 100) return { color: 'danger', percent: 100, label: 'Over budget!' };
    if (percent >= 80) return { color: 'warning', percent, label: `${percent.toFixed(0)}% used` };
    return { color: 'success', percent, label: `${percent.toFixed(0)}% used` };
  };

  return (
    <div className="row">
      {/* Add Category Form */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Add Category</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input
                  type="text"
                  className={`form-control ${error ? 'is-invalid' : ''}`}
                  id="categoryName"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g., Groceries"
                  maxLength="50"
                  disabled={loading}
                />
                {error && <div className="invalid-feedback">{error}</div>}
                <small className="text-muted">{newCategory.length}/50</small>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                ) : (
                  <><FaPlus className="me-2" />Add Category</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Categories with Budget */}
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Categories & Budgets</h5>
          </div>
          <div className="card-body">
            {categories.length === 0 ? (
              <p className="text-muted text-center mb-0">
                No categories yet. Add your first category!
              </p>
            ) : (
              <div className="row">
                {categories.map(cat => {
                  const spent = getSpentAmount(cat.name);
                  const status = getBudgetStatus(spent, cat.budget);

                  return (
                    <div key={cat.id} className="col-md-6 mb-3">
                      <div className="p-3 bg-light rounded">
                        {/* Category name and tag */}
                        <div className="d-flex align-items-center mb-2">
                          <FaTag className="text-primary me-2" />
                          <span className="fw-bold flex-grow-1">{cat.name}</span>
                        </div>

                        {/* Spent amount */}
                        <div className="d-flex justify-content-between mb-1">
                          <small className="text-muted">
                            Spent: <strong>₹{spent.toFixed(2)}</strong>
                          </small>
                          {cat.budget && (
                            <small className="text-muted">
                              Budget: <strong>₹{cat.budget.toFixed(2)}</strong>
                            </small>
                          )}
                        </div>

                        {/* Progress bar */}
                        {status && (
                          <>
                            <div className="progress mb-1" style={{ height: '8px' }}>
                              <div
                                className={`progress-bar bg-${status.color}`}
                                style={{ width: `${Math.min(status.percent, 100)}%` }}
                              />
                            </div>
                            <small className={`text-${status.color}`}>
                              {status.label}
                              {status.color === 'danger' && (
                                <span> — Over by ₹{(spent - cat.budget).toFixed(2)}!</span>
                              )}
                            </small>
                          </>
                        )}

                        {/* Budget input */}
                        {editingBudget === cat.id ? (
                          <div className="input-group mt-2">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              value={budgetValue}
                              onChange={(e) => setBudgetValue(e.target.value)}
                              placeholder="Monthly budget"
                              min="0.01"
                              step="0.01"
                              autoFocus
                            />
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleBudgetSave(cat.id)}
                              disabled={savingBudget}
                            >
                              {savingBudget ? '...' : 'Save'}
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingBudget(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm mt-2 w-100"
                            onClick={() => handleBudgetClick(cat)}
                          >
                            <FaWallet className="me-1" />
                            {cat.budget ? 'Edit Budget' : 'Set Budget'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;