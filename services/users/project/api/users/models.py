# project/api/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db, bcrypt


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, username="", email="", password=""):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, current_app.config.get("BCRYPT_LOG_ROUNDS")
        ).decode()

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "active": self.active,
        }

    def encode_auth_token(self, user_id):
        """Generates the access token"""
        try:
            payload = {
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(
                    days=current_app.config.get("TOKEN_EXPIRATION_DAYS"),
                    seconds=current_app.config.get("TOKEN_EXPIRATION_SECONDS"),
                ),
                "iat": datetime.datetime.utcnow(),
                "sub": user_id,
            }
            return jwt.encode(
                payload, current_app.config.get("SECRET_KEY"), algorithm="HS256"
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the access token - :param auth_token: - :return: integer|string
        """
        try:
            payload = jwt.decode(auth_token, current_app.config.get("SECRET_KEY"))
            return payload["sub"]
        except jwt.ExpiredSignatureError:
            return "Signature expired. Please log in again."
        except jwt.InvalidTokenError:
            return "Invalid token. Please log in again."


if os.getenv("FLASK_ENV") == "development":
    from project import admin
    from project.api.users.admin import UsersAdminView

    admin.add_view(UsersAdminView(User, db.session))
