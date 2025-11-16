from http.client import HTTPException
from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os

app = FastAPI()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

class Posting(BaseModel):
    restaurant: str
    eat_time: str
    max_people: int
    host_name: str

@app.post("/hostings")
def create_hosting(posting: Posting):
    result = supabase.table("Postings").insert(posting.dict()).execute()
    return {"status": "success", "data": result.data}

@app.delete("/hostings/user/{username}")
def delete_hosting_by_username(username: str):
    result = supabase.table("Hostings").delete().eq("username", username).execute()
    if result.data:  
        return {"status": "success", "deleted": result.data}
    else:
        raise HTTPException(status_code=404, detail=f"No hostings found for username '{username}'")
    
@app.patch("/hostings/join")
def join_hosting(username: str, eat_time: str):
    # 1. Fetch the hosting row
    hosting = supabase.table("Hostings")\
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
    updated_row = supabase.table("Hostings")\
        .update({"number_accepted": new_accepted})\
        .eq("username", username)\
        .eq("eat_time", eat_time)\
        .execute()

    # 3. Check if it reached max, then move
    if new_accepted == max_party:
        # Insert into FullHostings
        supabase.table("FullHostings").insert(updated_row.data[0]).execute()
        # Delete from Hostings
        supabase.table("Hostings")\
            .delete()\
            .eq("username", username)\
            .eq("eat_time", eat_time)\
            .execute()
        return {"status": "moved", "moved_row": updated_row.data[0]}

    return {"status": "success", "updated": updated_row.data}