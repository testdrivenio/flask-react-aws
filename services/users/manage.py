# manage.py


import sys

from flask.cli import FlaskGroup

from project import create_app, db
from project.api.users.models import User


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('recreate_db')
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command('seed_db')
def seed_db():
    """Seeds the database."""
    db.session.add(User(
        username='michael',
        email='michael@reallynotreal.com',
        password='greaterthaneight'
    ))
    db.session.add(User(
        username='michaelherman',
        email='michael@mherman.org',
        password='greaterthaneight'
    ))
    db.session.commit()


if __name__ == '__main__':
    cli()
