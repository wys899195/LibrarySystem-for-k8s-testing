from fastapi import APIRouter,HTTPException
from service_communicator.account_service_comunicator import get_one_user
from service_communicator.collection_service_comunicator import get_one_book
from handler.db import set_data,fecth_data
from datetime import datetime, timedelta
from pydantic import BaseModel
borrow_return_APIs = APIRouter(tags=["borrow/return management"])

class BorrowReturnOperation(BaseModel):
    userID: str
    ISBN: str
    bookNum: int
@borrow_return_APIs.post("/borrowBook") #borrow book
def borrow_book(op: BorrowReturnOperation):
    userID = op.userID
    ISBN = op.ISBN
    bookNum = op.bookNum

    # Check if user exists
    user = get_one_user(userID)

    # Check if the book is in the collection  
    book = get_one_book(ISBN)

    origin_stockNum = book["stock_num"]
    origin_borrowNum = book["borrowed_num"]

    
    if bookNum > origin_stockNum:
        return {"message": f"書籍庫存不足，僅剩餘 {origin_stockNum} 本","userID": userID,"ISBN": ISBN}
    elif bookNum <= 0:
        return {"message": "借閱數量須大於0","userID": userID,"ISBN": ISBN}
    else:
        # update collection
        sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum - bookNum},borrowed_num = {origin_borrowNum + bookNum} WHERE `ISBN` = '{ISBN}'"
        result = set_data(sql)
        if result:
            start_rent_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            lasting_return_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
            # update borrowing history
            sql = f"SELECT * FROM user_book_history WHERE ISBN = '{ISBN}'AND userID = '{userID}' AND start_rent_date = '{start_rent_date}' LIMIT 1"
            record = fecth_data(sql)
            if record != None:
                if len(record) == 0:
                    sql = f"INSERT INTO user_book_history (userID,ISBN,borrowing_num,start_rent_date,lasting_return_date,return_date) VALUES('{userID}','{ISBN}','{bookNum}','{start_rent_date}','{lasting_return_date}','')"
                else:
                    sql = f"UPDATE user_book_history SET borrowing_num = '{bookNum + record[0]['borrowing_num']}' WHERE userID = '{userID}' AND ISBN = '{ISBN}'  AND start_rent_date = '{start_rent_date}'"
                result = set_data(sql)
                if result:
                    return {"message": "借出書籍成功","userID": userID,"ISBN": ISBN}
            sql = f"UPDATE `book` SET `stock_num` = {origin_stockNum},borrowed_num = {origin_borrowNum} WHERE `ISBN` = '{ISBN}'"
            result = set_data(sql)
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(借出書籍)，請聯絡管理員")


@borrow_return_APIs.post("/returnBook") # return book
def return_book(op: BorrowReturnOperation):
    userID = op.userID
    ISBN = op.ISBN
    bookNum = op.bookNum

    # Check if user exists
    user = get_one_user(userID)

    # Check if the book is in the collection  
    book = get_one_book(ISBN)

    origin_stockNum = book["stock_num"]
    origin_borrowNum = book["borrowed_num"]

    #Get the user's borrowing history
    sql = f"SELECT * FROM user_book_history WHERE userID = '{userID}' AND ISBN = '{ISBN}' AND return_date = '' ORDER BY start_rent_date ASC"
    records = fecth_data(sql)
    if records == None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員")
    elif len(records) == 0:
        return {"message": "這位使用者並無借閱此書的紀錄","userID": userID,"ISBN": ISBN}
    else:
        return_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        borrowing_num = 0
        for record in records:
            borrowing_num += record['borrowing_num']
        if bookNum > borrowing_num:
            return {"message": f"這位使用者沒有借那麼多書，只有借 {borrowing_num} 本","userID": userID,"ISBN": ISBN} 
        else:

            current_remain_returnNum = bookNum
            current_book_stock_num = origin_stockNum
            current_book_borrow_num = origin_borrowNum
            for record in records:
                if record['borrowing_num'] >= current_remain_returnNum:
                    if record['borrowing_num'] > current_remain_returnNum:
                        result = set_data(f"""
                                UPDATE book AS b
                                JOIN user_book_history AS ubh ON b.ISBN = ubh.ISBN
                                SET b.stock_num = {current_book_stock_num + current_remain_returnNum},
                                    b.borrowed_num = {current_book_borrow_num - current_remain_returnNum},
                                    ubh.borrowing_num = {record['borrowing_num'] - current_remain_returnNum}
                                WHERE ubh.userID = '{userID}'
                                AND ubh.ISBN = '{ISBN}'
                                AND ubh.start_rent_date = '{record['start_rent_date']}'
                                """)
                    else:
                        result = set_data(f"""
                                UPDATE book AS b
                                JOIN user_book_history AS ubh ON b.ISBN = ubh.ISBN
                                SET b.stock_num = {current_book_stock_num + current_remain_returnNum},
                                    b.borrowed_num = {current_book_borrow_num - current_remain_returnNum},
                                    ubh.borrowing_num = 0,
                                    ubh.return_date = '{return_date}'
                                WHERE ubh.userID = '{userID}'
                                AND ubh.ISBN = '{ISBN}'
                                AND ubh.start_rent_date = '{record['start_rent_date']}'
                                """)
                    if not result:
                        raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員!!")  
                    else:
                        return {"message": "歸還書籍成功","userID": userID,"ISBN": ISBN}
                else:
                    result = set_data(f"""
                                UPDATE book AS b
                                JOIN user_book_history AS ubh ON b.ISBN = ubh.ISBN
                                SET b.stock_num = {current_book_stock_num + current_remain_returnNum},
                                    b.borrowed_num = {current_book_borrow_num - current_remain_returnNum},
                                    ubh.borrowing_num = 0,
                                    ubh.return_date = '{return_date}'
                                WHERE ubh.userID = '{userID}'
                                AND ubh.ISBN = '{ISBN}'
                                AND ubh.start_rent_date = '{record['start_rent_date']}'
                                """)
                    if not result:
                        raise HTTPException(status_code=501, detail="伺服器發生錯誤(歸還書籍)，請聯絡管理員!!")  
                    else:
                        current_remain_returnNum -= record['borrowing_num']
                        current_book_stock_num += record['borrowing_num']
                        current_book_borrow_num -= record['borrowing_num']
                        continue