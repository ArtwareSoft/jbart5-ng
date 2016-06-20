System.register(['jb-core', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.component('field.default', {
                type: 'feature',
                params: {
                    value: { type: 'data' },
                },
                impl: function (context, defaultValue) {
                    var field = context.vars.field;
                    if (field && field.getValue() == null)
                        field.writeValue(defaultValue);
                }
            });
            jb_core_1.jb.component('field.subscribe', {
                type: 'feature',
                params: {
                    action: { type: 'action', essential: true, dynamic: true },
                    includeFirst: { type: 'boolean', as: 'boolean' },
                },
                impl: function (context, action, includeFirst) { return ({
                    init: function (cmp) {
                        var field = context.vars.field;
                        var includeFirstEm = includeFirst ? jb_rx.Observable.of(field.getValue()) : jb_rx.Observable.of();
                        field && field.observable(context)
                            .merge(includeFirstEm)
                            .filter(function (x) { return x; })
                            .subscribe(function (x) {
                            return action(context.setData(x));
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('field.toolbar', {
                type: 'feature',
                params: {
                    toolbar: { type: 'control', essential: true, dynamic: true },
                },
                impl: function (context, toolbar) { return ({
                    extendComp: { jb_toolbar: toolbar() }
                }); }
            });
        }
    }
});
