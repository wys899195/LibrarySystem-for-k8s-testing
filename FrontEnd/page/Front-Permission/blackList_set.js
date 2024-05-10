
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

    $("#add_blacklist_submit_btn").click(add_user_to_blacklist);
    $("#edit_blacklist_submit_btn").click(edit_user_in_blacklist);

    //load blacklist from db
    $.ajax({
        async:false,
        type: "GET",
        url: "/api/v1/blacklist",
        dataType: "json",
        success: function (response) {
            for (let item in response) {
                console.log(response[item])
                let content = 
                    "<tr>" +
                    "<td>" + response[item]['userID'] + "</td>" +
                    "<td>" + response[item]['username'] + "</td>" +
                    "<td>" + response[item]['reason'] +"</td>" +
                    "<td>" + "<input type='button' class='btn btn-outline-success btn-sm ' id='editReason"+response[item]['userID']+"' value='編輯原因'>&emsp;" + "<input type='submit' class='btn btn-outline-danger btn-sm ' onClick=\"$('#userID_delete').val('"+response[item]['userID']+"'); delete_user_in_blacklist();\" value='刪除'>" +"</td>" +
                    "</tr>";
                $("#menu").append(content);
    
                let content2 =  "<div>"+
                                "<input name='userID'   type='hidden' value="+response[item]['userID']   +">"+
                                "<input name='username' type='hidden' value="+response[item]['username'] +">"+
                                "<input name='reason'   type='hidden' value="+response[item]['reason']   +">"+
                                "<input name='action'   type='hidden' value='delete'>"+
                                "</div>";
                $("#formlist").append(content2);
    
                //「編輯原因」按鈕按下去後，會打開「編輯原因小視窗」
                $( "#editReason"+response[item]['userID']).click(function() {
                    $( "#editWindow" ).dialog( "open" );
                    $( "#userID_edit" ).val(response[item]['userID']);
                    $( "#userID_edit1" ).html(response[item]['userID']);
                    $( "#username_edit" ).html(response[item]['username']);
                    $( "#reason_edit" ).val(response[item]['reason']);
                });
            }
        },
        error: function (response) {
            alert("讀取黑名單失敗！("+response.responseJSON.detail+")");
        },
    });

     //「新增黑名單小視窗」預設為隱藏
     $(function() {
         $( "#addWindow" ).dialog({autoOpen: false,height:window.innerHeight*0.7,width:window.innerWidth*0.7});
     });
 
     //「編輯使用者被加入黑名單原因」預設為隱藏
     $(function() {
         $( "#editWindow" ).dialog({autoOpen: false,height:window.innerHeight*0.7,width:window.innerWidth*0.7});
     });
 
     //「新增」按鈕按下去後，會打開「新增黑名單小視窗」
         $( "#addNew" ).click(function() {
             $( "#addWindow" ).dialog( "open" );
     });

})


function add_user_to_blacklist(){
    if(confirm('確定將該使用者加入到黑名單?')){
        let userID = $("#add_blacklist_userID").val() || "";
        let reason = $("#add_blacklist_reason").val() || "無";
        if (userID){
            if(userID == localStorage.getItem("userID")){
                alert('不能把自己加入黑名單！');
                $("#add_blacklist_userID").val("");
            }
            else{
                //檢查使用者是否已經在黑名單內
                $.ajax({
                    type: "GET",
                    url: "/api/v1/blacklist/" + userID,
                    dataType: "json",
                    success: function (response) {
                        console.log(response);
                        if(!response['is_user_in_blacklist']){
                            $.ajax({
                                type: "POST",
                                url: "/api/v1/blacklist",
                                data: JSON.stringify({ 
                                    "userID":userID,
                                    "reason":reason
                                }),
                                contentType: "application/json",
                                success: function (response) {
                                    alert(response['message']);
                                    location.reload();
                                },
                                error: function (response) {
                                    alert(response.responseJSON.detail);
                                },
                            });
                        }
                        else{
                            alert("使用者已在黑名單內!");
                        }
                    },
                    error: function (response) {
                        alert(response.responseJSON.detail);
                    },
                });

            }
        }
    }
}

function edit_user_in_blacklist(){
    if(confirm('確定要修改嗎?')){
        let userID = $("#userID_edit").val() || "";
        let reason = $("#reason_edit").val() || "無";
        if (userID){
            //檢查使用者是否已不在黑名單內
            $.ajax({
                type: "GET",
                url: "/api/v1/blacklist/" + userID,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if(response['is_user_in_blacklist']){
                        $.ajax({
                            type: "PUT",
                            url: "/api/v1/blacklist/" + userID,
                            data: { 
                                "reason":reason
                            },
                            dataType: "json",
                            success: function (response) {
                                alert(response['message']);
                                location.reload();
                            },
                            error: function (response) {
                                alert(response.responseJSON.detail);
                            },
                        });
                    }
                    else{
                        alert("使用者已不在黑名單內!");
                        location.reload();
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.detail);
                },
            });
        }
    }
}

function delete_user_in_blacklist(){
    if(confirm('確定將該使用者從黑名單移除?')){
        let userID = $("#userID_delete").val() || "";
        if (userID){
            
            //檢查使用者是否已不在黑名單內
            $.ajax({
                type: "GET",
                url: "/api/v1/blacklist/" + userID,
                dataType: "json",
                success: function (response) {
                    console.log(response);
                    if(response['is_user_in_blacklist']){
                        $.ajax({
                            type: "DELETE",
                            url: "/api/v1/blacklist/" + userID,
                            dataType: "json",
                            success: function (response) {
                                alert(response['message']);
                                location.reload();
                            },
                            error: function (response) {
                                alert(response.responseJSON.detail);
                            },
                        });
                    }
                    else{
                        alert("使用者已不在黑名單內!");
                        location.reload();
                    }
                },
                error: function (response) {
                    alert(response.responseJSON.detail);
                },
            });
        }
    }
}
