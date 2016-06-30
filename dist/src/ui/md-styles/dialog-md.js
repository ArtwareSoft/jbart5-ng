System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('dialog.md-dialog-ok-cancel', {
                type: 'dialog.style',
                params: {
                    okLabel: { as: 'string', defaultValue: 'OK' },
                    cancelLabel: { as: 'string', defaultValue: 'Cancel' },
                },
                impl: { $: 'customStyle',
                    template: "\n\t\t\t\t<div class=\"jb-dialog jb-default-dialog\">\n\t\t\t\t      <div class=\"dialog-title\">{{title}}</div>\n\t\t\t\t      <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t      <jb_comp [comp]=\"contentComp\"></jb_comp>\n\t\t\t\t\t  <div class=\"dialog-buttons\">\n\t\t\t\t\t\t\t<button md-button=\"\" type=\"button\" (click)=\"dialogClose({OK:false})\">\n\t\t\t\t\t\t\t  \t<span class=\"md-button-wrapper\">\n\t\t\t\t\t\t\t\t      <span>%$cancelLabel%</span>\n    \t\t\t\t\t\t\t</span>\n    \t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button class=\"md-primary\" md-button=\"\" (click)=\"dialogClose({OK:true})\" type=\"button\">\n\t\t\t\t\t\t\t\t\t<span class=\"md-button-wrapper\">\n\t\t\t\t\t\t\t      \t\t<span>%$okLabel%</span>\n\t\t\t\t\t\t\t    \t</span>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t</div>\n\t\t\t\t</div>\t\t\n\t\t",
                    css: ".dialog-buttons { display: flex; justify-content: flex-end; margin: 5px }",
                    directives: 'MdButton'
                }
            });
        }
    }
});
