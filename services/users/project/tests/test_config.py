# services/users/project/tests/test_config.py


import os


def test_development_config(test_app):
    test_app.config.from_object("project.config.DevelopmentConfig")
    assert test_app.config["SECRET_KEY"] == os.environ.get("SECRET_KEY")
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get("DATABASE_URL")
    assert test_app.config["BCRYPT_LOG_ROUNDS"] == 4
    assert test_app.config["TOKEN_EXPIRATION_DAYS"] == 30
    assert test_app.config["TOKEN_EXPIRATION_SECONDS"] == 0


def test_testing_config(test_app):
    test_app.config.from_object("project.config.TestingConfig")
    assert test_app.config["SECRET_KEY"] == os.environ.get("SECRET_KEY")
    assert test_app.config["TESTING"]
    assert not test_app.config["PRESERVE_CONTEXT_ON_EXCEPTION"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get(
        "DATABASE_TEST_URL"
    )
    assert test_app.config["BCRYPT_LOG_ROUNDS"] == 4
    assert test_app.config["TOKEN_EXPIRATION_DAYS"] == 0
    assert test_app.config["TOKEN_EXPIRATION_SECONDS"] == 3


def test_production_config(test_app):
    test_app.config.from_object("project.config.ProductionConfig")
    assert test_app.config["SECRET_KEY"] == os.environ.get("SECRET_KEY")
    assert not test_app.config["TESTING"]
    assert test_app.config["SQLALCHEMY_DATABASE_URI"] == os.environ.get("DATABASE_URL")
    assert test_app.config["BCRYPT_LOG_ROUNDS"] == 13
    assert test_app.config["TOKEN_EXPIRATION_DAYS"] == 30
    assert test_app.config["TOKEN_EXPIRATION_SECONDS"] == 0
