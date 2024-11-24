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

'''INDEX FOR THE FILE

 0. TESTCASE SET UP DATA
 1. REGISTER LOGIN AND LOGOUT
 2. FAQ
 3. MILESTONE
 
 
 
 
 '''




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
#################################LOGIN AND REGISTER#####################################
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

####################################FAQ#################################

class TestFaqResource:

    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):

        login_response = client.post("/api/login", json={
            "email": "instructor1@abc.com",
            "password": "12345678"
        })

        print("Login Response:", login_response.json)
        assert login_response.status_code == 200
        assert "access_token" in login_response.json

        
        return login_response.json["access_token"]

    def test_get_faqs_success(self, client, instructor_jwt_token):
        
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.get("/api/faq", headers=headers)

        
        print("FAQ GET Response:", response.json)


        assert response.status_code == 200
        assert isinstance(response.json, list)  # Ensure response is a list of FAQs

    def test_post_faq_success(self, client, instructor_jwt_token):

        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data = {
            "question": "What is 42?",
            "answer": "It is the answer to life, the universe, and everything."
        }
        response = client.post("/api/faq", headers=headers, json=data)

   
        print("FAQ POST Response:", response.json)

    
        assert response.status_code == 200
        assert response.json["message"] == "FAQ created successfully."

    def test_post_faq_missing_data(self, client, instructor_jwt_token):
      
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data = {"question": ""}  
        response = client.post("/api/faq", headers=headers, json=data)

        
        print("FAQ POST Missing Data Response:", response.json)

   
        assert response.status_code == 400  
        assert "message" in response.json        
    

class TestFaqUpdateResource:
    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):

        login_response = client.post("/api/login", json={
            "email": "instructor1@abc.com",
            "password": "12345678"
        })

        print("Login Response:", login_response.json)
        assert login_response.status_code == 200
        assert "access_token" in login_response.json

        
        return login_response.json["access_token"]

    def test_update_faq_success(self, client, instructor_jwt_token):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        # Update f_id 1
        f_id =4
      
        # Update the FAQ with new question and answer
        update_data = {"question": "Updated Question?", "answer": "Updated Answer."}
        update_response = client.put(f"/api/faq/{f_id}", headers=headers, json=update_data)

        print("FAQ UPDATE Response:", update_response.json)

        assert update_response.status_code == 200
        assert update_response.json["message"] == "FAQ updated successfully."

    def test_update_faq_not_found(self, client, instructor_jwt_token):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        update_data = {"question": "Does not matter", "answer": "Will not work"}
        f_id = 99999  

        response = client.put(f"/api/faq/{f_id}", headers=headers, json=update_data)

        print("FAQ NOT FOUND UPDATE Response:", response.json)

        assert response.status_code == 400
        assert response.json["message"] == "FAQ not found"

    def test_update_faq_invalid_data(self, client, instructor_jwt_token):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}

        # Create an FAQ entry to update
        create_data = {"question": "Original Question?", "answer": "Original Answer."}
        create_response = client.post("/api/faq", headers=headers, json=create_data)
        assert create_response.status_code == 200

        f_id = 5
        

        # Attempt to update with invalid data
        update_data = {"question": "", "answer": ""}  # Invalid inpu
        update_response = client.put(f"/api/faq/{f_id}", headers=headers, json=update_data)

        print("FAQ INVALID DATA UPDATE Response:", update_response.json)

        assert update_response.status_code == 400 
        assert "message" in update_response.json


class TestFaqDeleteResource:


    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):

        login_response = client.post("/api/login", json={
            "email": "instructor1@abc.com",
            "password": "12345678"
        })

        print("Login Response:", login_response.json)
        assert login_response.status_code == 200
        assert "access_token" in login_response.json

        
        return login_response.json["access_token"]
    

    def test_delete_faq_success(self, client, instructor_jwt_token):
        
        faq_id = 4
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.delete(f"/api/faq/{faq_id}", headers=headers)

        print("FAQ DELETE Response:", response.json)

        assert response.status_code == 200
        assert response.json["message"] == "FAQ deleted successfully."

    def test_delete_faq_not_found(self, client, instructor_jwt_token):
        # Attempt to delete a non-existent FAQ
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.delete("/api/faq/99999", headers=headers)  # Non-existent ID

        print("FAQ DELETE NOT FOUND Response:", response.json)

        assert response.status_code == 400  # Bad Request
        assert response.json["message"] == "FAQ not found"

    def test_delete_faq_unauthorized(self, client):
        
        response = client.delete("/api/faq/1")  
        

        assert response.status_code == 401  


############################################################################################

