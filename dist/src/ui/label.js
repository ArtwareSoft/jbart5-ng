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
            jb_core_1.jb.component('label', {
                type: "control",
                params: {
                    title: { essential: true, defaultValue: 'label', as: 'ref' },
                    style: { type: 'label.style', defaultValue: { $: 'label.span' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx.setVars({ title: jb_core_1.jb.val(ctx.params.title) }));
                }
            });
            jb_core_1.jb.type('label.style');
            jb_core_1.jb.component('label.span', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<span>{{title}}</span>',
                    features: { $: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
                }
            });
            jb_core_1.jb.component('label.static-span', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<span>%$title%</span>'
                }
            });
            jb_core_1.jb.component('label.h1', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<h1>{{title}}</h1>',
                    features: { $: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
                }
            });
        }
    }
});
