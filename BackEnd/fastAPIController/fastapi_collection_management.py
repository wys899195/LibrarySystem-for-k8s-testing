from fastapi import APIRouter,HTTPException,Form
from handler.db import set_data,fecth_data
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Optional


collection_APIs = APIRouter(tags=["collection management"])

class Book(BaseModel):
    ISBN: str
    stock_num: int
    borrowed_num: Optional[int] = None
    bookName: str
    bookClass: str
    author: str
    publisher: str
    publishYear: int
    describeBook: Optional[str] = None

@collection_APIs.get("/{ISBN}") #館藏查詢某一本書
async def get_one_book(ISBN:str) -> Book:
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
            book = book[0]

            return Book(
                ISBN = book['ISBN'],
                stock_num = book['stock_num'],
                borrowed_num = book['borrowed_num'],
                bookName = book['bookName'],
                bookClass = book['bookClass'],
                author = book['author'],
                publisher = book['publisher'],
                publishYear = book['publishYear'],
                describeBook = book['describeBook']
            )

@collection_APIs.get("") #館藏查詢全部書籍
async def get_all_book() -> list[Book]:
    sql = f"SELECT * FROM book"
    books =  fecth_data(sql)
    if books is None:
        raise HTTPException(status_code=501, detail="伺服器發生錯誤(館藏查詢全部書籍)，請聯絡管理員")
    else:
        res = []
        for book in books:
            res.append(
                Book(
                    ISBN = book['ISBN'],
                    stock_num = book['stock_num'],
                    borrowed_num = book['borrowed_num'],
                    bookName = book['bookName'],
                    bookClass = book['bookClass'],
                    author = book['author'],
                    publisher = book['publisher'],
                    publishYear = book['publishYear'],
                    describeBook = book['describeBook']
                )
            )
        return res

@collection_APIs.post("") #上架書籍
async def add_one_book(book: Book):
    if len(book.ISBN) != 13:
        raise HTTPException(status_code=404, detail="書號輸入格式錯誤!!")
    else:
        sql = f"SELECT * FROM book WHERE ISBN = '{book.ISBN}' LIMIT 1"
        existing_book =  fecth_data(sql)
        if existing_book is None:
            raise HTTPException(status_code=501, detail="伺服器在上架書籍時發生錯誤，請聯絡管理員")
        elif len(existing_book) != 0:
            raise HTTPException(status_code=400, detail="該書已在館藏中")
        else:
            if book.describeBook:
                sql = f"INSERT INTO `book`(`ISBN`, `stock_num`, `borrowed_num`, `bookName`, `bookClass`, `author`, `publisher`, `publishYear`, `describeBook`) VALUES ('{book.ISBN}',{book.stock_num},0,'{book.bookName}','{book.bookClass}','{book.author}','{book.publisher}',{book.publishYear},'{book.describeBook}')"
            else:
                sql = f"INSERT INTO `book`(`ISBN`, `stock_num`, `borrowed_num`, `bookName`, `bookClass`, `author`, `publisher`, `publishYear`, `describeBook`) VALUES ('{book.ISBN}',{book.stock_num},0,'{book.bookName}','{book.bookClass}','{book.author}','{book.publisher}',{book.publishYear},'無')"
            result = set_data(sql)
            if not result:
                raise HTTPException(status_code=501, detail="伺服器在上架書籍時發生錯誤，請聯絡管理員!")
            else:
                return {"message": "上架書籍成功","ISBN": book.ISBN}

@collection_APIs.put("/{ISBN}") #館藏調整
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
                    return {"message": "館藏調整成功","ISBN": ISBN}

@collection_APIs.delete("/{ISBN}") #下架書籍
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
                    return {"message": "下架書籍成功","ISBN": ISBN}