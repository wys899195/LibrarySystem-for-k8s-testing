from fastapi import APIRouter,HTTPException,Form
from handler.db import set_data,fecth_data



blacklist_APIs = APIRouter(tags=["blacklist"])

@blacklist_APIs.get("/{userID}") #檢查使用者是否已經在黑名單內
async def check_user_is_in_blacklist(userID:str):
    sql = f"SELECT userID,username,reason FROM blacklist WHERE userID ='{userID}'"
    users = fecth_data(sql)
    if users is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤，請聯絡管理員")
    else:
        if len(users) == 0:
            return {"user_in_blacklist": "no"}
        else:
            user = users[0]
            return {"user_in_blacklist": "yes"}

@blacklist_APIs.get("") # 取得所有使用者在黑名單的資訊
async def get_all_blacklist():
    sql = "select userID,username,reason FROM blacklist"
    users = fecth_data(sql)
    if users is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤，請聯絡管理員")
    else:
        return users

@blacklist_APIs.post("") # 新增使用者到黑名單
async def post_one_user_to_blacklist(userID:str = Form(),reason:str = Form()):
    #檢查此使用者是否存在
    sql = f"select username FROM users where userID ='{userID}' LIMIT 1"
    user = fecth_data(sql)
    if len(user) != 0:
        username = user[0]['username']
        sql = f"  insert into blacklist VALUES('{userID}','{username}','{reason}')"
        result = set_data(sql)
        if result:
            return {"message": "加入成功!"}
        else:
            raise HTTPException(status_code=501, detail="加入失敗，請聯絡管理員")
    else:
        raise HTTPException(status_code=404, detail="找不到該使用者")
        
@blacklist_APIs.put("/{userID}") #編輯加入黑名單原因
async def put_one_user_to_blacklist(userID:str,reason:str = Form()):
    sql = f"update blacklist set reason = '{reason}' where userID = '{userID}'"
    result = set_data(sql)
    if result:
        return {"message": "編輯成功!"}
    else:
        raise HTTPException(status_code=501, detail="編輯失敗，請聯絡管理員")

@blacklist_APIs.delete("/{userID}") #將使用者從黑名單移除
async def delete_one_user_in_blacklist(userID:str):
    sql = f"delete from blacklist where userID = '{userID}'"
    result = set_data(sql)
    if result:
        return {"message": "刪除成功!"}
    else:
        raise HTTPException(status_code=501, detail="刪除失敗，請聯絡管理員")