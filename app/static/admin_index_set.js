
$(document).ready(function(){

    let username = localStorage.getItem("username");
    let userID = localStorage.getItem("userID");
    let is_admin = localStorage.getItem("admin") == 1 ? true : false;
    //check is admin or not
    if (!is_admin){
        window.location.replace('index.html');
    }

    //login block
    if (username != null){
        $("#login_out_block").html(
        username+`&emsp;你好&emsp;
        <div class="btn-group">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="Front-Authentication/logout.html" class="text-decoration-none"><button type="button" class="dropdown-item ">登出</button></a>
                <a href="Front-Authentication/change.php" class="text-decoration-none"><button type="button" class="dropdown-item ">修改密碼</button></a>
            </div>
        </div>
        
        `)
    }

})







        // //將從資料庫抓到的資料輸出成首頁目前狀態欄的項目
        // var jsonUrl = "current_state.php";
        // $.getJSON(jsonUrl, function (data) {
        //     $("#current_state_borrowedNum").append(data['borrowedNum']);
        //     $("#current_state_overdueNum").append(data['overdueNum']);
        //     $("#current_state_holdingsNum").append(data['remainingHoldingsNum']+" / "+data['holdingsNum']);
        // });



        // //將從資料庫抓到的資料輸出成首頁公告欄的項目
        //  jsonUrl = "php-announcement/announcement_view_API.php";
        // $.getJSON(jsonUrl, function (data) {
        //     let announcementCount = 5;//首頁顯示前5個公告
        //     for (let item in data) {
        //         let content = 
        //         "<tr class='one_announcement' onclick=location.href='php-announcement/announcement_detail_view_API.php?ID="+data[item].ID+"';>"+
        //             "<td style='width:75%; border-right:0px;' >"+
        //                 data[item].title+
        //             "</td>"+
        //             "<td style='width:25%; border-left:0px;'>"+
        //                 data[item].annouceTime +
        //             "</td>"+
        //         "</tr>";
        //         $("#announcement_area").append(content);
        //         announcementCount -= 1;
        //         if(announcementCount<=0){
        //             break;
        //         }
        //     }
        //     while(announcementCount>0){//若公告數量未滿5個，則用空格補滿5個欄位
        //         let content = 
        //         "<tr>"+
        //             "<td style='width:75%; border-right:0px;' >"+
                        
        //             "</td>"+
        //             "<td style='width:25%; border-left:0px;'>"+
                        
        //             "</td>"+
        //         "</tr>";
        //         $("#announcement_area").append(content);
        //         announcementCount-=1;
        //     }
        // });