from flask_restful import Resource, reqparse
from ..data.database import db
from ..data.models import User, Role, RolesUsers, Faq, Instructors, Students, Projects,Queries
from ..security import user_datastore
from flask import current_app as app, jsonify, request
from flask_bcrypt import Bcrypt
import flask_login
from functools import wraps
from flask_login import current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.datastructures import FileStorage
import csv


bcrypt = Bcrypt(app)
login_manager = flask_login.LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


# Role-based access decorator
def role_required(*roles):
    def wrapper(fn):
        def wrapped(*args, **kwargs):
            user = User.query.get(get_jwt_identity()['user_id'])

            # Check if the user has any of the required roles
            if any(role in [role.name for role in user.roles] for role in roles):
                return fn(*args, **kwargs)
            else:
                print([role.name for role in user.roles])
                print(roles)
                return jsonify({"message": "Access denied"}, 403)
        return wrapped
    return wrapper

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


# to get project_id of current user(instructor)
def get_project_id_instructor():
    user_id = get_jwt_identity()['user_id']
    user = User.query.get(user_id)
    instructor = Instructors.query.filter_by(email=user.email).first()
    project_id = instructor.project_id
    return project_id


# to get project_id of current user(student)
def get_project_id_student():
    user_id = get_jwt_identity()['user_id']
    user = User.query.get(user_id)
    student = Students.query.filter_by(email=user.email).first()
    project_id = student.project_id
    return project_id


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

    @jwt_required()
    @role_required('instructor', 'student')
    def get(self):

        """
        Retrieve all FAQ entries 
        """
        project_id = get_project_id_instructor()
        faqs = Faq.query.filter_by(project_id=project_id).all()

        
        faq_list = [{"f_id": faq.f_id, "question": faq.question, "answer": faq.answer} for faq in faqs]
        return jsonify(faq_list)

    @jwt_required()
    @role_required('instructor')
    def post(self):
        
        data = request.json

        # getting current user project_id
        project_id = get_project_id_instructor()
        
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
    @role_required('instructor')
    def put(self, f_id):
        data = request.json

        try:
            # getting faq to be updated
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
    @role_required('instructor')
    def delete(self, f_id):
        # getting faq to be deleted
        faq = Faq.query.filter_by(f_id=f_id).first()

        if not faq:
            return jsonify({"message": "FAQ not found"}, 404)

        db.session.delete(faq)
        db.session.commit()
        return jsonify({"message": "FAQ deleted successfully."}, 200)
    


class BulkUpload(Resource):

    @jwt_required()
    @role_required('admin')
    def get(self):

        """
        Retrieve all Student enteries
        """
        students = Students.query.all()

        student_list = [{"s_id": student.s_id, "name": student.name, "email": student.email, 'project_id': student.project_id} for student in students]
        return jsonify(student_list)

    @jwt_required()
    @role_required('admin')
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('csvFile', type=FileStorage, location='files')
        args = parser.parse_args()

        if 'csvFile' not in request.files:
            return jsonify({"message": "No file part"}, 400)

        file = request.files['csvFile']

        if file.filename == '':
            return jsonify({"message": "No selected file"}, 400)

        if file and allowed_file(file.filename):
            students_data = []
            try:

                # Read the CSV file
                reader = csv.DictReader(file.stream.read().decode('utf-8').splitlines())
                for row in reader:
                    students_data.append({
                        'name': row['name'],
                        'email': row['email'],
                        'project_id': int(row['project_id'])
                    })

                # Insert data into the database
                for student in students_data:
                    new_student = Students(name=student['name'], email=student['email'], project_id=student['project_id'])
                    db.session.add(new_student)

                db.session.commit()
                return jsonify({"message": "Students added successfully"}, 201)

            except Exception as e:
                db.session.rollback()
                return jsonify({"message": str(e)}, 500)
        else:
            return jsonify({"message": "Invalid file type"}, 400)


