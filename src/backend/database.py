
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
    # Fetch the posting row by restaurant, time, and host
    posting_res = supabase.table("Postings")\
        .select("*")\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    if not posting_res.data:
        raise HTTPException(status_code=404, detail="Hosting not found")

    row = posting_res.data[0]
    list_of_users = row.get("listOfUsers", [])

    if joining_username in list_of_users:
        raise HTTPException(status_code=400, detail="User already joined")

    if row["number_accepted"] >= row["max_party"]:
        raise HTTPException(status_code=400, detail="Hosting is already full")

    # Add user to list
    list_of_users.append(joining_username)
    new_number = len(list_of_users)

    updated_row = supabase.table("Postings")\
        .update({"listOfUsers": list_of_users, "number_accepted": new_number})\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    # Move to FullPostings if max reached
    if new_number == row["max_party"]:
        supabase.table("FullPostings").insert(updated_row.data[0]).execute()
        supabase.table("Postings")\
            .delete()\
            .eq("restaurant", restaurant)\
            .eq("eat_time", eat_time)\
            .eq("username", host_username)\
            .execute()
        return {"status": "moved", "moved_row": updated_row.data[0]}

    return {"status": "success", "updated": updated_row.data}

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


@app.patch("/postings/leave")
def leave_posting(restaurant: str, eat_time: str, host_username: str, leaving_username: str):
    # Check in Postings
    posting_res = supabase.table("Postings")\
        .select("*")\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    if posting_res.data:
        row = posting_res.data[0]
    else:
        # Check in FullPostings
        full_res = supabase.table("FullPostings")\
            .select("*")\
            .eq("restaurant", restaurant)\
            .eq("eat_time", eat_time)\
            .eq("username", host_username)\
            .execute()
        if not full_res.data:
            raise HTTPException(status_code=404, detail="Hosting not found")
        row = full_res.data[0]
        # Move back to Postings
        supabase.table("Postings").insert(row).execute()
        supabase.table("FullPostings")\
            .delete()\
            .eq("restaurant", restaurant)\
            .eq("eat_time", eat_time)\
            .eq("username", host_username)\
            .execute()

    list_of_users = row.get("listOfUsers", [])

    if leaving_username not in list_of_users:
        raise HTTPException(status_code=400, detail="User not in hosting")

    # Remove user
    list_of_users.remove(leaving_username)
    new_number = len(list_of_users)

    updated_row = supabase.table("Postings")\
        .update({"listOfUsers": list_of_users, "number_accepted": new_number})\
        .eq("restaurant", restaurant)\
        .eq("eat_time", eat_time)\
        .eq("username", host_username)\
        .execute()

    return {"status": "success", "updated": updated_row.data[0]}