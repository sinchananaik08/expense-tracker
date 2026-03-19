import React, { useState } from 'react';
import { deleteExpense } from '../services/api';
import { FaTrash, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

function ExpenseList({ expenses, categories, onExpenseDeleted, onError }) {
  const [deletingId, setDeletingId] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

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

  const sortedExpenses = [...expenses].sort((a, b) => {
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
    <div className="card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Expense History</h5>
        <span className="badge bg-light text-dark">
          {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
        </span>
      </div>
      <div className="card-body p-0">
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
      </div>
    </div>
  );
}

export default ExpenseList;