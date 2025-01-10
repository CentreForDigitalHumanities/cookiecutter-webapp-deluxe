def test_user_model(db, user, user_data):
    assert user.username == user_data["username"]
