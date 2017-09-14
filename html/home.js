/**
 * Created by yupc on 2017/4/18.
 */
/*
 * Waves Animation
 */
(function(){
    Waves.attach('.btn:not(.btn-icon):not(.btn-float)');
    Waves.attach('.btn-icon, .btn-float', ['waves-circle', 'waves-float']);
    Waves.init();
})();

