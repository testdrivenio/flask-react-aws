# services/users/project/__init__.py


import os

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# instantiate the extensions
db = SQLAlchemy()
cors = CORS()
bcrypt = Bcrypt()


def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    cors.init_app(app)
    bcrypt.init_app(app)

    # register blueprints
    from project.api.ping import ping_blueprint

    app.register_blueprint(ping_blueprint)
    from project.api.users import users_blueprint

    app.register_blueprint(users_blueprint)
    from project.api.auth import auth_blueprint

    app.register_blueprint(auth_blueprint)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
