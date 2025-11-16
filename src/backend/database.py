from supabase import create_client
import os

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

supabase = create_client(url, key)

# example insert
supabase.table("tasks").insert({"title": "hello", "status": "todo"}).execute()