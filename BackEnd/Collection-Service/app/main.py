from fastapi import FastAPI
from fastAPIController.fastapi_collection_management import collection_APIs

API_PREFIX = "/api/v1"

app = FastAPI(openapi_url=f"{API_PREFIX}/openapi.json", docs_url=f"{API_PREFIX}/docs")


app.include_router(collection_APIs, prefix=f'{API_PREFIX}/collection')