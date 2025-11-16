from auth_controller import google_login
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)


@app.post("/auth/google")
def auth_google():
    return google_login()


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(port=port, debug=True)
