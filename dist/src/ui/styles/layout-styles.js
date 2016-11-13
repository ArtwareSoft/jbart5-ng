System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.component('layout.vertical', {
                type: 'group.style',
                params: [
                    { id: 'spacing', as: 'number', defaultValue: 3 }
                ],
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: ".group-item { margin-bottom: %$spacing%px; display: block }\n        .group-item:last-child { margin-bottom:0 }",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('layout.horizontal', {
                type: 'group.style',
                params: [
                    { id: 'spacing', as: 'number', defaultValue: 3 }
                ],
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: "{display: flex}\n        .group-item { margin-right: %$spacing%px }\n        .group-item:last-child { margin-right:0 }",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('layout.flex', {
                type: 'group.style',
                params: [
                    { id: 'align', as: 'string', options: ',flex-start,flex-end,center,space-between,space-around' },
                    { id: 'direction', as: 'string', options: ',row,row-reverse,column,column-reverse' },
                    { id: 'wrap', as: 'string', options: ',wrap' },
                ],
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    //    css: '{ %$flexProps% }',
                    css: '{ display: flex; {?justify-content:%$align%;?} {?flex-direction:%$direction%;?} {?flex-wrap:%$wrap%;?} }',
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('flex-layout-container.align-main-axis', {
                type: 'feature',
                params: [
                    { id: 'align', as: 'string', options: 'flex-start,flex-end,center,space-between,space-around', defaultValue: 'flex-start' }
                ],
                impl: function (ctx, factor) { return ({
                    css: "{ justify-content: " + align + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.grow', {
                type: 'feature',
                params: [
                    { id: 'factor', as: 'number', defaultValue: '1' }
                ],
                impl: function (ctx, factor) { return ({
                    css: "{ flex-grow: " + factor + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.basis', {
                type: 'feature',
                params: [
                    { id: 'factor', as: 'number', defaultValue: '1' }
                ],
                impl: function (ctx, factor) { return ({
                    css: "{ flex-basis: " + factor + " }"
                }); }
            });
            jb_core_1.jb.component('flex-layout-item.align-self', {
                type: 'feature',
                params: [
                    { id: 'align', as: 'string', options: 'auto,flex-start,flex-end,center,baseline,stretch', defaultValue: 'auto' }
                ],
                impl: function (ctx, align) { return ({
                    css: "{ align-self: " + align + " }"
                }); }
            });
            jb_core_1.jb.component('flex-filler', {
                type: 'control',
                params: [
                    { id: 'title', as: 'string', defaultValue: 'flex filler' },
                    { id: 'basis', as: 'number', defaultValue: '1' },
                    { id: 'grow', as: 'number', defaultValue: '1' },
                    { id: 'shrink', as: 'number', defaultValue: '0' },
                ],
                impl: function (ctx, title, basis, grow, shrink) {
                    var css = [
                        ("flex-basis: " + basis),
                        ("flex-grow: " + grow),
                        ("flex-shrink: " + shrink),
                    ].join('; ');
                    return jb_ui.Comp({ jbTemplate: "<div style=\"" + css + "\"></div>" }, ctx);
                }
            });
            jb_core_1.jb.component('responsive.only-for-phone', {
                type: 'feature',
                impl: function () { return ({
                    cssClass: 'only-for-phone'
                }); }
            });
            jb_core_1.jb.component('responsive.not-for-phone', {
                type: 'feature',
                impl: function () { return ({
                    cssClass: 'not-for-phone'
                }); }
            });
        }
    }
});
