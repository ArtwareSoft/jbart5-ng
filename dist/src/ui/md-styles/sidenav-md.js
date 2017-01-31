System.register(['jb-core', '@angular/material'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, material_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (material_1_1) {
                material_1 = material_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('sidenav.md', {
                type: 'sidenav.style',
                params: [
                    { id: 'width', as: 'number' },
                    { id: 'align', options: 'start,end', as: 'string' },
                    { id: 'mode', options: 'over,push,side', as: 'string' },
                    { id: 'opened', as: 'boolean', type: 'boolean' }
                ],
                impl: { $: 'customStyle',
                    template: "<md-sidenav-layout>\n      <md-sidenav align=\"%$align%\" mode=\"%$mode%\">\n        <div *ngFor=\"let ctrl of ctrls\"><div *jbComp=\"ctrl\"></div></div>\n      </md-sidenav>\n      </md-sidenav-layout>",
                    css: "md-sidenav { width: %$width%px }",
                    features: { $: 'group.initGroup' },
                    imports: material_1.MdSidenavModule
                }
            });
        }
    }
});
