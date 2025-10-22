# 此模組負責與COLLECTION服務溝通
import os
import requests
from requests.exceptions import Timeout,RequestException
from fastapi import HTTPException
from handler.distributed_tracing_header_handler import extract_upstream_error
## 環境變數 ##
COLLECTION_SERVICE_DOMAIN = os.getenv("COLLECTION_SERVICE_DOMAIN")

def get_one_book(ISBN: str):
    req_url = f"{COLLECTION_SERVICE_DOMAIN}/api/v1/collection/{ISBN}"
    try:
        response = requests.get(req_url, timeout=15)
    except Timeout:
        raise HTTPException(status_code=504, detail="連線至Collection服務逾時")
    except RequestException as e:
        raise HTTPException(status_code=502, detail=f"無法連線至館藏服務：{e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"未知錯誤：{e}")


    if response.status_code == 200:
        # 回傳實際書籍資料 (JSON 格式)
        return response.json()

    # 非 200：把上游的錯誤原樣轉拋
    detail = extract_upstream_error(response)
    raise HTTPException(status_code=response.status_code, detail=detail)

