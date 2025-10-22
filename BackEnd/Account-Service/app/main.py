from fastapi import FastAPI
from fastAPIController.fastAPI_user import user_APIs
from fastAPIController.fastAPI_blacklist import blacklist_APIs


API_PREFIX = "/api/v1"

app = FastAPI(openapi_url=f"{API_PREFIX}/openapi.json", docs_url=f"{API_PREFIX}/docs")

app.include_router(user_APIs, prefix=f'{API_PREFIX}/user')
app.include_router(blacklist_APIs, prefix=f'{API_PREFIX}/blacklist')
