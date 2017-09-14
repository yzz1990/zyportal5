var root='http://127.0.0.1:8090/';
var $wu={
    uploadConfig:{

    },
    getDT:function(){
        var now=new Date();
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var day=now.getDay();
        var hour=now.getHours();
        var min=now.getMinutes();
        var sec=now.getSeconds();
        month=month<10?'0'+month:month;
        day=day<10?'0'+day:day;
        hour=hour<10?'0'+hour:hour;
        min=min<10?'0'+min:min;
        sec=sec<10?'0'+sec:sec;
        var dt=year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
        return dt;
    },
    upload:function(config){
        var uploadConfig=this.uploadConfig;
        $.extend(uploadConfig,config);

    }
}