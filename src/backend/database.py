from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client
import os

app = FastAPI()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

class Hosting(BaseModel):
    restaurant: str
    eat_time: str
    max_people: int
    host_name: str

@app.post("/hostings")
def create_hosting(hosting: Hosting):
    result = supabase.table("Hostings").insert(hosting.dict()).execute()
    return {"status": "success", "data": result.data}