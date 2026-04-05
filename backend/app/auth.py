from flask import Blueprint, request, jsonify
from .database import db
from .models import User
from pydantic import ValidationError, BaseModel, EmailStr, validator
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os
from functools import wraps

auth = Blueprint('auth', __name__)

SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')


class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginSchema(BaseModel):
    email: EmailStr
    password: str


def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')


# Token required decorator — use this on any route you want to protect
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Get token from Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]

        if not token:
            return jsonify({'error': 'Token is missing. Please log in.'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired. Please log in again.'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token. Please log in again.'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


@auth.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        validated = RegisterSchema(**data)

        existing = User.query.filter_by(email=validated.email).first()
        if existing:
            return jsonify({'error': 'Email already registered'}), 400

        hashed = generate_password_hash(validated.password)
        user = User(
            name=validated.name,
            email=validated.email,
            password_hash=hashed
        )
        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id)
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': user.to_dict()
        }), 201

    except ValidationError as e:
        return jsonify({'error': e.errors()}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Register error: {e}")
        return jsonify({'error': 'Registration failed'}), 500


@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        validated = LoginSchema(**data)

        user = User.query.filter_by(email=validated.email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not check_password_hash(user.password_hash, validated.password):
            return jsonify({'error': 'Invalid email or password'}), 401

        token = generate_token(user.id)
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except ValidationError as e:
        return jsonify({'error': e.errors()}), 400
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500