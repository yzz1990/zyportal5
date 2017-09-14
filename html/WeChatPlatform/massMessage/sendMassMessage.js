/**
 * Created by jisy on 2017/7/21.
 */

var ajaxData={};
var openid;
//var openids;
var fromUser;
var tagid;
var wechatid;
var sendType;
var type='text';
var $initFileInputOPtion;
var voiceType=['amr'];//aud
var videoType=['mp4', 'mkv', 'avi', 'swf', 'wmv', 'flv', 'rm', 'rmvb'];

var image_pic_filePath;
var mpnews_pic_filePath;
var voice_filePath;
var video_filePath;

var image_pic_url;
var mpnews_pic_url;
var voice_url;
var video_url;

var text_editor;
var mpnews_editor;


$(document).ready(function() {
    $("#c-tab-content").height(clientHeight - 310);

    initgzhselect();
    initupload();
    initeditor();

    $('#sendType').selectpicker({});  //初始化
    $('#totag').selectpicker({});  //初始化
    //$('#tousers').selectpicker({});  //初始化

    $('#send').click(function() {
        sendMessage();
    });

});

function initupload(){
    //初始化图片上传
    initFileInputPicture($('#image_pic'), cors+"/file/fileUpload/imageUpload");
    initFileInputPicture($('#mpnews_pic'), cors+"/file/fileUpload/imageUpload");

    //初始化文件上传
    initFileInput($('#voice_file'), cors+"/file/fileUpload/fileUpload",voiceType);
    initFileInput($('#video_video'), cors+"/file/fileUpload/fileUpload",videoType);

    //初始化图片上传提示图片
    $('#image_image').attr('src',uploadImageUrl);
    $('#mpnews_image').attr('src',uploadImageUrl);
}


function getWeChatId() {
    wechatid = $("#wxgzh").selectpicker('val');
    if(wechatid==''||wechatid==undefined){
        $('#type').hide();
        $('#tag').hide();
        //$('#users').hide();
    }else {
        $('#type').show();
        getSendObject();
    }
}

function getSendObject() {
    ajaxData={};
    ajaxData.wechatid = wechatid;
    sendType=$('#sendType').selectpicker('val');
    if(sendType==1){
        getData(
            'post',
            '/WeChatPlatform/tagManage/selectAll',
            ajaxData,
            'json',
            function (data) {//success
                document.getElementById("totag").options.length=0;
                if(data.rows.length>0){
                    $('#totag').append("<option value='1'>请选择标签</option>")
                    for(var i=0;i<data.rows.length;i++){
                        $('#totag').append('<option value="'+data.rows[i].tagid+'">'+data.rows[i].tagname+'</option>');
                    }
                }
                $('#totag').selectpicker('refresh');  //初始化
                $('#tag').show();
                //$('#users').hide();
            },function(obj){//error
                showtoastr("inverse", '标签列表加载异常');
            }
        );
    }
    /*else if(sendType==2){
        getData(
            'post',
            '/WeChatPlatform/userManage/selectUsersSubscribed',
            ajaxData,
            'json',
            function (data) {//success
                document.getElementById("tousers").options.length=0;
                if(data.users.length>0){
                    for(var i=0;i<data.users.length;i++){
                        $('#tousers').append('<option value="'+data.users[i].openid+'">'+data.users[i].nickname+'</option>');
                    }
                }
                $('#tousers').selectpicker('refresh');  //初始化
                $('#users').show();
                $('#tag').hide();
            },function(obj){//error
                showtoastr("inverse", '用户列表加载异常');
            }
        );
    }*/
    else{
        $('#tag').hide();
        //$('#users').hide();
    }
}


