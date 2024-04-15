//全域變數
var AICS_AUTH = localStorage.getItem("AICS_AUTH");
var admin_data = {} //管理員個人資料
var admin_managable_groups = [] //此為管理者能管理的組別，若管理者權限為「全部組別」，則可以管理所有組別
var group_data = {} //暫存目前選中組別的所有相關資料
var groups_name_list = []; //所有組別的名稱
var account_table;//帳號管理畫面的已註冊帳號table
var valid_email_list_table;//帳號管理畫面的註冊白名單table
const regex_for_twitter_username = /@([^&]+)/; // 用正規表達式，從設定檔讀取的twitter_id中獲取twitter的username
var first_load;
var last_sel_group = ""; //暫存重新載入資料前選中的組別
var last_sel_subfield = ""; //暫存重新載入資料前選中的次領域

//網頁初始化
$(document).ready(function(){

    //初始化頁面上方導覽列
    init_navbar("系統管理")

    //一開始顯示帳號管理功能畫面
    show_account_management_page()
    
    //初始化已註冊帳號table
    account_table = $("#account-table").DataTable({
        sDom: '<"top"flp>rt<"bottom"><"clear">',
        language: {
            emptyTable: " ",
            zeroRecords: "没有匹配结果",
            searchPlaceholder: "搜尋帳號(信箱)",
            sSearch: "",
        },
        columnDefs: [
            { targets: [0], searchable: true },    
            { targets: '_all', searchable: false },
            { "width": "1%", "targets": 4 },
        ],
        paging: false,
        scrollCollapse: true,
        scrollX: true,
        scrollY: 350,
        order: [[1, "desc"]], //依照帳號所屬組別排列
        fixedColumns: {
            left: 1,
            right: 1
        },
    });

    //初始化註冊白名單table
    valid_email_list_table = $("#valid-email-list-table").DataTable({
        sDom: '<"top"flp>rt<"bottom"><"clear">',
        language: {
            emptyTable: " ",
            zeroRecords: "没有匹配结果",
            searchPlaceholder: "搜尋信箱或姓名",
            sSearch: "",
        },
        columnDefs: [
            { targets: [0,1], searchable: true },    
            { targets: '_all', searchable: false },
            { "width": "1%", "targets": 2 },
        ],
        paging: false,
        scrollCollapse: true,
        scrollX: true,
        scrollY: 350
    });

    //載入資料
    reload()

    //更新已註冊帳號table
    put_data_in_account_table()

    //更新帳號白名單table
    put_data_in_valid_email_list_table()
 
    /****以下皆為事件綁定****/
    //帳號管理畫面切換tab
    for(let i=1;i<3;i++){
        $("#account-manage-tab-" + i).click(function() {
            if(i == 1){
                account_table.draw(false);
            }
            else if(i == 2){
                valid_email_list_table.draw(false);
            }
            for(let j=1;j<3;j++){
                if(j==i){
                    $("#account-manage-tab-label-" + j).css("background-color", "white");
                }
                else{
                    $("#account-manage-tab-label-" + j).css("background-color", "#ababab");
                }
            }
        });
    }
    //某些輸入框按下Enter後可完成輸入
    $("#new_keyword").bind("enterKey",function(e){
        add_keyword();
    });
    $("#new_keyword").keyup(function(e){
        if(e.keyCode == 13){
            $(this).trigger("enterKey");
        }
    });
    $("#a-keyword-in-multiple-keyword").bind("enterKey",function(e){
        insert_keyword_to_new_multiple_keyword();
    });
    $("#a-keyword-in-multiple-keyword").keyup(function(e){
        if(e.keyCode == 13){
            $(this).trigger("enterKey");
        }
    });
    //點選排序分數各項分數指標之權重時自動全選輸入框內的文字
    $("#time_score_weight").on("click", function () {
        this.select();
    ;});
    $("#country_score_weight").on("click", function () {
        this.select();
    ;});
    $("#title_keyword_score_weight").on("click", function () {
        this.select();
    ;});
    $("#text_keyword_score_weight").on("click", function () {
        this.select();
    ;});
    $("#popularity_score_weight").on("click", function () {
        this.select();
    ;});
    //可用「+」、「-」按紐調整排序分數指標之權重大小
    $('.score-weight-plus-btn, .score-weight-minus-btn').on('click', function(e) {
        const isNegative = $(e.target).closest('.score-weight-minus-btn').is('.score-weight-minus-btn');
        const input = $(e.target).closest('.input-group').find('input');
        if (input.is('input')) {
            input[0][isNegative ? 'stepDown' : 'stepUp']()
        }
    })
    //點選右下箭頭按鈕回頂部
    $(window).scroll(function () {
        if ($(window).scrollTop() > 1) {
            if ($("#back-top").hasClass("hide")) {
                $("#back-top").toggleClass("hide");
            }
        } else {
            $("#back-top").addClass("hide");
        }
    });
    $("#back-top").on("click", function () {
        scroll_to_top(300);
    ;});
    //點選最下方「回頂部」按鈕回頂部
    $("#back-top-btn").on("click", function () {
        scroll_to_top(300);
    });
    //左側選單功能選項的滑鼠事件
    $(".menu-button").on("mousedown", function (e) {$("#"+ e.target.id).css('background-color', '#c1c0c0');});
    $(".menu-button").on("mouseup", function (e) {$("#"+ e.target.id).css('background-color', '');});
    $(".menu-button").on("mouseout", function (e) {$("#"+ e.target.id).css('background-color', '');});
    //點選左側功能選單中任一功能選項將打開對應畫面
    $("#account-management-menu-button").on("click", function () {show_account_management_page();});
    $("#keyword-management-menu-button").on("click", function () {show_keyword_management_page();});
    $("#site-management-menu-button").on("click", function () {show_site_management_page();});
    $("#sorting-score-setting-menu-button").on("click", function () {show_sorting_score_setting_page();});
    $("#crawler-schedule-setting-menu-button").on("click", function () {show_crawler_schedule_setting_page();});

    /****以上皆為事件綁定****/

})

//管理者執行各種操作發生錯誤時發出錯誤訊息
function show_error_message(response = null,unexpected_error_message="執行該操作時發生錯誤"){
    //unexpected_error_message:後端出現未預期錯誤時將顯示此訊息
    try{
        switch(response.status){
            case 401: //尚未登入
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: response.responseJSON.detail,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        logout("尚未登入，將導至登入畫面...");
                    }
                });
                break;
            case 403: //管理權限不足
                Swal.fire({
                    icon: "error",
                    title: "管理權限不足，無法進行該操作",
                    text: "您的權限可能已被其他管理者更改，請刷新頁面重試",
                    allowOutsideClick: false,
                });
                break;
            default:
                Swal.fire({
                    icon: "error",
                    title: unexpected_error_message,
                    html:"<p style='font-weight:bold;'>請稍後刷新頁面重試，若多次失敗請聯繫開發人員<br></p><p >錯誤原因: "+ response.responseJSON.detail +"</p>",
                    allowOutsideClick: false,
                });
        }
    }
    catch(error){
        Swal.fire({
            icon: "error",
            title: unexpected_error_message,
            html:"<p style='font-weight:bold;'>請稍後刷新頁面重試，若多次失敗請聯繫開發人員<br></p><p >錯誤原因: 未知錯誤</p>",
            allowOutsideClick: false,
        });
    }
}


/*****讀取資料相關*****/
//讀取管理者資料
function get_admin_data(scrollList = "",scrollTo = 0){
    $.ajax({
        type: "POST",
        url: "../getUserData",
        data: { Authorization: "Bearer " + AICS_AUTH, },
        dataType: "json",
        headers: {
            Authorization: "Bearer " + AICS_AUTH,
        },
        success: function (response) {
            admin_data = response["user_data"]
            get_manageable_group(scrollList,scrollTo);
        },
        error: function (response) {
            show_error_message(response,"讀取您的個人資料及管理權限失敗")
        },
    });
}
//讀取管理者可管理的組別資料
function get_manageable_group(scrollList = "",scrollTo = 0) {
    try{
        //獲取所有組別的名稱
        $.ajax({
            async:false,
            type: "GET",
            url: "../getGroupsNameList",
            data: { Authorization: "Bearer " + AICS_AUTH, },
            dataType: "json",
            headers: {
                Authorization: "Bearer " + AICS_AUTH,
            },
            success: function (response) {
                groups_name_list = response['groups_name_list']
            },
            error: function (response) {
                show_error_message(response,"載入組別資料時發生錯誤")
                return;
            },
        });
    
        //檢查是否具有管理權限
        if(admin_data["manageable_group"] == "全部組別"){ //可以管理所有組別
            admin_managable_groups = groups_name_list;
        }
        else if(groups_name_list.includes(admin_data["manageable_group"])){ //管理員的權限有明確寫是哪一個組別，只能管一個組別
            admin_managable_groups = [admin_data["manageable_group"],]
        }
        else{  //不具管理權限
            Swal.fire({
                icon: "error",
                title: "您必須擁有管理權限，才能進行管理者操作，稍後將跳轉至主畫面",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("index.html");
                }
            });
            return;
        }

        //設定可選取的組別
        var sel_group_inner_html = ""
        for(let i = 0; i < admin_managable_groups.length; i++){
            sel_group_inner_html += '<option>' + admin_managable_groups[i] + '</option>'
        }
        $("#sel_group").html(sel_group_inner_html);

        //選中重新載入資料前選中的組別、次領域(若是第一次載入則忽略)
        if(last_sel_group != "" && admin_managable_groups.includes(last_sel_group)){
            $("#sel_group").val(last_sel_group);

        }

        select_group(scrollList,scrollTo);
    }catch(error){
        Swal.fire({
            icon: "error",
            title: "讀取管理權限時發生錯誤",
            text:"稍後將跳轉至主畫面，若發生錯誤多次請聯繫開發人員",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.replace("index.html");
                }
            });
        return;
    }
}

