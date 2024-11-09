from flask_restful import Resource, reqparse
from ..data.database import db
from ..data.models import User, Role, RolesUsers
from ..security import user_datastore
from flask import current_app as app, jsonify, request
from flask_bcrypt import Bcrypt
import flask_login
from flask_security import auth_required
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


bcrypt = Bcrypt(app)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# api for login
class Login(Resource):
    
    def post(self):
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Basic validation
        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        # Check if user exists
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):

            # Login the user
            flask_login.login_user(user)

            # Fetch the role_id from RolesUsers
            role_users = RolesUsers.query.filter_by(user_id=user.id).first()
            role_id = role_users.role_id if role_users else None

             # Create JWT access token with both user_id and fs_uniquifier
            access_token = create_access_token(identity={"user_id": user.id, "fs_uniquifier": user.fs_uniquifier})
            return jsonify({"message": "Login successful", "user_id": user.id, "role_id": role_id, "access_token": access_token}, 200)

        return jsonify({"message": "Invalid email or password"}, 401)
    
# api for logout
class Logout(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get the token payload
            token_payload = get_jwt_identity()

            # Log out the user using Flask-Login (this uses the user_id)
            flask_login.logout_user()

            return jsonify({"message": "Logout successful"}, 200)

        except Exception as e:
            return jsonify({"message": "Error during logout", "error": str(e)}, 500)


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
            return jsonify({"message": "Email and password are required"}, 400)

        # Check if user already exists
        user = User.query.filter_by(email=email).first()

        role_id = Role.query.with_entities(Role.id).filter_by(name=role_name).scalar()
        if user:
            return jsonify({"message": "User already exists"}, 400)

        # Create new user
        hashed_password = self.generate_password_hash(password)
        try:
            user = user_datastore.create_user(email=email, password=hashed_password)
            db.session.commit()

            user_datastore.add_role_to_user(user, role_name)
            db.session.commit()

            return jsonify({"message": "User registered successfully"}, 201)
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Error registering user", "error": str(e)}, 500)