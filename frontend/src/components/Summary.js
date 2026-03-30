import React from 'react';
import { FaMoneyBillWave, FaChartPie, FaCalendarAlt } from 'react-icons/fa';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

const COLORS = ['#0d6efd', '#198754', '#0dcaf0', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];

function Summary({ summary, categories }) {
  if (!summary) return null;

  const getCategoryColor = (index) => {
    const colors = ['primary', 'success', 'info', 'warning', 'danger'];
    return colors[index % colors.length];
  };

  // Prepare pie chart data from category breakdown
  const pieData = Object.entries(summary.category_breakdown).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }));

  // Prepare bar chart data from category breakdown
  const barData = Object.entries(summary.category_breakdown).map(([name, value]) => ({
    category: name,
    amount: parseFloat(value.toFixed(2))
  }));

  return (
    <div className="row">
      {/* Existing 3 summary cards — unchanged */}
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

      {/* Existing category breakdown — unchanged */}
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
                    <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
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

      {/* Charts — only show if there is data */}
      {pieData.length > 0 && (
        <div className="col-12 mt-4">
          <div className="row">

            {/* Pie Chart */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  <h6 className="mb-0">Spending by Category</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-header bg-success text-white">
                  <h6 className="mb-0">Amount per Category</h6>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                      data={barData}
                      margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, index) => (
                          <Cell
                            key={`bar-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Summary;