//管理者切換選中的組別時觸發的事件
function select_group(scrollList = "",scrollTo = 0){
    var group_val = $("#sel_group").val();
    last_sel_group = group_val
    console.log(group_val)
    $.ajax({
        type: "POST",
        url: "../getGroupData",
        data: { group: group_val},
        dataType: "json",
        headers: {
            Authorization: "Bearer " + AICS_AUTH,
        },
        success: function (response) {
            //載入組別下的所有次領域
            var selection_html = '<div class="col-sm-10" id="subfield_selection">' +
            '<select class="form-control" id="sel_subfield" onchange="select_field();">'
            group_data = response["group_data"]
            console.log(group_data)
            fields_obj = group_data.fields
            fields_name = Object.keys(fields_obj)
            for (let j = 0; j < fields_name.length; j++) {
                selection_html += '<option>' + fields_name[j] + '</option>'
            }
            selection_html += '</select></div>'
            $("#subfield_selection").replaceWith(selection_html)

            //選中次領域
            if(fields_name.includes(last_sel_subfield)){
                $("#sel_subfield").val(last_sel_subfield);
            }
            select_field(scrollList,scrollTo);

            //載入組別的資料排序分數權重
            try{
                var sorting_score_weight = group_data.sorting_score_weight
                $("#time_score_weight").val(sorting_score_weight['time'])
                $("#country_score_weight").val(sorting_score_weight['country'])
                $("#title_keyword_score_weight").val(sorting_score_weight['title_keyword'])
                $("#text_keyword_score_weight").val(sorting_score_weight['text_keyword'])
                $("#popularity_score_weight").val(sorting_score_weight['popularity'])
            }catch(error){
                $("#time_score_weight").val()
                $("#country_score_weight").val()
                $("#title_keyword_score_weight").val()
                $("#text_keyword_score_weight").val()
                $("#popularity_score_weight").val()
                Swal.fire({
                    icon: "error",
                    title: "讀取組別的排序分數之指標權重時發生錯誤",
                    text:"請刷新頁面重試，若多次失敗請聯繫開發人員",
                    allowOutsideClick: false,
                })
            }
        },
        error: function (response) {
            show_error_message(response,"讀取組別下的次領域時發生錯誤")
        },
    });
}

