# project/api/users/views.py


from flask import Blueprint, request
from flask_restful import Api, Resource
from sqlalchemy import exc

from project import db
from project.api.users.models import User

users_blueprint = Blueprint("users", __name__)
api = Api(users_blueprint)


class UsersList(Resource):
    def get(self):
        response_object = {
            "status": "success",
            "data": {"users": [user.to_json() for user in User.query.all()]},
        }
        return response_object, 200

    def post(self):
        post_data = request.get_json()
        response_object = {"status": "fail", "message": "Invalid payload."}
        if not post_data:
            return response_object, 400
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")
        try:
            user = User.query.filter_by(email=email).first()
            if not user:
                db.session.add(User(username=username, email=email, password=password))
                db.session.commit()
                response_object["status"] = "success"
                response_object["message"] = f"{email} was added!"
                return response_object, 201
            else:
                response_object["message"] = "Sorry. That email already exists."
                return response_object, 400
        except exc.IntegrityError:
            db.session.rollback()
            return response_object, 400
        except (exc.IntegrityError, ValueError):
            db.session.rollback()
            return response_object, 400


class Users(Resource):
    def get(self, user_id):
        response_object = {"status": "fail", "message": "User does not exist"}
        try:
            user = User.query.filter_by(id=int(user_id)).first()
            if not user:
                return response_object, 404
            else:
                response_object = {
                    "status": "success",
                    "data": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "active": user.active,
                    },
                }
                return response_object, 200
        except ValueError:
            return response_object, 404

    def put(self, user_id):
        post_data = request.get_json()
        response_object = {"status": "fail", "message": "Invalid payload."}
        if not post_data:
            return response_object, 400
        username = post_data.get("username")
        email = post_data.get("email")
        if not username or not email:
            return response_object, 400
        try:
            user = User.query.filter_by(id=int(user_id)).first()
            if user:
                user.username = username
                user.email = email
                db.session.commit()
                response_object["status"] = "success"
                response_object["message"] = f"{user.id} was updated!"
                return response_object, 200
            else:
                response_object["message"] = "User does not exist."
                return response_object, 404
        except exc.IntegrityError:
            db.session.rollback()
            return response_object, 400

    def delete(self, user_id):
        response_object = {"status": "fail", "message": "User does not exist"}
        try:
            user = User.query.filter_by(id=int(user_id)).first()
            if not user:
                return response_object, 404
            else:
                db.session.delete(user)
                db.session.commit()
                response_object["status"] = "success"
                response_object["message"] = f"{user.email} was removed!"
                return response_object, 200
        except ValueError:
            return response_object, 404


api.add_resource(UsersList, "/users")
api.add_resource(Users, "/users/<user_id>")
