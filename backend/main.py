from database import db

@app.get("/analyses")
async def get_analyses():
    analyses = await db["analyses"].find().to_list(100)
    return analyses