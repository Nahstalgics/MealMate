from fastapi import HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os
from dotenv import load_dotenv


load_dotenv()  # This will load variables from .env
app = FastAPI()

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

@app.post("/hostings")
def create_hosting(posting: Posting):
    result = supabase.table("Postings").insert(posting.model_dump()).execute()
    return {"status": "success", "data": result.data}

@app.delete("/hostings/user/{username}/{eat_time}")
def delete_hosting(username: str, eat_time: str):
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
    
@app.patch("/hostings/join")
def join_hosting(username: str, eat_time: str):
    # 1. Fetch the hosting row
    hosting = supabase.table("Postings")\
        .select("*")\
        .eq("username", username)\
        .eq("eat_time", eat_time)\
        .execute()
    
    if not hosting.data:
        raise HTTPException(status_code=404, detail="Hosting not found")

    row = hosting.data[0]
    current_accepted = row["number_accepted"]
    max_party = row["max_party"]

    if current_accepted >= max_party:
        raise HTTPException(status_code=400, detail="Hosting is already full")

    # 2. Increment number_accepted
    new_accepted = current_accepted + 1
    updated_row = supabase.table("Postings")\
        .update({"number_accepted": new_accepted})\
        .eq("username", username)\
        .eq("eat_time", eat_time)\
        .execute()

    # 3. Check if it reached max, then move
    if new_accepted == max_party:
        # Insert into FullHostings
        supabase.table("FullPostings").insert(updated_row.data[0]).execute()
        # Delete from Hostings
        supabase.table("Postings")\
            .delete()\
            .eq("username", username)\
            .eq("eat_time", eat_time)\
            .execute()
        return {"status": "moved", "moved_row": updated_row.data[0]}

    return {"status": "success", "updated": updated_row.data}

@app.patch("/hostings/leave")
def leave_hosting(username: str, eat_time: str):

    # 1. Check if hosting exists in Postings (not full)
    hosting = (
        supabase.table("Postings")
        .select("*")
        .eq("username", username)
        .eq("eat_time", eat_time)
        .execute()
    )

    # 2. If not in Postings, check in FullPostings (currently full)
    if not hosting.data:
        full_hosting = (
            supabase.table("FullPostings")
            .select("*")
            .eq("username", username)
            .eq("eat_time", eat_time)
            .execute()
        )

        if not full_hosting.data:
            raise HTTPException(status_code=404, detail="Hosting not found")

        # Hosting is currently FULL
        row = full_hosting.data[0]
        current_accepted = row["number_accepted"]

        if current_accepted <= 0:
            raise HTTPException(status_code=400, detail="Accepted number is already zero")

        # Decrement
        new_accepted = current_accepted - 1
        row["number_accepted"] = new_accepted

        # Move to Postings
        supabase.table("Postings").insert(row).execute()

        # Remove from FullPostings
        supabase.table("FullPostings")\
            .delete()\
            .eq("username", username)\
            .eq("eat_time", eat_time)\
            .execute()

        # Update number_accepted in Postings
        updated = (
            supabase.table("Postings")
            .update({"number_accepted": new_accepted})
            .eq("username", username)
            .eq("eat_time", eat_time)
            .execute()
        )

        return {
            "status": "moved_back",
            "updated_row": updated.data[0]
        }

    # Otherwise it is in Postings (not full)
    row = hosting.data[0]
    current_accepted = row["number_accepted"]

    if current_accepted <= 0:
        raise HTTPException(status_code=400, detail="Accepted number cannot go below zero")

    new_accepted = current_accepted - 1

    updated = (
        supabase.table("Postings")
        .update({"number_accepted": new_accepted})
        .eq("username", username)
        .eq("eat_time", eat_time)
        .execute()
    )

    return {"status": "success", "updated": updated.data[0]}