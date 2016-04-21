System.register(['jb-core/jb', 'jb-ui/jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('picklist.style');
            jb_1.jb.type('picklist.options');
            jb_1.jb.component('picklist', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    databind: { as: 'ref' },
                    options: { type: 'picklist.options', dynamic: true, essential: true, defaultValue: { $: 'picklist.optionsByComma' } },
                    style: { type: 'picklist.style', defaultValue: { $: 'picklist.native' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    ctx = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
                    return jb_ui.ctrl(ctx).jbExtend({
                        init: function (cmp) {
                            ctx.vars.field.bindToCmp(cmp, ctx);
                            cmp.options = ctx.params.options(ctx);
                        }
                    }, ctx);
                }
            });
            // ********* styles
            jb_1.jb.component('picklist.native', {
                type: 'picklist.style',
                impl: { $: 'customStyle',
                    template: "<div><select %$field.modelExp%>\n                    <option *ngFor=\"#option of options\" [value]=\"option.code\">{{option.text}}</option>\n                 </select></div>",
                    css: 'select {height: 23px}'
                }
            });
            // ********* options
            jb_1.jb.component('picklist.optionsByComma', {
                type: 'picklist.options',
                params: {
                    options: { as: 'string', essential: true },
                    allowEmptyValue: { type: 'boolean' },
                },
                impl: function (context, options, allowEmptyValue) {
                    var emptyValue = allowEmptyValue ? [{ code: '', value: '' }] : [];
                    return emptyValue.concat((options || '').split(',').map(function (code) {
                        return { code: code, text: code };
                    }));
                }
            });
            jb_1.jb.component('picklist.options', {
                type: 'picklist.options',
                params: {
                    options: { as: 'array', essential: true },
                    allowEmptyValue: { type: 'boolean' },
                },
                impl: function (context, options, allowEmptyValue) {
                    var emptyValue = allowEmptyValue ? [{ code: '', value: '' }] : [];
                    return emptyValue.concat(options.map(function (code) { return { code: code, text: code }; }));
                }
            });
            jb_1.jb.component('picklist.coded-options', {
                type: 'picklist.options',
                params: {
                    options: { as: 'array', essential: true },
                    code: { as: 'string', dynamic: true, essential: true },
                    text: { as: 'string', dynamic: true, essential: true },
                    allowEmptyValue: { type: 'boolean' },
                },
                impl: function (context, options, code, text, allowEmptyValue) {
                    var emptyValue = allowEmptyValue ? [{ code: '', value: '' }] : [];
                    return emptyValue.concat(options.map(function (option) {
                        return {
                            code: code(null, option), text: text(null, option)
                        };
                    }));
                }
            });
        }
    }
});
