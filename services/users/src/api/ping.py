from flask_restx import Namespace, Resource

ping_namespace = Namespace("ping")


class Ping(Resource):
    def get(self):
        return {"status": "success", "message": "pong!"}


ping_namespace.add_resource(Ping, "")
