import pytest
from flask import Flask, json
from backend.application.data.database import db
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from backend.application.security import user_datastore
from flask_security import Security
from flask_restful import Resource
import flask_login
import pprint


@pytest.fixture(scope='module')
def app():
    test_app = Flask(__name__)
    test_app.config.from_object('backend.config.DevelopmentConfig')

    # Initialize extensions within the test context
    with test_app.app_context():
        bcrypt = Bcrypt(test_app)
        db.init_app(test_app)
        jwt = JWTManager(test_app)
        login_manager = flask_login.LoginManager()
        login_manager.init_app(test_app)

        # Import resources to ensure they are registered with the app
        from backend.application.controller.api import (
            Register, Login, Logout, FaqResource, FaqUpdateResource,
            BulkUpload, StudentUpdate, InstructorResource, InstructorUpdateResource,
            StudentQueryResource, StudentQueryUpdateResource, InstructorQueryResource,
            InstructorUpdateQueryResource, MilestoneResource, MilestoneStudentResource,
            MilestoneUpdateResource, MilestoneSubmissionResource, ProjectResource,
            DashBoardResource
        )

        # Create an API instance and add resources
        api = Api(test_app)
        api.add_resource(Register, "/api/register")
        api.add_resource(Login, "/api/login")
        api.add_resource(Logout, "/api/logout")
        api.add_resource(FaqResource, "/api/faq")
        api.add_resource(FaqUpdateResource, "/api/faq/<int:f_id>")
        api.add_resource(BulkUpload, "/api/student")
        api.add_resource(StudentUpdate, "/api/student/<int:s_id>")
        api.add_resource(InstructorResource, "/api/instructor")
        api.add_resource(InstructorUpdateResource, "/api/instructor/<int:i_id>")
        api.add_resource(StudentQueryResource, "/api/student_query")
        api.add_resource(StudentQueryUpdateResource, "/api/student_query/<int:q_id>")
        api.add_resource(InstructorQueryResource, "/api/instructor_query")
        api.add_resource(InstructorUpdateQueryResource, "/api/instructor_query/<int:q_id>")
        api.add_resource(MilestoneResource, '/api/milestone')
        api.add_resource(MilestoneStudentResource, '/api/milestone_student')
        api.add_resource(MilestoneUpdateResource, '/api/milestone/<int:m_id>')
        api.add_resource(MilestoneSubmissionResource, '/api/milestone_sub/<int:m_id>')
        api.add_resource(ProjectResource, '/api/project_statement')
        api.add_resource(DashBoardResource, '/api/dash_top_studd')

    return test_app

@pytest.fixture(scope='module')
def client(app):
    with app.test_client() as client:
        yield client

# Test cases for Register Resource
class TestRegisterResource:
    def test_register_user_success(self, client):
        data = {
            "email": "student11@abc.com",
            "password": "12345678",
            "role": "student"
        }
        response = client.post("/api/register", json=data)
        print("Response status code:", response.status_code)
        
        assert response.status_code == 200
        assert response.json["message"] == "User registered successfully"
    
    def test_register_user_with_existing_email(self, client):
        data = {
            "email": "student10@abc.com",
            "password": "12345678",
            "role": "student"
        }
        client.post("/api/register", json=data)  
        response = client.post("/api/register", json=data)
        print("Response content:", response.data)
        assert response.json["message"] == "User already exists"
        assert response.status_code == 400
        


class TestLoginResource:
    def test_login_valid_user(self, client):
        data = {
            "email": "student1@abc.com",
            "password": "12345678"
        }
        response = client.post('/api/login', json=data)
        print("Response content:", response.data)
        assert response.status_code == 200
        assert 'access_token' in json.loads(response.data)

    def test_login_invalid_user(self, client):
        data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        response = client.post('/api/login', json=data)
        print("Response content:", response.data)
        assert json.loads(response.data)['message'] == 'Invalid email or password'
        assert response.status_code == 400
    
    def test_login_empty_inputs(self, client):

        response = client.post("/api/login", json={
            "email": "",
            "password": ""
        })
        print("Empty Login Response:", response.json)
        assert response.status_code == 400
        assert response.json["message"] == "Email and password are required"    

class TestLogoutResource:
    def test_logout_user(self, client):
        # Step 1: Login to get the access token
        login_data = {
            "email": "student1@abc.com",
            "password": "12345678"
        }
        login_response = client.post('/api/login', json=login_data)
        assert login_response.status_code == 200
        
        
        login_json = json.loads(login_response.data)
        assert 'access_token' in login_json
        access_token = login_json['access_token']
        print("Access Token for Logout Test:", access_token)
        
        
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        logout_response = client.post('/api/logout', headers=headers)
        
        
        print("Logout Response:", logout_response.data)
        assert logout_response.status_code == 200
        logout_json = json.loads(logout_response.data)
        assert logout_json['message'] == "Logout successful"


if __name__ == '__main__':
    pytest.main(['test.py'])