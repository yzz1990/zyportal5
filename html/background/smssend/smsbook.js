var zTreeObj4bk;
var $myzTree4bk=$("#bookTree");
var zTreeObj4org;
var $myzTree4org=$("#orgTree");
var modelName="通讯录";
var select_tomans_TagObj;
$(function(){
    $(".upload").height(clientHeight - 400);

    $('#select_tomansDIV').css('width','auto');
    $('#select_tomansDIV').css('height','100px');
    select_tomans_TagObj = $('#select_tomans').tagsInput({width:'auto',height:'100px'});
    
    creatNode();
    var nodes= zTreeObj4bk.getNodes();
    zTreeObj4bk.selectNode(nodes[0]);
    reloadFiles('all');
})

function creatNode() {
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeOnClick
        }
    };
    getData_async(
        'post',
        '/sms/book/bookTree',
        "",
        'json',
        function (value) {//success
            var zNodes=value.data;
            for (var i=0;i<zNodes.length;i++){
                zNodes[i].open=true;
            }
            zTreeObj4bk = $.fn.zTree.init($myzTree4bk, setting, zNodes);
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    );

    var setting4org = {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeOnClick4org
        }
    };
    getData_async(
        'post',
        '/system/organization/tree',
        "",
        'json',
        function (value) {//success
            var zNodes=value.data;
            for (var i=0;i<zNodes.length;i++){
                zNodes[i].open=true;
            }
            zTreeObj4org = $.fn.zTree.init($myzTree4org, setting4org, zNodes);
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    );
}

function zTreeOnClick(event, treeId, treeNode) {
    reloadFiles();
};

function  reloadFiles() {
    $("#mypeople").html("");
    // var loadHtml='<div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center;width: 80%;margin-left: 10%;" class="filenone">'
    //     +'<i class="zmdi zmdi-bike zmdi-hc-fw"></i>拼命加载中<span class="dotting" style="font-size:30px;font-weight: bold;"></span> </div>';
    // $("#mypeople").append(loadHtml);
    var nodes = zTreeObj4bk .getSelectedNodes();
    var parentId=nodes[0].id;
    getData(
        'post',
        '/sms/man/manList',
        {"bookid":parentId,"pageNumber":1,"pageSize":1000},
        'json',
        function (value) {//success
            var data=value.rows;
            $("#mypeople").html("");
            if(data.length==0){
                var nonehtml=' <div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center">'
                    +'<i class="zmdi zmdi-mood-bad zmdi-hc-fw"></i>该通讯录下没有人员！</div>';
                $("#mypeople").append(nonehtml);
            }else {
                var myhtml='<div class="allpeople-box">'
                    +'<div class="checkbox"><label><input type="checkbox" onchange="selectAllPeople(this,1);"> <i class="input-helper"></i>全选</label></div>'
                    +'</div>';
                for(var i=0;i<data.length;i++){
                    var name=data[i].name;
                    var telephone=data[i].telephone;

                    myhtml+='<div class="people-box">'
                        +'<div class="checkbox"><label><input id="'+i+'" name="mycheckbox" type="checkbox" onchange="selectPeople(this);"> <i class="input-helper"></i>'+name+'</label></div>'
                        +'<input id="myvalue'+i+'" type="hidden" value="'+name+':'+telephone+'">'
                        +'</div>';
                }
                $("#mypeople").append(myhtml);
            }
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    )
}

function zTreeOnClick4org(event, treeId, treeNode) {
    reloadFiles4org();
};

function  reloadFiles4org() {
    $("#mypeople").html("");
    // var loadHtml='<div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center;width: 80%;margin-left: 10%;" class="filenone">'
    //     +'<i class="zmdi zmdi-bike zmdi-hc-fw"></i>拼命加载中<span class="dotting" style="font-size:30px;font-weight: bold;"></span> </div>';
    // $("#mypeople").append(loadHtml);
    var nodes = zTreeObj4org .getSelectedNodes();
    var parentId=nodes[0].id;
    getData(
        'post',
        '/system/user/userList',
        {"orgids":parentId,"pageNumber":1,"pageSize":1000},
        'json',
        function (value) {//success
            var data=value.data.rows;
            $("#mypeople").html("");
            if(data.length==0){
                var nonehtml=' <div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center">'
                    +'<i class="zmdi zmdi-mood-bad zmdi-hc-fw"></i>该通讯录下没有人员！</div>';
                $("#mypeople").append(nonehtml);
            }else {
                var myhtml='<div class="allpeople-box">'
                    +'<div class="checkbox"><label><input type="checkbox" onchange="selectAllPeople(this,2);"> <i class="input-helper"></i>全选</label></div>'
                    +'</div>';
                for(var i=0;i<data.length;i++){
                    var name=data[i].realname;
                    var telephone=data[i].tel;

                    myhtml+='<div class="people-box">'
                        +'<div class="checkbox"><label><input id="'+i+'" name="mycheckbox" type="checkbox" onchange="selectPeople(this);"> <i class="input-helper"></i>'+name+'</label></div>'
                        +'<input id="myvalue'+i+'" type="hidden" value="'+name+':'+telephone+'">'
                        +'</div>';
                }
                $("#mypeople").append(myhtml);
            }
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    )
}

//全选通讯人员
function selectAllPeople(obj,type){
    var flag = obj.checked;
    $("[name = 'mycheckbox']:checkbox").each(function(){
        $(this).attr("checked", flag);
        var id = $(this).attr("id");
        var tag = $("#myvalue"+id).val();
        if(flag){
            if(select_tomans_TagObj){
                //选定人员
                var selectSMSPeople = select_tomans_TagObj.val();
                var selectSMSPeopleArray = selectSMSPeople.split(",");
                var flag1 = false;
                for(var i=0;i<selectSMSPeopleArray.length;i++) {
                    var tag1 = selectSMSPeopleArray[i];
                    if(tag==tag1)flag1=true;
                }
                if(!flag1)select_tomans_TagObj.addTag(tag);
            }
        }else{
            if(select_tomans_TagObj){
                select_tomans_TagObj.removeTag(tag);
            }
        }
    });
    if(!flag){
        if(type==1)reloadFiles();
        else reloadFiles4org();
    }else{
        //$("[name = 'mycheckbox']:checkbox").attr("checked", flag);
    }
}

//选择通讯人员
function selectPeople(obj){
    var flag = obj.checked;
    var id = obj.id;
    var tag = $("#myvalue"+id).val();
    if(flag){
        if(select_tomans_TagObj){
            //选定人员
            var selectSMSPeople = select_tomans_TagObj.val();
            var selectSMSPeopleArray = selectSMSPeople.split(",");
            var flag1 = false;
            for(var i=0;i<selectSMSPeopleArray.length;i++) {
                var tag1 = selectSMSPeopleArray[i];
                if(tag==tag1)flag1=true;
            }
            if(!flag1)select_tomans_TagObj.addTag(tag);
        }
    }else{
        if(select_tomans_TagObj){
            select_tomans_TagObj.removeTag(tag);
        }
    }
}

//清空选择的通讯人员
function clearSelectPeople(){
    var selectSMSPeople = select_tomans_TagObj.val();
    var selectSMSPeopleArray = selectSMSPeople.split(",");
    for(var i=0;i<selectSMSPeopleArray.length;i++){
        var tag = selectSMSPeopleArray[i];
        select_tomans_TagObj.removeTag(tag);
    }
}
