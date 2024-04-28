from fastapi import APIRouter,HTTPException,Form
from handler.db import set_data,fecth_data
from datetime import datetime, timedelta


book_APIs = APIRouter(tags=["books"])

@book_APIs.get("/{ISBN}") #館藏查詢
async def get_one_book(ISBN:str):
    if len(ISBN) != 13:
        raise HTTPException(status_code=404, detail="書號輸入格式錯誤!!")
    else:
        sql = f"SELECT * FROM book WHERE ISBN = '{ISBN}' LIMIT 1"
        book =  fecth_data(sql)
        if book is None:
            raise HTTPException(status_code=501, detail="伺服器發生錯誤(館藏查詢單一書籍)，請聯絡管理員")
        elif len(book) == 0:
            raise HTTPException(status_code=404, detail="館藏無此書")
        else:
            return book[0]

@book_APIs.get("") #館藏查詢全部書籍
async def get_all_book():
    sql = f"SELECT * FROM book"
    books =  fecth_data(sql)
    if books is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(館藏查詢全部書籍)，請聯絡管理員")
    else:
        return books

@book_APIs.post("") #上架書籍
async def add_one_book(ISBN:str = Form(),stock_num:int = Form(),borrowed_num:int = Form(),bookName:str = Form(),bookClass:str = Form(),author:str = Form(),publisher:str = Form(),publishYear:int = Form(),describeBook:str = Form(),):
    if len(ISBN) != 13:
        raise HTTPException(status_code=404, detail="書號輸入格式錯誤!!")
    else:
        sql = f"SELECT * FROM book WHERE ISBN = '{ISBN}' LIMIT 1"
        existing_book =  fecth_data(sql)
        if existing_book is None:
            raise HTTPException(status_code=501, detail="伺服器在上架書籍時發生錯誤，請聯絡管理員")
        elif len(existing_book) != 0:
            raise HTTPException(status_code=400, detail="該書已在館藏中")
        else:
            sql = f"INSERT INTO `book`(`ISBN`, `stock_num`, `borrowed_num`, `bookName`, `bookClass`, `author`, `publisher`, `publishYear`, `describeBook`) VALUES ('{ISBN}',{stock_num},0,'{bookName}','{bookClass}','{author}','{publisher}',{publishYear},'{describeBook}')"
            result = set_data(sql)
            if not result:
                raise HTTPException(status_code=501, detail="伺服器在上架書籍時發生錯誤，請聯絡管理員!")
            else:
                return {"message": "上架書籍成功"}

@book_APIs.put("/{ISBN}") #館藏調整
async def update_one_book(ISBN:str,new_stock_num:int = Form()):
    if len(ISBN) != 13:
        raise HTTPException(status_code=404, detail="書號輸入格式錯誤!!")
    else:
        sql = f"SELECT * FROM book WHERE ISBN = '{ISBN}' LIMIT 1"
        book =  fecth_data(sql)
        if book is None:
            raise HTTPException(status_code=501, detail="伺服器在館藏調整時發生錯誤，請聯絡管理員")
        elif len(book) == 0:
            raise HTTPException(status_code=400, detail="該書不在館藏中")
        else:
            book = book[0]
            current_stock_num = book['stock_num']
            if new_stock_num == current_stock_num:
                raise HTTPException(status_code=400, detail="與目前館藏數量相同，無須調整")
            elif new_stock_num < 0:
                raise HTTPException(status_code=400, detail="調整後的館藏數量不能少於0")
            else:
                sql = f"UPDATE `book` SET `stock_num` = {new_stock_num} WHERE `ISBN` = '{ISBN}'"
                result = set_data(sql)
                if not result:
                    raise HTTPException(status_code=501, detail="伺服器在館藏調整時發生錯誤，請聯絡管理員")
                else:
                    return {"message": "館藏調整成功"}

