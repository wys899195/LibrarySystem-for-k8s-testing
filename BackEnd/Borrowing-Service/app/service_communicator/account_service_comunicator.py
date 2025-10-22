# 此模組負責與ACCOUNT服務溝通
import os
import requests
from requests.exceptions import Timeout,RequestException
from handler.distributed_tracing_header_handler import extract_upstream_error
from fastapi import HTTPException
## 環境變數 ##
ACCOUNT_SERVICE_DOMAIN = os.getenv("ACCOUNT_SERVICE_DOMAIN")



def get_one_user(userID):
    req_url = f"{ACCOUNT_SERVICE_DOMAIN}/api/v1/user/id/{userID}"
    try:
        response = requests.get(req_url, timeout=15)
    except Timeout:
        raise HTTPException(status_code=504, detail="連線至Account服務逾時")
    except RequestException as e:
        raise HTTPException(status_code=502, detail=f"無法連線至館藏服務：{e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"未知錯誤：{e}")

    if response.status_code == 200:
        # 若要取回資料（例如使用者資訊），回傳 response.json()
        print(f"成功get one user:{response.json()}")
        return response.json()

    # 非 200：把上游的錯誤原樣轉拋
    detail = extract_upstream_error(response)
    raise HTTPException(status_code=response.status_code, detail=detail)

