/**
 * Created by jisy on 2017/7/19.
 */
var ajaxData={};
var openid;
var wechatid;
var type='text';

var voiceType=['amr'];
var musicType=['mp3'];
var videoType=['mp4', 'mkv', 'avi', 'swf', 'wmv', 'flv', 'rm', 'rmvb'];

var image_pic_filePath;
var mpnews_pic_filePath;
var music_pic_filePath;
var voice_filePath;
var video_filePath;

var image_pic_url;
var mpnews_pic_url;
var music_pic_url;
var voice_url;
var video_url;
var music_url;

var text_editor;
var mpnews_editor;

var fromUser;

$(document).ready(function() {
    $("#c-tab-content").height(clientHeight - 310);
    //reloadDate();
    initgzhselect();
    initupload();
    initeditor();

    $('#touser').selectpicker({});  //初始化

    $('#send').click(function() {
        sendMessage();
    });

});


function initupload(){
    //初始化图片上传
    initFileInputPicture($('#image_pic'), cors+"/file/fileUpload/imageUpload");
    initFileInputPicture($('#mpnews_pic'), cors+"/file/fileUpload/imageUpload");
    initFileInputPicture($('#music_pic'), cors+"/file/fileUpload/imageUpload");

    //初始化文件上传
    initFileInput($('#voice_file'), cors+"/file/fileUpload/fileUpload",voiceType);
    initFileInput($('#video_video'), cors+"/file/fileUpload/fileUpload",videoType);
    initFileInput($('#music_music'), cors+"/file/fileUpload/fileUpload",musicType);
    initFileInput($('#music_hqmusic'), cors+"/file/fileUpload/fileUpload",musicType);

    //初始化图片上传提示图片
    $('#image_image').attr('src',uploadImageUrl);
    $('#mpnews_image').attr('src',uploadImageUrl);
    $('#music_image').attr('src',uploadImageUrl);

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
    if(openid == ''||openid == undefined||wechatid==''){
        showtoastr("inverse", '请选择发送对象！');
        return;
    }
    //获取发送消息类型
    //type = $('.tab-content .active').attr('id');

    getLocalUser();
    ajaxData={};
    ajaxData.touser = openid;
    ajaxData.msgtype = type;
    ajaxData.type = 0;
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
        sendKFMessage(message,ajaxData);

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
                sendKFMessage(message,ajaxData);
            },
            headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });

    }else if(type=='video'){
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
                url:cors+"/WeChatPlatform/kfMessage/getMedia_id",
                datatype:'json',
                type:'post',
                data:{'filePath':video_filePath,'type':type,'weChatId':wechatid},
                success:function(data){
                    var media_id=data.media_id;
                    message += "media_id:'"+media_id+"'}";
                    ajaxData.mediaId = media_id;
                    ajaxData.fileUrl = video_url;
                    sendKFMessage(message,ajaxData);
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        }

        // $.ajax({
        //     async:false,
        //     url:cors+"/WeChatPlatform/kfMessage/getMedia_id",
        //     datatype:'json',
        //     type:'post',
        //     data:{'filePath':video_pic_filePath,'type':'image','weChatId':wechatid},
        //     success:function(data){
        //
        //         var thumb_media_id=data.media_id;
        //         message += "thumb_media_id:"+thumb_media_id+"}";
        //     },
        //     headers: {
        //         "Authorization":"Bearer "+getLocalStorage('token') ,
        //         "Accept":"application/json;charset=UTF-8"
        //     }
        // });
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
                sendKFMessage(message,ajaxData);
            },
            headers: {
                "Authorization":"Bearer "+getLocalStorage('token') ,
                "Accept":"application/json;charset=UTF-8"
            }
        });
    }else if(type=='music'){
        if(music_url == '' || music_url == undefined){
            showtoastr("inverse", '请上传需要发送的音乐！');
            return;
        }
        if(music_pic_filePath == '' || music_pic_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的音乐图片！');
            return;
        }
        var title = $('#music_title').val();
        var description = $('#music_description').val();
        var message = "{title:'"+title+"',";
        message += "description:'"+description+"',";
        message += "musicurl:'"+music_url+"',";
        ajaxData.title = title;
        ajaxData.description = description;
        ajaxData.musicurl = music_url;
        if($("#musicForm").valid()){
            $.ajax({
                url:cors+"/WeChatPlatform/kfMessage/getMedia_id",
                datatype:'json',
                type:'post',
                data:{'filePath':music_pic_filePath,'type':'image','weChatId':wechatid},
                success:function(data){
                    var thumb_media_id=data.media_id;
                    message += "thumb_media_id:'"+thumb_media_id+"'}";
                    ajaxData.mediaId = thumb_media_id;
                    ajaxData.fileUrl = music_pic_url;
                    sendKFMessage(message,ajaxData);
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token') ,
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        }

    }else if(type=='mpnews'){
        if(mpnews_pic_filePath == '' || mpnews_pic_filePath == undefined){
            showtoastr("inverse", '请上传需要发送的封面图片！');
            return;
        }
        var author = $('#mpnews_author').val();
        var title = $('#mpnews_title').val();
        var desc = $('#mpnews_digest').val();
        var content = mpnews_editor.txt.html();
        if(content == '' || content == undefined){
            showtoastr("inverse", '请输入需要发送的内容！');
            return;
        }
        ajaxData.author = author;
        ajaxData.title = title;
        ajaxData.description = desc;
        ajaxData.content = content;
        //type="news";
        // var message ="{articles: [{title:'Happy Day',description:'Is Really A Happy Day',url:'www.baidu.com',picurl:'http://up.qqjia.com/z/face01/face06/facejunyong/junyong04.jpg'}]}";
        // sendKFMessage(message);
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
                    sendKFMessage(message,ajaxData);
                },
                headers: {
                    "Authorization":"Bearer "+getLocalStorage('token'),
                    "Accept":"application/json;charset=UTF-8"
                }
            });
        }

    }else{
        showtoastr("inverse", "请选择发送消息类型！");
        return;
    }
}

function sendKFMessage(message,saveMessage){
    getData(
        'post',
        '/WeChatPlatform//kfMessage/sendMessage',
        {'openid':openid,'msgType':type,'message':message,'weChatId':wechatid},
        'json',
        function (data) {//success
            showtoastr("inverse", data.desc);
            if(data.code=="50071"){
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
        },function(obj){//error
            showtoastr("inverse", '客服消息发送失败！');
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

$("#musicForm").validate({
    rules: {
        music_title: {
            required: true
        },
        music_description:{
            required: true
        },
        music_music:{
            required:true
        }
    }
});

