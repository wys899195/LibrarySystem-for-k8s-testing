from fastapi import FastAPI
from fastAPIController.fastAPI_authentication import authentication_APIs
from fastAPIController.fastAPI_blacklist import blacklist_APIs
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

API_PREFIX = "/api/v1"

app = FastAPI(openapi_url=f"{API_PREFIX}/openapi.json", docs_url=f"{API_PREFIX}/docs")

app.include_router(blacklist_APIs, prefix=f'{API_PREFIX}/blacklist')
app.include_router(authentication_APIs, prefix=f'{API_PREFIX}')

app.mount("/page",StaticFiles(directory="static"),name="static")
@app.get("/")
async def redirect_to_index():
    return RedirectResponse(url="/page/index.html")