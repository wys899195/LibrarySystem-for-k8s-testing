
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

    $("#borrowreturn_borrow_btn").click(borrow_book);
    $("#borrowreturn_return_btn").click(return_book);

})


function borrow_book(){
    let userID = $("#borrowreturn_userID").val() || "";
    let ISBN = $("#borrowreturn_ISBN").val() || "";
    let borrowNum = $("#borrowreturn_num").val() || "";
    if (userID && ISBN && borrowNum){
        $.ajax({
            type: "GET",
            url: "/api/v1/user/id/"  + userID,
            dataType: "json",
            success: function (response) {

                $.ajax({
                    type: "GET",
                    url: "/api/v1/collection/"  + ISBN,
                    dataType: "json",
                    success: function (response) {

                        $.ajax({
                            type: "POST",
                            url: "/api/v1/borrowReturn/borrowBook",
                            data: { 
                                "userID":userID,
                                "ISBN":ISBN,
                                "borrowNum":borrowNum,
                                "origin_stockNum":response['stock_num'],
                                "origin_borrowNum":response['borrowed_num'],
                            },
                            dataType: "json",
                            success: function (response) {
                                alert(response['message']);
                            },
                            error: function (response) {
                                alert(response.responseJSON.detail);
                            },
                        });
                        
                    },
                    error: function (response) {
                        alert(response.responseJSON.detail);
                    },
                });

            },
            error: function (response) {
                alert(response.responseJSON.detail);
            },
        });
    }
}
function return_book(){
    let userID = $("#borrowreturn_userID").val() || "";
    let ISBN = $("#borrowreturn_ISBN").val() || "";
    let returnNum = $("#borrowreturn_num").val() || "";
    if (userID && ISBN && returnNum){
        $.ajax({
            type: "GET",
            url: "/api/v1/user/id/"  + userID,
            dataType: "json",
            success: function (response) {
                $.ajax({
                    type: "GET",
                    url: "/api/v1/collection/"  + ISBN,
                    dataType: "json",
                    success: function (response) {

                        $.ajax({
                            type: "POST",
                            url: "/api/v1/borrowReturn/returnBook",
                            data: { 
                                "userID":userID,
                                "ISBN":ISBN,
                                "returnNum":returnNum,
                                "origin_stockNum":response['stock_num'],
                                "origin_borrowNum":response['borrowed_num'],
                            },
                            dataType: "json",
                            success: function (response) {
                                alert(response['message']);
                            },
                            error: function (response) {
                                alert(response.responseJSON.detail);
                            },
                        });
                        
                    },
                    error: function (response) {
                        alert(response.responseJSON.detail);
                    },
                });

            },
            error: function (response) {
                alert(response.responseJSON.detail);
            },
        });
    }
}

