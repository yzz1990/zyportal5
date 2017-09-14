/**
 * Created by jisy on 2017/7/19.
 */
var ajaxData={};
var openid;
var wechatid;

var fromUser;

$(document).ready(function() {
    $("#c-tab-content").height(clientHeight - 310);

    initgzhselect();

    $('#touser').selectpicker({});  //初始化

});

function initgzhselect(){
    $('#wxgzh').append('<option value="">请选择公众号</option>');
    getData(
        'post',
        '/WeChatPlatform/AccountDevelopInfo/selectAll',
        null,
        'json',
        function (data) {//success
            if(data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $('#wxgzh').append('<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>');
                }
            }
            $('#wxgzh').selectpicker({});  //初始化
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}

function getWeChatId() {
    wechatid = $("#wxgzh").selectpicker('val');
    if(wechatid==""){
        $('#user').hide();
    }else{
        ajaxData={};
        ajaxData.wechatid = wechatid;
        getData(
            'post',
            '/WeChatPlatform/userManage/selectUsersSubscribed',
            ajaxData,
            'json',
            function (data) {//success
                document.getElementById("touser").options.length=0;
                $('#touser').append('<option value="">请选择发送对象</option>');
                if(data.users.length>0){
                    for(var i=0;i<data.users.length;i++){
                        $('#touser').append('<option value="'+data.users[i].openid+'">'+data.users[i].nickname+'</option>');
                    }
                }
                $('#touser').selectpicker('refresh');  //初始化
                $('#user').show();
            },function(obj){//error
                showtoastr("inverse", '用户列表加载异常');
            }
        );
    }
}

function getUser() {
    openid = $("#touser").selectpicker('val');
}

function sendMessage(){
    var first = $('#first').val();
    var keyword1 = $('#keyword1').val();
    var keyword2 = $('#keyword2').val();
    var keyword3 = $('#keyword3').val();
    var keyword4 = $('#keyword4').val();
    var keyword5 = $('#keyword5').val();
    var remark = $('#remark').val();
    ajaxData={};
    ajaxData.first = {'value':first};
    ajaxData.keyword1 = {'value':keyword1};
    ajaxData.keyword2 = {'value':keyword2};
    ajaxData.keyword3 = {'value':keyword3};
    ajaxData.keyword4 = {'value':keyword4};
    ajaxData.keyword5 = {'value':keyword5};
    ajaxData.remark = {'value':remark};

    getData(
        'post',
        '/WeChatPlatform/templateMessage/sendMessage',
        {'openid':openid,'templateId':'Yl0wiwDaKZ0vcv4CAD3oJ9DVv-TJ9lFiYfV42fuPn4I','data':JSON.stringify(ajaxData),'weChatId':wechatid},
        'json',
        function (data) {//success
            showtoastr('inverse',data.desc);
        },function(obj){//error
            showtoastr("inverse", '公众号列表加载异常');
        }
    );
}