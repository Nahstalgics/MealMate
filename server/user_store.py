users = []  # temporary in-memory database


def find_user_by_email(email):
    return next((u for u in users if u["email"] == email), None)


def create_user(email, name, picture):
    user = {
        "id": len(users) + 1,
        "email": email,
        "name": name,
        "picture": picture,
        "username": None
    }
    users.append(user)
    return user
 