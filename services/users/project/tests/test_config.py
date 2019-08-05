# project/tests/test_config.py


import os


def test_development_config(test_app):
    test_app.config.from_object("project.config.DevelopmentConfig")
    assert test_app.config["SECRET_KEY"] == "my_precious"
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get("DATABASE_URL")


def test_testing_config(test_app):
    test_app.config.from_object("project.config.TestingConfig")
    assert test_app.config["SECRET_KEY"] == "my_precious"
    assert test_app.config["TESTING"]
    assert not test_app.config["PRESERVE_CONTEXT_ON_EXCEPTION"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get(
        "DATABASE_TEST_URL"
    )


def test_production_config(test_app):
    test_app.config.from_object("project.config.ProductionConfig")
    assert test_app.config["SECRET_KEY"] == "my_precious"
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get("DATABASE_URL")
