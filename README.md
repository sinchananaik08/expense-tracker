# 💰 Simple Expense Tracker

A full-stack expense tracking application built with Flask (backend) and React (frontend). Track your expenses by category, view monthly summaries, and manage your spending.

## 🚀 Live Demo 
Backend: `http://localhost:5000`
Frontend: `http://localhost:3000`

## 📋 Features

- ✅ Create and manage expense categories
- ✅ Add expenses with amount, description, date, and category
- ✅ View all expenses in sortable table
- ✅ Delete expenses
- ✅ Monthly summary with total spending and category breakdown
- ✅ Indian Rupee (₹) currency support
- ✅ Form validation on both frontend and backend

## 🏗 Architecture

```
expense-tracker/
├── backend/                 # Flask API
│   ├── app/
│   │   ├── models.py       # Database models
│   │   ├── routes.py       # API endpoints  
│   │   ├── schemas.py      # Pydantic validation
│   │   ├── database.py     # DB configuration
│   │   └── tests/          # Pytest suite
│   ├── requirements.txt
│   └── run.py
├── frontend/                # React App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── App.js          # Main component
│   │   └── index.js
│   └── package.json
├── AI_GUIDANCE.md           # AI development guidelines
└── README.md
```

## 🔧 Technical Decisions

|    Decision   | Rationale |
|---------------|-----------|
| **Flask**     | Lightweight, Pythonic, minimal boilerplate, perfect for small APIs 
| **SQLite**    | Zero configuration, file-based, ideal for assessment, easy to backup 
| **SQLAlchemy**| ORM provides abstraction, prevents SQL injection, easy model changes 
| **Pydantic**  | Runtime type checking, automatic validation, clear error messages 
| **React**     | Component reuse, predictable state with hooks, large ecosystem 
| **Bootstrap** | Rapid UI development, responsive out-of-box, consistent styling 
| **pytest**    | Simple test syntax, good Flask integration, detailed output 

## 🤖 AI Usage

This project was developed with assistance from AI (DeepSeek). Here's how AI was used:

### What AI Helped With:
- ✅ Generated initial boilerplate code
- ✅ Suggested error handling patterns
- ✅ Created test cases
- ✅ Helped debug date formatting issues
- ✅ Provided Bootstrap styling examples

### What Was Manually Done:
- ✅ All code was reviewed and understood
- ✅ Critical fixes (date format issue)
- ✅ Testing and validation
- ✅ Currency change to INR
- ✅ UI/UX decisions

### AI Guidelines:
See `AI_GUIDANCE.md` for detailed constraints and rules used when interacting with AI.

## ⚠️ Tradeoffs & Weaknesses

1. **SQLite vs PostgreSQL**: SQLite simpler but less suitable for multi-user scenarios. Can be swapped by changing the database URI.
2. **No Authentication**: Keeps focus on core functionality. Add if multi-user needed.
3. **Bootstrap Styling**: Faster development but less unique. Custom CSS can be added.
4. **No Pagination**: Fine for small datasets. Would need pagination for hundreds of expenses.
5. **Basic Error Logging**: Console logs only. Production would need proper logging service.

## 🧪 Testing

### Backend Tests (11 passing)
```bash
cd backend
python -m pytest -v

Test Coverage Includes:

✅ Category creation ( valid/invalid/duplicate )
✅ Expense creation ( valid/invalid amount, invalid category)
✅ Data retrieval
✅ Deletion
✅ Monthly summary calculation

Manual Testing Scenarios:
✅ Form validation on frontend
✅ Error message display
✅ Date handling

🚀 Running Locally
Prerequisites
Python 3.8+
Node.js 14+
npm or yarn

Backend Setup 
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py
# API runs on http://localhost:5000

Frontend Setup ( React with Node.js)
cd frontend
npm install  # Uses Node.js to install dependencies
npm start    # Uses Node.js to run development server
# App runs on http://localhost:3000

📱 Usage Guide
Create Categories: Go to "Categories" tab → Add category name → Click "Add Category"
Add Expenses: Go to "Expenses" tab → Fill form → Click "Add Expense"
View Summary: Monthly totals show at top with category breakdown
Delete Expenses: Click trash icon next to any expense
Sort Expenses: Click column headers ( Date, Description, Amount)

🔮 Future Enhancements
Easy Additions ( Minimal Impact)
Edit Expenses - Add PUT endpoint and edit button
Date Filter - Add date range picker
Export to CSV - Download expense data
Dark Mode - Add Bootstrap theme toggle

Larger Additions ( Would Require Rearchitecture)
User Authentication - Would need users table, login, JWT
Multiple Currencies - Would need currency conversion
Recurring Expenses - Would need cron jobs, notification system

📝 API Documentation
Categories
GET /api/categories - Get all categories
POST /api/categories - Create category ( {"name": "Food"})

Expenses
GET /api/expenses - Get all expenses ( optional: ?start_date=&end_date=&category_id=)
POST /api/expenses - Create expense ( {"amount": 100, "description": "Lunch", "category_id": 1, "date": "2026-03-17T00:00:00"})
DELETE /api/expenses/<id> - Delete expense

Summary
GET /api/summary/monthly - Get current month summary

👤 Author
Sinchana Naik

🙏 Acknowledgments
Flask documentation
React documentation
Bootstrap for UI components
AI assistance for code generation