class StudentUpdate(Resource):

    @jwt_required()
    @role_required('admin')
    def put(self, s_id):
        data = request.json

        try:
            # getting student to be updated
            updated_student = Students.query.filter_by(s_id=s_id).first()

            if not updated_student:
                return jsonify({"message": "student not found"}), 404
            
            # updating email in user model

            email = updated_student.email
            user = User.query.filter_by(email=email).first()
            user.email = email

            updated_student.name = data.get('name', updated_student.name)
            updated_student.email = data.get('email', updated_student.email)
            updated_student.project_id = data.get('project_id', updated_student.project_id)

            db.session.commit()

            
            return jsonify({"message": "Student updated successfully."}, 200)
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}, 500)
    
    @jwt_required()
    @role_required('admin')
    def delete(self, s_id):
        # getting student to be deleted
        student = Students.query.filter_by(s_id=s_id).first()

        # deleting from user model
        email = student.email
        user = User.query.filter_by(email=email).first()

        if not student:
            return jsonify({"message": "Student not found"}, 404)

        db.session.delete(student)
        if user:
            db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Student deleted successfully."}, 200)
    
class InstructorResource(Resource):

    @jwt_required()
    @role_required('admin')
    def get(self):

        """
        Retrieve all Instructor enteries
        """
        instructors = Instructors.query.all()

        instructor_list = [{"i_id": instructor.i_id,
                        "name": instructor.name,
                        "email": instructor.email, 
                        'project_id': instructor.project_id,
                        'Designation': instructor.designation
                        } for instructor in instructors]
        return jsonify(instructor_list)

class InstructorUpdateResource(Resource):

    @jwt_required()
    @role_required('admin')
    def put(self, i_id):
        data = request.json

        try:
            # getting student to be updated
            updated_instructor = Instructors.query.filter_by(i_id=i_id).first()

            if not updated_instructor:
                return jsonify({"message": "instructor not found"}), 404
            
            # updating email in user model

            email = updated_instructor.email
            user = User.query.filter_by(email=email).first()
            user.email = email

            updated_instructor.name = data.get('name', updated_instructor.name)
            updated_instructor.email = data.get('email', updated_instructor.email)
            updated_instructor.project_id = data.get('project_id', updated_instructor.project_id)
            updated_instructor.designation = data.get('designation', updated_instructor.designation)
            
            db.session.commit()

            
            return jsonify({"message": "Instructor updated successfully."}, 200)
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)}, 500)



class QueryResource(Resource):
    
    @jwt_required()
    @role_required('instructor', 'student')
    def get(self, q_id=None):
        """
        Retrieve a specific query by ID or all queries if no ID is provided.
        Accessible by instructor, student, or admin roles.
        """
        if q_id:
            query = Queries.query.get(q_id)
            if not query:
                return jsonify({"message": "Query not found"}, 404)
            return {
                "q_id": query.q_id,
                "desc": query.desc,
                "s_id": query.s_id,
                "i_id": query.i_id,
                "qdate": query.qdate,
                "response": query.response,
                "project_id": query.project_id
            }, 200
        else:
            queries = Queries.query.all()
            query_list = [
                {
                    "q_id": query.q_id,
                    "desc": query.desc,
                    "s_id": query.s_id,
                    "i_id": query.i_id,
                    "qdate": query.qdate,
                    "response": query.response,
                    "project_id": query.project_id
                }
                for query in queries
            ]
            return jsonify(query_list)

    @jwt_required()
    @role_required('student')
    def post(self):
        """
        Allow students to create a new query.
        """
        data = request.json
        s_id = get_jwt_identity()['user_id']  # Fetch the student ID from the JWT token
        project_id = data.get("project_id")
        desc = data.get("desc")
        
        if not desc:
            return jsonify({"message": "Description is required"}, 400)

        new_query = Queries(desc=desc, s_id=s_id, project_id=project_id)
        try:
            db.session.add(new_query)
            db.session.commit()
            return jsonify({"status": "success", "message": "Query created successfully."}, 201)
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)}, 500)

    @jwt_required()
    @role_required('instructor')
    def put(self, q_id):
        """
        Allow instructors to update an existing query's response.
        """
        data = request.json
        response = data.get("response")
        
        query = Queries.query.get(q_id)
        if not query:
            return jsonify({"message": "Query not found"}, 404)

        query.response = response

        try:
            db.session.commit()
            return jsonify({"status": "success", "message": "Query updated successfully."}, 200)
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)}, 500)

    @jwt_required()
    @role_required('instructor')
    def delete(self, q_id):
        """
        Allow admin to delete a query.
        """
        query = Queries.query.get(q_id)
        if not query:
            return jsonify({"message": "Query not found"}, 404)
        try:
            db.session.delete(query)
            db.session.commit()
            return jsonify({"message": "Query deleted successfully."}, 200)
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)}, 500)