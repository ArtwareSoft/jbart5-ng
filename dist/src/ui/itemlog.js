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
            jb_1.jb.type('itemlog.style');
            jb_1.jb.component('itemlog', {
                type: 'control',
                params: {
                    title: { as: 'string' },
                    items: { as: 'observable', dynamic: true, essential: true },
                    controls: { type: 'control[]', essential: true, dynamic: true },
                    style: { type: 'itemlog.style', dynamic: true, defaultValue: { $: 'itemlog.div' } },
                    itemVariable: { as: 'string', defaultValue: 'item' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context) {
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.items = [];
                            cmp.itemToComp = function (item) {
                                return context.params.controls(item.setVars(jb_1.jb.obj(context.params.itemVariable, item.data)))[0];
                            };
                            context.params.items(context).subscribe(function (itemCtx) {
                                return cmp.items.unshift(itemCtx);
                            });
                        }
                    });
                }
            });
            jb_1.jb.component('itemlog.div', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group jb-itemlog\"><div jb-item *ngFor=\"let item of items\">\n        <jb_comp [comp]=\"itemToComp(item)\" flatten=\"true\"></jb_comp>\n      </div></div>"
                }
            });
        }
    }
});