class TestMilestoneResource:

    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):
        

        login_response = client.post("/api/login", json={
            "email": "instructor1@abc.com",
            "password": "12345678"
        })

        assert login_response.status_code == 200
        assert "access_token" in login_response.json

        return login_response.json["access_token"]

    def test_get_milestones_success(self, client, instructor_jwt_token):
      
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.get("/api/milestone", headers=headers)

        print("GET Milestones Response:", response.json)

       
        assert response.status_code == 200
        assert isinstance(response.json, list)  
        if response.json:  
            assert "m_id" in response.json[0]
            assert "desc" in response.json[0]
            assert "deadline" in response.json[0]

    def test_post_milestone_success(self, client, instructor_jwt_token):
        # Make a POST request to create a new milestone
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data = {
            "desc": "Complete Module 1",
            "deadline": "2024-12-31"
        }
        response = client.post("/api/milestone", headers=headers, json=data)

        print("POST Milestone Response:", response.json)

        # Assertions
        assert response.status_code == 200

    def test_post_milestone_missing_data(self, client, instructor_jwt_token):
        
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data = {"desc": ""}  
        response = client.post("/api/milestone", headers=headers, json=data)

        print("POST Milestone Missing Data Response:", response.json)

        
        assert response.status_code == 400  
        assert "message" in response.json

############################################INSTRUCTOR QUERY RESOURCE##########################################
class TestInstructorQueryResource:

    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):


        login_response = client.post("/api/login", json={
            "email": "instructor1@abc.com",
            "password": "12345678"
        })

        assert login_response.status_code == 200
        assert "access_token" in login_response.json

        return login_response.json["access_token"]

    @pytest.fixture(scope="class")
    def create_queries(self, client, instructor_jwt_token):
        
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data_list = [
            {"desc": "what is the meaning of life?"},
            {"desc": "what makes us study endlessly?"}
        ]
        for data in data_list:
            response = client.post("/api/student_query", headers=headers, json=data)
            assert response.status_code == 200

    def test_get_all_queries_success(self, client, instructor_jwt_token, create_queries):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.get("/api/instructor_query", headers=headers)

        print("GET All Queries Response:", response.json)

        assert response.status_code == 200
        assert isinstance(response.json, list)  
        assert len(response.json) > 0

##########################################PROJECT RESOURCE##########################   
class TestProjectResource:
    @pytest.fixture(scope="class")
    def instructor_jwt_token(self, client):
        
        login_data = {
            "email": "instructor1@abc.com",
            "password": "12345678"
        }
        login_response = client.post("/api/login", json=login_data)
        assert login_response.status_code == 200
        
        login_json = json.loads(login_response.data)
        assert 'access_token' in login_json
        return login_json['access_token']

    @pytest.fixture(scope="class")
    def student_jwt_token(self, client):
       
        login_data = {
            "email": "student1@abc.com",
            "password": "12345678"
        }
        login_response = client.post("/api/login", json=login_data)
        assert login_response.status_code == 200
        
        login_json = json.loads(login_response.data)
        assert 'access_token' in login_json
        return login_json['access_token']

    def test_get_project_statement_as_instructor(self, client, instructor_jwt_token):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        response = client.get("/api/project_statement", headers=headers)

        print("GET Project Statement Response (Instructor):", response.json)

        assert response.status_code == 200
        assert "statement" in response.json

    def test_get_project_statement_as_student(self, client, student_jwt_token):
        headers = {"Authorization": f"Bearer {student_jwt_token}"}
        response = client.get("/api/project_statement", headers=headers)

        print("GET Project Statement Response (Student):", response.json)

        assert response.status_code == 200
        assert "statement" in response.json

    def test_put_project_statement_as_instructor(self, client, instructor_jwt_token):
        headers = {"Authorization": f"Bearer {instructor_jwt_token}"}
        data = {"statement": "This is a new project statement for testing."}
        response = client.put("/api/project_statement", headers=headers, json=data)

        print("PUT Project Statement Response:", response.json)

        assert response.status_code == 200
        assert response.json["message"] == "Statement added successfully."

    def test_put_project_statement_as_student(self, client, student_jwt_token):
        headers = {"Authorization": f"Bearer {student_jwt_token}"}
        data = {"statement": "This statement should not be accepted."}
        response = client.put("/api/project_statement", headers=headers, json=data)

        print("PUT Project Statement Response (Student):", response.json)

        assert response.json[0]["message"] == 'Access denied'
        assert response.json[1] == 403

