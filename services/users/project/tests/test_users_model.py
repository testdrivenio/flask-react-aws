# services/users/project/tests/test_users_model.py


from project.api.users.models import User


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("justatest", "test@test.com", "greaterthaneight")
    user_two = add_user("justatest2", "test@test2.com", "greaterthaneight")
    assert user_one.password != user_two.password


def test_encode_auth_token(test_app, test_database, add_user):
    user = add_user("justatest", "test@test.com", "test")
    auth_token = user.encode_auth_token(user.id, "access")
    assert isinstance(auth_token, bytes)


def test_decode_auth_token(test_app, test_database, add_user):
    user = add_user("justatest", "test@test.com", "test")
    auth_token = user.encode_auth_token(user.id, "access")
    assert isinstance(auth_token, bytes)
    assert User.decode_auth_token(auth_token) == user.id
