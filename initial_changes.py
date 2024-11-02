# from main import app, datastore
# from frontend.application.models import db, Role
# from werkzeug.security import generate_password_hash

# with app.app_context():
#     db.create_all()
#     datastore.find_or_create_role(name='User',description='Regular User')

#     db.session.commit()
#     if not datastore.find_user(email='user@email.com'):
#         datastore.create_user(email='user@email.com',password=generate_password_hash('userYI'),roles=["User"])
#     db.session.commit() 