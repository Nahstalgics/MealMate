
from fastapi import HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # This will load variables from .env
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

class Posting(BaseModel):
    restaurant: str
    eat_time: str
    max_party: int
    host_name: str
    number_accepted: int
    comments: str
    username: str
    listOfUsers: list[str]

class User(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    username: str

class LoginData(BaseModel):
    username: str
    password: str

@app.get("/postings/joined")
def get_joined_postings(username: str):
    # Active postings user joined
    active = (
        supabase.table("Postings")
        .select("*")
        .contains("listOfUsers", [username])
        .execute()
    ).data

    # Finished/full postings user joined
    full = (
        supabase.table("FullPostings")
        .select("*")
        .contains("listOfUsers", [username])
        .execute()
    ).data

    # Combine them
    return {
        "active": active,
        "full": full,
        "all": active + full,
    }

@app.post("/users")
def create_user(user: User):
    # Insert the user into the Users table
    result = (
        supabase
        .table("Users")
        .insert(user.model_dump())
        .execute()
    )

    return {
        "status": "success",
        "user": result.data[0] if result.data else None
    }

@app.post("/login")
def login(data: LoginData):
    # Find the user by username
    result = (
        supabase.table("Users")
        .select("*")
        .eq("username", data.username)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Username not found")

    user = result.data[0]

    # Validate password
    if user["password"] != data.password:
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Return the full user
    return {
        "status": "success",
        "user": user
    }

@app.get("/fullpostings")
def get_all_full_postings():
    result = supabase.table("FullPostings").select("*").execute()
    return {"status": "success", "data": result.data}

@app.get("/postings")
def get_all_postings():
    result = supabase.table("Postings").select("*").execute()
    return {"status": "success", "data": result.data}

@app.get("/users")
def get_users():
    result = supabase.table("Users").select("*").execute()
    return {"status": "success", "data": result.data}

@app.post("/postings")
def create_posting(posting: Posting):
    result = supabase.table("Postings").insert(posting.model_dump()).execute()
    return {"status": "success", "data": result.data}

@app.delete("/postings/user/{username}/{eat_time}")
def delete_posting(username: str, eat_time: str):
    result = (
        supabase.table("Postings")
        .delete()
        .eq("username", username)
        .eq("eat_time", eat_time)
        .execute()
    )

    if result.data:
        return {"status": "success", "deleted": result.data}
    else:
        raise HTTPException(
            status_code=404,
            detail=f"No hosting found for username '{username}' at time '{eat_time}'"
        )
    
@app.patch("/postings/join")
def join_posting(restaurant: str, eat_time: str, host_username: str, joining_username: str):
    # Fetch posting from Postings
    res = supabase.table("Postings")\
        .select("*")\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="Posting not found")

    post = res.data[0]
    users = post.get("listOfUsers", []) or []

    if joining_username in users:
        raise HTTPException(status_code=400, detail="User already joined")

    max_party = int(post["max_party"])

    if len(users) >= max_party:
        raise HTTPException(status_code=400, detail="Post already full")

    # Add user
    users.append(joining_username)
    number_accepted = len(users)

    # Update the posting
    updated = supabase.table("Postings")\
        .update({"listOfUsers": users, "number_accepted": number_accepted})\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    # Move to FullPostings if full
    if number_accepted >= max_party:
        supabase.table("FullPostings").insert(updated.data[0]).execute()
        supabase.table("Postings")\
            .delete()\
            .eq("restaurant", restaurant)\
            .eq("eat_time", eat_time)\
            .eq("username", host_username)\
            .execute()
        return {"status": "moved", "moved_row": updated.data[0]}

    return {"status": "success", "updated": updated.data[0]}


@app.patch("/postings/leave")
def leave_posting(username: str, host_username: str, eat_time: str):
    # Determine if posting is in Postings or FullPostings
    table_name = "Postings"
    res = supabase.table("Postings")\
        .select("*")\
        .eq("username", host_username)\
        .eq("eat_time", eat_time)\
        .execute()

    if not res.data:
        # Try FullPostings
        res = supabase.table("FullPostings")\
            .select("*")\
            .eq("username", host_username)\
            .eq("eat_time", eat_time)\
            .execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Posting not found")
        table_name = "FullPostings"

    post = res.data[0]
    users = post.get("listOfUsers", []) or []

    if username == host_username:
        raise HTTPException(status_code=400, detail="Host cannot leave their own posting")

    if username not in users:
        return {"message": "User was not in the posting"}

    users.remove(username)
    number_accepted = len(users)

    # If leaving a FullPostings and now has space, move back to Postings
    if table_name == "FullPostings" and number_accepted < int(post["max_party"]):
        # Insert into Postings
        supabase.table("Postings").insert({
            **post,
            "listOfUsers": users,
            "number_accepted": number_accepted
        }).execute()
        # Delete from FullPostings
        supabase.table("FullPostings")\
            .delete()\
            .eq("username", host_username)\
            .eq("eat_time", eat_time)\
            .execute()
        return {"status": "moved_back", "updated": {"listOfUsers": users, "number_accepted": number_accepted}}

    # Otherwise, just update table
    supabase.table(table_name)\
        .update({"listOfUsers": users, "number_accepted": number_accepted})\
        .eq("username", host_username)\
        .eq("eat_time", eat_time)\
        .execute()

    return {"status": "success", "updated": {"listOfUsers": users, "number_accepted": number_accepted}}


@app.post("/postings")
def create_posting(posting: Posting):
    # Ensure the listOfUsers includes the host
    if not posting.listOfUsers:
        posting.listOfUsers = [posting.username]
    
    # Ensure number_accepted is consistent with listOfUsers
    posting.number_accepted = len(posting.listOfUsers)

    try:
        result = supabase.table("Postings").insert(posting.model_dump()).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to insert posting")
        return {"status": "success", "data": result.data[0]}
    except Exception as e:
        print("Error creating posting:", e)
        raise HTTPException(status_code=500, detail=str(e))