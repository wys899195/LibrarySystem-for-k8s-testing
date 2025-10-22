'''
此模組可以讓各服務之間溝通時，轉發分散式監控所需的http header
'''
from fastapi import Request

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
