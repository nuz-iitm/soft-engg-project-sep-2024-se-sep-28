import os

basedir = os.path.abspath(os.path.dirname(__file__))
size = len(basedir)
maindir = basedir[:size-8]


class Config(object):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLITE_DB_DIR = os.path.join(basedir, "db_directory")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + os.path.join(SQLITE_DB_DIR, "seproject.sqlite3")
    SECRET_KEY = 'superdupersecretkey'
    SECURITY_PASSWORD_SALT = 'supersaltysalt'
    SECURITY_PASSWORD_HASH = "bcrypt"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
    JWT_SECRET_KEY = 'jwt_secret_key'
    MAX_CONTENT_LENGTH = 5 * 1024 *1024  #  5 mb limit
    ALLOWED_EXTENSIONS = {'csv', 'pdf'}
    UPLOAD_FOLDER = os.path.join(basedir, "/uploads")