//管理者切換選中的次領域時觸發的事件
function select_field(scrollList = "",scrollTo = 0) {
    var field_val = $("#sel_subfield").val();
    last_sel_subfield = field_val
    var keywords_array = group_data.fields[field_val].keywords
    var multiple_keywords_array = group_data.fields[field_val].multiple_keywords
    var sites_array = group_data.fields[field_val].sites

    //主要關鍵字列表
    var keywords_list_html = '<div class="keywords-list" id="keywords_list">'
    try {
        if(keywords_array.length != 0){
            for (let j = 0; j < keywords_array.length; j++) {
                keywords_list_html += '<div class="card" id="keyword-card' + j + '"><div class="card-body" >' +
                    '<div class="edit-button">' +
                    
                    '</div>' +
                    '<input type="text" style=" margin-left: 5px;" class="form-control" id="keyword' + j + '" value="' + keywords_array[j] + '" disabled></input>' +
                    '<div class="edit-button">' +
                    '<button type="button" class="btn btn-primary" id="keywords_list_edit_Btn' + j + '" title="編輯" onClick="keyword_editable('+j+');" ><i class="fa-regular fa-pen-to-square" style="font-size: 0.87em;"></i></button>'+
                    '<button type="button" class="btn btn-secondary" id="keywords_list_cancel_edit_Btn' + j + '" title="取消編輯" onClick="cancel_edit_keyword('+j+');" hidden><i class="fa-solid fa-xmark" style="font-size: 1.15em;"></i></button>'+
                    '<button type="button" class="btn btn-success" id="keywords_list_save_edit_Btn' + j + '" title="完成編輯" onClick="edit_keyword('+j+');" hidden><i class="fa-solid fa-check"></i></button>'+
                    '<button type="button" class="btn btn-danger" id="keywords_list_delete_Btn' + j + '" title="刪除" onClick="delete_keyword('+j+');"><i class="fa-regular fa-trash-can" style="font-size: 1em;"></i></button>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
        }
        else{
            keywords_list_html += "此次領域尚無主要關鍵字"
        }

    } catch (error) {
        keywords_list_html += "讀取主要關鍵字列表時發生錯誤"
    }
    keywords_list_html += '</div>'
    $("#keywords_list").replaceWith(keywords_list_html)
    
    //輔助關鍵字列表
    var multiple_keywords_list_html = '<div class="keywords-list" id="multiple_keywords_list">'
    try {
        if(multiple_keywords_array.length != 0){
            for (let j = 0; j < multiple_keywords_array.length; j++) {
                multiple_keywords_list_html += '<div class="card" id="multiple-keyword-card' + j + '"><div class="card-body" >' +
                    '<div class="edit-button">' +
                    '</div>' +
                    '<input type="text" style=" margin-left: 5px;" class="form-control" id="multiple-keyword' + j + '" value="' + multiple_keywords_array[j].join(';') + '" disabled></input>' +
                    '<div class="edit-button">' +
                    '<button type="button" class="btn btn-primary" id="multiple_keywords_list_edit_Btn' + j + '" title="編輯" data-toggle="modal" data-target="#add-or-edit-new-multiple-keyword-window" onclick="open_add_or_edit_mkw_window(\'edit\',\''+multiple_keywords_array[j].join(';')+'\','+j+')" ><i class="fa-regular fa-pen-to-square" style="font-size: 0.87em;"></i></button>'+
                    '<button type="button" class="btn btn-danger" id="multiple_keywords_list_delete_Btn' + j + '" title="刪除" onClick="delete_multiple_keyword('+j+');"><i class="fa-regular fa-trash-can" style="font-size: 1em;"></i></button>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
        }
        else{
            multiple_keywords_list_html += "此次領域尚無輔助關鍵字"
        }

    } catch (error) {
        multiple_keywords_list_html += "讀取輔助關鍵字列表時發生錯誤"
    }
    multiple_keywords_list_html += '</div>'
    $("#multiple_keywords_list").replaceWith(multiple_keywords_list_html)

    //網站列表
    var str = ""
    var web_list_html = '<div class="web-list" id="web_list">'
    try {
        if(sites_array.length != 0){
            for (let k = 0; k < sites_array.length; k++) {
                site_data = {
                    "site_name":sites_array[k].site_name == null ? "" :sites_array[k].site_name,
                    "site":sites_array[k].site == null ? "" :sites_array[k].site,
                    "title_css":sites_array[k].title_css == null ? "" :sites_array[k].title_css,
                    "content_css":sites_array[k].content_css == null ? "" :sites_array[k].content_css,
                    "twitter_url":"", 
                    "twitter_username": "",
                    "twitter_id":"",
                }
                try{
                    if (sites_array[k].twitter_id != null && sites_array[k].twitter_id.trim() != ""){
                        site_data['twitter_username'] = sites_array[k].twitter_id.match(regex_for_twitter_username)[1]//從設定檔的twitter_id欄位擷取出twitter username
                    }
                    if (site_data['twitter_username'] == undefined){
                        site_data['twitter_username'] = "(讀取時發生錯誤)"
                    }
                }catch(error){
                    site_data['twitter_username'] = "(讀取時發生錯誤)" 
                }
                try{
                    if (sites_array[k].twitter_id != null && sites_array[k].twitter_id.trim() != ""){
                        site_data['twitter_id'] = sites_array[k].twitter_id.split('&')[1] //從設定檔的twitter_id欄位擷取出twitter id
                    }
                    if (site_data['twitter_id'] == undefined){
                        site_data['twitter_id'] = "(讀取時發生錯誤)"
                    }
                }catch(error){
                    site_data['twitter_id'] = "(讀取時發生錯誤)"
                }
                web_list_html += '<div class="card"  style="width: 100%;" id="web-list-card' + k + '"><div class="card-body">' +
                    '<label for="web-list-web' + k + '">網站名稱:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control" id="web-list-web' + k + '" name="web-list-web' + k + '" value="' + site_data["site_name"] + '" disabled></input>' +
                    '<label for="web-list-site' + k + '">網址:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control" id="web-list-site' + k + '" name=""web-list-site' + k + '" value="' + site_data["site"] + '" disabled></input>' +
                    '<label for="web-list-titleCSS' + k + '">titleCSS:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control" id="web-list-titleCSS' + k + '" name=""web-list-titleCSS' + k + '" value="' + site_data["title_css"] + '" disabled></input>' +
                    '<label for="web-list-contentCSS' + k + '">contentCSS:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control" id="web-list-contentCSS' + k + '" name=""web-list-contentCSS' + k + '" value="' + site_data["content_css"] + '" disabled></input>' +
                    '<label for="web-list-twitter-username' + k + '">官方Twitter Username:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control twitter-username" id="web-list-twitter-username' + k + '" name=""web-list-twitter-username' + k + '" value="' + site_data["twitter_username"] + '" disabled></input>' +
                    '<label for="web-list-twitter-id' + k + '">官方Twitter ID:</label>' +
                    '<input type="text" placeholder="(暫無)" class="form-control" id="web-list-twitter-id' + k + '" name=""web-list-twitter-id' + k + '" value="' + site_data["twitter_id"] + '" disabled></input>' +
                    '<div class="edit-button"><br>' +
                    '<button type="button" class="btn btn-primary" id="web_list_edit_Btn' + k + '" onClick="site_editable('+k+');" >編輯</button>'+
                    '<button type="button" class="btn btn-secondary" id="web_list_cancel_edit_Btn' + k + '" onClick="cancel_edit_site('+k+');" hidden>取消</button>'+
                    '<button type="button" class="btn btn-success" id="web_list_save_edit_Btn' + k + '" onClick="add_or_edit_site(action = \'edit\',web_listindex = '+k+');" style="margin-left: 10px;" hidden>完成</button>'+
                    '<button type="button" class="btn btn-danger" id="web_list_delete_Btn' + k + '" onClick="delete_site('+k+');" style="position: absolute; right: 20px;">刪除</button>'+
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
        }
        else{
            web_list_html += "此次領域尚無網站" 
        }

    } catch (error) {
        web_list_html += "讀取網站列表時發生錯誤" 
    }
    web_list_html += '</div>'
    $("#web_list").replaceWith(web_list_html)

    //新增關鍵字或網站後，對應列表滾動至最下方
    //編輯關鍵字或網站後，對應列表滾動至剛被變更的關鍵字或網站
    if(scrollList == "keyword_list"){
        $("#keywords_list").prop('scrollTop',scrollTo);
    }
    else if(scrollList == "multiple_keywords_list"){
        $("#multiple_keywords_list").prop('scrollTop',scrollTo);
    }
    else if(scrollList == "web_list"){
        $("#web_list").prop('scrollTop',scrollTo);
    }
}

/***** 帳號管理相關 *****/
// 載入資料至已註冊帳號table
function put_data_in_account_table() {
    //讀取可管理的使用者清單
    var users_list = [];
    $.ajax({
        type: "GET",
        url: "../getUsersList",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + AICS_AUTH,
        },
        success: function (response) {
            users_list = response['users_list']
            drawAccountTable(users_list)
        },
        error: function (response) {
            show_error_message(response,"載入使用者列表時發生錯誤")
        },
    });

}
// 載入資料至帳號白名單table
function put_data_in_valid_email_list_table(){
    var valid_email_list = [];
    $.ajax({
        type: "GET",
        url: "../getValidEmailList",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + AICS_AUTH,
        },
        success: function (response) {
            valid_email_list = response['valid_email_list']
            drawValidEmailListTable(valid_email_list)
        },
        error: function (response) {
            show_error_message(response,"載入白名單列表時發生錯誤")
        },
    });
}
// 畫已註冊帳號table
function drawAccountTable(users_list){
    account_table.clear();
    for(let i = 0; i < users_list.length; i++){

        //讀取帳號的身分及管理權限
        var account_identity;
        try{
            if("manageable_group" in users_list[i]){
                if(users_list[i]['manageable_group'] == "全部組別"){ //此帳號為管理所有組別的超級管理者
                    account_identity = "超級管理者"
                }else if(groups_name_list.includes(users_list[i]['manageable_group'])){ //此使用者為管理單一組別的管理者
                    account_identity = "管理者（"+users_list[i]['manageable_group']+"）"
                }else{ //此帳號為一般使用者
                    account_identity = "使用者"
                }
            }else{ //此帳號為一般使用者
                account_identity = "使用者"
            }
        }catch(error){
            account_identity = "（讀取失敗或未知）"
        }

        //帳號是否被ban
        var is_account_disabled = ""
        try{
            if ("disabled" in users_list[i]){
                if(users_list[i]['disabled'] == true){
                    is_account_disabled = '<i class="fa-solid fa-ban" style="color: #ff0000;font-size: 0.87em;"></i><label id="users_list_disabled'+i+'">禁用</label>'
                }else{
                    is_account_disabled = '<i class="fa-solid fa-check" style="color: #20bc3f;"></i><label id="users_list_disabled'+i+'">允許</label>'
                }
            }
        }catch(error){
            is_account_disabled = "（讀取失敗或未知）"
        }

        //管理者不能對權限大於等於自己的帳號進行編輯或刪除等操作
        var account_is_manageable = false;
        var operation_block_html ="<label style='font-style:italic;opacity:0.7;margin-bottom:9.5px;margin-top:9.5px;'>僅供檢視</label>";
        if ((admin_data["manageable_group"] == "全部組別" && account_identity != "超級管理者") || (admin_data["manageable_group"] != "" && account_identity == "使用者")){ 
            account_is_manageable = true;
            operation_block_html = 
            '<div class="edit-button">'+
            '<button type="button" onclick="open_edit_account_window(' + i + ')" style="margin-left:5px;margin-bottom:5px;" class="btn btn-primary" id="account_list_edit_Btn' + i + '" title="編輯此帳號" data-toggle="modal" data-target="#edit-account-window"><i class="fa-regular fa-pen-to-square" style="font-size: 0.87em;"></i>編輯</button>'+
            '<button type="button" onclick="delete_account(' + i + ')" style="margin-left:5px;margin-bottom:5px;" class="btn btn-danger" id="account_list_delete_Btn' + i + '" title="刪除此帳號"><i class="fa-regular fa-trash-can" style="font-size: 1em;">刪除</button>'+
            '</div>';
        }
        //畫table
        if(!($("#toggle-all-account-display-checkbox-for-account-table").prop("checked") == true && account_is_manageable == false)){ //當切換到僅顯示可管理的帳號
            account_table.row.add([
                '<label id="users_list_username'+i+'">'+users_list[i]['username']+'</label>',
                '<label id="users_list_group'+i+'">'+users_list[i]['belonging_group']+'</label>',
                '<label id="users_list_identity'+i+'">'+account_identity+'</label>',
                '<label>'+is_account_disabled+'</label>',
                operation_block_html,
            ]);
        }

    }
    account_table.draw(false);
}
// 畫帳號白名單table
function drawValidEmailListTable(valid_email_list){
    valid_email_list_table.clear();

    //畫table
    for(let i = 0; i < valid_email_list.length; i++){
        var operation_block_html =
        '<div class="edit-button">'+
        '<button type="button" onclick="open_add_or_edit_valid_email_list_window(\'edit\',' + i + ')" style="margin-left:5px;margin-bottom:5px;" class="btn btn-primary" id="account_list_edit_Btn' + i + '" title="編輯此帳號" data-toggle="modal" data-target="#add-or-edit-valid-email-list-window"><i class="fa-regular fa-pen-to-square" style="font-size: 0.87em;"></i>編輯</button>'+
        '<button type="button" onclick="delete_user_in_valid_email_list(' + i + ')" style="margin-left:5px;margin-bottom:5px;" class="btn btn-danger" id="account_list_delete_Btn' + i + '" title="刪除此帳號"><i class="fa-regular fa-trash-can" style="font-size: 1em;">刪除</button>'+
        '</div>';
        if (valid_email_list[i]['name'].trim()==""){
            valid_email_list[i]['name'] = "AICS使用者"
        } 
        valid_email_list_table.row.add([
            '<label id="valid_email_list_name'+i+'">'+valid_email_list[i]['name']+'</label>',
            '<label id="valid_email_list_email'+i+'">'+valid_email_list[i]['email']+'</label>',
            // '<label id="valid_email_list_field'+i+'">'+valid_email_list[i]['field']+'</label>',
            operation_block_html
        ]); 
    }
    valid_email_list_table.draw(false);
}
// 打開帳號編輯視窗
function open_edit_account_window(accountIndex){
    var manageable_group = ""
    try{
        manageable_group = admin_data['manageable_group']
    }catch(error){
        manageable_group = ""
    }
    $("#account-in-edit-account-window").val($("#users_list_username"+accountIndex).html());
    $("#group-in-edit-account-window").val($("#users_list_group"+accountIndex).html());
    $("#select-disabled-in-edit-account-window").val($("#users_list_disabled"+accountIndex).html());
    let account_identity_html = $("#users_list_identity"+accountIndex).html();

    var select_identity_html = '><option value="無">使用者</option>';
    if(manageable_group == "全部組別"){ //超級管理者
        for(let i=0;i<groups_name_list.length;i++){        
            select_identity_html +=  '<option id="identity_option_管理者（'+groups_name_list[i]+'）" value="'+groups_name_list[i]+'">管理者（'+groups_name_list[i]+'）</option>';
        }
        select_identity_html +=  '<option id="identity_option_超級管理者" value="全部組別(equal_to_active_admin)">超級管理者</option>';

    }else if(groups_name_list.includes(manageable_group)){ //管理者
        select_identity_html +=  '<option id="identity_option_管理者（'+groups_name_list[i]+'）" value="'+manageable_group+'(equal_to_active_admin)">管理者（'+groups_name_list[i]+'）</option>';
    }
    $("#select-identity-in-edit-account-window").html(select_identity_html);
    $("#identity_option_"+account_identity_html).attr("selected", "selected");

}
function edit_account(){
    var account = $("#account-in-edit-account-window").val();
    var manageable_group = $("#select-identity-in-edit-account-window").val();
    var disabled = $("#select-disabled-in-edit-account-window").val();

    if(disabled == "禁用"){
        disabled = true;

    }else{
        disabled = false;
    }
    console.log(manageable_group)
    if (manageable_group.includes('(equal_to_active_admin)')){ //即將把該帳號的權限提升到與自己相同
        Swal.fire({
            title: "此帳號切換身分後，其管理等級將與您相同，之後無法透過此頁面管理此帳號，是否確認編輯？",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "確定",
            cancelButtonText: "取消",
        }).then((result) => {
            if (result.isConfirmed) {
                manageable_group = manageable_group.replace("(equal_to_active_admin)","");
                $.ajax({
                    type: "POST",
                    url: "../updateUser",
                    data: { 
                        username: account,
                        new_disabled: disabled,
                        new_manageable_group:manageable_group
                    },
                    dataType: "json",
                    headers: {
                        Authorization: "Bearer " + AICS_AUTH,
                    },
                    success: function (response) {
                        Swal.fire({
                            icon: "success",
                            title: "編輯成功",
                            text:"已更新至資料庫",
                            showConfirmButton:false,
                            timer: 1000
                        }).then(() => {
                            $('#edit-account-window').modal('hide');
                            reload();
                            //更新帳號管理畫面的帳號table
                            put_data_in_account_table()
                        });
                        
                    },
                    error: function (response) {
                        show_error_message(response,"編輯帳號失敗")
                    },
                });  
            }
        });
    }else{
        $.ajax({
            type: "POST",
            url: "../updateUser",
            data: { 
                username: account,
                new_disabled: disabled,
                new_manageable_group:manageable_group
            },
            dataType: "json",
            headers: {
                Authorization: "Bearer " + AICS_AUTH,
            },
            success: function (response) {
                Swal.fire({
                    icon: "success",
                    title: "編輯成功",
                    text:"已更新至資料庫",
                    showConfirmButton:false,
                    timer: 1000
                }).then(() => {
                    $('#edit-account-window').modal('hide');
                    reload();
                    //更新帳號管理畫面的帳號table
                    put_data_in_account_table()
                });
                
            },
            error: function (response) {
                show_error_message(response,"編輯帳號失敗")
            },
        });  
    }

}

function delete_account(accountIndex){
    var account = $("#users_list_username"+ accountIndex).html();
    Swal.fire({
        title: "確定刪除這個帳號?",
        html: "<p style='font-weight:bold;'>此帳號將從帳號資料庫刪除，之後須重新註冊才能使用本系統，您無法恢復此操作<br></p><a>請輸入「"+account+"」以刪除該帳號</a>",
        input: 'text', //輸入欄位的類型
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        customClass: {
            validationMessage: 'swal-input-validation-message',
        },
        cancelButtonText: "取消",
        preConfirm: (value) => {
            if (value != account) {
              Swal.showValidationMessage('<i class="fa fa-info-circle"></i>請輸入正確')
            }}
    }).then((result) => {
        if (result.isConfirmed) {
            if (result.isConfirmed) {
                    
                $.ajax({
                    type: "POST",
                    url: "../deleteUser",
                    data: { 
                        username: account
                    },
                    dataType: "json",
                    headers: {
                        Authorization: "Bearer " + AICS_AUTH,
                    },
                    success: function (response) {
                        Swal.fire({
                            icon: "success",
                            title: "刪除成功",
                            text:"已更新至資料庫",
                            showConfirmButton:false,
                            timer: 1000
                        }).then(() => {
                            reload();
                            //更新帳號管理畫面的帳號table
                            put_data_in_account_table()
                        });
                        
                    },
                    error: function (response) {
                        show_error_message(response,"刪除帳號失敗")
                    },
                });         
            }
        }
    });
}
function open_add_or_edit_valid_email_list_window(action = "",accountIndex = -999){
    if (action == "add"){
        $("#add-or-edit-vel-window-title").html("加入信箱至白名單");
        $("#email-in-add-or-edit-vel-window").val('');
        $("#name-in-add-or-edit-vel-window").val('');
        $("#add-valid-email-list-window-ok-btn").removeAttr('hidden');
        $("#edit-valid-email-list-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-valid-email-list-window-ok-btn").attr("onclick","");
    }
    else if (action == "edit" && accountIndex != 999){
        $("#add-or-edit-vel-window-title").html("修改信箱資料");
        $("#email-in-add-or-edit-vel-window").val($("#valid_email_list_email" + accountIndex).html());
        $("#name-in-add-or-edit-vel-window").val($("#valid_email_list_name" + accountIndex).html());
        $("#add-valid-email-list-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-valid-email-list-window-ok-btn").removeAttr('hidden');
        $("#edit-valid-email-list-window-ok-btn").attr("onclick","add_or_edit_user_to_valid_email_list('edit',"+accountIndex+")");
    }
}
// 新增或編輯信箱至註冊白名單
function add_or_edit_user_to_valid_email_list(action,accountIndex = -999){
    var email_val = $("#email-in-add-or-edit-vel-window").val().trim();
    var name_val = $("#name-in-add-or-edit-vel-window").val().trim();
    var old_email_val = $("#valid_email_list_email" + accountIndex).html();
    var email_format_re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email_val != ""){
        if(email_format_re.test(email_val)){
            if(name_val == ""){
                name_val = "AICS使用者"
            }
            $.ajax({
                type: "POST",
                url: "../isUserInValidEmailList",
                data: { 
                    email: email_val
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    if (action == "add" && response == true){
                        Swal.fire({
                            icon: "warning",
                            title: "該信箱已在白名單內",
                            showConfirmButton: true,
                        }) 
                    }
                    else if(action == "edit" && !(old_email_val == email_val) && response == true){
                        Swal.fire({
                            icon: "warning",
                            title: "修改後的信箱與其他信箱重複",
                            showConfirmButton: true,
                        })
                    }
                    else{
                        if (action == "add"){
                            $.ajax({
                                type: "POST",
                                url: "../addUserToValidEmailList",
                                data: { 
                                    name: name_val,
                                    email: email_val
                                },
                                dataType: "json",
                                headers: {
                                    Authorization: "Bearer " + AICS_AUTH,
                                },
                                success: function (response) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "加入成功",
                                        text:"已更新至白名單",
                                        showConfirmButton:false,
                                        timer: 1000
                                    }).then(() => {
                                        reload();
                                        $("#email-in-add-or-edit-vel-window").val('');
                                        $("#name-in-add-or-edit-vel-window").val('');
                                        //更新註冊白名單管理畫面的帳號table
                                        put_data_in_valid_email_list_table()
                                    });
                                },
                                error: function (response) {
                                    show_error_message(response,"加入信箱至白名單失敗")
                                },
                            }); 
                        }
                        else if(action == "edit" && accountIndex!= -999){
                            $.ajax({
                                type: "POST",
                                url: "../editUserInValidEmailList",
                                data: { 
                                    old_email:old_email_val,
                                    name: name_val,
                                    email: email_val
                                },
                                dataType: "json",
                                headers: {
                                    Authorization: "Bearer " + AICS_AUTH,
                                },
                                success: function (response) {
                                    Swal.fire({
                                        icon: "success",
                                        title: "編輯成功",
                                        text:"已更新至白名單",
                                        showConfirmButton:false,
                                        timer: 1000
                                    }).then(() => {
                                        reload();
                                        $("#email-in-add-or-edit-vel-window").val('');
                                        $("#name-in-add-or-edit-vel-window").val('');
                                        $('#add-or-edit-valid-email-list-window').modal('hide');
                                        //更新註冊白名單管理畫面的帳號table
                                        put_data_in_valid_email_list_table()
                                    });
                                },
                                error: function (response) {
                                    show_error_message(response,"編輯信箱失敗")
                                },
                            }); 
                        }

                    }
                },
                error: function (response) {
                    show_error_message(response,"查詢該使用者是否已在白名單內時失敗")
                },
            }); 
        }
        else{
            Swal.fire({
                icon: "warning",
                title: "請輸入正確的信箱格式",
                showConfirmButton: true,
            })
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "請輸入欲新增的信箱",
            showConfirmButton: true,
        })
    }
}
//刪除白名單中的一支帳號
function delete_user_in_valid_email_list(accountIndex = -999){
    Swal.fire({
        title: "確定將此信箱從白名單刪除?",
        html: "<p>此信箱將無法用來註冊本系統，您無法恢復此操作</p><p>（若該信箱已註冊，則直到帳號被刪除前都不會受影響）</p>",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then((result) => {
        if (result.isConfirmed) {
            var email_val = $("#valid_email_list_email" + accountIndex).html();
            $.ajax({
                type: "POST",
                url: "../deleteUserInValidEmailList",
                data: { 
                    email:email_val
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "刪除成功",
                        text:"已更新至白名單",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload();
                        $("#email-in-add-or-edit-vel-window").val('');
                        $("#name-in-add-or-edit-vel-window").val('');
                        $('#add-or-edit-valid-email-list-window').modal('hide');
                        //更新註冊白名單管理畫面的帳號table
                        put_data_in_valid_email_list_table()
                    });
                },
                error: function (response) {
                    show_error_message(response,"刪除信箱失敗")
                },
            });
        }
    });
}


