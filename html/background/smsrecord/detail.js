//加载表单数据
function initFormDatas(datas){
    if(datas){
        //普通数据加载
        $("#form_fromman").text(datas.fromman);
        $("#form_tomans").text(datas.tomans);
        $("#form_content").text(datas.content);
    }
}
