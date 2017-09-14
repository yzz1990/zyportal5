/**
 * Created by Administrator on 2017/7/17 0017.
 */
//平台账号信息systemUser
var $message = $('#char-message');
var $messagecount = $('#mesage-counts');
var mynotify;
var flag = false;
$(function () {
    getData_async(
        'post',
        '/social/getServerInfo',
        null,
        'json',
        function (obj) {
            IM.app_id = obj.app_id;
            IM.init();
            Login();
        }
    );
});

function showmessage(message) {
    $message.css('display', 'block');
    $message.html(message);
}
function Login() {
   IM.userinfo = getUserInfo();
    getData(
        'post',
        '/social/loginSubAccount',
        {userId: IM.userinfo.id},
        'json',
        function (obj) {
            if (obj.code == 0) {
                IM.subAccount = obj.data;
                IM.Do_login(obj.data);
                flag = true;
            } else {
                showmessage('<a style="color: red">&nbsp;账号异常，请联系管理员</a>');
                flag =false;
            }
        }
    );
}
//获取用户列表（从当前平台中获取用户而不是从API中获取用户）
function getContacts() {
    getData(
        'post',
        '/social/getContacts',
        null,
        'json',
        function (obj) {
            listContacts(obj.data);
        }
    )
}
//将获取的用户json显示在页面上
function listContacts(data) {
    var $viewlist = $('#contacts');
    $viewlist.empty();
    var list = '';
    //1
    // var arr = {};
    //2
    var thisurl = '../img/profile-pics/2.jpg';
    if (trim(IM.userinfo.photourl) != '' || typeof (IM.userinfo.photourl) === undefined) {
        thisurl = urlPathPre +IM.userinfo.photourl;
    }
    var self = '<div class="collapsed" id="self">' +
        '<i class="zmdi zmdi-account zmdi-hc-fw"></i>' +
        '<span>自己</span>' +
        // '<a class="lv-item" href="JavaScript:letsChat( '+IM.subAccount+');">'+
        '<a class="lv-item" href="JavaScript:void(0);">' +
        '<div class="media">' +
        '<div class="pull-left p-relative">' +
        '<img class="lv-img-sm"  style="width: 40px;height: 40px" src="' + thisurl + '" alt="' + IM.subAccount.friendlyname + '">' +
        '<i class="chat-status-online"></i>' +
        '</div>' +
        '<div class="media-body">' +
        '<div class="lv-title">' + IM.subAccount.friendlyname + '</div>' +
        '<small class="lv-small">' + IM.subAccount.shuoshuo + '</small>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</div>' +
        '<hr style="margin-top: 5px;margin-bottom: 5px">';
    for (var key in data) {
        var ttl = '<div class="collapsed"><i class="zmdi zmdi-accounts zmdi-hc-fw"></i><span>' + key + '</span>';
        var bdy = data[key];
        $.each(bdy, function (index, cell) {
            //1
            // arr[cell.friendlyname]=cell;
            //2
            IM.contacts.push(cell.account);
            var url = '../img/profile-pics/2.jpg';
            if (trim(cell.photo) != '' || typeof (cell.photo) === undefined) {
                url = urlPathPre +cell.photo;
            }
            var cellString = JSON.stringify(cell);
            cellString = cellString.replace(/"/g, '\'');
            ttl += '<a class="lv-item ' + cell.account + '"style="cursor:pointer" onclick="letsChat(' + cellString + ');" id="' + cell.account + '">' +
                '<div class="media">' +
                '<div class="pull-left p-relative" data-name="' + cell.friendlyname + '">' +
                '<img class="lv-img-sm" style="width: 40px;height: 40px" src="' + url + '" alt="' + cell.friendlyname + '">' +
                '</div>' +
                '<div class="media-body">' +
                '<div class="lv-title">' + cell.friendlyname + '</div>' +
                // '<i class="zmdi zmdi-comment-text zmdi-hc-fw"style="color: red;"></i>'+
                '<small class="lv-small">' + cell.shuoshuo + '</small>' +
                '</div>' +
                '</div>' +
                '</a>';
        });
        ttl += '</div>';
        list += ttl;
    }
    list = self + list;
    $viewlist.append(list);
}
//打开 对话窗口
function letsChat(cell) {
    var dialog = new BootstrapDialog({
        title: "对话-" + cell.friendlyname,
        message: $('<div></div>').load('IM/chatwindow.html'),
        closeByBackdrop: false,//点击遮罩层不会退出
        onshow: function () {//显示前执行
            $('#' + cell.account).find('i').remove();
        },
        onshown: function () {//显示后执行
            IM.initEmoji();
            IM.chat_window = $('[data-window-type="chat"]');
            IM.currentChat = IM.chat_window.find('.chatting .chats');
            IM.chatNickName = IM.chat_window.find('.receiver .name');
            IM.fireMsgWindow = $('#firemsg');
            IM.fireMsgContent = IM.fireMsgWindow.find('.modal-body');
            IM.createP2pChatWindow(cell);
            IM.getChat(cell);
        }
    });
    dialog.open();
}

function seachpeople() {
    if(flag){
        var seachinfo = $('.seachpeople').val();
        getData(
            'post',
            '/social/seachContacts',
            {name: seachinfo},
            'json',
            function (obj) {
                listContacts(obj.data);
            }
        )
    }

}










