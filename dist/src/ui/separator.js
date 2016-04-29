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
            jb_core_1.jb.type('separator.style');
            jb_core_1.jb.component('separator', {
                type: 'control',
                params: {
                    style: { type: 'separator.style', defaultValue: { $: 'separator.br' }, dynamic: true },
                    title: { as: 'string', defaultValue: 'text' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx);
                }
            });
            jb_core_1.jb.component('separator.br', {
                type: 'separator.style',
                params: {},
                impl: { $: 'customStyle',
                    template: '<div><br></div>',
                }
            });
        }
    }
});
