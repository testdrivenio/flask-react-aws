# project/tests/test_users.py


import json

from project.tests.utils import add_user, recreate_db


def test_add_user(test_app, test_database):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps({"username": "michael", "email": "michael@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 201
    assert "michael@testdriven.io was added!" in data["message"]
    assert "success" in data["status"]


def test_add_user_invalid_json(test_app, test_database):
    client = test_app.test_client()
    resp = client.post("/users", data=json.dumps({}), content_type="application/json")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_add_user_invalid_json_keys(test_app,):
    client = test_app.test_client()
    resp = client.post(
        "/users",
        data=json.dumps({"email": "john@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_add_user_duplicate_email(test_app, test_database):
    client = test_app.test_client()
    client.post(
        "/users",
        data=json.dumps({"username": "michael", "email": "michael@testdriven.io"}),
        content_type="application/json",
    )
    resp = client.post(
        "/users",
        data=json.dumps({"username": "michael", "email": "michael@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Sorry. That email already exists." in data["message"]
    assert "fail" in data["status"]


def test_single_user(test_app, test_database):
    user = add_user("jeffrey", "jeffrey@testdriven.io")
    client = test_app.test_client()
    resp = client.get(f"/users/{user.id}")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert "jeffrey" in data["data"]["username"]
    assert "jeffrey@testdriven.io" in data["data"]["email"]
    assert "success" in data["status"]


def test_single_user_no_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get("/users/blah")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User does not exist" in data["message"]
    assert "fail" in data["status"]


def test_single_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.get("/users/999")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User does not exist" in data["message"]
    assert "fail" in data["status"]


def test_all_users(test_app, test_database):
    recreate_db()
    add_user("michael", "michael@mherman.org")
    add_user("fletcher", "fletcher@notreal.com")
    client = test_app.test_client()
    resp = client.get("/users")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 200
    assert len(data["data"]["users"]) == 2
    assert "michael" in data["data"]["users"][0]["username"]
    assert "michael@mherman.org" in data["data"]["users"][0]["email"]
    assert "fletcher" in data["data"]["users"][1]["username"]
    assert "fletcher@notreal.com" in data["data"]["users"][1]["email"]
    assert "success" in data["status"]


def test_remove_user(test_app, test_database):
    recreate_db()
    user = add_user("user-to-be-removed", "remove-me@testdriven.io")
    client = test_app.test_client()
    resp_one = client.get("/users")
    data = json.loads(resp_one.data.decode())
    assert resp_one.status_code == 200
    assert len(data["data"]["users"]) == 1
    resp_two = client.delete(f"/users/{user.id}")
    data = json.loads(resp_two.data.decode())
    assert resp_two.status_code == 200
    assert "remove-me@testdriven.io was removed!" in data["message"]
    assert "success" in data["status"]
    resp_three = client.get("/users")
    data = json.loads(resp_three.data.decode())
    assert resp_three.status_code == 200
    assert len(data["data"]["users"]) == 0


def test_remove_user_incorrect_id(test_app, test_database):
    client = test_app.test_client()
    resp = client.delete("/users/999")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User does not exist" in data["message"]
    assert "fail" in data["status"]


def test_update_user(test_app, test_database):
    user = add_user("user-to-be-updated", "update-me@testdriven.io")
    client = test_app.test_client()
    resp_one = client.put(
        f"/users/{user.id}",
        data=json.dumps({"username": "me", "email": "me@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp_one.data.decode())
    assert resp_one.status_code == 200
    assert f"{user.id} was updated!" in data["message"]
    assert "success" in data["status"]
    resp_two = client.get(f"/users/{user.id}")
    data = json.loads(resp_two.data.decode())
    assert resp_two.status_code == 200
    assert "me" in data["data"]["username"]
    assert "me@testdriven.io" in data["data"]["email"]
    assert "success" in data["status"]


def test_update_user_invalid_json(test_app, test_database):
    client = test_app.test_client()
    resp = client.put("/users/1", data=json.dumps({}), content_type="application/json")
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_update_user_invalid_json_keys(test_app, test_database):
    client = test_app.test_client()
    resp = client.put(
        "/users/1",
        data=json.dumps({"email": "me@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 400
    assert "Invalid payload." in data["message"]
    assert "fail" in data["status"]


def test_update_user_does_not_exist(test_app, test_database):
    client = test_app.test_client()
    resp = client.put(
        "/users/999",
        data=json.dumps({"username": "me", "email": "me@testdriven.io"}),
        content_type="application/json",
    )
    data = json.loads(resp.data.decode())
    assert resp.status_code == 404
    assert "User does not exist" in data["message"]
    assert "fail" in data["status"]
