var zTreeObj;
var zNodes = [];
var $myzTree=$("#orgTree");
var modelName="组织机构";
$(function(){
    $(".upload").height(clientHeight - 400);
    creatNode();
    var nodes= zTreeObj.getNodes();
    zTreeObj.selectNode(nodes[0]);
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
        '/system/organization/tree',
        "",
        'json',
        function (value) {//success
            zNodes=value.data;
            for (var i=0;i<zNodes.length;i++){
                zNodes[i].open=true;
            }
            zTreeObj = $.fn.zTree.init($myzTree, setting, zNodes);
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    );
}

function zTreeOnClick(event, treeId, treeNode) { 
    $("#mypeople").html('');
    reloadFiles('all');
};

function  reloadFiles(type) {
    $("#mypeople").html("");
    var loadHtml='<div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center;width: 80%;margin-left: 10%;" class="filenone">'
        +'<i class="zmdi zmdi-bike zmdi-hc-fw"></i>拼命加载中<span class="dotting" style="font-size:30px;font-weight: bold;"></span> </div>';
    $("#mypeople").append(loadHtml);
    var nodes = zTreeObj .getSelectedNodes();
    var parentId=nodes[0].id;
    getData(
        'post',
        '/system/user/userList',
        {"orgids":parentId},
        'json',
        function (value) {//success
            var data=value.data.rows;
            var myhtml="";
            if(data.length==0){
                $("#mypeople").html("");
                var nonehtml=' <div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center">'
                    +'<i class="zmdi zmdi-mood-bad zmdi-hc-fw"></i>该组织机构下没有系统用户！</div>';
                $("#mypeople").append(nonehtml);
            }else {
                var myImg="";
                for(var i=0;i<data.length;i++){
                    var name=data[i].realname;
                    var telephone=data[i].tel;

                    myhtml='<div class="people-box" >'
                        +'<div class="mypeople">'
                        +'<div class="image"><img width="55" height="55" src="../img/head.jpg"></div>'
                        +'<div class="people-name" style="text-align: center;word-wrap: break-word;word-break: break-all;overflow: hidden;">'
                        +'<div class="checkbox"><label><input id="'+i+'" name="mycheckbox" type="checkbox"> <i class="input-helper"></i>'+name+'</label></div>'
                        +'<input id="myvalue'+i+'" type="hidden" value="'+name+':'+telephone+'">'
                        +'</div>'
                        +'</div>'
                        +'</div>'+myhtml;
                }
                $("#mypeople").html("");
                $("#mypeople").append(myhtml);
                $('.file-box').each(function() {
                    animationHover(this, 'pulse');
                });
                $("[data-toggle='popover']").popover();
            }
        },function(obj){//error
            showtoastr("inverse", '节点加载异常');
        }
    )
}
