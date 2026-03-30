import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExpenseForm from './components/ExpenseForm.js';
import ExpenseList from './components/ExpenseList';
import Summary from './components/Summary';
import CategoryManager from './components/CategoryManager';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { getExpenses, getCategories, getMonthlySummary } from './services/api';
import { FaWallet, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Protected route — redirects to /login if not logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

// Main dashboard (your existing app)
function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');

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
    fetchAllData();
  };

  const handleExpenseDeleted = () => {
    fetchAllData();
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
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <FaWallet className="me-2" />
            Simple Expense Tracker
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white">Hi, {user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              <FaSignOutAlt className="me-1" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <FaExclamationTriangle className="me-2" />
            <strong>Error:</strong> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {summary && <Summary summary={summary} categories={categories} />}

        <ul className="nav nav-tabs mt-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
              Expenses
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
              Categories
            </button>
          </li>
        </ul>

        <div className="tab-content mt-4">
          {activeTab === 'expenses' && (
            <div className="tab-pane active">
              <div className="row">
                <div className="col-md-4">
                  <ExpenseForm categories={categories} onExpenseAdded={handleExpenseAdded} onError={setError} />
                </div>
                <div className="col-md-8">
                  <ExpenseList expenses={expenses} categories={categories} onExpenseDeleted={handleExpenseDeleted} onExpenseUpdated={fetchAllData} onError={setError} />
                </div>
              </div>
            </div>
          )}
          {activeTab === 'categories' && (
            <div className="tab-pane active">
              <CategoryManager categories={categories} onCategoryAdded={handleCategoryAdded} onError={setError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Root app with routing
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;