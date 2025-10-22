from fastapi import Request
import requests
# 服務跟服務之間透過API溝通時會轉發一些header，用於分散式追蹤
# 目前系統使用zipkin進行分散式追蹤，故轉發zipkin所需的header
def get_forward_distributed_tracing_headers(request: Request):
    # 如果header中有zipkin所需的header，就轉發
    zipkin_headers = {
        'x-request-id':request.headers.get("x-request-id"),
        'x-b3-traceid': request.headers.get("x-b3-traceid"),
        'x-b3-spanid': request.headers.get("x-b3-spanid"),
        'x-b3-parentspanid': request.headers.get("x-b3-parentspanid"),
        'x-b3-sampled': request.headers.get("x-b3-sampled"),
        'x-b3-flags': request.headers.get("x-b3-flags"),
    }
    # 如果request.headers.get拿到的header是空的就不會被回傳，以免出錯
    return {k: v for k, v in zipkin_headers.items() if v}  

def extract_upstream_error(response: requests.Response):
    """
    嘗試從上游 FastAPI 的錯誤回應中取出 detail。
    FastAPI 的 HTTPException 預設會是 {"detail": "..."}。
    若不是 JSON 或沒有 detail，就退回純文字或狀態碼描述。
    """
    try:
        data = response.json()
        detail = data.get("detail", data)
    except ValueError:
        # 非 JSON
        detail = response.text or f"Upstream error {response.status_code}"
    return detail