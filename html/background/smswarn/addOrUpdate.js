/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */
var $form_addOrUpdate;
var newJqueryValidate;

var $jobgroupid;
var $jobcode;
var $jobSelData;

var form_tomans_TagObj;

(function(){    
    $form_addOrUpdate=$('#form_addOrUpdate');
    validateElement($form_addOrUpdate);

    $('#form_tomansDIV').css('width','auto');
    $('#form_tomansDIV').css('height','100px');
    form_tomans_TagObj = $('#form_tomans').tagsInput({width:'auto',height:'100px'});
})();

function initSelectpicker(oldData){
    $jobgroupid=$('#jobgroupid');
    $jobcode=$('#jobcode');

    $jobgroupid.append('<option value="">请选择</option>');
    $jobcode.append('<option value="">请选择</option>');
    $jobgroupid.selectpicker({});
    $jobcode.selectpicker({});

    $jobcode.on('changed.bs.select', function (e) {
        var $jcode=$jobcode.selectpicker('val');
        var $scodeObj=$("select#jobcode option[value='"+$jcode+"']");//选中任务对象
        var $sname=$scodeObj.text();//显示的任务名
        $('#jobname').val($sname);
    });

    getData('post',
        '/Code/SystemCode/selectTask',
        null,
        'json',
        function(data){
            $jobSelData=data;
            //加载组下拉
            for(var i=0;i<$jobSelData.length;i++){
                $jobgroupid.append('<option value="'+$jobSelData[i].groupid+'">'+$jobSelData[i].groupName+'</option>');
            }
            $jobgroupid.selectpicker('refresh');

            if(oldData){
                var groupid=oldData.groupid;                
                //联动任务下拉
                $jobcode.empty();
                $jobcode.append('<option value="">请选择</option>');
                if(groupid && groupid!=''){
                    for(var i=0;i<$jobSelData.length;i++){
                        if($jobSelData[i].groupid == groupid){
                            var childData=$jobSelData[i].child;
                            for(var j=0;j<childData.length;j++){
                                var type=childData[j].type;
                                var typeData=childData[j].typedata;
                                if('class'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobcode.append('<option value="'+typeData[k].codeMyid+'" jobype="class">'+typeData[k].name+'</option>');
                                    }
                                }
                                if('bean'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobcode.append('<option value="'+typeData[k].codeMyid+'" jobype="bean" jobmethod="'+typeData[k].description+'">'+typeData[k].name+'</option>');
                                    }
                                }
                            }
                        }
                    }
                }
                $jobgroupid.selectpicker('val',groupid);
                $jobcode.selectpicker('val',oldData.jobcode);

                $('#jobgroupid').attr('disabled','disabled');
                $('#jobcode').attr('disabled','disabled');
                return;
            }

            $jobgroupid.selectpicker({}).on('changed.bs.select', function (e) {
                var groupid=$jobgroupid.selectpicker('val');
                //联动任务下拉
                $jobcode.empty();
                $jobcode.append('<option value="">请选择</option>');
                if(groupid && groupid!=''){
                    for(var i=0;i<$jobSelData.length;i++){
                        if($jobSelData[i].groupid == groupid){
                            var childData=$jobSelData[i].child;
                            for(var j=0;j<childData.length;j++){
                                var type=childData[j].type;
                                var typeData=childData[j].typedata;
                                if('class'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobcode.append('<option value="'+typeData[k].codeMyid+'" jobype="class">'+typeData[k].name+'</option>');
                                    }
                                }
                                if('bean'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobcode.append('<option value="'+typeData[k].codeMyid+'" jobype="bean" jobmethod="'+typeData[k].description+'">'+typeData[k].name+'</option>');
                                    }
                                }
                            }
                        }
                    }
                }
                $jobcode.selectpicker('refresh');
            });
        }, function(obj){
            showtoastr("inverse", '下拉列表加载错误');
            return false;
        });
}

function formSubmit($modelObj,type){
    var submitUrl;

    var tomans = $("#form_tomans").val().trim();
    if(tomans==""){
        showtoastr("inverse", '请选择或输入预警人员！');
        return false;
    }
    if(tomans.length>1500){
        showtoastr("inverse", '预警人员超出最多人数！');
        return false;
    }

    var $jgroupid=$('#jobgroupid').selectpicker('val');
    var $jcode=$('#jobcode').selectpicker('val');

    var $sgnameObj=$("select#jobgroupid option[value='"+$jgroupid+"']");//选中的组对象
    var $snameObj=$("select#jobcode option[value='"+$jcode+"']");//选中任务对象

    var $sgname=$sgnameObj.text();//显示的组名
    var $sname=$snameObj.text();//显示的任务名

    $('#jobgroupname').val($sgname);
    $('#jobname').val($sname);

    if (newJqueryValidate.jqueryValidForm()) {
        if(type=='add'){
            submitUrl='/sms/warn/addWarn';
        }else if(type=='update'){
            submitUrl='/sms/warn/updateWarn';
        }

        var $data;
        if(type=='update'){
            $("#jobgroupid").removeAttr("disabled");
            $("#jobcode").removeAttr("disabled");

            $data = $form_addOrUpdate.serialize();

            $('#jobgroupid').attr('disabled','disabled');
            $('#jobcode').attr('disabled','disabled');
        }else{
            $data = $form_addOrUpdate.serialize();
        }
        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                // if(data.code=='0'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        $modelObj.close();//关闭
                    }
                // }
                showtoastr("inverse",data.desc);
                return true;
            },function(obj){//error
                showtoastr("inverse", '未知错误');
                return false;
            }
        );
    }
}

//加载表单数据
function initFormDatasQuartzAddEdit(datas){
    dataLoad('#div_container',datas);//普通数据加载
}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        jobgroupname:{
            isSelected:true
        },
        jobname:{
            isSelected:true
        },
        tomans:{
            required:true,
        }
    };
    newJqueryValidate.jqueryValidate();
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
            if(smsorgOpt){
                smsorgOpt.close();
            }
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
