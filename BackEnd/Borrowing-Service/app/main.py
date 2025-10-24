from fastapi import FastAPI
from fastAPIController.fastAPI_borrow_return_management import borrow_return_APIs


API_PREFIX = "/api/v1/borrowing"

app = FastAPI(openapi_url=f"{API_PREFIX}/openapi.json", docs_url=f"{API_PREFIX}/docs")

app.include_router(borrow_return_APIs, prefix=f'{API_PREFIX}')

@app.get(f"{API_PREFIX}/") 
async def home(): 
    return {"detail": "borrowing service is running"}