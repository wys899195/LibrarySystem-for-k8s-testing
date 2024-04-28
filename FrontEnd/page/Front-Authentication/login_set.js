
$(document).ready(function(){
    $("#login-reset").click(reset_login);
    $("#login-confirm").click(login);

})

function login(){
    let userID = $("#login-userID").val() || "";
    let password = $("#login-password").val() || "";
    if (userID && password){
        $.ajax({
            type: "POST",
            url: "../../api/v1/user/login",
            data: { 
                "userID":userID,
                "password":password
            },
            dataType: "json",
            success: function (response) {
                localStorage.setItem("loggedin", true);
                localStorage.setItem("username", response['username']);
                localStorage.setItem("userID", response['userID']);
                localStorage.setItem("email", response['email']);
                localStorage.setItem("status", response['status']);
                localStorage.setItem("admin", localStorage.getItem("status") == 2 ? 1 : 0);
                alert("登入成功");
                let is_admin = localStorage.getItem("admin") == 1 ? true : false;
                //check is admin or not
                if (is_admin){
                    window.location.replace('../admin_index.html');
                }
                else{
                    window.location.replace('../index.html');
                }
            },
            error: function (response) {
                alert(response.responseJSON.detail);
                $("#login-password").val("");
            },
        });
    }
}


function reset_login(){
    $("#login-userID").val("")
    $("#login-password").val("")
}
