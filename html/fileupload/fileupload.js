var zTreeObj;
var zNodes = [];
var $myzTree=$("#fileTree");
var modelName="文件目录";
var pdfpreview="../vendors/pdfview/web/viewer2.html?f=";
var videopreview="../html/background/video/index.html?&isAutoPlay=0&poster=../../../img/cal-header.jpg&videourl=";
var topdf=true;
$(function(){
    $(".upload").height(clientHeight - 180);
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
                pIdKey: "parentId",
                rootPId: 1
            }
        },
        callback: {
            onClick: zTreeOnClick
        }
    };
    getData_async(
        'post',
        '/fileNode/fileupload/getNodes',
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
    $("#myfile").html('');
    reloadFiles('all');
};

function createNode() {
    var nodes = zTreeObj .getSelectedNodes();
    if(nodes.length<1){
        showtoastr("inverse", '请选择父节点');
    }else{
        openAddModel(nodes);
    }

}
function openAddModel(nodes){
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "新增"+modelName,
        $('<div></div>').load('fileupload/addNode.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.055);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.43);
        },
        function(){
            loadPid(nodes)
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            var parentId=$('#nodeid').val();
            var name=$("#nodeName").val();
            getData(
                'post',
                '/fileNode/fileupload/Insert',
                {'name':name,"parentId":parentId},
                'json',
                function (value) {//success
                 if(value.code=="60001"){
                     nodeReload();
                     showtoastr("inverse",value.desc);
                     addm.close();
                 }else {
                     showtoastr("inverse",value.desc);
                 }

                },function(obj){//error
                    showtoastr("inverse", '节点加载异常');
                }
            )

        });
}
function loadPid(nodes) {
    var parentId=nodes[0].id;
    var name=nodes[0].name;
    $("#nodeid").append('<option value="'+parentId+'">'+name+'</option>');
    $("#nodeid").selectpicker({});
}
function loadids(pid,id) {
    var parentId=pid.id;
    var name=pid.name;
    var id=id[0].id;
   $("#nodeid").append('<option value="'+parentId+'">'+name+'</option>');
    $("#nodeid").selectpicker({});
    getData(
        'post',
        '/fileNode/fileupload/getNodeById',
        {'id':id},
        'json',
        function (value) {//success
            var data=value.data;
$("#nodeName").val(data.name);
        },function(obj){//error
            showtoastr("inverse", '节点查询异常');
        }
    )

}
function nodeReload() {
    creatNode();
}
function delNode() {
    var nodes = zTreeObj .getSelectedNodes();
    var id=nodes[0].id;
    messageConfimDialog(BootstrapDialog.INFO, "提示","确认删除该目录？", function(){
        getData(
            'post',
            '/fileNode/fileupload/delNode',
            {"id":id},
            'json',
            function (value) {//success
                if(value.code=="60003"||value.code=="60010"){
                    showtoastr("inverse",value.desc);
                    nodeReload();
                    var nodes= zTreeObj.getNodes();
                    zTreeObj.selectNode(nodes[0]);
                }
                else {
                    showtoastr("inverse",value.desc);
                }

            },function(obj){//error
                showtoastr("inverse", '节点加载异常');
            }
        )
    }, null);
}
function editNode() {
    var nodes = zTreeObj .getSelectedNodes();
    if(nodes.length < 1){
        showtoastr("inverse", '请选择节点');
    }else{
        var node = nodes[0].getParentNode();
        openEditModel(node,nodes);
    }
}
  function openEditModel(pid,id){
      addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
          "编辑"+modelName,
          $('<div></div>').load('fileupload/addNode.html'),
          function($dialogParentDiv){
              $dialogParentDiv.css('height',clientHeight*0.055);
              $dialogParentDiv.css('overflow-x','');
              $dialogParentDiv.css('overflow-y','');
              $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.43);
          },
          function(){
              loadids(pid,id);
          },
          function(dialogItself){
              //cancel
          },
          function(dialogItself){
              var parentId=$('#nodeid').val();
              var name=$("#nodeName").val();
              var nodes = zTreeObj .getSelectedNodes();
              var id=nodes[0].id;
              getData(
                  'post',
                  '/fileNode/fileupload/Update',
                  {'name':name,"parentId":parentId,"id":id},
                  'json',
                  function (value) {//success
                      if(value.code=="60005"){
                          nodeReload();
                          showtoastr("inverse",value.desc);
                          addm.close();
                      }else {
                          showtoastr("inverse",value.desc);
                      }

                  },function(obj){//error
                      showtoastr("inverse", '节点加载异常');
                  }
              )

          });
}
function  reloadFiles(type) {
    $("#myfile").html("");
      var loadHtml='<div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center;width: 80%;margin-left: 10%;" class="filenone">'
         +'<i class="zmdi zmdi-bike zmdi-hc-fw"></i>玩命加载中<span class="dotting" style="font-size:30px;font-weight: bold;"></span> </div>';
    $("#myfile").append(loadHtml);
    var nodes = zTreeObj .getSelectedNodes();
      var parentId=nodes[0].id;
    getData(
        'post',
        '/fileNode/fileupload/getFileByPid',
        {"parentId":parentId,"filetype":type},
        'json',
        function (value) {//success
var data=value.data;
var myhtml="";
if(data.length==0){
    $("#myfile").html("");
   var nonehtml=' <div style="font-weight: bold;font-size: 30px;top: 50px;margin-top: 25%;text-align: center">'
    +'<i class="zmdi zmdi-mood-bad zmdi-hc-fw"></i>该目录没有文件</div>';
    $("#myfile").append(nonehtml);
}else {
    var myImg="";
    for(var i=0;i<data.length;i++){
        var file=data[i].filetype;
       var status=data[i].status;
       var tips=""
        var topdf="";
       var del='<a  target="_blank" href="'+urlPathPre+data[i].fileurl+'" download="'+data[i].basename+'"><i class="zmdi zmdi-download zmdi-hc-fw"></i> 下载</a>';
       if(status=="false"){
           tips=' <i  data-trigger="hover" data-toggle="popover" data-placement="top" data-content="该文件还未转换pdf,可选择手动转换,点击转换后请等待几分钟再进行预览!" title="" data-original-title="提示" class="zmdi zmdi-alert-circle-o zmdi-hc-fw" style="color: red"></i>';
           topdf='<a href="javascript:void(0);" onclick="toPdf(\''+data[i].id+'\',\''+data[i].fileurl+'\',\''+data[i].pdfpath+'\',\'myfile'+i+'\')"><i class="zmdi zmdi-refresh-alt zmdi-hc-fw"></i>转换</a>';
       }else if(status=="failed"){
            tips=' <i  data-trigger="hover" data-toggle="popover" data-placement="top" data-content="文件转换失败,请查看文件或请重新转换！" title="" data-original-title="提示" class="zmdi zmdi-alert-circle-o zmdi-hc-fw" style="color: red"></i>';
            topdf='<a href="javascript:void(0);" onclick="toPdf(\''+data[i].id+'\',\''+data[i].fileurl+'\',\''+data[i].pdfpath+'\',\'myfile'+i+'\')"><i class="zmdi zmdi-refresh-alt zmdi-hc-fw"></i>转换</a>';
        }
       else if(status=="Non-Existent"){
           tips=' <i  data-trigger="hover" data-toggle="popover" data-placement="top" data-content="该文件不存在请删除后重新上传!" title="" data-original-title="提示" class="zmdi zmdi-alert-circle-o zmdi-hc-fw" style="color: red"></i>';
           del="";
       } else if(status=="checktrue"){
           topdf='<a href="javascript:void(0);" onclick="checkPdfread(\''+data[i].id+'\',\''+data[i].pdfpath+'\',\''+data[i].filetype+'\',\''+data[i].fileurl+'\')"><i class="zmdi zmdi-search zmdi-hc-fw"></i>  预览</a>';

       } else if(status=="disConect"){
           tips=' <i  data-trigger="hover" data-toggle="popover" data-placement="top" data-content="文件转换失败,转换服务未启动！" title="" data-original-title="提示" class="zmdi zmdi-alert-circle-o zmdi-hc-fw" style="color: red"></i>';
           topdf='<a href="javascript:void(0);" onclick="toPdf(\''+data[i].id+'\',\''+data[i].fileurl+'\',\''+data[i].pdfpath+'\',\'myfile'+i+'\')"><i class="zmdi zmdi-refresh-alt zmdi-hc-fw"></i>转换</a>';

       }else if(status=="bgToPdf"){
           topdf='<a href="javascript:void(0);" onclick="checkPdfread(\''+data[i].id+'\',\''+data[i].pdfpath+'\',\''+data[i].filetype+'\',\''+data[i].fileurl+'\')"><i class="zmdi zmdi-search zmdi-hc-fw"></i>  预览</a>';
       }else{
           topdf='<a href="javascript:void(0);" onclick="pdfread(\''+data[i].pdfpath+'\',\''+data[i].filetype+'\',\''+data[i].fileurl+'\')"><i class="zmdi zmdi-search zmdi-hc-fw"></i>  预览</a>';
       }
        if(file=="img"){
            myImg='<div class="image"><img alt="image" class="img-responsive" src="'+urlPathPre+data[i].fileurl+'"></div>';
        }else if(file=="docOffice"){
            myImg='<div class="icon"><i class="zmdi zmdi-file zmdi-hc-fw"></i></div>';
        }else if(file=="xlsOffice"){
            myImg='<div class="icon"><i class="zmdi zmdi-chart zmdi-hc-fw"></i></div>';
        }else if(file=="video"){
            myImg='<div class="icon"><i class="zmdi zmdi-videocam zmdi-hc-fw"></i></div>';
        }else if(file=="music"){
            myImg='<div class="icon"><i class="zmdi zmdi-collection-music zmdi-hc-fw"></i></div>';
        }else{
            myImg='<div class="icon"> <i class="zmdi zmdi-folder-outline zmdi-hc-fw"></i></div>';
        }
       myhtml=' <div class="file-box" >'
            +' <div class="myfile" id="myfile'+i+'">'
           +'<div style="position: absolute;left: 82%;top: 5%;">'
            +'<ul class="actions  pull-right" >'
           +' <li class="dropdown">'
           +'<a href="" data-toggle="dropdown" aria-expanded="false">'
           +' <i class="zmdi zmdi-more-vert"></i>'
           +' </a>'
           +' <ul class="dropdown-menu dropdown-menu-right">'
           +' <li>'
           +' <a href="javascript:void(0);" onclick="delfile(\''+data[i].id+'\')"><i class="zmdi zmdi-delete"></i>  删除</a>'
           +' </li>'
           +' <li>'
           +topdf
           +' </li>'
           +'<li>'
           +del
           +'</li>'
           +'</ul>'
           +'</li>'
           +'</ul>'
           +'</div>'
           +'<a href="javascript:void(0);">'
           +myImg
           +'<div class="file-name" style="text-align: center;word-wrap: break-word;word-break: break-all;overflow: hidden;">'+data[i].basename+'<br> <small>'+bytesToSize(data[i].size)+'</small>'
               +tips
           +'</div>'
           +'</a>'
           +'</div>'
           +'</div>'+myhtml;

    }
    $("#myfile").html("");
    $("#myfile").append(myhtml);
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
function openUpload(){
    var nodes = zTreeObj .getSelectedNodes();
    if(nodes.length==0){
        showtoastr("inverse", '请选择文件目录！');
    }
    var parentId=nodes[0].id;

    jsonstr=[];
    addm=messageConfimDialogCommon(BootstrapDialog.TYPE_INFO,
        "上传附件",
        $('<div></div>').load('editor/fileUpload.html'),
        function($dialogParentDiv){
            $dialogParentDiv.css('height',clientHeight*0.45);
            $dialogParentDiv.css('overflow-x','');
            $dialogParentDiv.css('overflow-y','');
            $dialogParentDiv.parents('.modal-content').css('width',clientWidth*0.48);
        },
        function(){
        },
        function(dialogItself){
            //cancel
        },
        function(dialogItself){
            var a=0;
            if(jsonstr.length==0){
                showtoastr("inverse", '文件还未上传！');
                return;
            }
       var files=jsonstr;
       var b=files.length;
       for(var i=0;i<files.length;i++){
     var baseName=files[i].fileBaseName;
     var fileUrl=files[i].fileUrl;
     var size=files[i].size;
    var pdfPath=files[i].pdfPath;
     var filetype=getfileType(files[i].fileBaseName);
           getData_async(
               'post',
               '/fileNode/fileupload/saveFileinfo',
               {'baseName':baseName,"fileUrl":fileUrl,"size":size,"parentId":parentId,"filetype":filetype,"pdfPath":pdfPath},
               'json',
               function (value) {//success
                   if(value.code=="60001"){
                     a=a+1;
                   }else {
                       showtoastr("inverse",value.desc);
                   }

               },function(obj){//error
                   showtoastr("inverse", '上传异常');
               }
           )
       }
            if(a==b){
                showtoastr("inverse", '文件保存成功');
                addm.close();
                reloadFiles('all');
            }else{
                showtoastr("inverse", '文件保存失败');
            }

   /*         uploadfile(jsonstr);*/

        });
}
function delfile(value) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","确认删除该文件？", function(){
        getData(
            'post',
            '/fileNode/fileupload/delFile',
            {"id":value},
            'json',
            function (value) {//success
                if(value.code=="60003"){
                    showtoastr("inverse",value.desc);
                    reloadFiles('all');
                }else {
                    showtoastr("inverse",value.desc);
                }

            },function(obj){//error
                showtoastr("inverse", '节点加载异常');
            }
        )
    }, null);

}
function toPdf(id,url,pdf,myfile) {
    messageConfimDialog(BootstrapDialog.INFO, "提示","手动转换pdf文件时间较长，确定转换？", function(){
        if(topdf){
            var addhtml='<div id="covered">PDF转换准备中<span class="dotting"></span></div>';
            var localHtml=$("#"+myfile).html();
            $("#"+myfile).html(addhtml+localHtml);
            getData(
                'post',
                '/fileNode/fileupload/officeToPdf',
                {"pdfPath":pdf,"fileUrl":url,"id":id},
                'json',
                function (value) {//success
                    if(value.code=="60011"){
                        setTimeout(" reloadFiles('all')",2000);
                        showtoastr("inverse","文件开始转换!");
                    }else{
                        $("#myfile").html("");
                        showtoastr("inverse",value.desc);
                    }
                },function(obj){//error
                    showtoastr("inverse", '转换异常');
                }
            )
        }else{
            showtoastr("inverse","当前有文件正在转换");
        }

    }, null);
}
function pdfread(value,type,fileurl) {
    if(type=="docOffice"||type=="xlsOffice"){
        window.open(pdfpreview+urlPathPre+value);
    }else if(type=="img"){
        window.open(urlPathPre+fileurl);
    }else if(type=="video"||type=="music"){
        window.open(videopreview+urlPathPre+fileurl+"&width=0&height=0");
    }else{
        showtoastr("inverse","文件不支持预览请下载！");
    }

}
function checkPdfread(id,myvalue,type,fileurl){
    getData(
        'post',
        '/fileNode/fileupload/getStatusById',
        {"id":id},
        'json',
        function (value) {//success
            if(value.code=="60011"){
                pdfread(myvalue,type,fileurl);
            }else if(value.code=="60013"){
                showtoastr("inverse","PDF正在转换中...");
                reloadFiles('all');
            }else if(value.code=="60016"){
                showtoastr("inverse",value.desc);
                reloadFiles('all');
            }else{
                showtoastr("inverse","转换过程遇到问题，转换失败！");
                reloadFiles('all');
            }
        },function(obj){//error
            showtoastr("inverse", '查询异常');
        }
    )
}