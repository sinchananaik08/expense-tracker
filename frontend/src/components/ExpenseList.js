import React, { useState } from 'react';
import { deleteExpense, updateExpense } from '../services/api';
import { FaTrash, FaSort, FaSortUp, FaSortDown, FaEdit, FaSearch, FaTimes } from 'react-icons/fa';

function ExpenseList({ expenses, categories, onExpenseDeleted, onExpenseUpdated, onError }) {
  const [deletingId, setDeletingId] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      onExpenseDeleted();
    } catch (err) {
      console.error('Error deleting expense:', err);
      onError('Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      amount: expense.amount,
      description: expense.description,
      category_id: expense.category_id,
      date: expense.date.split('T')[0]
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateExpense(editingExpense.id, {
        amount: parseFloat(editForm.amount),
        description: editForm.description.trim(),
        category_id: parseInt(editForm.category_id),
        date: editForm.date + 'T00:00:00'
      });
      setEditingExpense(null);
      onExpenseUpdated();
    } catch (err) {
      console.error('Error updating expense:', err);
      onError('Failed to update expense');
    } finally {
      setUpdating(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterCategory('');
  };

  const hasActiveFilters = searchText || filterCategory;

  // Apply search and category filter
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory = filterCategory
      ? expense.category_id === parseInt(filterCategory)
      : true;
    return matchesSearch && matchesCategory;
  });

  // Apply sorting on filtered results
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortField === 'amount') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    } else if (sortField === 'date') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  if (expenses.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <p className="text-muted mb-0">No expenses yet. Add your first expense!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Expense History</h5>
          <span className="badge bg-light text-dark">
            {sortedExpenses.length} of {expenses.length}{' '}
            {expenses.length === 1 ? 'expense' : 'expenses'}
          </span>
        </div>

        {/* Search and Filter Bar */}
        <div className="card-body border-bottom pb-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by description..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              {hasActiveFilters && (
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={clearFilters}
                >
                  <FaTimes className="me-1" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted mb-0">No expenses match your search.</p>
              <button
                className="btn btn-link btn-sm"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                      Date {getSortIcon('date')}
                    </th>
                    <th onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                      Description {getSortIcon('description')}
                    </th>
                    <th>Category</th>
                    <th onClick={() => handleSort('amount')} style={{ cursor: 'pointer' }} className="text-end">
                      Amount {getSortIcon('amount')}
                    </th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedExpenses.map(expense => (
                    <tr key={expense.id}>
                      <td>{formatDate(expense.date)}</td>
                      <td>{expense.description}</td>
                      <td>
                        <span className="badge bg-info">
                          {getCategoryName(expense.category_id)}
                        </span>
                      </td>
                      <td className="text-end fw-bold">
                        ₹{expense.amount.toFixed(2)}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEditClick(expense)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(expense.id)}
                          disabled={deletingId === expense.id}
                        >
                          {deletingId === expense.id ? (
                            <span className="spinner-border spinner-border-sm" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal — unchanged */}
      {editingExpense && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h5 className="modal-title">Edit Expense</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditingExpense(null)}
                />
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      maxLength="200"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category_id"
                      value={editForm.category_id}
                      onChange={handleEditChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingExpense(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-warning"
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenseList;