from flask_restful import Resource, reqparse
from ..data.database import db
from ..data.models import User, Role, RolesUsers
from ..security import user_datastore
from flask import current_app as app, jsonify
from flask_bcrypt import Bcrypt
import flask_login
from flask import request, render_template, send_from_directory, send_file
from flask_security import auth_required
from werkzeug.utils import secure_filename
import uuid

bcrypt = Bcrypt(app)


# api for registration
class Register(Resource):

    # for creating password hash with bcrypt
    def generate_password_hash(self, password):
        return bcrypt.generate_password_hash(password).decode('utf-8')
    
    def post(self):
        data = request.json
        email = data.get("email")
        password = data.get("password")
        role_name = data.get('role')

        # Basic validation
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Check if user already exists
        user = User.query.filter_by(email=email).first()
        role_id = Role.query.with_entities(Role.id).filter_by(name=role_name).scalar()
        if user:
            return jsonify({"message": "User already exists"}, 400)

        # Create new user
        hashed_password = self.generate_password_hash(password)
        print(type(role_id), hashed_password)
        user = User(email=email, password=hashed_password, fs_uniquifier=None)
        db.session.add(user)
        db.session.commit()
        user_datastore.set_uniquifier(user)
        user_id = User.query.with_entities(User.id).filter_by(email=email).scalar()
        role_user = RolesUsers(role_id=role_id,user_id=user_id)
        db.session.add(role_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}, 201)