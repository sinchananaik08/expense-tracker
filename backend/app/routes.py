from flask import Blueprint, request, jsonify
from .database import db
from .models import Expense, Category
from .schemas import ExpenseCreate, CategoryCreate, ExpenseResponse
from pydantic import ValidationError
from datetime import datetime, timedelta
from sqlalchemy import func, extract
import traceback

api = Blueprint('api', __name__)

# Error handler for observability
@api.errorhandler(Exception)
def handle_error(error):
    print(f"Error: {str(error)}")
    print(traceback.format_exc())
    return jsonify({'error': 'Internal server error'}), 500

# Categories endpoints
@api.route('/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        return jsonify([c.to_dict() for c in categories])
    except Exception as e:
        print(f"Error getting categories: {e}")
        return jsonify({'error': 'Failed to fetch categories'}), 500

@api.route('/categories', methods=['POST'])
def create_category():
    """Create a new category"""
    try:
        data = request.get_json()
        # Validate with Pydantic
        validated = CategoryCreate(**data)
        
        # Check if exists
        existing = Category.query.filter_by(name=validated.name).first()
        if existing:
            return jsonify({'error': 'Category already exists'}), 400
        
        category = Category(name=validated.name)
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 400
    except Exception as e:
        print(f"Error creating category: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create category'}), 500

# Expenses endpoints
@api.route('/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses with optional filters"""
    try:
        query = Expense.query
        
        # Filter by date range
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date:
            query = query.filter(Expense.date >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Expense.date <= datetime.fromisoformat(end_date))
        
        # Filter by category
        category_id = request.args.get('category_id')
        if category_id:
            query = query.filter_by(category_id=int(category_id))
        
        expenses = query.order_by(Expense.date.desc()).all()
        return jsonify([e.to_dict() for e in expenses])
    except Exception as e:
        print(f"Error getting expenses: {e}")
        return jsonify({'error': 'Failed to fetch expenses'}), 500

@api.route('/expenses', methods=['POST'])
def create_expense():
    """Create a new expense"""
    try:
        data = request.get_json()
        # Validate with Pydantic
        validated = ExpenseCreate(**data)
        
        # Check if category exists
        category = Category.query.get(validated.category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        expense = Expense(
            amount=validated.amount,
            description=validated.description,
            date=validated.date,
            category_id=validated.category_id
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify(expense.to_dict()), 201
    except ValidationError as e:
        return jsonify({'error': e.errors()}), 400
    except Exception as e:
        print(f"Error creating expense: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to create expense'}), 500

@api.route('/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        expense = Expense.query.get(expense_id)
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'})
    except Exception as e:
        print(f"Error deleting expense: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete expense'}), 500

@api.route('/summary/monthly', methods=['GET'])
def monthly_summary():
    """Get monthly summary"""
    try:
        # Get current month's expenses
        current_month = datetime.utcnow().month
        current_year = datetime.utcnow().year
        
        expenses = Expense.query.filter(
            extract('month', Expense.date) == current_month,
            extract('year', Expense.date) == current_year
        ).all()
        
        total = sum(e.amount for e in expenses)
        
        # Category breakdown
        breakdown = {}
        for expense in expenses:
            cat_name = expense.category.name
            breakdown[cat_name] = breakdown.get(cat_name, 0) + expense.amount
        
        summary = {
            'month': f"{current_year}-{current_month:02d}",
            'total': total,
            'category_breakdown': breakdown,
            'expense_count': len(expenses)
        }
        
        return jsonify(summary)
    except Exception as e:
        print(f"Error getting summary: {e}")
        return jsonify({'error': 'Failed to get summary'}), 500