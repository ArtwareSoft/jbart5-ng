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
            jb_core_1.jb.component('layout.vertical', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 3 }
                },
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: ".group-item { margin-bottom: %$spacing%px; display: block }\n        .group-item:last-child { margin-bottom:0 }",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('layout.horizontal', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 3 }
                },
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: "{display: flex}\n        .group-item { margin-right: %$spacing%px }\n        .group-item:last-child { margin-right:0 }",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('layout.flex', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: "{display: flex }",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('flex-layout-container.align-main-axis', {
                type: 'feature',
                params: {
                    align: { as: 'string', options: 'flex-start,flex-end,center,space-between,space-around', defaultValue: 'flex-start' }
                },
                impl: function (ctx, factor) { return ({
                    css: "{ justify-content: " + align + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.grow', {
                type: 'feature',
                params: {
                    factor: { as: 'number', defaultValue: '1' }
                },
                impl: function (ctx, factor) { return ({
                    css: "{ flex-grow: " + factor + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.basis', {
                type: 'feature',
                params: {
                    factor: { as: 'number', defaultValue: '1' }
                },
                impl: function (ctx, factor) { return ({
                    css: "{ flex-basis: " + factor + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.align-self', {
                type: 'feature',
                params: {
                    align: { as: 'string', options: 'auto,flex-start,flex-end,center,baseline,stretch', defaultValue: 'auto' }
                },
                impl: function (ctx, align) { return ({
                    css: "{ align-self: " + align + " }"
                }); }
            });
        }
    }
});
