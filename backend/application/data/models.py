from flask_security import UserMixin, RoleMixin
from backend.application.data.database import db

class User(db.Model, UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(255))
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    active = db.Column(db.Boolean())
    roles = db.relationship('Role', secondary="roles_users", 
                           backref=db.backref('users', lazy='dynamic'), 
                           lazy='dynamic')


class Role(db.Model, RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(120), unique=True)
    description = db.Column(db.String(255))
    # id = 1, admin
    # id = 2, instructor
    # id = 3, student

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))


class Students(db.Model):
    __tablename__ = 'students'
    s_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    team_id = db.Column(db.Integer)


class Instructors(db.Model):
    __tablename__ = 'instructors'
    i_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    designation = db.Column(db.String(120))

class Projects(db.Model):
    __tablename__ = 'projects'
    project_id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80))
    statement = db.Column(db.String(1000))
    githublink = db.Column(db.String(255))

class Milestones(db.Model):
    __tablename__ = 'milestones'
    m_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    desc = db.Column(db.String(500))
    deadline = db.Column(db.String(120))
    sub_date = db.Column(db.String(120))
    submission = db.Column(db.String(255))

class Queries(db.Model):
    __tablename__ = 'queries'
    q_id = db.Column(db.Integer, primary_key=True)
    desc = db.Column(db.String(500))
    s_id = db.Column(db.Integer, db.ForeignKey('students.s_id'))
    i_id = db.Column(db.Integer, db.ForeignKey('instructors.i_id'))
    qdate = db.Column(db.String(120))
    response = db.Column(db.String(500))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))


class Faq(db.Model):
    __tablename__ = 'faq'
    f_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    question = db.Column(db.String(500))
    answer = db.Column(db.String(500))


class githubdata(db.Model):
    __tablename__ = 'githubdata'
    g_id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    s_id = db.Column(db.Integer, db.ForeignKey('students.s_id'))
    commit_date = db.Column(db.String(80))
    message = db.Column(db.String(500))


