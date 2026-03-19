import React, { useState } from 'react';
import { createExpense } from '../services/api';
import { FaPlusCircle, FaSpinner } from 'react-icons/fa';

function ExpenseForm({ categories, onExpenseAdded, onError }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFieldErrors({});
    
    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description.trim(),
        category_id: parseInt(formData.category_id),
        date: formData.date + 'T00:00:00'  // FIXED: Added time component
      };
      
      console.log('Sending expense data:', expenseData);
      
      const response = await createExpense(expenseData);
      
      onExpenseAdded(response.data);
      
      // Reset form
      setFormData({
        amount: '',
        description: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
      onError(null);
      
    } catch (err) {
      console.error('Error creating expense:', err);
      
      // Handle different types of errors
      if (err.response?.data?.error) {
        const errorData = err.response.data.error;
        
        // Check if it's a validation error array
        if (Array.isArray(errorData)) {
          // Transform validation errors into field-specific errors
          const fieldErrorMap = {};
          errorData.forEach(err => {
            if (err.loc && err.loc.length > 1) {
              const field = err.loc[1];
              fieldErrorMap[field] = err.msg;
            }
          });
          setFieldErrors(fieldErrorMap);
          onError('Please check the form for errors');
        } else {
          onError(errorData);
        }
      } else {
        onError(err.message || 'Failed to create expense');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="card">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">Add New Expense</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Amount Input */}
            
        <div className="mb-3">
        <label htmlFor="amount" className="form-label">Amount (₹)</label>  
        <input
       type="number"
        className={`form-control ${errors.amount || fieldErrors.amount ? 'is-invalid' : ''}`}
        id="amount"
         name="amount"
         value={formData.amount}
         onChange={handleChange}
         step="0.01"
         min="0.01"
         placeholder="0.00"
         disabled={loading}
        />
            {(errors.amount || fieldErrors.amount) && (
              <div className="invalid-feedback">
                {errors.amount || fieldErrors.amount}
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              className={`form-control ${errors.description || fieldErrors.description ? 'is-invalid' : ''}`}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Lunch at restaurant"
              maxLength="200"
              disabled={loading}
            />
            {(errors.description || fieldErrors.description) && (
              <div className="invalid-feedback">
                {errors.description || fieldErrors.description}
              </div>
            )}
            <small className="text-muted">
              {formData.description.length}/200
            </small>
          </div>

          {/* Category Select */}
          <div className="mb-3">
            <label htmlFor="category_id" className="form-label">Category</label>
            <select
              className={`form-select ${errors.category_id || fieldErrors.category_id ? 'is-invalid' : ''}`}
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              disabled={loading || categories.length === 0}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {(errors.category_id || fieldErrors.category_id) && (
              <div className="invalid-feedback">
                {errors.category_id || fieldErrors.category_id}
              </div>
            )}
            {categories.length === 0 && (
              <small className="text-warning d-block mt-1">
                ⚠️ Please create a category first in the Categories tab
              </small>
            )}
          </div>

          {/* Date Input */}
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className={`form-control ${errors.date || fieldErrors.date ? 'is-invalid' : ''}`}
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
            />
            {(errors.date || fieldErrors.date) && (
              <div className="invalid-feedback">
                {errors.date || fieldErrors.date}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-success w-100"
            disabled={loading || categories.length === 0}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Adding...
              </>
            ) : (
              <>
                <FaPlusCircle className="me-2" />
                Add Expense
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;