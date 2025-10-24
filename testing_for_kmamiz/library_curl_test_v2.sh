#!/bin/bash

#### ACCOUNT SERVICE ####

### users
curl -X POST "http://localhost:6677/api/v1/account/user/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "userID=00857006" \
     -d "password=111111" 

### blacklist
## GET
curl -s -X GET "http://localhost:6677/api/v1/account/blacklist/users" | jq


## POST
curl -s -X POST "http://localhost:6677/api/v1/account/blacklist/user" \
  -H "Content-Type: application/json" \
  -d '{"userID": "00857006"}' | jq
curl -s -X POST "http://localhost:6677/api/v1/account/blacklist/user" \
  -H "Content-Type: application/json" \
  -d '{"userID": "00857020"}' | jq
curl -s -X POST "http://localhost:6677/api/v1/account/blacklist/user" \
  -H "Content-Type: application/json" \
  -d '{"userID": "00857039"}' | jq

## PUT
curl -s -X PUT "http://localhost:6677/api/v1/account/blacklist/user/id/00857006" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "reason=test" | jq
curl -s -X PUT "http://localhost:6677/api/v1/account/blacklist/user/id/00857020" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "reason=test" | jq
curl -s -X PUT "http://localhost:6677/api/v1/account/blacklist/user/id/00857039" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "reason=test" | jq

## DELETE
curl -s -X DELETE "http://localhost:6677/api/v1/account/blacklist/user/id/00857006" | jq
curl -s -X DELETE "http://localhost:6677/api/v1/account/blacklist/user/id/00857020" | jq
curl -s -X DELETE "http://localhost:6677/api/v1/account/blacklist/user/id/00857039" | jq


#### BORROWING SERVICE ####

### borrow/return management

## borrow
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554087","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554087","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/borrowBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554087","bookNum":0}' | jq

## return
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857006","ISBN":"9789574554087","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857020","ISBN":"9789574554087","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554089","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554088","bookNum":0}' | jq
curl -s -X POST "http://localhost:6677/api/v1/borrowing/returnBook" \
     -H "Content-Type: application/json" \
     -d '{"userID":"00857029","ISBN":"9789574554087","bookNum":0}' | jq



#### COLLECTION SERVICE ####

### collection management

## GET
curl -s -X GET "http://localhost:6677/api/v1/collection/book/isbn/9789574554089" | jq
curl -s -X GET "http://localhost:6677/api/v1/collection/book/isbn/9789574554088" | jq
curl -s -X GET "http://localhost:6677/api/v1/collection/book/isbn/9789574554087" | jq
curl -s -X GET "http://localhost:6677/api/v1/collection/books" | jq

## POST
curl -s -X POST "http://localhost:6677/api/v1/collection/book" \
  -H "Content-Type: application/json" \
  -d '{
    "ISBN": "9789574554089",
    "stock_num": 4,
    "borrowed_num": 0,
    "bookName": "老人與海(假)",
    "bookClass": "無",
    "author": "厄尼斯特．海明威",
    "publisher": "晨星",
    "publishYear": 2003,
    "describeBook": "<P>testtest</P>"
  }' | jq


## PUT
curl -s -X PUT "http://localhost:6677/api/v1/collection/book/isbn/9789574554089" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "new_stock_num=5" | jq
curl -s -X PUT "http://localhost:6677/api/v1/collection/book/isbn/9789574554088" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "new_stock_num=5" | jq
curl -s -X PUT "http://localhost:6677/api/v1/collection/book/isbn/9789574554087" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "new_stock_num=5" | jq

## DELETE
curl -s -X DELETE "http://localhost:6677/api/v1/collection/book/isbn/9789574554081" | jq
curl -s -X DELETE "http://localhost:6677/api/v1/collection/book/isbn/9789574554082" | jq
curl -s -X DELETE "http://localhost:6677/api/v1/collection/book/isbn/9789574554083" | jq




