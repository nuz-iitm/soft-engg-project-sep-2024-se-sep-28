from flask_restful import Resource, reqparse
from ..data.database import db
from ..data.models import User, RolesUsers, Faq, Instructors, Students, Projects, Queries, Milestones, githubdata, MilestonesSub, Events
from ..security import user_datastore
from flask import current_app as app, jsonify, request
from flask_bcrypt import Bcrypt
import flask_login
from functools import wraps
from flask_login import current_user
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
import csv
import datetime
import os


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

def allowed_file_csv(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'csv'}

def allowed_file_pdf(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'pdf'}


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

def get_s_id():
    user_id = get_jwt_identity()['user_id']
    user = User.query.get(user_id)
    email = user.email
    student = Students.query.filter_by(email=email).first()
    s_id = student.s_id
    return s_id


# api for login
class Login(Resource):
    
    def post(self):
        data = request.json
        email = data.get("email")
        password = data.get("password")

        # Basic validation
        if not email or not password:
            response = jsonify({"message": "Email and password are required"})
            response.status_code = 400
            return response

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
            return jsonify({"message": "Login successful", "user_id": user.id, "role_id": role_id, "access_token": access_token})

        response = jsonify({"message": "Invalid email or password"})
        response.status_code = 400
        return response
    
# api for logout
class Logout(Resource):
    @jwt_required()
    def post(self):
        try:
            # Get the token payload
            token_payload = get_jwt_identity()

            # Log out the user using Flask-Login (this uses the user_id)
            flask_login.logout_user()

            return jsonify({"message": "Logout successful"})

        except Exception as e:
            return jsonify({"message": "Error during logout", "error": str(e)})


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
            return jsonify({"message": "Email and password are required"})


        
        if self.check_registration(email, role_name):
            # Check if user already exists
            user = User.query.filter_by(email=email).first()
            if user:
                response = jsonify({"message": "User already exists"})
                response.status_code = 400
                return response

            # Create new user
            hashed_password = self.generate_password_hash(password)
            try:
                user = user_datastore.create_user(email=email, password=hashed_password)
                db.session.commit()

                user_datastore.add_role_to_user(user, role_name)
                db.session.commit()

                return jsonify({"message": "User registered successfully"})
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": "Error registering user", "error": str(e)})
        else:
            return jsonify({"message": "User not part of the course"})

