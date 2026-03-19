import pytest
import sys
import os

# Add parent directory to path so we can import app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app
from app.database import db
from app.models import Category, Expense

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # Use in-memory DB for tests
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_health_check(client):
    """Test health endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_create_category(client):
    """Test category creation"""
    response = client.post('/api/categories', 
                          json={'name': 'Food'})
    assert response.status_code == 201
    assert response.json['name'] == 'Food'
    assert 'id' in response.json

def test_create_category_invalid(client):
    """Test category creation with invalid data"""
    response = client.post('/api/categories', 
                          json={'name': ''})
    assert response.status_code == 400

def test_create_category_duplicate(client):
    """Test creating duplicate category"""
    # First create
    client.post('/api/categories', json={'name': 'Food'})
    
    # Try duplicate
    response = client.post('/api/categories', json={'name': 'Food'})
    assert response.status_code == 400
    assert 'already exists' in response.json['error'].lower()

def test_get_categories(client):
    """Test getting all categories"""
    # Create a category first
    client.post('/api/categories', json={'name': 'Food'})
    
    response = client.get('/api/categories')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['name'] == 'Food'

def test_create_expense(client):
    """Test expense creation"""
    # First create category
    cat_response = client.post('/api/categories', 
                              json={'name': 'Food'})
    category_id = cat_response.json['id']
    
    # Then create expense
    expense_data = {
        'amount': 100.50,
        'description': 'Lunch',
        'category_id': category_id,
        'date': '2026-03-17T00:00:00'
    }
    response = client.post('/api/expenses', json=expense_data)
    assert response.status_code == 201
    assert response.json['amount'] == 100.50
    assert response.json['description'] == 'Lunch'

def test_create_expense_invalid_amount(client):
    """Test expense with invalid amount"""
    cat_response = client.post('/api/categories', 
                              json={'name': 'Food'})
    category_id = cat_response.json['id']
    
    expense_data = {
        'amount': -10,  # Invalid negative amount
        'description': 'Lunch',
        'category_id': category_id,
        'date': '2026-03-17T00:00:00'
    }
    response = client.post('/api/expenses', json=expense_data)
    assert response.status_code == 400

def test_create_expense_invalid_category(client):
    """Test expense with non-existent category"""
    expense_data = {
        'amount': 100,
        'description': 'Lunch',
        'category_id': 999,  # Non-existent category
        'date': '2026-03-17T00:00:00'
    }
    response = client.post('/api/expenses', json=expense_data)
    assert response.status_code == 404

def test_get_expenses(client):
    """Test getting all expenses"""
    # Create category and expense
    cat_response = client.post('/api/categories', json={'name': 'Food'})
    category_id = cat_response.json['id']
    
    expense_data = {
        'amount': 100.50,
        'description': 'Lunch',
        'category_id': category_id,
        'date': '2026-03-17T00:00:00'
    }
    client.post('/api/expenses', json=expense_data)
    
    # Get expenses
    response = client.get('/api/expenses')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['amount'] == 100.50

def test_delete_expense(client):
    """Test deleting an expense"""
    # Create category and expense
    cat_response = client.post('/api/categories', json={'name': 'Food'})
    category_id = cat_response.json['id']
    
    expense_data = {
        'amount': 100.50,
        'description': 'Lunch',
        'category_id': category_id,
        'date': '2026-03-17T00:00:00'
    }
    exp_response = client.post('/api/expenses', json=expense_data)
    expense_id = exp_response.json['id']
    
    # Delete expense
    response = client.delete(f'/api/expenses/{expense_id}')
    assert response.status_code == 200
    
    # Verify it's gone
    get_response = client.get('/api/expenses')
    assert len(get_response.json) == 0

def test_monthly_summary(client):
    """Test monthly summary"""
    # Create category
    cat_response = client.post('/api/categories', json={'name': 'Food'})
    category_id = cat_response.json['id']
    
    # Create expense
    expense_data = {
        'amount': 100.50,
        'description': 'Lunch',
        'category_id': category_id,
        'date': '2026-03-17T00:00:00'
    }
    client.post('/api/expenses', json=expense_data)
    
    # Get summary
    response = client.get('/api/summary/monthly')
    assert response.status_code == 200
    assert response.json['total'] == 100.50
    assert response.json['expense_count'] == 1
    assert 'Food' in response.json['category_breakdown']