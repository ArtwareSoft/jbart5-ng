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
            jb_core_1.jb.type('editable-text.style');
            jb_core_1.jb.component('editable-text', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    databind: { as: 'ref' },
                    style: { type: 'editable-text.style', defaultValue: { $: 'editable-text.input' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) }));
                }
            });
            jb_core_1.jb.component('editable-text.bindField', {
                type: 'feature',
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        return ctx.vars.field.bindToCmp(cmp, ctx);
                    }
                }); }
            });
            jb_core_1.jb.component('editable-text.input', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: "<div><input %$field.modelExp%></div>",
                    css: 'input {height: 16px}'
                }
            });
            jb_core_1.jb.component('editable-text.textarea', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: '<textarea %$field/modelExp%></textarea>',
                }
            });
        }
    }
});
