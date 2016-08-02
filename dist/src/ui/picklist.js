System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    function groupOfOpt(opt) {
        if (!opt.group && opt.text.indexOf('.') == -1)
            return '';
        return opt.group || opt.text.split('.').shift();
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.type('picklist.style');
            jb_core_1.jb.type('picklist.options');
            jb_core_1.jb.component('picklist', {
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
                        beforeInit: function (cmp) {
                            ctx.vars.field.bindToCmp(cmp, ctx);
                            cmp.recalcOptions = function () {
                                cmp.options = ctx.params.options(ctx);
                                var groupsHash = {};
                                cmp.groups = [];
                                cmp.options.forEach(function (o) {
                                    var groupId = groupOfOpt(o);
                                    var group = groupsHash[groupId] || { options: [], text: groupId };
                                    if (!groupsHash[groupId]) {
                                        cmp.groups.push(group);
                                        groupsHash[groupId] = group;
                                    }
                                    group.options.push({ text: o.text.split('.').pop(), code: o.code });
                                });
                            };
                            cmp.recalcOptions();
                        },
                        observable: function () { } // to create jbEmitter
                    }, ctx);
                }
            });
            jb_core_1.jb.component('picklist.dynamic-options', {
                type: 'feature',
                params: {
                    recalcEm: { as: 'observable' }
                },
                impl: function (ctx, recalcEm) { return ({
                    init: function (cmp) {
                        return recalcEm
                            .takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                            .subscribe(function (e) {
                            return cmp.recalcOptions();
                        });
                    }
                }); }
            });
            // ********* options
            jb_core_1.jb.component('picklist.optionsByComma', {
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
            jb_core_1.jb.component('picklist.options', {
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
            jb_core_1.jb.component('picklist.coded-options', {
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
