import React from 'react';
import { FaMoneyBillWave, FaChartPie, FaCalendarAlt } from 'react-icons/fa';

function Summary({ summary, categories }) {
  if (!summary) return null;

  const getCategoryColor = (index) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    return colors[index % colors.length];
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card text-white bg-primary mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title">Total This Month</h6>
                <h2 className="mb-0">₹{summary.total.toFixed(2)}</h2>
              </div>
              <FaMoneyBillWave size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-white bg-success mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title">Number of Expenses</h6>
                <h2 className="mb-0">{summary.expense_count}</h2>
              </div>
              <FaCalendarAlt size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card text-white bg-info mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title">Categories Used</h6>
                <h2 className="mb-0">
                  {Object.keys(summary.category_breakdown).length}
                </h2>
              </div>
              <FaChartPie size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(summary.category_breakdown).length > 0 && (
        <div className="col-12 mt-2">
          <div className="card">
            <div className="card-header bg-warning">
              <h6 className="mb-0">Category Breakdown</h6>
            </div>
            <div className="card-body">
              <div className="row">
                {Object.entries(summary.category_breakdown).map(([category, amount], index) => (
                  <div key={category} className="col-md-4 mb-2">
                    <div className={`d-flex justify-content-between align-items-center p-2 bg-light rounded`}>
                      <span className="fw-bold">{category}:</span>
                      <span className={`text-${getCategoryColor(index)} fw-bold`}>
                        ₹{amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;