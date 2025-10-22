import os
import pymysql

mysql_host = os.getenv("MYSQL_HOST", "mysql")  
mysql_port = int(os.getenv("MYSQL_PORT", 3306))  


# 資料庫設定
db_settings = {
    "host": mysql_host,
    "port": mysql_port,
    "user": "wys899195",
    "password": "wwww",
    "db": "library_system",
    "charset": "utf8"
}

#插入/更新/刪除
def set_data(sql):
    try:
        db = pymysql.connect(**db_settings)
        cursor = db.cursor()

        try:
            # 執行sql語句
            cursor.execute(sql)
            # 提交到資料庫執行
            db.commit() 
            return True
        except Exception as e:
            print(f"set data fail,rollback.    (err:{e})")
            # 如果發生錯誤則回滾
            db.rollback()
            print ("Error: unable to set data")
            return False
    except Exception as e:
        print(f"set data fail.    (err:{e})")
        return False

#查詢/取得資料
def fecth_data(sql):
    try:
        db = pymysql.connect(**db_settings)
        cursor = db.cursor(pymysql.cursors.DictCursor) # 每一筆資料都以dict形式回傳
        try:
            # 執行sql語句
            cursor.execute(sql)
            # 取得所有記錄列表
            results = cursor.fetchall() #回傳的是一個list
            db.close()
            return results
        except Exception as e:
            print(f"fecth data fail,rollback.    (err:{e})")
            db.close()
            return None
    except Exception as e:
        print(f"fecth data fail.    (err:{e})")
        return None             