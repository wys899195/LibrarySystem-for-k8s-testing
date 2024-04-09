from fastapi import APIRouter,HTTPException,Form
from handler.db import fecth_data

authentication_APIs = APIRouter()

@authentication_APIs.post("/login") # 使用者登入
async def login(userID:str = Form(),password:str = Form()):
    sql = f"SELECT * FROM users WHERE userID ='{userID}'"
    users = fecth_data(sql)
    if users is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤，請聯絡管理員")
    else:
        if len(users) == 0:
            raise HTTPException(status_code=403, detail="帳號或密碼錯誤")
        else:
            user = users[0]
            if int(user['status']) < 1:
                raise HTTPException(status_code=403, detail="帳號尚未通過信箱驗證，故無法使用")
            else:
                if user['password'] == password:
                    return user
                else:
                    raise HTTPException(status_code=403, detail="帳號或密碼錯誤")