function sendMessage(){
debugger
    tagid=$('#totag').val();
    /*openids='[';
    var obj = document.getElementById("tousers");
    for(var i=0;i<obj.options.length;i++){
        if(obj.options[i].selected){
            openids+=obj.options[i].value+',';// 收集选中项
        }
    }
    openids=openids.substring(0,openids.length-1);
    if(openids != ''){
        openids+=']'
    }*/
    if(wechatid==''||((tagid == ''||tagid == undefined)/*&&(openids==''||openids==undefined)*/&&sendType!=0)){
        showtoastr("inverse", '请选择发送对象');
        return;
    }
    ajaxData={};
    //ajaxData.touser = openids;
    getLocalUser();
    ajaxData.tagid = tagid;
    ajaxData.msgtype = type;
    ajaxData.type = 1;
    ajaxData.wechatid = wechatid;
    ajaxData.fromuser = fromUser;
    //根据类型拼装消息体
    if(type=='text'){
        var content = text_editor.txt.text();
        if(content == '' || content == undefined){
            showtoastr("inverse", '请输入需要发送的内容！');
            return;
        }
        var message = "{content:'"+content+"'}";
        ajaxData.content = content;
        sendMassMessage(message,ajaxData);
    }else if(type=='image'){
        if(image_pic_filePath == '' || image_pic_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的图片！');
            return;
        }
        $.ajax({
            url:cors+"/WeChatPlatform/kfMessage/getMedia_id",
            datatype:'json',
            type:'post',
            data:{'filePath':image_pic_filePath,'type':type,'weChatId':wechatid},
            success:function(data){
                var media_id=data.media_id;
                var message = "{media_id:'"+media_id+"'}";
                ajaxData.mediaId = media_id;
                ajaxData.fileUrl = image_pic_url;
                sendMassMessage(message,ajaxData);
            },
            headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });

    }else if(type=='mpvideo'){
        if(video_filePath == '' || video_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的视频！');
            return;
        }
        var title = $('#video_title').val();
        var description = $('#video_description').val();
        var message = "{title:'"+title+"',";
        message += "description:'"+description+"',";
        ajaxData.title = title;
        ajaxData.description = description;
        if($("#videoForm").valid()){
            $.ajax({
                async:false,
                url:cors+"/WeChatPlatform/kfMessage/getVedioId",
                datatype:'json',
                type:'post',
                data:{'filePath':video_filePath,'title':title,'description':description,'weChatId':wechatid},
                success:function(data){
                    var media_id=data.videoId;
                    message += "media_id:'"+media_id+"'}";
                    ajaxData.mediaId = media_id;
                    ajaxData.fileUrl = video_url;
                    sendMassMessage(message,ajaxData);
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        }

    }else if(type=='voice'){
        if(voice_filePath == '' || voice_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的语音！');
            return;
        }
        $.ajax({
            url:cors+"/WeChatPlatform/kfMessage/getMedia_id",
            datatype:'json',
            type:'post',
            data:{'filePath':voice_filePath,'type':type,'weChatId':wechatid},
            success:function(data){
                var media_id=data.media_id;
                var message = "{media_id:'"+media_id+"'}";
                ajaxData.mediaId = media_id;
                ajaxData.fileUrl = voice_url;
                sendMassMessage(message,ajaxData);
            },
            headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }else if(type=='mpnews'){
        if(mpnews_pic_filePath == '' || mpnews_pic_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的封面图片！');
            return;
        }
        var author = $('#mpnews_author').val();
        var title = $('#mpnews_title').val();
        var desc = $('#mpnews_digest').val();
        var content = mpnews_editor.txt.html();
        var element = $(content).get(0);
        if(content == '' || content == undefined){
            showtoastr("inverse", '请输入需要发送的内容！');
            return;
        }
        ajaxData.author = author;
        ajaxData.title = title;
        ajaxData.description = desc;
        ajaxData.content = content;
        if($("#mpnewsForm").valid()){
            $.ajax({
                url:cors+"/WeChatPlatform/kfMessage/getMpNewsId",
                datatype:'json',
                type:'post',
                data:{'filePath':mpnews_pic_filePath,'author':author,'title':title,'desc':desc,'content':content,'weChatId':wechatid},
                success:function(data){
                    var media_id = data.mpNewsId;
                    var message = "{media_id:'"+media_id+"'}";
                    ajaxData.mediaId = media_id;
                    ajaxData.fileUrl = mpnews_pic_url;
                    sendMassMessage(message,ajaxData);
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        }
    }else{
        showtoastr("inverse", "请选择发送消息类型！");
        return;
    }
}

function sendMassMessage(message,saveMessage){
    if(sendType==0){
        getData(
            'post',
            '/WeChatPlatform//massMessage/sendMessageToAll',
            {'msgType':type,'message':message,'weChatId':wechatid},
            'json',
            function (data) {//success
                showtoastr("inverse", data.desc);
                if(data.code=="50071"){
                    saveMessage.isToAll = true;
                    saveMassMessage(saveMessage);
                }
            },function(obj){//error
                showtoastr("inverse", '发送失败');
            }
        );
    }else if(sendType==1){
        getData(
            'post',
            '/WeChatPlatform//massMessage/sendMessageByTag',
            {'tagid':tagid,'msgType':type,'message':message,'weChatId':wechatid},
            'json',
            function (data) {//success
                showtoastr("inverse", data.desc);
                if(data.code=="50071"){
                    saveMassMessage(saveMessage);
                }
            },function(obj){//error
                showtoastr("inverse", '发送失败');
            }
        );
    }
    /*else if(sendType==2){
        getData(
            'post',
            '/WeChatPlatform//massMessage/sendMessageByOpenids',
            {'openids':openids,'msgType':type,'message':message,'weChatId':wechatid},
            'json',
            function (data) {//success
                showtoastr("inverse", data.desc);
                if(data.code=="50071"){
                    saveMassMessage(saveMessage);
                }
            },function(obj){//error
                showtoastr("inverse", '发送失败');
            }
        );
    }*/
    else{
        showtoastr("inverse", "发送失败");
        return;
    }
}

function saveMassMessage(saveMessage){
    getData(
        'post',
        '/WeChatPlatform//message/addMessage',
        saveMessage,
        'json',
        function (data) {//success
            showtoastr("inverse", data.desc);
        },function(obj){//error
            showtoastr("inverse", '消息记录保存失败！');
        }
    );
}

$("#mpnewsForm").validate({
    rules: {
        mpnews_title: {
            required: true
        },
        mpnews_author:{
            required: true
        },
        mpnews_digest:{
            required: true
        },
        mpnews_content:{
            required: true
        },
        mpnews_pic:{
            required: true
        }
    }
});

$("#videoForm").validate({
    rules: {
        video_title: {
            required: true
        },
        video_description:{
            required: true
        },
        video_video:{
            required: true
        }
    }
});
