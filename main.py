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

# statch directory for frontend DO NOT DELETE
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
        from backend.application.controller.api import Register, Login, Logout

        # user registration endpoint
        api.add_resource(Register, "/api/register")
        # user login endpoint
        api.add_resource(Login, "/api/login")
        # user logout endpoint
        api.add_resource(Logout, "/api/logout")
        
    return app, api


app, api = create_app()

if __name__ == '__main__':
    app.run(debug=True)