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
                    title: { essential: true, defaultValue: 'hello', dynamic: true },
                    style: { type: 'label.style', defaultValue: { $: 'label.span' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx.setVars({ title: ctx.params.title() }));
                }
            });
            jb_core_1.jb.type('label.style');
            jb_core_1.jb.component('label.bind-title', {
                type: 'feature',
                impl: function (ctx) { return ({
                    doCheck: function (cmp) {
                        cmp.title = ctx.vars.$model.title(cmp.ctx);
                    }
                }); }
            });
            jb_core_1.jb.component('label.span', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<span>{{title}}</span>',
                    features: { $: 'label.bind-title' }
                }
            });
            jb_core_1.jb.component('label.static-span', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<span>%$title%</span>'
                }
            });
            jb_core_1.jb.component('label.p', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<p>{{title}}</p>',
                    features: { $: 'label.bind-title' }
                }
            });
            jb_core_1.jb.component('label.h1', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<h1>{{title}}</h1>',
                    features: { $: 'label.bind-title' }
                }
            });
            jb_core_1.jb.component('label.h2', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<h2>{{title}}</h2>',
                    features: { $: 'label.bind-title' }
                }
            });
        }
    }
});
