/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */
var form_tomans_TagObj;
(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $(".card").height(clientHeight - 180);

    $("[data-toggle='tooltip']").popover();

    $("#form_deftime").jeDate({
        format:"YYYY-MM-DD hh:mm:ss",
        isinitVal:true
    });

    $('#form_tomansDIV').css('width','auto');
    $('#form_tomansDIV').css('height','100px');
    form_tomans_TagObj = $('#form_tomans').tagsInput({width:'auto',height:'100px'});
})();

//发送短信
function sendSMS(){
    var submitUrl='/sms/record/addRecord';
    //参数
    var userInfo = getUserInfo();
    var fromman = "";
    if(null!=userInfo && userInfo!="null")fromman = userInfo.realname;
    var tomans = $("#form_tomans").val().trim();
    if(tomans==""){
        showtoastr("inverse", '请选择或输入接受人员！');
        return false;
    }
    if(tomans.length>1500){
        showtoastr("inverse", '接受人员超出最多人数！');
        return false;
    }
    var content = $("#form_content").val().trim();
    if(content==""){
        showtoastr("inverse", '请输入短信内容！');
        return false;
    }
    if(content.length>300){
        showtoastr("inverse", '短信内容超出300字！');
        return false;
    }
    var istimed=0;
    var deftime="";
    if($("#form_istimed").is(':checked')) {
        istimed=1;
        deftime=$("#form_deftime").val();
    }
    var $data = {'fromman':fromman,'tomans':tomans,'content':content,'istimed':istimed,'deftime':deftime};
    getData(
        'post',
        submitUrl,
        $data ,
        'json',
        function (data) {
            //success
            showtoastr("inverse",data.desc);
            //清空选择的通讯人员
            clearSelectTomans();
            $("#form_content").val("");
            return true;
        },function(obj){
            //error
            showtoastr("inverse", '未知错误');
            return false;
        }
    );
}

var smsbookOpt;
//弹出通讯录
function openSMSBookModel(){
    smsbookOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "通讯录",
        $('<div></div>').load('background/smssend/smsbook.html'),
        function($dialogParentDiv){//页面显示前
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.65);
            $dialogParentDiv.css('height',clientHeight*0.70);
        },
        function() {//页面显示后
            
        },
        function(){//取消,点关闭按钮
            if(smsbookOpt){
                smsbookOpt.close();
            }
        },
        function(){//确定
            //选定人员
            var selectSMSPeople = select_tomans_TagObj.val();
            var selectSMSPeopleArray = selectSMSPeople.split(",");
            //确认人员
            var formSMSPeople = form_tomans_TagObj.val();
            var formSMSPeopleArray = formSMSPeople.split(",");

            for(var i=0;i<selectSMSPeopleArray.length;i++){
                var tag = selectSMSPeopleArray[i];
                var flag = false;
                for(var j=0;j<formSMSPeopleArray.length;j++){
                    var tag1 = formSMSPeopleArray[j];
                    if(tag==tag1)flag=true;
                }
                if(!flag)form_tomans_TagObj.addTag(tag);
            }
            if(smsbookOpt){
                smsbookOpt.close();
            }
        });
}

var smsorgOpt;
//弹出通讯录
function openSMSOrganizationModel(){    
    smsorgOpt=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "组织机构",
        $('<div></div>').load('background/smssend/smsorganization.html'),
        function(){//页面显示前

        },
        function() {//页面显示后
            
        },
        function(){//取消,点关闭按钮
            if(smsorgOpt){
                smsorgOpt.close();
            }
        },
        function(){//确定
            var selectMans="";
            $("input[name='mycheckbox']").each(function(){
                var id = $(this).attr("id");
                if($(this).is(':checked')){
                    selectMans+=$("#myvalue"+id).val()+",";
                }
            });
            var selectMansArr = selectMans.split(',');
            for(var i=0;i<selectMansArr.length;i++){
                var tag = selectMansArr[i];
                $('#form_tomans').tagEditor('addTag',tag);
            }
            if(smsorgOpt){
                smsorgOpt.close();
            }
        });
}

//清空选择的通讯人员
function clearSelectTomans(){
    var selectSMSPeople = form_tomans_TagObj.val();
    var selectSMSPeopleArray = selectSMSPeople.split(",");
    for(var i=0;i<selectSMSPeopleArray.length;i++){
        var tag = selectSMSPeopleArray[i];
        form_tomans_TagObj.removeTag(tag);
    }
}
