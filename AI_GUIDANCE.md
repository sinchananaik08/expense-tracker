# AI Guidance for Expense Tracker Project

## Project Context
This is a full-stack expense tracking application built with Flask (backend) and React (frontend). The AI assistant helped develop this project with the following constraints and guidelines.

## Core Constraints

### 1. Architecture Rules
- Backend and frontend must be completely separate folders
- All API responses must use proper HTTP status codes
- Database operations must use SQLAlchemy ORM
- Frontend components must be functional with React hooks
- No authentication required (keep it simple)

### 2. Data Validation Rules
- Backend: Always use Pydantic schemas for request validation
- Frontend: Validate forms before API calls
- Database: Use CHECK constraints for data integrity (amount > 0, description not empty)
- Never trust client-side validation alone-always validate on backend

### 3. Error Handling Rules
- All API routes must have try-catch blocks
- Return consistent error format: `{"error": "message"}`
- Log all errors with traceback on backend
- Show user-friendly error messages on frontend

### 4. Testing Requirements
- Backend endpoints must have pytest coverage
- Test both success and failure scenarios
- Use in-memory SQLite for tests
- All tests must pass before deployment
- Minimum 10 tests (we have 11)

### 5. Code Style Guidelines
- Python: Follow PEP 8
- JavaScript: Use ES6+ syntax
- Component names: PascalCase (ExpenseForm)
- Functions: camelCase (handleSubmit)
- CSS: Bootstrap classes preferred over custom CSS

## AI Interaction Rules

### What AI Should Do
- Generate boilerplate code following existing patterns
- Suggest improvements while maintaining simplicity
- Help debug specific errors with clear explanations
- Write tests following existing test patterns

### What AI Should NOT Do
- Add features not requested (no authentication, no complex features)
- Remove existing validation or error handling
- Suggest major architectural changes
- Generate code without explaining the changes

## Prompting Rules for This Project

When asking for help, always:
1. Specify which file needs changes
2. Describe the current behavior
3. Describe the expected behavior
4. Include any error messages
5. Mention if it's backend or frontend

## Coding Standards Checklist

Before accepting AI-generated code:
- [ ] Does it follow the existing pattern?
- [ ] Is error handling included?
- [ ] Are inputs validated?
- [ ] Does it maintain simplicity?
- [ ] Will it break existing functionality?
- [ ] Are there tests (for backend changes)?

## Project-Specific Rules

### Backend (Flask)
- Models in `models.py` with SQLAlchemy
- Routes in `routes.py` with Blueprint
- Validation in `schemas.py` with Pydantic
- Database config in `database.py`

### Frontend (React)
- Components in `src/components/`
- API calls in `src/services/api.js`
- State management with React hooks
- Styling with Bootstrap classes

### Database
- Tables: categories, expenses
- Foreign key: expense.category_id → categories.id
- Constraints: amount > 0, description not empty
- Default values: created_at = current timestamp

## Risk Mitigation

1. Data Loss: Regular SQLite backups recommended
2. Validation Bypass: Server-side validation always enforced
3. API Misuse: Pydantic schemas prevent invalid data
4. Frontend Errors: Error boundaries and try-catch blocks