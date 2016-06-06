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
            jb_core_1.jb.type('editable-boolean.style');
            jb_core_1.jb.type('editable-boolean.yes-no-settings');
            jb_core_1.jb.component('editable-boolean', {
                type: 'control',
                params: {
                    databind: { as: 'ref' },
                    style: { type: 'editable-boolean.style', defaultValue: { $: 'editable-boolean.checkbox' }, dynamic: true },
                    title: { as: 'string', dynamic: true },
                    textForTrue: { as: 'string', defaultValue: 'yes' },
                    textForFalse: { as: 'string', defaultValue: 'no' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    var ctx2 = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
                    return jb_ui.ctrl(ctx2).jbExtend({
                        beforeInit: function (cmp) {
                            ctx2.vars.field.bindToCmp(cmp, ctx2);
                            cmp.toggle = function () {
                                cmp.jbModel = !cmp.jbModel;
                                ctx2.vars.field.writeValue(cmp.jbModel);
                            };
                            cmp.text = function () {
                                return cmp.jbModel ? ctx.params.textForTrue : ctx.params.textForFalse;
                            };
                        }
                    });
                }
            });
        }
    }
});
