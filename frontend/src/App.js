import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseForm from './components/ExpenseForm.js';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import CategoryManager from './components/CategoryManager';
import { getExpenses, getCategories, getMonthlySummary } from './services/api';
import { FaWallet, FaExclamationTriangle } from 'react-icons/fa';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesRes, categoriesRes, summaryRes] = await Promise.all([
        getExpenses(),
        getCategories(),
        getMonthlySummary()
      ]);
      
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
    fetchAllData(); // Refresh summary
  };

  const handleExpenseDeleted = () => {
    fetchAllData(); // Refresh all data
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  if (loading && expenses.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading your expense tracker...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <FaWallet className="me-2" />
            Simple Expense Tracker
          </span>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Error Alert */}
        {error && (
      <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <FaExclamationTriangle className="me-2" />
      <strong>Error:</strong> {error}
      <button 
        type="button" 
        className="btn-close" 
        onClick={() => setError(null)}
        aria-label="Close"
        ></button>
     </div>
  )}

        {/* Summary Cards */}
        {summary && <Summary summary={summary} categories={categories} />}

        {/* Tabs */}
        <ul className="nav nav-tabs mt-4">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveTab('expenses')}
            >
              Expenses
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="tab-content mt-4">
          {activeTab === 'expenses' && (
            <div className="tab-pane active">
              <div className="row">
                <div className="col-md-4">
                  <ExpenseForm 
                    categories={categories} 
                    onExpenseAdded={handleExpenseAdded}
                    onError={setError}
                  />
                </div>
                <div className="col-md-8">
                  <ExpenseList 
                    expenses={expenses}
                    categories={categories}
                    onExpenseDeleted={handleExpenseDeleted}
                    onError={setError}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="tab-pane active">
              <CategoryManager 
                categories={categories}
                onCategoryAdded={handleCategoryAdded}
                onError={setError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;