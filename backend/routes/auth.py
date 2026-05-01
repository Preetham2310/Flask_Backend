# backend/routes/auth.py

from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash
import re

auth = Blueprint('auth', __name__)

# Email validation function
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email)

# Signup API
@auth.route('/signup', methods=['POST'])
def signup():   
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    # 1️⃣ Check required fields
    if not all([full_name, email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400

    # 2️⃣ Email validation
    if not is_valid_email(email):
        return jsonify({"error": "Invalid email format"}), 400

    # 3️⃣ Password length
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    # 4️⃣ Password match
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # 5️⃣ Check existing user
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Account already exists"}), 400

    # 6️⃣ Hash password
    hashed_password = generate_password_hash(password)

    # 7️⃣ Save user
    new_user = User(
        full_name=full_name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Signup successful. Please login."}), 201
#Task 1.2 ---Admin login API
from werkzeug.security import check_password_hash

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    # 1️⃣ Validate input
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # 2️⃣ Check user
    user = User.query.filter_by(email=email).first()

    # 3️⃣ Validate password
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # 4️⃣ Success
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email
        }
    }), 200
#Forget password API
import uuid
from datetime import datetime, timedelta

@auth.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    # Always return same response
    response_msg = {
        "message": "If this email is registered, a reset link has been generated."
    }

    user = User.query.filter_by(email=email).first()

    if user:
        # Generate token
        token = str(uuid.uuid4())

        # Set expiry (1 hour)
        expiry = datetime.utcnow() + timedelta(hours=1)

        user.reset_token = token
        user.reset_token_expiry = expiry

        db.session.commit()

        # Log reset link (IMPORTANT)
        reset_link = f"http://127.0.0.1:5000/reset-password/{token}"
        print("Reset link:", reset_link)

    return jsonify(response_msg), 200
@auth.route('/reset-password/<token>', methods=['POST'])
def reset_password(token):
    data = request.get_json()
    new_password = data.get('password')

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"error": "Invalid token"}), 400

    # Check expiry
    if user.reset_token_expiry < datetime.utcnow():
        return jsonify({"error": "Token expired"}), 400

    # Update password
    from werkzeug.security import generate_password_hash
    user.password = generate_password_hash(new_password)

    # Clear token
    user.reset_token = None
    user.reset_token_expiry = None

    db.session.commit()

    return jsonify({"message": "Password reset successful"}), 200