from flask_security import SQLAlchemySessionUserDatastore, Security
from .data.models import db, User, Role

user_datastore = SQLAlchemySessionUserDatastore(db.session, User, Role)
