System.register(['jb-core', 'jb-ui', '@angular2-material/sidenav/sidenav'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, sidenav_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (sidenav_1_1) {
                sidenav_1 = sidenav_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MD_SIDENAV_DIRECTIVES: sidenav_1.MD_SIDENAV_DIRECTIVES });
            jb_core_1.jb.component('sidenav.md', {
                type: 'sidenav.style',
                params: [
                    { id: 'width', as: 'number' },
                    { id: 'align', options: 'start,end', as: 'string' },
                    { id: 'mode', options: 'over,push,side', as: 'string' },
                    { id: 'opened', as: 'boolean', type: 'boolean' }
                ],
                impl: { $: 'customStyle',
                    template: "<md-sidenav-layout>\n      <md-sidenav>\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" align=\"%$align%\" mode=\"%$mode%\"></jb_comp>\n      </md-sidenav>\n      </md-sidenav-layout>",
                    css: "md-sidenav { width: %$width%px }",
                    features: { $: 'group.initGroup' }
                }
            });
        }
    }
});
