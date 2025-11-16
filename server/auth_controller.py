from flask import request, jsonify
from verify_google import verify_google_token
from user_store import find_user_by_email, create_user
import jwt
import os

JWT_SECRET = os.getenv("JWT_SECRET")

def google_login():
    data = request.get_json()
    credential = data.get("credential")

    if not credential:
        return jsonify({"error": "Missing Google credential"}), 400
    
    google_user = verify_google_token(credential)

    if not google_user:
        return jsonify({"error": "Invalid Google token"}), 401

    email = google_user["email"]
    name = google_user.get("name", "")
    picture = google_user.get("picture", "")

    user = find_user_by_email(email)
    if not user:
        user = create_user(email, name, picture)

    # Create JWT token for your app's session
    token = jwt.encode(
        {"id": user["id"], "email": email},
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({
        "success": True,
        "token": token,
        "user": user
    })