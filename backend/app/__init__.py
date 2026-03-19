from flask import Flask, jsonify
from flask_cors import CORS
from .database import db, init_app as init_db
from .routes import api

def create_app():
    app = init_db()
    CORS(app)  # Enable CORS for React
    
    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')
    
    @app.route('/')
    def home():
        return jsonify({
            'message': 'Expense Tracker API',
            'endpoints': {
                'health': '/health',
                'categories': '/api/categories',
                'expenses': '/api/expenses',
                'summary': '/api/summary/monthly'
            }
        })
    
    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy', 'timestamp': __import__('datetime').datetime.now().isoformat()}), 200
    
    return app