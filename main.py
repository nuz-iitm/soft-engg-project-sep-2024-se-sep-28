from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_security import Security
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
    app.app_context().push()
    #flask-security
    security = Security(app, user_datastore)
    api = Api(app)
    app.app_context().push()
    with app.app_context():
        import backend.application.controller.controllers
    return app, api


app, api = create_app()

# api imports
from backend.application.controller.api import Register

# user registration endpoint
api.add_resource(Register, "/api/register")

if __name__ == '__main__':
    app.run(debug=True)