# api for faq's
class FaqResource(Resource):

    @jwt_required()
    @role_required('instructor', 'student')
    def get(self):

        """
        Retrieve all FAQ entries 
        """
        user_id = get_jwt_identity()['user_id']
        user = User.query.get(user_id)
        if 'student' in [role.name for role in user.roles]:
            project_id = get_project_id_student()
        elif 'instructor' in [role.name for role in user.roles]:
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
            return jsonify({"message": "FAQ created successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

# api for updating faq's
class FaqUpdateResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def put(self, f_id):
        data = request.json

        try:
            # getting faq to be updated
            updated_faq = Faq.query.filter_by(f_id=f_id).first()

            if not updated_faq:
                return jsonify({"message": "FAQ not found"})

            updated_faq.question = data.get('question', updated_faq.question)
            updated_faq.answer = data.get('answer', updated_faq.answer)

            db.session.commit()
            return jsonify({"message": "FAQ updated successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

    @jwt_required()
    @role_required('instructor')
    def delete(self, f_id):
        # getting faq to be deleted
        faq = Faq.query.filter_by(f_id=f_id).first()

        if not faq:
            return jsonify({"message": "FAQ not found"})

        db.session.delete(faq)
        db.session.commit()
        return jsonify({"message": "FAQ deleted successfully."})
    

# api for student resources
class BulkUpload(Resource):

    @jwt_required()
    @role_required('admin', 'instructor')
    def get(self):

        """
        Retrieve all Student enteries
        """
        students = Students.query.all()

        student_list = [{"s_id": student.s_id, 
                         "name": student.name, 
                         "email": student.email, 
                         'project_id': student.project_id,
                         'is_registered': User.query.filter_by(email=student.email).first() is not None} 
                         for student in students]
        return jsonify(student_list)

    @jwt_required()
    @role_required('admin')
    def post(self):
        # parser = reqparse.RequestParser()
        # parser.add_argument('csvFile', type=FileStorage, location='files')
        # args = parser.parse_args()

        if 'csvFile' not in request.files:
            return jsonify({"message": "No file part"})

        file = request.files['csvFile']

        if file.filename == '':
            return jsonify({"message": "No selected file"})

        if file and allowed_file_csv(file.filename):
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
                return jsonify({"message": "Students added successfully"})

            except Exception as e:
                db.session.rollback()
                return jsonify({"message": str(e)})
        else:
            return jsonify({"message": "Invalid file type"})


class StudentUpdate(Resource):

    @jwt_required()
    @role_required('admin')
    def put(self, s_id):
        data = request.json

        try:
            # getting student to be updated
            updated_student = Students.query.filter_by(s_id=s_id).first()

            if not updated_student:
                return jsonify({"message": "student not found"})
            
            old_email = updated_student.email
            new_email = data.get('email')

            #updating student
            updated_student.name = data.get('name')
            updated_student.email = data.get('email')
            updated_student.project_id = data.get('project_id')

            db.session.commit()

            #updating email in user model
            user = User.query.filter_by(email=old_email).first()
            if user:
                user.email = new_email
                db.session.commit()

            return jsonify({"message": "Student updated successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

    
    @jwt_required()
    @role_required('admin')
    def delete(self, s_id):
        # getting student to be deleted
        student = Students.query.filter_by(s_id=s_id).first()

        # deleting from user model
        email = student.email
        user = User.query.filter_by(email=email).first()

        if not student:
            return jsonify({"message": "Student not found"})

        db.session.delete(student)
        if user:
            db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Student deleted successfully."})

# api for instructor resources
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
                        'designation': instructor.designation
                        } for instructor in instructors]
        return jsonify(instructor_list)
    
    @jwt_required()
    @role_required('admin')
    def post(self):
        
        data = request.json
        
        try:
            new_instructor = Instructors(
                name=data.get('name'),
                email=data.get('email'),
                project_id=data.get('project_id'),
                designation=data.get('designation')
            )
            db.session.add(new_instructor)
            db.session.commit()
            return jsonify({"message": "Instructor added successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

class InstructorUpdateResource(Resource):

    @jwt_required()
    @role_required('admin')
    def put(self, i_id):
        data = request.json

        try:
            # getting student to be updated
            updated_instructor = Instructors.query.filter_by(i_id=i_id).first()

            if not updated_instructor:
                return jsonify({"message": "instructor not found"})
            
            old_email = updated_instructor.email
            new_email = data.get('email')

            updated_instructor.name = data.get('name')
            updated_instructor.email = new_email
            updated_instructor.project_id = data.get('project_id')
            updated_instructor.designation = data.get('designation')
            db.session.commit()
            # updating email in user model
            user = User.query.filter_by(email=old_email).first()
            if user:
                user.email = new_email
                db.session.commit()

            return jsonify({"message": "Instructor updated successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})
    
    @jwt_required()
    @role_required('admin')
    def delete(self, i_id):
        # getting instructor to be deleted
        instructor = Instructors.query.filter_by(i_id=i_id).first()

        # deleting from user model
        email = instructor.email
        user = User.query.filter_by(email=email).first()

        if not instructor:
            return jsonify({"message": "Instructor not found"})

        db.session.delete(instructor)
        if user:
            db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Instructor deleted successfully."})



class StudentQueryResource(Resource):
    
    @jwt_required()
    @role_required('student')
    def get(self):
        """
        Retrieve all queries 
        """

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
        s_id = get_s_id()  # Fetch the student ID from the JWT token
        desc = data.get("desc")
        project_id = get_project_id_student()

        if not desc:
            return jsonify({"message": "Description is required"})

        new_query = Queries(desc=desc, s_id=s_id, project_id=project_id)
        try:
            db.session.add(new_query)
            db.session.commit()
            return jsonify({"status": "success", "message": "Query created successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)})

class StudentQueryUpdateResource(Resource):

    @jwt_required()
    @role_required('student')
    def get(self, q_id):
         
        """
        Retrieve a specific query by ID
        """
        
        if q_id:
            query = Queries.query.get(q_id)
            
            return jsonify({
                "q_id": query.q_id,
                "desc": query.desc,
                "s_id": query.s_id,
                "i_id": query.i_id,
                "qdate": query.qdate,
                "response": query.response,
                "project_id": query.project_id
            }, 200)
        else:
            return jsonify({"message": "Query not found"})

class InstructorQueryResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def get(self):
        """
        Retrieve all queries
        """
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


        
class InstructorUpdateQueryResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def get(self, q_id):
        """
        Retrieve a specific query by ID.
        """
        if q_id:
            query = Queries.query.get(q_id)
            if not query:
                return jsonify({"message": "Query not found"})
            return jsonify({
                "q_id": query.q_id,
                "desc": query.desc,
                "s_id": query.s_id,
                "i_id": query.i_id,
                "qdate": query.qdate,
                "response": query.response,
                "project_id": query.project_id
            }, 200)
        else:
            return jsonify({"message": "query not found"})

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
            return jsonify({"message": "Query not found"})

        query.response = response

        try:
            db.session.commit()
            return jsonify({"status": "success", "message": "Responce submitted successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)})

    @jwt_required()
    @role_required('instructor')
    def delete(self, q_id):
        """
        Allow instructors to delete a query.
        """
        query = Queries.query.get(q_id)
        if not query:
            return jsonify({"message": "Query not found"})
        try:
            db.session.delete(query)
            db.session.commit()
            return jsonify({"message": "Query deleted successfully."})
        except Exception as e:
            db.session.rollback()
            return jsonify({"status": "error", "message": str(e)})


class ProjectResource(Resource):

    @jwt_required()
    @role_required('instructor', 'student')
    def get(self):
        # getting project statement
        user_id = get_jwt_identity()['user_id']
        user = User.query.get(user_id)

        # get project_id for the user
        if 'student' in [role.name for role in user.roles]:
            project_id = get_project_id_student()
        elif 'instructor' in [role.name for role in user.roles]:
            project_id = get_project_id_instructor()
        
        try:
            project = Projects.query.get(project_id)

            return jsonify({
                "statement": project.statement
            })
        except Exception as e:
            return jsonify({"message": str(e)})
        
    
    @jwt_required()
    @role_required('instructor')
    def put(self):
        # adding a statment
        try:
            data = request.json
            project_id = get_project_id_instructor()
            project = Projects.query.get(project_id)
            project.statement = data.get("statement")
            db.session.commit()
            return jsonify({"message": "Statement added successfully."})
        except Exception as e:
            print(str(e))
            return jsonify({"message": str(e)})


class MilestoneResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def get(self):
        """
        Retrieve all milestones for the project id.
        """

        # get project_id for the user

        project_id = get_project_id_instructor()
        
        # get milestones for the project
        milestones = Milestones.query.filter_by(project_id=project_id).all()
        
        milestone_list = [
            {
                "m_id": milestone.m_id,
                "desc": milestone.desc,
                "deadline": milestone.deadline,
            }
            for milestone in milestones
        ]
        return jsonify(milestone_list)

    @jwt_required()
    @role_required('instructor')
    def post(self):
        """
        Create a new milestone.
        """
        data = request.json

        new_milestone = Milestones(
            project_id=get_project_id_instructor(),
            desc=data.get("desc"),
            deadline=data.get("deadline")
        )

        try:
            db.session.add(new_milestone)
            db.session.commit()
            return jsonify({"message": "Milestone created successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

class MilestoneStudentResource(Resource):

    def submission_status(self, m_id, s_id):

        status = MilestonesSub.query.filter_by(s_id=s_id, m_id=m_id).first()
        if status:
            return True
        else:
            return False

    @jwt_required()
    @role_required('student')
    def get(self):
        """
        Retrieve all milestones for the project id.
        """
        s_id = get_s_id()

        # get project_id for the user
        project_id = get_project_id_student()

        # get milestones and check if they have been submitted
        milestones = Milestones.query.filter_by(project_id=project_id).all()
        
        milestone_list = [
            {
                "m_id": milestone.m_id,
                "desc": milestone.desc,
                "deadline": milestone.deadline,
                "status" : self.submission_status(milestone.m_id, s_id)
            }
            for milestone in milestones
        ]
        return jsonify(milestone_list)

class MilestoneUpdateResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def put(self, m_id):
        """
        Update an existing milestone.
        """
        data = request.json
   
        milestone = Milestones.query.get(m_id)
        if not milestone:
            return jsonify({"message": "Milestone not found"})

        milestone.desc = data.get("desc")
        milestone.deadline = data.get("deadline")

        try:
            db.session.commit()
            return jsonify({"message": "Milestone updated successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

    @jwt_required()
    @role_required('instructor')
    def delete(self, m_id):
        """
        Delete an existing milestone.
        """
        milestone = Milestones.query.get(m_id)
        if not milestone:
            return jsonify({"message": "Milestone not found"})

        try:
            db.session.delete(milestone)
            db.session.commit()
            return jsonify({"message": "Milestone deleted successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

class MilestoneSubmissionResource(Resource):

    @jwt_required()
    @role_required('student')
    def post(self, m_id):

        file = request.files['pdfFile']

        if file.filename == '':
            return jsonify({"message": "No selected file"})

        if file and allowed_file_pdf(file.filename):
            try:
                filename = secure_filename(file.filename)
                y = datetime.datetime.now()
                sub_date = y.strftime("%c") # submission date
                f_n, f_ex = os.path.splitext(filename)
                filename = sub_date+"_"+f_n+f_ex
                basedir = os.path.abspath(os.path.dirname(__file__))
                size = len(basedir)
                uploads_dir = basedir[:size-22]+'uploads/'
                print(uploads_dir)
                file.save(os.path.join(uploads_dir, filename))
                url = uploads_dir+filename
                print(url)
                project_id = get_project_id_student()
                s_id = get_s_id()
                milestone_sub = MilestonesSub(m_id=m_id, s_id=s_id, project_id=project_id,sub_date=sub_date, submission=url)
                db.session.add(milestone_sub)
                db.session.commit()
                return jsonify({"message": "Submission successful"})
            except Exception as e:
                db.session.rollback()
                return jsonify({"message": str(e)})
        else:
            return jsonify({"message": "Invalid file type"})

        
class DashBoardResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def get(self):
        project_id = get_project_id_instructor()

        # Calculate commits per student
        top_students = db.session.query(
            githubdata.s_id, 
            Students.name,
            db.func.count(githubdata.g_id).label('commit_count')
        ).join(Students, githubdata.s_id == Students.s_id).filter(githubdata.project_id == project_id).group_by(githubdata.s_id).order_by(db.desc('commit_count')).limit(3).all()

        # Prepare response
        dashboard_data = [
            {
                's_id': student[0],
                'name': student[1],
                'commits': student[2]
            } for student in top_students]

        return jsonify(dashboard_data)
    
class EventResource(Resource):

    @jwt_required()
    @role_required('instructor')
    def get(self):
        project_id = get_project_id_instructor()

        # get events for a project_id
        events = Events.query.filter_by(project_id=project_id).all()
        
        events_list = [
            {
                "e_id": event.e_id,
                "title": event.title,
                "start": event.start_date,
            }
            for event in events
        ]
        return jsonify(events_list)
    

    @jwt_required()
    @role_required('instructor')
    def post(self):
        data = request.json

        new_event = Events(
            project_id=get_project_id_instructor(),
            title =data.get("title"),
            start_date=data.get("start")
        )

        try:
            db.session.add(new_event)
            db.session.commit()
            return jsonify({"message": "Event created successfully"})
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": str(e)})

class EventStudentResource(Resource):

    @jwt_required()
    @role_required('student')
    def get(self):
        project_id = get_project_id_student()

        # get events for a project_id
        events = Events.query.filter_by(project_id=project_id).all()
        
        events_list = [
            {
                "title": event.title,
                "start": event.start_date,
            }
            for event in events
        ]
        return jsonify(events_list)