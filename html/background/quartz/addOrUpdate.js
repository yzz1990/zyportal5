/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */


var $form_addOrUpdate;
var newJqueryValidate;

var $jobgroup;
var $jobname;
var $jobSelData;

(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();

    $form_addOrUpdate=$('#form_addOrUpdate');


    $('#btn_cronget').click(function(){
        window.open('background/quartz/cron/cron.html');
    });

    validateElement($form_addOrUpdate);


})();


function initSelectpicker(oldData){
    $jobgroup=$('#jobgroup');
    $jobname=$('#jobname');

    $jobgroup.append('<option value="">请选择</option>');
    $jobname.append('<option value="">请选择</option>');
    $jobgroup.selectpicker({});
    $jobname.selectpicker({});

    $jobname.on('changed.bs.select', function (e) {
        var $jname=$jobname.selectpicker('val');
        var $snameObj=$("select#jobname option[value='"+$jname+"']");//选中任务对象
        var $sname=$snameObj.text();//显示的任务名
        $('#jobshowname').val($sname);
    });

    getData('post',
        '/Code/SystemCode/selectTask',
        null,
        'json',
        function(data){
            // console.log(data);
            $jobSelData=data;
            //加载组下拉
            for(var i=0;i<$jobSelData.length;i++){
                $jobgroup.append('<option value="'+$jobSelData[i].groupid+'">'+$jobSelData[i].groupName+'</option>');
            }
            $jobgroup.selectpicker('refresh');

            if(oldData){
                var groupid=oldData.groupid;
                //联动任务下拉
                $jobname.empty();
                $jobname.append('<option value="">请选择</option>');
                if(groupid && groupid!=''){
                    for(var i=0;i<$jobSelData.length;i++){
                        if($jobSelData[i].groupid == groupid){
                            var childData=$jobSelData[i].child;
                            for(var j=0;j<childData.length;j++){
                                var type=childData[j].type;
                                var typeData=childData[j].typedata;
                                if('class'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobname.append('<option value="'+typeData[k].codeMyid+'" jobype="class">'+typeData[k].name+'</option>');
                                    }
                                }
                                if('bean'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobname.append('<option value="'+typeData[k].codeMyid+'" jobype="bean" jobmethod="'+typeData[k].description+'">'+typeData[k].name+'</option>');
                                    }
                                }
                            }
                        }
                    }
                }
                $jobname.selectpicker('val',oldData.jobname);
                $jobgroup.selectpicker('val',groupid);

                $('#jobgroup').attr('disabled','disabled');
                $('#jobname').attr('disabled','disabled');

                return;
            }

            $jobgroup.selectpicker({}).on('changed.bs.select', function (e) {
                var groupid=$jobgroup.selectpicker('val');
                //联动任务下拉
                $jobname.empty();
                $jobname.append('<option value="">请选择</option>');
                if(groupid && groupid!=''){
                    for(var i=0;i<$jobSelData.length;i++){
                        if($jobSelData[i].groupid == groupid){
                            var childData=$jobSelData[i].child;
                            for(var j=0;j<childData.length;j++){
                                var type=childData[j].type;
                                var typeData=childData[j].typedata;
                                if('class'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobname.append('<option value="'+typeData[k].codeMyid+'" jobype="class">'+typeData[k].name+'</option>');
                                    }
                                }
                                if('bean'==type.toString().toLowerCase()){
                                    for(var k=0;k<typeData.length;k++){
                                        $jobname.append('<option value="'+typeData[k].codeMyid+'" jobype="bean" jobmethod="'+typeData[k].description+'">'+typeData[k].name+'</option>');
                                    }
                                }
                            }
                        }
                    }
                }

                $jobname.selectpicker('refresh');

            });
        }, function(obj){
            showtoastr("inverse", '下拉列表加载错误');
            return false;
        });




}

function formSubmit($modelObj,type){
    var submitUrl;

    var $jgroupid=$('#jobgroup').selectpicker('val');
    var $jname=$('#jobname').selectpicker('val');

    var $sgnameObj=$("select#jobgroup option[value='"+$jgroupid+"']");//选中的组对象
    var $snameObj=$("select#jobname option[value='"+$jname+"']");//选中任务对象

    var $sgname=$sgnameObj.text();//显示的组名
    var $sname=$snameObj.text();//显示的任务名

    $('#jobgroupname').val($sgname);
    $('#jobshowname').val($sname);

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!需要根据具体  修改bean或class包   为bean时需要指定方法

    var $jobype=$snameObj.attr('jobype');
    $('#jobtype').val($jobype);
    if($jobype=='class'){
        $('#jobusemethod').val('');
    }else if($jobype=='bean'){
        var $jobusemethod=$snameObj.attr('jobmethod');
        $('#jobusemethod').val($jobusemethod);
    }else{
        //其他
    }

    if (newJqueryValidate.jqueryValidForm()) {
        if(type=='add'){
            submitUrl='/quartz/quartzMan/addJob';
        }else if(type=='update'){
            submitUrl='/quartz/quartzMan/updateJob';
        }


        var $data;
        if(type=='update'){
            $("#jobgroup").removeAttr("disabled");
            $("#jobname").removeAttr("disabled");

            $data = $form_addOrUpdate.serialize();

            $('#jobgroup').attr('disabled','disabled');
            $('#jobname').attr('disabled','disabled');
        }else{
            $data = $form_addOrUpdate.serialize();
        }

        getData(
            'post',
            submitUrl,
            $data ,
            'json',
            function (data) {//success
                console.log(data)
                if(data.code=='0'){
                    //页面刷新
                    reloadTableData();
                    if($modelObj){
                        $modelObj.close();//关闭
                    }
                }
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
    // $jobname.selectpicker('val',datas.jobname);
    // $jobgroup.selectpicker('val',datas.groupid);
}

function validateElement($form_obj){
    newJqueryValidate=MyDiyJqueryValidate($form_obj);
    newJqueryValidate.jqueryValidateOption.rules={
        groupname:{
            isSelected:true
        },
        showname:{
            isSelected:true
        },
        cron:{
            required:true,
        }
    };
    newJqueryValidate.jqueryValidate();
}

