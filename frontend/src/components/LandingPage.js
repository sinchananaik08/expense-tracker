import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWallet, FaChartPie, FaTag } from 'react-icons/fa';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <FaWallet className="me-2" />
            Expense Tracker
          </span>
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button
              className="btn btn-light"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="container text-center py-5">
        <h1 className="display-5 fw-bold mb-3">Track your spending,<br />stress less about money</h1>
        <p className="lead text-muted mb-4">
          Add expenses, organise by category, and see exactly where your money goes every month.
        </p>
        <button
          className="btn btn-primary btn-lg me-3"
          onClick={() => navigate('/register')}
        >
          Get Started Free
        </button>
        <button
          className="btn btn-outline-secondary btn-lg"
          onClick={() => navigate('/login')}
        >
          Sign In
        </button>

        {/* Feature cards */}
        <div className="row mt-5 g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <FaWallet size={32} className="text-primary mb-3" />
              <h5>Track Expenses</h5>
              <p className="text-muted">Log every expense with amount, description, category and date in seconds.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <FaChartPie size={32} className="text-success mb-3" />
              <h5>Monthly Summary</h5>
              <p className="text-muted">See your total spending and a full breakdown by category every month.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm p-3">
              <FaTag size={32} className="text-warning mb-3" />
              <h5>Custom Categories</h5>
              <p className="text-muted">Create your own categories like Food, Transport, Shopping and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;