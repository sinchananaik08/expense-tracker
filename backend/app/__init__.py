from flask import Flask, jsonify
from flask_cors import CORS
from .database import db, init_app as init_db
from .routes import api
from .auth import auth

def create_app():
    app = init_db()
    CORS(app)

    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(auth, url_prefix='/api/auth')

    @app.route('/')
    def home():
        return jsonify({
            'message': 'Expense Tracker API',
            'endpoints': {
                'health': '/health',
                'categories': '/api/categories',
                'expenses': '/api/expenses',
                'summary': '/api/summary/monthly',
                'register': '/api/auth/register',
                'login': '/api/auth/login'
            }
        })

    @app.route('/health')
    def health():
        import datetime
        return jsonify({'status': 'healthy', 'timestamp': datetime.datetime.now().isoformat()}), 200

    return app