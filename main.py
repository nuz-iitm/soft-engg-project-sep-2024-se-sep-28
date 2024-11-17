from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_security import Security
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
import flask_excel as excel
from backend.config import DevelopmentConfig
from backend.application.data.database import db
from backend.application.security import user_datastore
import os

# template directory for frontend DO NOT DELETE
template_dir = os.path.abspath('frontend/templates')

# static directory for frontend DO NOT DELETE
static_dir = os.path.abspath('frontend/static')


def create_app():
    app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
    app.config.from_object(DevelopmentConfig)
    CORS(app)
    db.init_app(app)

    jwt = JWTManager(app)

    #flask-security
    security = Security(app, user_datastore)

    api = Api(app)
    app.app_context().push()

    with app.app_context():
        import backend.application.controller.controllers

        # api imports
        from backend.application.controller.api import (
            Register, 
            Login, 
            Logout, 
            FaqResource,
            FaqUpdateResource, 
            BulkUpload, 
            StudentUpdate, 
            InstructorResource,
            InstructorUpdateResource,
            StudentQueryResource,
            StudentQueryUpdateResource,
            InstructorQueryResource,
            InstructorUpdateQueryResource,
            MilestoneResource,
            MilestoneUpdateResource,
            MilestoneSubmissionResource,
            ProjectResource,
            DashBoardResource)
        
        # user registration endpoint
        api.add_resource(Register, "/api/register") # post
        # user login endpoint
        api.add_resource(Login, "/api/login") # post
        # user logout endpoint
        api.add_resource(Logout, "/api/logout") # post
        # faq endpoint
        api.add_resource(FaqResource, "/api/faq") # get, post
        api.add_resource(FaqUpdateResource, "/api/faq/<int:f_id>") # put, delete
        # bulk upload endpoint
        api.add_resource(BulkUpload, "/api/student") # get, post(csv file)
        # student endpoint
        api.add_resource(StudentUpdate, "/api/student/<int:s_id>") # put, delete
        # instructor endpoint
        api.add_resource(InstructorResource, "/api/instructor") # get, post
        api.add_resource(InstructorUpdateResource, "/api/instructor/<int:i_id>")
        # queries endpoint
        api.add_resource(StudentQueryResource, "/api/student_query") # get, post
        api.add_resource(StudentQueryUpdateResource, "/api/student_query/<int:q_id>") # get
        api.add_resource(InstructorQueryResource, "/api/instructor_query") # get
        api.add_resource(InstructorUpdateQueryResource, "/api/instructor_query/<int:q_id>")# get put delete
        # milestone endpoint
        api.add_resource(MilestoneResource, '/api/milestone') #get post
        api.add_resource(MilestoneUpdateResource, '/api/milestone/<int:m_id>') # put delete
        api.add_resource(MilestoneSubmissionResource, '/api/milestone_sub/<int:m_id>') # get post
        # project statement endpoint
        api.add_resource(ProjectResource, '/api/project_statement') # get put
        # dashboard endpoints
        api.add_resource(DashBoardResource, '/api/dash_top_studd') # get

    return app, api


app, api = create_app()

if __name__ == '__main__':
    app.run(debug=True)