@book_APIs.delete("/{ISBN}") #下架書籍
async def delete_one_book(ISBN:str):
    if len(ISBN) != 13:
        raise HTTPException(status_code=404, detail="書號輸入格式錯誤!!")
    else:
        sql = f"SELECT * FROM book WHERE ISBN = '{ISBN}' LIMIT 1"
        book =  fecth_data(sql)
        if book is None:
            raise HTTPException(status_code=501, detail="伺服器在下架書籍時發生錯誤，請聯絡管理員")
        elif len(book) == 0:
            raise HTTPException(status_code=400, detail="該書已不在館藏中，無須下架")
        else:
            if int(book[0]['borrowed_num']) > 0:
                raise HTTPException(status_code=400, detail="該書尚有幾本出借中，不可下架")
            else:
                sql = f"DELETE FROM `book` WHERE `ISBN` = '{ISBN}'"
                result = set_data(sql)
                if not result:
                    raise HTTPException(status_code=501, detail="伺服器在下架書籍時發生錯誤，請聯絡管理員!")
                else:
                    return {"message": "下架書籍成功"}



@book_APIs.post("/borrowBook") #借書
async def borrow_book(userID:str = Form(),ISBN:str = Form(),borrowNum:int = Form(),origin_stockNum:int = Form(),origin_borrowNum:int = Form()):
    if borrowNum > origin_stockNum:
        return {"message": f"書籍庫存不足，僅剩餘 {origin_stockNum} 本"}
    elif borrowNum <= 0:
        return {"message": "借閱數量須大於0"}
    else:
        # 更新庫存
        sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum - borrowNum},borrowed_num = {origin_borrowNum + borrowNum} WHERE `ISBN` = '{ISBN}'"
        result = set_data(sql)
        if result:
            start_rent_date = datetime.now().strftime("%Y-%m-%d")
            lasting_return_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
            # 更新借閱紀錄
            sql = f"SELECT * FROM user_book_history WHERE ISBN = '{ISBN}'AND userID = '{userID}' LIMIT 1"
            record = fecth_data(sql)
            if record != None:
                if len(record) == 0:
                    sql = f"INSERT INTO user_book_history (userID,ISBN,borrowing_num,start_rent_date,lasting_return_date,return_date) VALUES('{userID}','{ISBN}','{borrowNum}','{start_rent_date}','{lasting_return_date}','-')"
                else:
                    sql = f"UPDATE user_book_history SET borrowing_num = '{borrowNum + record[0]['borrowing_num']}' WHERE userID = '{userID}' AND ISBN = '{ISBN}'"
                result = set_data(sql)
            if result:
                return {"message": "借出書籍成功"}
            else:
                sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum},borrowed_num = {origin_borrowNum} WHERE `ISBN` = '{ISBN}'"
                result = set_data(sql)
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(借出書籍)，請聯絡管理員")


@book_APIs.post("/returnBook") #還書
async def return_book(userID:str = Form(),ISBN:str = Form(),returnNum:int = Form(),origin_stockNum:int = Form(),origin_borrowNum:int = Form()):
    #獲取借閱紀錄
    sql = f"SELECT * FROM user_book_history WHERE userID = '{userID}' AND ISBN = '{ISBN}'"
    record = fecth_data(sql)
    if record == None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員")
    elif len(record) == 0:
        return {"message": "這位使用者並無借閱此書的紀錄"}
    else:
        borrowing_num = record[0]['borrowing_num']
        if returnNum > borrowing_num:
            return {"message": f"這位使用者沒有借那麼多書，只有借 {borrowing_num} 本"} 
        else:
            sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum + returnNum},borrowed_num = {origin_borrowNum - returnNum} WHERE `ISBN` = '{ISBN}'"
            result = set_data(sql)
            if not result:
                raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員!!")
            else:
                #更新使用者歷史紀錄
                if (borrowing_num - returnNum) == 0:
                    sql = f"DELETE FROM `user_book_history` WHERE userID = '{userID}' AND ISBN = '{ISBN}'"
                else:
                    sql = f"UPDATE user_book_history SET borrowing_num = '{borrowing_num - returnNum}' WHERE userID = '{userID}' AND ISBN = '{ISBN}'"
                result = set_data(sql)
                if not result:
                    sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum},borrowed_num = {origin_borrowNum} WHERE `ISBN` = '{ISBN}'"
                    result = set_data(sql)
                    raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員!")
                else:
                    return {"message": "歸還書籍成功"} 