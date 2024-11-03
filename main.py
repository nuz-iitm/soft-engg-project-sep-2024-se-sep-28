from flask import Flask
from flask_cors import CORS
import flask_excel as excel
from backend.config import DevelopmentConfig
import os


template_dir = os.path.abspath('frontend/templates')
stactic_dir = os.path.abspath('frontend/static')

def create_app():
    app = Flask(__name__, template_folder=template_dir, static_folder=stactic_dir)
    app.config.from_object(DevelopmentConfig)
    CORS(app)
    with app.app_context():
        import backend.application.controllers
    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)