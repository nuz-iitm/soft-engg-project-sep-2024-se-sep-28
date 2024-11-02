from flask import Flask
from flask_cors import CORS
import flask_excel as excel
from config import DevelopmentConfig

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    CORS(app)
    with app.app_context():
        import frontend.application.controllers

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True)