System.register(['jb-ui', '@angular2-material/sidenav/sidenav'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_ui, sidenav_1;
    return {
        setters:[
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (sidenav_1_1) {
                sidenav_1 = sidenav_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MD_SIDENAV_DIRECTIVES: sidenav_1.MD_SIDENAV_DIRECTIVES });
        }
    }
});
