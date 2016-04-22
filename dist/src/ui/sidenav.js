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
            jb_core_1.jb.type('sidenav.style');
            jb_core_1.jb.component('sidenav', {
                type: 'control',
                params: {
                    controls: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
                    title: { as: 'string', dynamic: true },
                    style: { type: 'sidenav.style', defaultValue: { $: 'sidenav.md' }, essential: true, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jbart.comps.group.impl(ctx);
                }
            });
            jb_core_1.jb.component('sidenav.md', {
                type: 'sidenav.style',
                params: {
                    width: { as: 'number' },
                    align: { options: 'start,end', as: 'string' },
                    mode: { options: 'over,push,side', as: 'string' },
                    opened: { as: 'boolean', type: 'boolean' }
                },
                impl: { $: 'customStyle',
                    template: "<md-sidenav-layout>\n      <md-sidenav>\n        <jb_comp *ngFor=\"var ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" align=\"%$align%\" mode=\"%$mode%\"></jb_comp>\n      </md-sidenav>\n      </md-sidenav-layout>",
                    css: "md-sidenav { width: %$width%px }",
                    features: { $: 'group.initGroup' }
                }
            });
        }
    }
});