#####################################INSTRUCTOR RESOURCE#####################
class TestInstructorResource:
    @pytest.fixture(scope="class")
    def admin_jwt_token(self, client):
        login_data = {
            "email": "abcde@abcd.com",
            "password": "12345678"
        }
        login_response = client.post("/api/login", json=login_data)
        assert login_response.status_code == 200

        login_json = json.loads(login_response.data)
        assert 'access_token' in login_json
        return login_json['access_token']

    def test_get_instructors_success(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        response = client.get("/api/instructor", headers=headers)

        print("GET Instructors Response:", response.json)

        assert response.status_code == 200
        assert isinstance(response.json, list)
        if response.json:
            for instructor in response.json:
                assert "i_id" in instructor
                assert "name" in instructor
                assert "email" in instructor
                assert "project_id" in instructor
                assert "designation" in instructor

    def test_add_instructor_success(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        data = {
            "name": "Instructor4",
            "email": "instructor4@abc.com",
            "project_id": 1,
            "designation": "Professor"
        }
        response = client.post("/api/instructor", headers=headers, json=data)

        print("POST Add Instructor Response:", response.json)

        assert response.status_code == 200
        assert response.json["message"] == "Instructor added successfully."

    def test_update_instructor_success(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        data = {
            "name": "Updated Instructor",
            "email": "updated.instructor@abc.com",
            "project_id": 1,
            "designation": "Senior Professor"
        }
        i_id = 4
        response = client.put(f"/api/instructor/{i_id}", headers=headers, json=data)

        print("PUT Instructor Update Response:", response.json)

        assert response.status_code == 200
        assert response.json["message"] == "Instructor updated successfully."

    def test_update_instructor_not_found(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        data = {
            "name": "Updated Instructor",
            "email": "nonexistent.instructor@abc.com",
            "project_id": 1,
            "designation": "Senior Professor"
        }
        i_id = 9999
        response = client.put(f"/api/instructor/{i_id}", headers=headers, json=data)

        print("PUT Instructor Update Not Found Response:", response.json)

        assert response.status_code == 400
        assert response.json["message"] == "instructor not found"

    def test_delete_instructor_success(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        i_id = 4  
        response = client.delete(f"/api/instructor/{i_id}", headers=headers)

        print("DELETE Instructor Response:", response.json)

        assert response.status_code == 200
        assert response.json["message"] == "Instructor deleted successfully."

    def test_delete_instructor_not_found(self, client, admin_jwt_token):
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        i_id = 9999  
        response = client.delete(f"/api/instructor/{i_id}", headers=headers)

        print("DELETE Instructor Not Found Response:", response.json)

        assert response.status_code == 400
        assert response.json["message"] == "Instructor not found"

##################student resource#################################

class TestBulkUpload:

    @pytest.fixture(scope="class")
    def admin_jwt_token(self, client):
     
        login_data = {"email": "abcde@abcd.com", "password": "12345678"}
        login_response = client.post("/api/login", json=login_data)
        assert login_response.status_code == 200, "Login failed. Check credentials."
        return login_response.json["access_token"]

    def test_get_students_as_admin(self, client, admin_jwt_token):
    
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        response = client.get("/api/student", headers=headers)

        print("GET Students Response:", response.json)

        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert isinstance(response.json, list), "Response should be a list of students"

    # def test_post_students_csv_success(self, client, admin_jwt_token):
   
    #     headers = {"Authorization": f"Bearer {admin_jwt_token}"}
      
    #     try:
    #         with open("test_students.csv", "rb") as file:
    #             data = {'csvFile': (file, "test_students.csv")}
    #             response = client.post(
    #                 "/api/student", headers=headers, data=data, content_type="multipart/form-data"
    #             )

    #             print("POST Students CSV Response:", response.json)

    #             assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    #             assert response.json["message"] == "Students added successfully"
    #     except FileNotFoundError:
    #         assert False, "File test_students.csv not found. Ensure the file exists in the directory."

    def test_post_students_csv_no_file(self, client, admin_jwt_token):
     
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
        response = client.post("/api/student", headers=headers)

        print("POST Students CSV No File Response:", response.json)

        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert response.json["message"] == "No file part", "Unexpected response message"

    def test_post_students_csv_invalid_file_type(self, client, admin_jwt_token):
   
        headers = {"Authorization": f"Bearer {admin_jwt_token}"}
     
        try:
            with open("test_invalid_file.txt", "rb") as file:
                data = {'csvFile': (file, "test_invalid_file.txt")}
                response = client.post(
                    "/api/student", headers=headers, data=data, content_type="multipart/form-data"
                )

                print("POST Students CSV Invalid File Type Response:", response.json)

                assert response.status_code == 400, f"Expected 400, got {response.status_code}"
                assert response.json["message"] == "Invalid file type", "Unexpected response message"
        except FileNotFoundError:
            assert False, "File test_invalid_file.txt not found. Ensure the file exists in the directory."

if __name__ == '__main__':
    pytest.main(['test.py'])