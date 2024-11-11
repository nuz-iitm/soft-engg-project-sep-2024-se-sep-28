from flask_restful import Resource, reqparse
from ..data.database import db
from ..data.models import User, Role, RolesUsers, Faq, Instructors, Students, Projects
from ..security import user_datastore
from flask import current_app as app, jsonify, request
from flask_bcrypt import Bcrypt
import flask_login
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

    # Check if user is registered
    def check_registration(self, email, role_name):
        
        if role_name == 'student':
            student = Students.query.filter_by(email=email).first()
            if student:
                return True
            else:
                return False
        else:
            instructor = Instructors.query.filter_by(email=email).first()
            if instructor:
                return True
            else:
                return False

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


        
        if self.check_registration(email, role_name):
            # Check if user already exists
            user = User.query.filter_by(email=email).first()
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
        else:
            return jsonify({"message": "User not part of the course"}, 500)

class FaqResource(Resource):

    def get_project_id(self):
        user_id = get_jwt_identity()['user_id']
        user = User.query.get(user_id)
        instructor = Instructors.query.filter_by(email=user.email).first()
        project_id = instructor.project_id
        return project_id

    @jwt_required()
    def get(self):

        """
        Retrieve all FAQ entries 
        """
        project_id = self.get_project_id()
        faqs = Faq.query.filter_by(project_id=project_id).all()

        
        faq_list = [{"f_id": faq.f_id, "question": faq.question, "answer": faq.answer} for faq in faqs]
        return jsonify(faq_list)

    @jwt_required()
    def post(self):
        
        data = request.json

        # getting current user project_id
        project_id = self.get_project_id()
        
        try:
            new_faq = Faq(
                question=data.get('question'),
                answer=data.get('answer'),
                project_id=project_id
            )
            db.session.add(new_faq)
            db.session.commit()
            return jsonify({"message": "FAQ created successfully."}, 201)
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}, 500)


class FaqUpdateResource(Resource):

    @jwt_required()
    def put(self, f_id):
        data = request.json

        try:
            # faq_id = request.args.get('id')
            updated_faq = Faq.query.filter_by(f_id=f_id).first()

            if not updated_faq:
                return jsonify({"message": "FAQ not found"}), 404

            updated_faq.question = data.get('question', updated_faq.question)
            updated_faq.answer = data.get('answer', updated_faq.answer)

            db.session.commit()
            return jsonify({"message": "FAQ updated successfully."}, 200)
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}, 500)

    @jwt_required()
    def delete(self, f_id):
        # faq_id = request.args.get('id')
        faq = Faq.query.filter_by(f_id=f_id).first()

        if not faq:
            return jsonify({"message": "FAQ not found"}, 404)

        db.session.delete(faq)
        db.session.commit()
        return jsonify({"message": "FAQ deleted successfully."}, 200)