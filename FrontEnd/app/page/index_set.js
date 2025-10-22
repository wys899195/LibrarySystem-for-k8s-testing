
$(document).ready(function(){

    let username = localStorage.getItem("username");
    let userID = localStorage.getItem("userID");
    let is_admin = localStorage.getItem("admin") == 1 ? true : false;

    //check is admin or not
    if (is_admin){
        window.location.replace('admin_index.html');
    }

    //set login block
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

    //event
    $("#index-normal-search-input").keyup(function(e) {
        if (e.keyCode == 13) { //enter
            console.log("123"); 
        }
    });

    $("index-normal-search-btn").click(function() {

    });
})









// //將從資料庫抓到的資料輸出成新書推薦的項目
// var jsonUrl = "recommendNewBook.php";
// console.log("YAA")
// $.getJSON(jsonUrl, function (data) {
//   console.log("YA")
//     let recommendCount = 3;//首頁顯示3本推薦的新書
//     while(recommendCount>0){
//       $("#recommendNewBook"+recommendCount).attr("onclick","location.href='php-book/book.php?search="+data[recommendCount-1].ISBN+"'");
//       $("#recommendNewBook_bookName"+recommendCount).html(data[recommendCount-1].bookName);
//       $("#recommendNewBook_author"+recommendCount).html("作者:"+data[recommendCount-1].author);
//       $("#recommendNewBook_describeBook"+recommendCount).html("簡介:<br>"+data[recommendCount-1].describeBook);
//       $imgurl = data[recommendCount-1].img_url;
//       console.log("YA")
//        if($imgurl == ""&&data[recommendCount-1].imageType!=''){
//          console.log(window.atob( data[recommendCount-1].bookImage ))
//         $imgurl="data:"+(data[recommendCount-1].imageType)+';base64,'+( data[recommendCount-1].bookImage )
//       }else if($imgurl == ""){
//         $imgurl = "recommendNewBook_no_Image.jfif";
//       }
//       $("#recommendNewBook_img"+recommendCount).attr("src",$imgurl);
//       recommendCount-=1;
//     }   
// })

// //將從資料庫抓到的資料輸出成首頁公告欄的項目
// jsonUrl = "php-announcement/announcement_view_API.php";
// // console.log(jsonUrl)
// $.getJSON(jsonUrl, function (data) {
  
//     let announcementCount = 5;//首頁顯示前5個公告
//     console.log(data)
//     for (let item in data) {
      
//         let content = 
//         "<tr class='one_announcement' onclick=location.href='php-announcement/announcement_detail_view_API.php?ID="+data[item].ID+"';>"+
//             "<td style='width:75%; ' >"+
//                 data[item].title+
//             "</td>"+
//             "<td style='width:25%; '>"+
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
//             "<td style='width:75%;' >&ensp;</td>"+
//             "<td style='width:25%;'>&ensp;</td>"+
//         "</tr>";
//         $("#announcement_area").append(content);
//         announcementCount-=1;
//     }

// });