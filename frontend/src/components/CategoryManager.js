import React, { useState } from 'react';
import { createCategory } from '../services/api';
import { FaPlus, FaTag } from 'react-icons/fa';

function CategoryManager({ categories, onCategoryAdded, onError }) {
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="row">
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
                {error && (
                  <div className="invalid-feedback">{error}</div>
                )}
                <small className="text-muted">
                  {newCategory.length}/50
                </small>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Add Category
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">Existing Categories</h5>
          </div>
          <div className="card-body">
            {categories.length === 0 ? (
              <p className="text-muted text-center mb-0">
                No categories yet. Add your first category!
              </p>
            ) : (
              <div className="row">
                {categories.map(cat => (
                  <div key={cat.id} className="col-md-4 mb-2">
                    <div className="d-flex align-items-center p-2 bg-light rounded">
                      <FaTag className="text-primary me-2" />
                      <span className="flex-grow-1">{cat.name}</span>
                      <small className="text-muted">
                        ID: {cat.id}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;