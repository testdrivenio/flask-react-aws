# project/tests/utils.py


from project import db
from project.api.users.models import User


def add_user(username, email, password):
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return user


def recreate_db():
    db.session.remove()
    db.drop_all()
    db.create_all()
