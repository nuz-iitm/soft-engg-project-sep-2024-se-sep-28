from flask import current_app as app, jsonify, request, render_template, flash
from flask_security import auth_required, roles_required, login_required, current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields

import secrets
import re
import os

# Dummy user data (for testing)
users = {
    "test@example.com": generate_password_hash("password")
}

ADMIN_CREDENTIALS = {
    "email": "admin@example.com",
    "password": "admin123"
}

# This starts the frontend DO NOT DELETE
@app.get('/')
def home():
    return render_template('index.html')

@app.post('/login')
def user_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Validate user credentials
    if email in users and check_password_hash(users[email], password):
        return jsonify({"message": "Login successful", "token": secrets.token_hex(16)}), 200
    else:
        return jsonify({"message": "Invalid email or password"}), 401



@app.post('/register')
def user_register():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Check if user already exists
    if email in users:
        return jsonify({"message": "User already exists"}), 409

    # Create new user
    hashed_password = generate_password_hash(password)
    users[email] = hashed_password  # Storing the hashed password
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/admin-login', methods=['POST'])
def admin_login():
    data = request.get_json()

    # Check if data was received and contains email and password
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Invalid request data"}), 400

    email = data['email']
    password = data['password']

    # Validate credentials
    if email == ADMIN_CREDENTIALS["email"] and password == ADMIN_CREDENTIALS["password"]:
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
