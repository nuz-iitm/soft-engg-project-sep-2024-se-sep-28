from flask_security import SQLAlchemyUserDatastore
from .models import db, User
datastore = SQLAlchemyUserDatastore(db, User)