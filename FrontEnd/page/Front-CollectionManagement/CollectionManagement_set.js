
$(document).ready(function(){
    let username = localStorage.getItem("username");
    let userID = localStorage.getItem("userID");
    let is_admin = localStorage.getItem("admin") == 1 ? true : false;
    //check is admin or not
    if (!is_admin){
        window.location.replace('../index.html');
    }

    //set login block
    if (username != null){
        $("#login_out_block").html(
        username+`&emsp;你好&emsp;
        <div class="btn-group">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <div class="dropdown-menu dropdown-menu-right">
                <a href="../Front-Authentication/logout.html" class="text-decoration-none"><button type="button" class="dropdown-item ">登出</button></a>
                <a href="Front-Authentication/change.php" class="text-decoration-none"><button type="button" class="dropdown-item ">修改密碼</button></a>
            </div>
        </div>
        
        `)
    }

    load_ISBN_list();
    $("#addbook_submit").click(add_book);
    $("#updatebook_submit").click(update_book);
    $("#deletebook_submit").click(delete_book);

    $("#updatebook_ISBN").change(load_current_stock_num);
    $("#deletebook_ISBN").change(load_current_borrow_state);


    //rwd
    rwd();
    window.addEventListener('resize', rwd);


})

function load_ISBN_list(){
    $("#updatebook_ISBN").empty();
    $("#deletebook_ISBN").empty();

    $.ajax({
        type: "GET",
        url: "/api/v1/collection",
        dataType: "json",
        success: function(response) {
            for (let book in response) {
                let content = `<option value="` + response[book]['ISBN'] + `">` + response[book]['ISBN'] + `</option>`;
                $("#updatebook_ISBN").append(content);
                $("#deletebook_ISBN").append(content);
            }
            load_current_stock_num();
            load_current_borrow_state();
        }
    });
}

function load_current_stock_num(){
    $("#updatebook_current_stock_num").text("讀取中...");
    let ISBN = $("#updatebook_ISBN").val();
    $.ajax({
        type: "GET",
        url: "/api/v1/collection/"  + ISBN,
        dataType: "json",
        success: function (response) {
            $("#updatebook_current_stock_num").text(response['stock_num']);
        },
        error: function (response) {
            $("#updatebook_current_stock_num").text("讀取失敗");
        },
    });
}

function load_current_borrow_state(){
    $("#deletebook_current_borrow_state").text("讀取中...");
    let ISBN = $("#deletebook_ISBN").val();
    $.ajax({
        type: "GET",
        url: "/api/v1/collection/"  + ISBN,
        dataType: "json",
        success: function (response) {
            if (parseInt(response['borrowed_num']) > 0){
                $("#deletebook_current_borrow_state").text("目前尚有 "+parseInt(response['borrowed_num'])+" 本出借中，不可下架");
            }
            else{
                $("#deletebook_current_borrow_state").text("目前沒有任何一本出借中，可以下架");
            }
        },
        error: function (response) {
            $("#deletebook_current_borrow_state").text("讀取失敗");
        },
    });
}

function add_book(){
    let ISBN = $("#addbook_ISBN").val() || "";
    let stock_num = $("#addbook_num").val() || 0;
    let bookName = $("#addbook_bookName").val() || "預設書名";
    let bookClass = $("#addbook_bookClass").val() || "總類";
    let author = $("#addbook_author").val() || "預設作者";
    let publisher = $("#addbook_publisher").val() || "預設出版社";
    let publishYear = $("#addbook_year").val() || 2000;
    let describeBook = $("#addbook_describeBook").val() || "無簡介";
    if(!ISBN){
        alert("ISBN不得為空");
    }
    else{
        $.ajax({
            type: "POST",
            url: "/api/v1/collection",
            data: { 
                "ISBN":ISBN,
                "stock_num": parseInt(stock_num),
                "borrowed_num": 0,
                "bookName": bookName,
                "bookClass": bookClass,
                "author": author,
                "publisher": publisher,
                "publishYear": parseInt(publishYear),
                "describeBook": describeBook
            },
            dataType: "json",
            success: function (response) {
                load_ISBN_list();
                alert(response['message']);
            },
            error: function (response) {
                alert(response.responseJSON.detail);
            },
        });
    }

}

function update_book(){
    let ISBN = $("#updatebook_ISBN").val() || "";
    let new_stock_num = $("#updatebook_num").val() || 0;
    if(!ISBN){
        alert("ISBN不得為空");
    }
    else{
        $.ajax({
            type: "PUT",
            url: "/api/v1/collection/" + ISBN,
            data: { 
                "new_stock_num":parseInt(new_stock_num )
            },
            dataType: "json",
            success: function (response) {
                load_ISBN_list();
                $("#updatebook_num").val(0);
                alert(response['message']);
            },
            error: function (response) {
                alert(response.responseJSON.detail);
            },
        });
    }
}

function delete_book(){
    let ISBN = $("#deletebook_ISBN").val() || "";
    if(!ISBN){
        alert("ISBN不得為空");
    }
    else{
        $.ajax({
            type: "DELETE",
            url: "/api/v1/collection/" + ISBN,
            dataType: "json",
            success: function (response) {
                load_ISBN_list();
                alert(response['message']);
            },
            error: function (response) {
                alert(response.responseJSON.detail);
            },
        });
    }
}

function rwd(){
    if(false){
        

    }
    else if(document.documentElement.clientWidth>=768 && document.documentElement.clientWidth<1268){
        var sizePercentage = 60+(1368-document.documentElement.clientWidth)/20;
        document.getElementById('rwd_a').setAttribute("style","width:"+sizePercentage+"%;");
    }
    else if(document.documentElement.clientWidth>=576 && document.documentElement.clientWidth<768){ 
        document.getElementById('rwd_a').setAttribute("style","width:90%;");
    }
    else if(document.documentElement.clientWidth<576){ 
        document.getElementById('rwd_a').setAttribute("style","width:90%;");
    }
    else{//document.documentElement.clientWidth>1368
        document.getElementById('rwd_a').setAttribute("style","width:60%;");
    }
}