/*****編輯組別及次領域相關(開發中)*****/
function add_group() {
    //post field_data
    var new_group_name = $('#new-group')[0].value
    new_group_obj = {
        "group": new_group_name,
        "field": {},
    }
    groups_data.push(new_group_obj)
    select_group()
}
function add_field() {
    //post field_data
    var e = document.getElementById("sel_subfield");
    var field_val = e.options[e.selectedIndex].value;
    var new_field_name = $('#new-field')[0].value
    group_data.fields[new_field_name]({
        "sites": [],
        "keywords": []
    })
    select_group()
    select_field()
}

/*****編輯主要關鍵字列表相關*****/
//編輯主要關鍵字後，檢查主要關鍵字列表中是否已有相同的主要關鍵字存在，有的話回傳該主要關鍵字於列表的index
function exist_same_keyword_url(new_keyword,keyword_list){
    for(let i=0;i<keyword_list.length;i++){
        if(keyword_list[i] == new_keyword){
            return i;
        }
    }
    return -999;// -999是隨便設的數字，代表網址不存在
}
function keyword_editable(keywordindex) {
    $('#keyword' + keywordindex).attr("disabled", false)
    $('#keywords_list_edit_Btn' + keywordindex).attr("hidden", true)
    $('#keywords_list_cancel_edit_Btn' + keywordindex).attr("hidden", false)
    $('#keywords_list_save_edit_Btn' + keywordindex).attr("hidden", false)
}
function cancel_edit_keyword(keywordindex){
    var e = document.getElementById("sel_subfield");
    var field_val = e.options[e.selectedIndex].value;
    var origin_keyword = group_data.fields[field_val].keywords[keywordindex]    //編輯前的關鍵字

    $('#keyword' + keywordindex).val(origin_keyword)
    $('#keyword' + keywordindex).attr("disabled", true)
    $('#keywords_list_edit_Btn' + keywordindex).attr("hidden", false)
    $('#keywords_list_cancel_edit_Btn' + keywordindex).attr("hidden", true)
    $('#keywords_list_save_edit_Btn' + keywordindex).attr("hidden", true)
}
function add_keyword() {
    var group_val = $("#sel_group").val();//目前選中的組別
    var field_val = $("#sel_subfield").val();//目前選中的次領域
    var new_keyword = document.getElementById("new_keyword").value.trim();
    if (new_keyword.trim() != "") {
        if(Array.from(group_data.fields[field_val].keywords).includes(new_keyword) ){ //新增的關鍵字已經在列表中
            Swal.fire({
                icon: "warning",
                title: "該主要關鍵字已存在於列表中",
                showConfirmButton: true,
            })
        }
        else{
            $.ajax({
                type: "POST",
                url: "../addFieldKeyword",
                data: { 
                    keyword_type:"主要關鍵字",
                    group: group_val,
                    field: field_val,
                    new_keyword:new_keyword
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "新增成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        $("#new_keyword").val("");
                        reload("keyword_list",$("#keywords_list").prop('scrollHeight'));
                    });
                },
                error: function (response) {
                    show_error_message(response,"新增關鍵字失敗")
                },
            });
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "請輸入欲新增的關鍵字",
            showConfirmButton: true,
        })
    }
}
function edit_keyword(keywordindex) {
    var group_val = $("#sel_group").val();//目前選中的組別
    var field_val = $("#sel_subfield").val();//目前選中的次領域
    var old_keyword = Array.from(group_data.fields[field_val].keywords)[keywordindex]//編輯前的關鍵字
    var edited_keyword = $('#keyword' + keywordindex)[0].value.trim();  //編輯後的關鍵字
    if (edited_keyword != "") {
        let same_idx = exist_same_keyword_url(edited_keyword,Array.from(group_data.fields[field_val].keywords))
        if(same_idx != -999 && same_idx != keywordindex){ //編輯後的關鍵字已經在列表中
            Swal.fire({
                icon: "warning",
                title: "該主要關鍵字已存在於列表中",
                showConfirmButton: true,
            })
        }
        else{
            $.ajax({
                type: "POST",
                url: "../editFieldKeyword",
                data: { 
                    keyword_type:"主要關鍵字",
                    group: group_val,
                    field: field_val,
                    old_keyword_index:keywordindex,
                    old_keyword:old_keyword,
                    new_keyword:edited_keyword,
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    
                    group_data.fields[field_val].keywords[keywordindex] = edited_keyword
                    Swal.fire({
                        icon: "success",
                        title: "編輯成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload("keyword_list",$("#keywords_list").prop('scrollTop'));
                    });
                },
                error: function (response) {
                    show_error_message(response,"編輯關鍵字失敗")
                },
            });
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "編輯後的關鍵字不得為空",
            showConfirmButton: true,
        })
    }
}
function delete_keyword(keywordindex) {
    Swal.fire({
        title: "確定刪除此關鍵字?",
        text: "此關鍵字將從關鍵字列表及設定檔資料庫刪除 ，您無法恢復此操作",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then((result) => {
        if (result.isConfirmed) {
            var group_val = $("#sel_group").val();//目前選中的組別
            var field_val = $("#sel_subfield").val();//目前選中的次領域
            var keyword_will_be_deleted = Array.from(group_data.fields[field_val].keywords)[keywordindex]
            $.ajax({
                type: "POST",
                url: "../deleteFieldKeyword",
                data: { 
                    keyword_type:"主要關鍵字",
                    group: group_val,
                    field: field_val,
                    keyword:keyword_will_be_deleted
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    group_data.fields[field_val].keywords.splice(keywordindex, 1)
                    reload("keyword_list",$("#keywords_list").prop('scrollTop'))
                    Swal.fire({
                        icon: "success",
                        title: "刪除成功",
                        text:  "已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload("keyword_list",$("#keywords_list").prop('scrollTop'));
                    });
                },
                error: function (response) {
                    show_error_message(response,"刪除關鍵字失敗")
                },
            });
        }
    });
}


/*****編輯輔助關鍵字列表相關*****/
//打開新增/編輯輔助關鍵字的視窗時觸發的事件
function open_add_or_edit_mkw_window(action = "",mkw = "",keywordindex = -999){
    if (action == "add"){//新增輔助關鍵字的視窗
        $("#add-or-edit-mkw-window-title").html("新增輔助關鍵字");
        $("#new_multiple_keyword").val("");
        $("#add-new-multiple-keyword-window-ok-btn").removeAttr('hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").attr("onclick","");
    }
    else if(action == "edit"){//編輯輔助關鍵字的視窗
        $("#add-or-edit-mkw-window-title").html("編輯輔助關鍵字");
        $("#new_multiple_keyword").val(mkw);
        $("#add-new-multiple-keyword-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").removeAttr('hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").attr("onclick","edit_multiple_keyword("+keywordindex+");");
    }
    else{//發生錯誤
        $("#add-or-edit-mkw-window-title").html("");
        $("#new_multiple_keyword").html("");
        $("#add-new-multiple-keyword-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").attr('hidden', 'hidden');
        $("#edit-new-multiple-keyword-window-ok-btn").attr("onclick","");
    }
}
//新增或編輯輔助關鍵字時，把一個關鍵字加進輔助關鍵字中（輔助關鍵字可包含一至多個關鍵字）
function insert_keyword_to_new_multiple_keyword(){
    var a_keyword = $("#a-keyword-in-multiple-keyword").val().trim();
    var new_multiple_keywords = $("#new_multiple_keyword").val();
    if (a_keyword != ""){
        $("#a-keyword-in-multiple-keyword").val("");
        if (new_multiple_keywords != "" && !(new_multiple_keywords.trim() === "")){
            $("#new_multiple_keyword").val(new_multiple_keywords.trim() + ";" + a_keyword);
        }
        else{
            $("#new_multiple_keyword").val(a_keyword.trim());
        }
    }
}
//檢查新增或修改後的輔助關鍵字(mkw)是否已存在於輔助關鍵字列表(mkw_list)中，有的話回傳該關鍵字於列表的index
function new_mkw_is_in_the_mkw_list(mkw,mkw_list){
    for(let i = 0; i < mkw_list.length; i++){
        if(mkw_list[i].length == mkw.length){
            var is_in_the_list = true;
            for(let j = 0; j < mkw_list[i].length; j++){
                if(mkw_list[i][j] != mkw[j]){
                    is_in_the_list = false;
                    break;
                }
            }
            if (is_in_the_list){
                return i;
            }
        }
    }
    return -999;
}

function add_multiple_keyword(){
    var group_val = $("#sel_group").val();//目前選中的組別
    var field_val = $("#sel_subfield").val();//目前選中的次領域
    var new_multiple_keyword = document.getElementById("new_multiple_keyword").value.trim();
    if (new_multiple_keyword != "") {
        new_multiple_keyword = new_multiple_keyword.split(";").filter(item => item !== ""); //將管理者輸入的以逗號分隔的輔助關鍵字轉成array，並刪除多餘逗號
        for(let k=0;k<new_multiple_keyword.length;k++){
            new_multiple_keyword[k] = new_multiple_keyword[k].trim() //輔助關鍵字中的每個關鍵詞去除頭尾多餘空白
        }
        var old_multiple_keywords = Array.from(group_data.fields[field_val].multiple_keywords)
        if(new_mkw_is_in_the_mkw_list(new_multiple_keyword,old_multiple_keywords) != -999){ //新增的關鍵字已經在列表中
            Swal.fire({
                icon: "warning",
                title: "該輔助關鍵字已存在於列表中",
                showConfirmButton: true,
            })
        }
        else{
            $.ajax({
                type: "POST",
                url: "../addFieldKeyword",
                data: { 
                    keyword_type:"輔助關鍵字",
                    group: group_val,
                    field: field_val,
                    new_keyword:JSON.stringify(new_multiple_keyword)
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "新增成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload("multiple_keywords_list",$("#multiple_keywords_list").prop('scrollHeight'));
                    });
                    document.getElementById("new_multiple_keyword").value = ""
                },
                error: function (response) {
                    show_error_message(response,"新增關鍵字失敗")
                },
            });
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "請輸入欲新增的關鍵字",
            showConfirmButton: true,
        })
    }
}
function edit_multiple_keyword(keywordindex){
    var group_val = $("#sel_group").val();//目前選中的組別
    var field_val = $("#sel_subfield").val();//目前選中的次領域
    var new_multiple_keyword = document.getElementById("new_multiple_keyword").value.trim();
    if (new_multiple_keyword != "") {
        new_multiple_keyword = new_multiple_keyword.split(";").filter(item => item !== ""); //將管理者輸入的以逗號分隔的輔助關鍵字轉成array，並刪除多餘逗號
        for(let k=0;k<new_multiple_keyword.length;k++){
            new_multiple_keyword[k] = new_multiple_keyword[k].trim() //輔助關鍵字中的每個關鍵詞去除頭尾多餘空白
        }
        console.log(new_multiple_keyword)
        var old_multiple_keywords = Array.from(group_data.fields[field_val].multiple_keywords)
        var index_in_mkw_list = new_mkw_is_in_the_mkw_list(new_multiple_keyword,old_multiple_keywords);
        if(index_in_mkw_list != -999 && index_in_mkw_list != keywordindex){ //編輯後的關鍵字已經在列表中
            Swal.fire({
                icon: "warning",
                title: "該輔助關鍵字已存在於列表中",
                showConfirmButton: true,
            })
        }
        else{
            $.ajax({
                type: "POST",
                url: "../editFieldKeyword",
                data: { 
                    keyword_type:"輔助關鍵字",
                    group: group_val,
                    field: field_val,
                    old_keyword_index:keywordindex,
                    old_keyword:JSON.stringify(old_multiple_keywords[keywordindex]),
                    new_keyword:JSON.stringify(new_multiple_keyword)
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    Swal.fire({
                        icon: "success",
                        title: "編輯成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        $('#add-or-edit-new-multiple-keyword-window').modal('hide');
                        reload("multiple_keywords_list",$("#multiple_keywords_list").prop('scrollTop'));
                    });
                    document.getElementById("new_multiple_keyword").value = ""
                },
                error: function (response) {
                    show_error_message(response,"編輯關鍵字失敗")
                },
            });
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "編輯後的關鍵字不得為空",
            showConfirmButton: true,
        })
    }
}
function delete_multiple_keyword(keywordindex) {
    Swal.fire({
        title: "確定刪除此關鍵字?",
        text: "此關鍵字將從關鍵字列表及設定檔資料庫刪除，您無法恢復此操作",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then((result) => {
        if (result.isConfirmed) {
            var group_val = $("#sel_group").val();//目前選中的組別
            var field_val = $("#sel_subfield").val();//目前選中的次領域
            var keyword_will_be_deleted = Array.from(group_data.fields[field_val].multiple_keywords)[keywordindex]
            $.ajax({
                type: "POST",
                url: "../deleteFieldKeyword",
                data: { 
                    keyword_type:"輔助關鍵字",
                    group: group_val,
                    field: field_val,
                    keyword:JSON.stringify(keyword_will_be_deleted)
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    group_data.fields[field_val].multiple_keywords.splice(keywordindex, 1)
                    Swal.fire({
                        icon: "success",
                        title: "刪除成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload("multiple_keywords_list",$("#multiple_keywords_list").prop('scrollTop'));
                    });
                },
                error: function (response) {
                    show_error_message(response,"刪除關鍵字失敗")
                },
            });
        }
    });
}


/*****編輯網站列表相關*****/
//新增or編輯網站後，檢查網站列表(sites_obj)中是否已有相同網址存在，有的話回傳該網址於列表的index
function exist_same_site_url(new_site_url,sites_obj){
    for(let i=0;i<sites_obj.length;i++){
        if(sites_obj[i]['site'] == new_site_url){
            return i;
        }
    }
    return -999;// -999是隨便設的數字，代表網址不存在
}
function site_editable(web_listindex) {
    $('#web-list-web' + web_listindex).attr("disabled", false)
    $('#web-list-site' + web_listindex).attr("disabled", false)
    $('#web-list-titleCSS' + web_listindex).attr("disabled", false)
    $('#web-list-contentCSS' + web_listindex).attr("disabled", false)
    $('#web-list-twitter-url' + web_listindex).attr("disabled", false)
    $('#web-list-twitter-username' + web_listindex).attr("disabled", false)
    $('#web_list_edit_Btn' + web_listindex).attr("hidden", true)
    $('#web_list_cancel_edit_Btn' + web_listindex).attr("hidden", false)
    $('#web_list_save_edit_Btn' + web_listindex).attr("hidden", false)
}
function cancel_edit_site(web_listindex){
    var e = document.getElementById("sel_subfield");
    var field_val = e.options[e.selectedIndex].value;
    var origin_site_obj = group_data.fields[field_val].sites[web_listindex] //網站編輯前的資料

    $('#web-list-web' + web_listindex).val(origin_site_obj['site_name'])
    $('#web-list-site' + web_listindex).val(origin_site_obj['site'])
    $('#web-list-titleCSS' + web_listindex).val(origin_site_obj['title_css'])
    $('#web-list-contentCSS' + web_listindex).val(origin_site_obj['content_css'])
    try{
        $('#web-list-twitter-username' + web_listindex).val(origin_site_obj['twitter_id'].match(regex_for_twitter_username)[1])
    }catch(error){
        $('#web-list-twitter-username' + web_listindex).val("")
    }
    $('#web-list-web' + web_listindex).attr("disabled", true)
    $('#web-list-site' + web_listindex).attr("disabled", true)
    $('#web-list-titleCSS' + web_listindex).attr("disabled", true)
    $('#web-list-contentCSS' + web_listindex).attr("disabled", true)
    $('#web-list-twitter-url' + web_listindex).attr("disabled", true)
    $('#web-list-twitter-username' + web_listindex).attr("disabled", true)
    $('#web_list_edit_Btn' + web_listindex).attr("hidden", false)
    $('#web_list_cancel_edit_Btn' + web_listindex).attr("hidden", true)
    $('#web_list_save_edit_Btn' + web_listindex).attr("hidden", true)
}
function add_or_edit_site(action = "",web_listindex = -1) {
    var group_val = $("#sel_group").val();//目前選中的組別
    var field_val = $("#sel_subfield").val();//目前選中的次領域
    var new_site_name = null
    var new_site_url = null
    var new_site_title_css = null
    var new_site_content_css = null
    var new_site_twitter_username = null
    if(action == "add"){
        new_site_name = document.getElementById("new_site_name").value;
        new_site_url = document.getElementById("new_site_url").value.trim();
        new_site_title_css = document.getElementById("new_site_title_css").value;
        new_site_content_css = document.getElementById("new_site_content_css").value;
        new_site_twitter_username = document.getElementById("new_site_twitter_username").value;
    }
    else if(action == "edit" && web_listindex != -1){
        new_site_name = document.getElementById("web-list-web" + web_listindex).value;
        new_site_url = document.getElementById("web-list-site" + web_listindex).value.trim();
        new_site_title_css = document.getElementById("web-list-titleCSS" + web_listindex).value;
        new_site_content_css = document.getElementById("web-list-contentCSS" + web_listindex).value;
        new_site_twitter_username = document.getElementById("web-list-twitter-username" + web_listindex).value;
    }
    else{
        return;
    }
    if (new_site_url != "") { //網址不能為空
        var old_sites = Array.from(group_data.fields[field_val].sites)
        var exist_idx = exist_same_site_url(new_site_url,old_sites)
        if(exist_idx != -999 && (action == "add" || (action == "edit" && exist_idx != web_listindex))){ //網站網址已經在列表中
            Swal.fire({
                icon: "warning",
                title: "該網站的網址已存在於列表中",
                showConfirmButton: true,
            })
        }
        else{   
            Swal.fire({
                title: "資料更新中...",
                html: "請稍後...",
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            if(new_site_twitter_username.trim() == ""){
                new_site_twitter_username = "empty" //管理員沒輸入twitter username,跳過查找twitter id
            }
            $.ajax({
                type: "POST",
                url: "../getTwitterID",
                data: { 
                    group:group_val,
                    twitter_username: new_site_twitter_username
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    var twitter_id_write_to_config = null 
                    if (response['twitter_id'] != null){
                        //以「@{username}&{id}」的格式寫入設定檔
                        twitter_id_write_to_config = "@" + new_site_twitter_username + "&" + response['twitter_id']   
                    }
                    var new_site_obj_write_to_config = {
                        'site_name': new_site_name,
                        'site': new_site_url,
                        'title_css': new_site_title_css,
                        'content_css': new_site_content_css,
                        'twitter_url':"https://twitter.com/" + new_site_twitter_username,
                        'twitter_id':twitter_id_write_to_config
                    }

                    //更新設定檔資料庫
                    if(action == "add"){
                        $.ajax({
                            type: "POST",
                            url: "../addFieldSite",
                            data: { 
                                group: group_val,
                                field: field_val,
                                new_site:JSON.stringify(new_site_obj_write_to_config)
                            },
                            dataType: "json",
                            headers: {
                                Authorization: "Bearer " + AICS_AUTH,
                            },
                            success: function (response) {
                                Swal.fire({
                                    icon: "success",
                                    title: "新增成功",
                                    text:"已更新至資料庫",
                                    showConfirmButton:false,
                                    timer: 1000
                                }).then(() => {
                                    reload("web_list",$("#web_list").prop('scrollHeight'));
                                });
                                document.getElementById("new_site_name").value = ""
                                document.getElementById("new_site_url").value = ""
                                document.getElementById("new_site_title_css").value = ""
                                document.getElementById("new_site_content_css").value = ""
                                document.getElementById("new_site_twitter_username").value = ""
                            },
                            error: function (response) {
                                show_error_message(response,"新增網站失敗")
                            },
                        }); 
                    }
                    else if(action == "edit" && web_listindex != -1){
                        $.ajax({
                            type: "POST",
                            url: "../editFieldSite",
                            data: { 
                                group: group_val,
                                field: field_val,
                                old_site_index:web_listindex,
                                old_site:JSON.stringify(old_sites[web_listindex]),
                                new_site:JSON.stringify(new_site_obj_write_to_config)
                            },
                            dataType: "json",
                            headers: {
                                Authorization: "Bearer " + AICS_AUTH,
                            },
                            success: function (response) {
                                Swal.fire({
                                    icon: "success",
                                    title: "編輯成功",
                                    text:"已更新至資料庫",
                                    showConfirmButton:false,
                                    timer: 1000
                                }).then(() => {
                                    reload("web_list",$("#web_list").prop('scrollTop'));
                                });
                            },
                            error: function (response) {
                                show_error_message(response,"編輯網站失敗")
                            },
                        });
                    }
                },
                error: function (response) {
                    show_error_message(response,"無法由輸入的Twitter帳號名稱查找Twitter ID")
                },
            });
        }
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "請提供網站的網址",
            showConfirmButton: true,
        })
    }
}
function delete_site(web_listindex) {
    Swal.fire({
        title: "確定刪除此網站?",
        text: "此網站將從網站列表及設定檔資料庫刪除，您無法恢復此操作",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then((result) => {
        if (result.isConfirmed) {
            var group_val = $("#sel_group").val();//目前選中的組別
            var field_val = $("#sel_subfield").val();//目前選中的次領域
            var site_will_be_deleted = Array.from(group_data.fields[field_val].sites)[web_listindex]
            $.ajax({
                type: "POST",
                url: "../deleteFieldSite",
                data: { 
                    group: group_val,
                    field: field_val,
                    site:JSON.stringify(site_will_be_deleted)
                },
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + AICS_AUTH,
                },
                success: function (response) {
                    group_data.fields[field_val].sites.splice(web_listindex, 1)
                    Swal.fire({
                        icon: "success",
                        title: "刪除成功",
                        text:"已更新至資料庫",
                        showConfirmButton:false,
                        timer: 1000
                    }).then(() => {
                        reload("web_list",$("#web_list").prop('scrollTop'));
                    });
                },
                error: function (response) {
                    show_error_message(response,"刪除網站失敗")
                },
            });
        }
    });
}


/*****編輯排序分數相關*****/
function edit_sorting_score_weight(){
    var time_score_weight = parseFloat($("#time_score_weight").val())
    var country_score_weight = parseFloat($("#country_score_weight").val())
    var title_keyword_score_weight = parseFloat($("#title_keyword_score_weight").val())
    var text_keyword_score_weight = parseFloat($("#text_keyword_score_weight").val())
    var popularity_score_weight = parseFloat($("#popularity_score_weight").val())

    //各項分數指標的權重必須是數字且介於0~1之間
    var has_invalid_score_weight = false
    var alert_invalid_html = ''
    alert_invalid_html = '<div style="text-align:right;">'
    if(isNaN(time_score_weight) || time_score_weight < 0 || time_score_weight > 1){
        alert_invalid_html += '<p>「文章發布時間」指標的權重必須是介於0~1之間</p>'
        has_invalid_score_weight = true
    }
    if(isNaN(country_score_weight) || country_score_weight < 0 || country_score_weight > 1){
        alert_invalid_html += '<p>「重要國家」指標的權重必須是介於0~1之間</p>'
        has_invalid_score_weight = true
    }
    if(isNaN(title_keyword_score_weight) || title_keyword_score_weight < 0 || title_keyword_score_weight > 1){
        alert_invalid_html += '<p>「標題關鍵字置信度」指標的權重必須是介於0~1之間</p>'
        has_invalid_score_weight = true
    }
    if(isNaN(text_keyword_score_weight) || text_keyword_score_weight < 0 || text_keyword_score_weight > 1){
        alert_invalid_html += '<p>「內文關鍵字置信度」指標的權重必須是介於0~1之間</p>'
        has_invalid_score_weight = true
    }
    if(isNaN(popularity_score_weight) || popularity_score_weight < 0 || popularity_score_weight > 1){
        alert_invalid_html += '<p>「文章熱門程度」指標的權重必須是介於0~1之間</p>'
        has_invalid_score_weight = true
    }
    alert_invalid_html += '</div>'
    if(has_invalid_score_weight){
        Swal.fire({
            icon:"warning",
            html:alert_invalid_html,
            customClass: 'swal-wide',
            showConfirmButton: true,
        });
        return;
    }

    //至少要有一個指標的權重不為0
    if(time_score_weight == 0 && country_score_weight == 0 && title_keyword_score_weight == 0 && text_keyword_score_weight == 0 && popularity_score_weight == 0){
        Swal.fire({
            icon:"warning",
            html:"<p>必須至少有一個指標的權重不為0</p>",
            showConfirmButton: true,
        });
        return;
    }

    //各項分數指標的權重總和應等於1
    var sum_of_score_weight = float_sum([time_score_weight,country_score_weight,title_keyword_score_weight,text_keyword_score_weight,popularity_score_weight])
    if (sum_of_score_weight == 1){
        //更新到設定檔資料庫
        score_weights_obj = {
            text_keyword: text_keyword_score_weight,
            title_keyword: title_keyword_score_weight,
            time: time_score_weight,
            country: country_score_weight,
            popularity:popularity_score_weight
        }
        var group_val = $("#sel_group").val();
        $.ajax({
            type: "POST",
            url: "../updateSortingScoreWeight",
            data: { 
                group: group_val,
                new_score_weights:JSON.stringify(score_weights_obj)
            },
            dataType: "json",
            headers: {
                Authorization: "Bearer " + AICS_AUTH,
            },
            success: function (response) {
                cancel_edit_sorting_score_weight()
                Swal.fire({
                    icon: "success",
                    title: "編輯成功",
                    text:"已更新至資料庫",
                    showConfirmButton:false,
                    timer: 1000
                }).then(() => {
                    reload();
                });
                select_group()
            },
            error: function (response) {
                show_error_message(response,"編輯排序分數指標權重失敗")
            },
        });
    }
    else{
        Swal.fire({
            icon: "warning",
            title: "各項分數指標的權重總和應等於1",
            html:"<p>目前總和為: <span style='font-weight:bold;'>"+sum_of_score_weight+"</span></p>",
            showConfirmButton: true,
        })
    }
}
function sorting_score_weight_editable(){
    $("button.score-weight-minus-btn").attr("hidden", false);
    $("button.score-weight-plus-btn").attr("hidden", false);

    $("#edit_sorting_score_weight_btn_div").attr("hidden", true)
    $("#empty_div_for_score_weight_btn").attr("hidden", true)
    $("#save_sorting_score_weight_btn_div").attr("hidden", false)
}
function cancel_edit_sorting_score_weight(){
    $("button.score-weight-minus-btn").attr("hidden", true);
    $("button.score-weight-plus-btn").attr("hidden", true);

    $("#edit_sorting_score_weight_btn_div").attr("hidden", false)
    $("#empty_div_for_score_weight_btn").attr("hidden", false)
    $("#save_sorting_score_weight_btn_div").attr("hidden", true)
}

/*****左側功能選單*****/
//選中任一功能時，先關閉其他功能的畫面
function close_all_page(){
    scroll_to_top(0);
    $("#content-detail-title-container").attr("hidden",true);
    $("#sel_group_block").attr("hidden",true);
    $("#sel_subfield_block").attr("hidden",true);
    $("#user-account-management-page").attr("hidden",true);
    $("#group-and-field-management-page").attr("hidden",true);
    $("#keyword-and-site-management-page").attr("hidden",true);
    $("#sorting-score-setting-page").attr("hidden",true);
    $('#content-detail-title_tips').off('click');
    //$("#Crawler-schedule-setting-page").attr("hidden",true); TODO
}
//顯示帳號管理畫面
function show_account_management_page(){
    close_all_page();
    $("#content-detail-title").html("使用者帳號管理");
    $("#content-detail-title-container").attr("hidden",false);
    $("#user-account-management-page").attr("hidden",false);
    $('#content-detail-title_tips').on('click', function () {
        page_title_explain('account_management');
    });
}

//顯示關鍵字管理畫面
function show_keyword_management_page(){
    close_all_page();
    $("#content-detail-title").html("關鍵字清單管理");
    $("#content-detail-title-container").attr("hidden",false);
    $("#sel_group_block").attr("hidden",false);
    $("#sel_subfield_block").attr("hidden",false);
    $("#keyword-and-site-management-page").attr("hidden",false);
    $("#keyword-management-page").attr("hidden",false);
    $("#site-management-page").attr("hidden",true);
    $('#content-detail-title_tips').on('click', function () {
        page_title_explain('keyword_management');
    });
}
//顯示網站管理畫面
function show_site_management_page(){
    close_all_page();
    $("#content-detail-title").html("網站清單管理");
    $("#content-detail-title-container").attr("hidden",false);
    $("#sel_group_block").attr("hidden",false);
    $("#sel_subfield_block").attr("hidden",false);
    $("#keyword-and-site-management-page").attr("hidden",false);
    $("#keyword-management-page").attr("hidden",true);
    $("#site-management-page").attr("hidden",false);
    $('#content-detail-title_tips').on('click', function () {
        page_title_explain('site_management');
    });
}
//顯示排序分數設定畫面
function show_sorting_score_setting_page(){
    close_all_page();
    $("#content-detail-title").html("資料排序分數設定");
    $("#content-detail-title-container").attr("hidden",false);
    $("#sel_group_block").attr("hidden",false);
    $("#sorting-score-setting-page").attr("hidden",false);
    $('#content-detail-title_tips').on('click', function () {
        page_title_explain('sorting_score_setting');
    });
}
//顯示爬蟲時間排程設定畫面(TODO)
// function show_crawler_schedule_setting_page(){
//     close_all_page();
//     $("#content-detail-title").html("爬蟲時間排程設定");
//     $("#content-detail-title-container").attr("hidden",false);
//     $("#Crawler-schedule-setting-page").attr("hidden",false);
// }

/*****問號說明*****/
function page_title_explain(pagename){
    switch (pagename) {
        case 'account_management': //帳號管理畫面
            Swal.fire({
                title: "使用者帳號管理",
                html:   '<div>'+
                            '<div>'+
                                '<p style="font-weight:bold">管理已註冊的帳號</p>'+
                                '<ul align="left">'+
                                    '<p style="margin-left:-20px">可對管理權限範圍內的已註冊帳號進行下列操作</p>'+
                                    '<li>更改帳號的管理權限（身分），可將帳號的權限等級最多提高到與自己一樣的等級</li>'+                             
                                    '<li>允許/禁止帳號使用本系統</li>'+
                                    '<li>刪除帳號</li>'+                           
                                '</ul>'+
                            '</div>'+
                            '<hr>'+
                            '<div>'+
                                '<p style="font-weight:bold;">註冊白名單</p>'+
                                '<ul align="left">'+
                                    '<p style="margin-left:-20px">信箱必須在註冊白名單內才能進行註冊，註冊白名單\n由每位管理者共同管理，可進行下列操作</p>'+
                                    '<li>加入信箱至白名單</li>'+  
                                    '<li>編輯白名單</li>'+
                                    '<li>從白名單刪除信箱</li>'+                           
                                '</ul>'+
                            '</div>'+
                        '</div>'
            });
            break;
        case 'keyword_management': //關鍵字管理畫面
            Swal.fire({
                title: "關鍵字清單管理",
                html:   '<div>'+
                            '<ul align="left">'+
                                '<li style="padding-bottom: 8px;">關鍵字分為"主要關鍵字"與"輔助關鍵字"</li>'+  
                                '<li style="padding-bottom: 8px;">主要關鍵字為一個詞，對應到關鍵字清單excel中B欄的關鍵字</li>'+
                                '<li style="padding-bottom: 8px;">輔助關鍵字為一或多個詞組成的詞組，對應到關鍵字清單excel中需同時存在且用分號隔開的C欄關鍵字</li>'+       
                                '<li style="padding-bottom: 8px;">首先選中特定的組別、次領域，接著便可在下方區塊新增關鍵字至系統中，或修改、刪除已加入至系統的關鍵字</li>'+                      
                            '</ul>'+
                            '<p style="font-weight:bold"></p>'+
                        '</div>'
            });
            break;
        case 'site_management': //網站管理畫面
            Swal.fire({
                title: "網站清單管理",
                html:   '<div>'+
                            '<ul align="left">'+
                                '<li style="padding-bottom: 8px;">首先選中特定的組別、次領域，接著便可在下方區塊新增網站至系統中，或修改、刪除已加入至系統的網站</li>'+  
                                '<li style="padding-bottom: 8px;">每個網站除了網站名稱及網址，還包含能增加爬蟲效果的CSS規則與官方Twitter資訊，詳細說明可<a href="管理員新增網站流程.pdf"  target="_blank">點此</a>查看</li>'+   
                                '<li style="padding-bottom: 8px;"><a href="管理員新增網站流程.pdf"  target="_blank">點此</a>可查看新增網站的詳細步驟</li>'+
                                '<li style="padding-bottom: 8px;">此外也可利用下方的CSS檢測工具，以檢測系統是否能成功爬取到指定網站的文章內容，詳細說明請點選「CSS檢測工具」標題旁的問號按鈕查看</li>'+                          
                            '</ul>'+
                            '<p style="font-weight:bold"></p>'+
                        '</div>'
            });
            break;
        case 'sorting_score_setting': //排序分數設定畫面
            Swal.fire({
                title: "資料排序分數設定",
                html:   '<div>'+
                            '<ul align="left">'+
                                '<li style="padding-bottom: 8px;">系統對主畫面中的每筆資料預設以評分進行排序，該評分由下方表格中的幾項指標的分數加權平均而得</li>'+  
                                '<li style="padding-bottom: 8px;">每個組別分別能設定不同的排序分數權重</li>'+
                                '<li style="padding-bottom: 8px;">可於下方選中一個組別，於表格修改該組別各項分數指標之權重大小，系統於每日爬蟲完畢時會根據新的設定重算每筆資料的排序分數。</li>'+                           
                            '</ul>'+
                            '<p style="font-weight:bold"></p>'+
                        '</div>'
            });
            break;
    }
}
function explain_multi() {
    Swal.fire('按住SHIFT點選可以選擇連續範圍內的次領域 按住Ctrl點選可以選擇不連續的多個次領域')
}
function explain_keywords() {
    Swal.fire('選中的次領域下的主要關鍵字列表，可直接在列表內編輯或刪除關鍵字。')
}
function explain_multiple_keywords() {
    Swal.fire('選中的次領域下的輔助關鍵字列表，可直接在列表內編輯或刪除關鍵字。')
}
function explain_web() {
    Swal.fire('1.選中的次領域下的網站列表，可直接在列表內編輯或刪除網站')
}
function explain_add_web(){
    Swal.fire('為目前選中的次領域新增網站，新增成功後將加入至系統設定檔，並顯示在網站列表<br><a href="管理員新增網站流程.pdf"  target="_blank" class="btn btn-link" role="button">點此查看新增網站操作說明</a>')
}
function explain_add_keyword(){
    Swal.fire('為目前選中的次領域新增主要關鍵字，新增成功後將顯示在主要關鍵字列表')
}
function explain_add_multiple_keyword(){
    Swal.fire('為目前選中的次領域新增輔助關鍵字，新增成功後將顯示在輔助關鍵字列表')
}
function explain_add_multiple_keyword_in_window(){
    Swal.fire('一個輔助關鍵字包含一或多個詞，若包含多個詞時，每個詞中間以「;」隔開\n（例如：Building;Energy;Label）\n，也可於左側輸入框中，每輸入一個詞後按下APPEND按鈕。')
}
function explain_css_checker(){
    Swal.fire('此工具可檢測系統能否成功從網頁擷取到文章內容，幫助管理者新增或修改網站時填入有效的CSS規則。<br><a href="CSS檢測工具流程.pdf"  target="_blank" class="btn btn-link" role="button">點此查看CSS檢測工具操作說明</a>')
}
function explain_css() {
    Swal.fire('若能提供該網站文章內容的相關CSS規則，即可幫助系統透過CSS工具擷取到文章的標題與內文。\n\n可點選新增網站標題旁的操作說明連結查看填寫CSS規則的方法及步驟。')
}
function explain_twitter() {
    Swal.fire('由於系統部分資料來源為網站官方Twitter的推文，因此若能提供官方Twitter帳號的名稱，則系統可爬到該網站於twitter發布的文章。\n\n可點選新增網站標題旁的操作說明連結查看填寫Twitter帳號的方法及步驟。')
}
function explain_score_weight(weight_name){
    switch (weight_name) {
        case 'score_weight_title': //「權重」欄位說明
            Swal.fire('各項指標的權重請介於0~1之間，且所有指標權重總和應等於1。');
            break;
        case 'time': //文章發布時間
            Swal.fire('此指標之分數依據[文章發布的時間]與[使用者查閱當下的時間]的間隔計算而得。');
            break;
        case 'country': //重要國家指標 
            Swal.fire('此指標之分數依據文章中是否有提到設定檔中的重要國家而定。');
            break;
        case 'title_keyword': //標題關鍵字置信度 
            Swal.fire('此指標之分數依據文章標題是否包含已出現在文章中的關鍵字而定。');
            break;
        case 'text_keyword': //內文關鍵字置信度
            Swal.fire('此指標之分數依據文章中包含關鍵字的符合程度而定。');
            break;
        case 'popularity': //文章熱門程度
            Swal.fire('此指標之分數依據文章的蒐集來源有以下幾種計算方式。\n\n1.Twitter文章：\n依據文章在Twitter平台中獲得的按讚數、留言數、轉發數、引用數總和而定。\n\n2.google alerts文章：\n所有Twitter文章的平均分。');
            break;
    }
}


/*****其他*****/
//回畫面頂部
function scroll_to_top(delay){
    $("html, body").animate({scrollTop: 0},delay)
}

//小數陣列加法總和(避免精度錯誤問題)
function float_sum(numlist,decimal=7) {
    //decimal是四捨五入到小數點第幾位
    var factor = Math.pow(10, decimal);
    for(let i=0;i<numlist.length;i++){
        numlist[i] = Math.round(numlist[i] * factor)
        console.log(numlist[i])
    }
    var sum = 0
    for(let i=0;i<numlist.length;i++){
        sum += numlist[i]
    }
    console.log(Math.round(sum) / factor)
    return (Math.round(sum) / factor);
}

//不刷新畫面，重新載入資料
function reload(scrollList = "",scrollTo = 0){
    //獲取管理員資料，接著獲取組別、次領域資料
    get_admin_data(scrollList,scrollTo)
}


