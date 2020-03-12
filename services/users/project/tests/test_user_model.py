# services/users/project/tests/test_users_model.py


def test_passwords_are_random(test_app, test_database, add_user):
    user_one = add_user("justatest", "test@test.com", "greaterthaneight")
    user_two = add_user("justatest2", "test@test2.com", "greaterthaneight")
    print(user_one.password, user_two.password)
    assert user_one.password != user_two.password
