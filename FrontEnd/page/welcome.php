<?php 
session_start();
// echo isset($_SESSION["admin"]);
// echo $_SESSION["admin"];
if(!isset($_SESSION["admin"]) || $_SESSION["admin"]!=true){
    header("location:index.php");
}

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/css/bootstrap.min.css">  
	<script src="https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js"></script>
	<script src="https://cdn.staticfile.org/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <title>管理介面</title>
    <style>
    .bt {
        border: none;
        background-color: #a5a5a5;
        color: white;
        font-size: 28px;
        padding: 20px;/*按鈕內邊距離*/
        width: 170px;/*按鈕寬*/
        border-radius: 5px;/*圓角*/
        margin-right:10px;
        margin-top: 10px;
    }
    
    .bt:hover{
        background-color: #000;
        color: #fff;
    }

    .table tbody tr td{
        vertical-align: middle;
    }
    .table_tit{  
        overflow: hidden;  
        text-overflow: ellipsis;
    }
    .one_announcement:hover{
        text-decoration:underline;
        cursor:pointer;
    }
    </style>

    <script>
		
	</script>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js" integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js" integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13" crossorigin="anonymous"></script> -->
    <div class="container">
      <header class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a href="index.php" class="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
          <img width="50px" height="50px"src="ntou_logo.png">
        </a>
        <span class="fs-1">海大資工系圖書館系統<span class="fs-2">-管理介面</span></span>
  
        <div class="col-md-3 text-end">
        <?php 
        //   session_start();
          if(isset($_SESSION['username'])){

            // echo ($_SESSION["status"]);
            // echo $_SESSION["admin"];
            echo $_SESSION['username'].'&emsp;你好&emsp;';
            
            echo '
            <div class="btn-group">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="php-member/logout.php" class="text-decoration-none"><button type="button" class="dropdown-item ">登出</button></a>
                <a href="php-member/change.php" class="text-decoration-none"><button type="button" class="dropdown-item ">修改密碼</button></a>
            </div>
          </div>
          ';
          }else{
            echo' <a href="php-member/login-2.htm"><button type="button" class="btn btn-outline-primary me-2">Login</button></a>
            <a href="php-member/signup-2.htm"><button type="button" class="btn btn-primary">Sign-up</button></a>
         ';
          } ?>
        </div>
      </header>
    </div>
    <div class="container"> 
            <div class="row justify-content-center">
                <input type ="button" class = "bt" onclick="javascript:location.href='php-book/borrowreturn-2.php'" value="出借/還書"></input><!-- //放入要跳轉的網址 -->
                <input type ="button" class = "bt" onclick="javascript:location.href='php-book/bookchange.php'" value="館藏調整"></input><!-- //放入要跳轉的網址 -->  
            </div>
            
            <div class="row justify-content-center">
                <input type ="button" class = "bt" onclick="javascript:location.href='php-condiction/condiction.php'" value="使用者權限"></input><!-- //放入要跳轉的網址 -->
                <input type ="button" class = "bt" onclick="javascript:location.href='php-blacklist/blackList.php'" value="黑名單"></input><!-- //放入要跳轉的網址 -->  
            </div>    
    </div>
    <div class="container w-50 p-5">
        <div class="row justify-content-center">
            <table class="table table-bordered col">
                <thead>
                    <tr class="table-warning">
                        <th colspan="2">目前狀態<button type="button" class="btn btn-outline-primary pull-right">&ensp;</button></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style='width:33%; border-right:0px;'>已出借:</td>
                        <td id="current_state_borrowedNum" style='width:67%; border-left:0px;'></td>
                    </tr>
                    <tr>
                        <td style='width:33%; border-right:0px;'>逾期:</td>
                        <td id="current_state_overdueNum" style='width:67%; border-left:0px;'></td>
                    </tr>
                    <tr>
                        <td style='width:33%; border-right:0px;'>館藏:</td>
                        <td id="current_state_holdingsNum" style='width:67%; border-left:0px;'></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered col" >
                <thead>
                    <tr class="table-warning">
                        <th colspan="2">
                        系統公告
                            <form style="display: inline " action="php-announcement/announcement_admin.php">                       
                                <input type="submit" class="btn btn-outline-primary pull-right" value="編輯公告" />
                            </form>
                            <!--<form style="display: inline " action="php-announcement/sentOverdueMail.php">
                                <button  type="submit" class="btn btn-outline-primary pull-right" value="">手動發布逾期通知(電子郵件)</button>
                            </form>-->
                        </th>
                    </tr>
                </thead>
                <tbody id = announcement_area>

                </tbody>
            </table>
        </div> 
    </div>
    <div class="container">
        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p class="col-md-4 mb-0 text-muted">&copy; 2021 Company, Inc</p>
      
      
          <ul class="nav col-md-4 justify-content-end">
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
            <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">About</a></li>
          </ul>
        </footer>
    </div>
    <link rel="stylesheet" href="//apps.bdimg.com/libs/jqueryui/1.10.4/css/jquery-ui.min.css">
    <script src="//apps.bdimg.com/libs/jquery/1.10.2/jquery.min.js"></script>
    <script src="//apps.bdimg.com/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>
    <script type="text/javascript">
        //將從資料庫抓到的資料輸出成首頁目前狀態欄的項目
        var jsonUrl = "current_state.php";
        $.getJSON(jsonUrl, function (data) {
            $("#current_state_borrowedNum").append(data['borrowedNum']);
            $("#current_state_overdueNum").append(data['overdueNum']);
            $("#current_state_holdingsNum").append(data['remainingHoldingsNum']+" / "+data['holdingsNum']);
        });



        //將從資料庫抓到的資料輸出成首頁公告欄的項目
         jsonUrl = "php-announcement/announcement_view_API.php";
        $.getJSON(jsonUrl, function (data) {
            let announcementCount = 5;//首頁顯示前5個公告
            for (let item in data) {
                let content = 
                "<tr class='one_announcement' onclick=location.href='php-announcement/announcement_detail_view_API.php?ID="+data[item].ID+"';>"+
                    "<td style='width:75%; border-right:0px;' >"+
                        data[item].title+
                    "</td>"+
                    "<td style='width:25%; border-left:0px;'>"+
                        data[item].annouceTime +
                    "</td>"+
                "</tr>";
                $("#announcement_area").append(content);
                announcementCount -= 1;
                if(announcementCount<=0){
                    break;
                }
            }
            while(announcementCount>0){//若公告數量未滿5個，則用空格補滿5個欄位
                let content = 
                "<tr>"+
                    "<td style='width:75%; border-right:0px;' >"+
                        
                    "</td>"+
                    "<td style='width:25%; border-left:0px;'>"+
                        
                    "</td>"+
                "</tr>";
                $("#announcement_area").append(content);
                announcementCount-=1;
            }
        });
    </script>
</body>
</html>