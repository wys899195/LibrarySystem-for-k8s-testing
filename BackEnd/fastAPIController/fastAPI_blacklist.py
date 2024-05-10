from fastapi import APIRouter,HTTPException,Form
from handler.db import set_data,fecth_data
from pydantic import BaseModel
from typing import Optional

blacklist_APIs = APIRouter(tags=["blacklist"])


class BlacklistItem(BaseModel):
    userID: str
    username: Optional[str] = None
    reason: Optional[str] = None


@blacklist_APIs.get("/{userID}") #檢查使用者是否已經在黑名單內
async def check_user_is_in_blacklist(userID:str):
    sql = f"SELECT userID,username,reason FROM blacklist WHERE userID ='{userID}'"
    users = fecth_data(sql)
    if users is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤，請聯絡管理員")
    else:
        if len(users) == 0:
            return {"is_user_in_blacklist": False}
        else:
            user = users[0]
            return {"is_user_in_blacklist": True}

@blacklist_APIs.get("") # 取得所有使用者在黑名單的資訊
async def get_all_blacklist() -> list[BlacklistItem]:
    sql = "select userID,username,reason FROM blacklist"
    users = fecth_data(sql)
    if users is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤，請聯絡管理員")
    else:
        res = []
        for user in users:
            res.append(
                BlacklistItem(
                    userID=user['userID'], 
                    username=user['username'],
                    reason=user['reason']
                )
            )
        return res

@blacklist_APIs.post("") # 新增使用者到黑名單
async def post_one_user_to_blacklist(req : BlacklistItem):
    #檢查此使用者是否存在
    sql = f"select username FROM users where userID ='{req.userID}' LIMIT 1"
    user = fecth_data(sql)
    if len(user) != 0:
        username = user[0]['username']
        if req.reason:
            sql = f"  insert into blacklist VALUES('{req.userID}','{username}','{req.reason}')"
        else:
            sql = f"  insert into blacklist VALUES('{req.userID}','{username}','無')"
        result = set_data(sql)
        if result:
            return {"message": "加入成功!"}
        else:
            raise HTTPException(status_code=501, detail="加入失敗，請聯絡管理員")
    else:
        raise HTTPException(status_code=404, detail="找不到該使用者")
        
@blacklist_APIs.put("/{userID}") #編輯加入黑名單原因
async def put_one_user_to_blacklist(userID:str,reason: Optional[str] = Form(None)):
    if reason:
        sql = f"update blacklist set reason = '{reason}' where userID = '{userID}'"
    else:
        sql = f"update blacklist set reason = '無' where userID = '{userID}'"
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