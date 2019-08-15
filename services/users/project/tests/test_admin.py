# project/tests/test_users.py


import os

from project import create_app
from project.tests.utils import recreate_db


def test_admin_view_dev():
    os.environ["FLASK_ENV"] = "development"
    assert os.getenv("FLASK_ENV") == "development"
    app = create_app()
    app.config.from_object("project.config.TestingConfig")
    with app.app_context():
        recreate_db()
        client = app.test_client()
        resp = client.get("/admin/user/")
        assert resp.status_code == 200
    assert os.getenv("FLASK_ENV") == "development"


def test_admin_view_prod():
    os.environ["FLASK_ENV"] = "production"
    assert os.getenv("FLASK_ENV") == "production"
    app = create_app()
    app.config.from_object("project.config.TestingConfig")
    with app.app_context():
        recreate_db()
        client = app.test_client()
        resp = client.get("/admin/user/")
        assert resp.status_code == 404
    assert os.getenv("FLASK_ENV") == "production"
