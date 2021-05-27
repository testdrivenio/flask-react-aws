# services/users/manage.py


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user('justatest', 'test@test.com', 'greaterthaneight')
    user_two = add_user('justatest2', 'test@test2.com', 'greaterthaneight')
    assert user_one.password != user_two.password

import sys

from flask.cli import FlaskGroup

from src import create_app, db
from src.api.users.models import User


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command('seed_db')
def seed_db():
    db.session.add(User(username='michael', email="hermanmu@gmail.com"))
    db.session.add(User(username='michaelherman', email="michael@mherman.org"))
    db.session.commit()


if __name__ == '__main__':
    cli()
