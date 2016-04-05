System.register(['js/jb', 'ui/jb-ui', 'ui/jb-rx', 'rxjs/Rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, jb_rx, Rx_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            }],
        execute: function() {
            jb_1.jb.component('wait', {
                type: 'feature',
                params: {
                    for: { essential: true },
                    loadingControl: { type: 'control', defaultValue: { $: 'label', title: 'loading ...' }, dynamic: true },
                    error: { type: 'control', defaultValue: { $: 'label', title: 'error: %$error%', styles: ['* {color: red; font-weight: bold}'] }, dynamic: true },
                },
                impl: function (context, waitFor, loading, error) {
                    return {
                        ctrlsEmFunc: function (originalCtrlsEmFunc, ctx) {
                            return jb_rx.observableFromCtx(ctx.setData(waitFor))
                                .flatMap(function (x) { return originalCtrlsEmFunc(ctx); })
                                .startWith([loading(ctx)])
                                .catch(function (e) { return Rx_1.Observable.of([error(ctx.setVars({ error: e }))]); });
                        }
                    };
                }
            });
            // bind data and watch the data to refresh the control
            jb_1.jb.component('group.data', {
                type: 'feature',
                params: {
                    data: { essential: true, dynamic: true, as: 'ref' },
                    itemVariable: { as: 'string' },
                    watch: { type: 'boolean', as: 'boolean', defaultValue: true }
                },
                impl: function (context, ref, itemVariable, watch) {
                    return {
                        ctrlsEmFunc: function (originalCtrlsEmFunc, ctx, cmp) {
                            if (!watch) {
                                var val = jb_1.jb.val(ref());
                                return Rx_1.Observable.of([originalCtrlsEmFunc(ctxWithItemVar(ctx.setData(val), val))]);
                            }
                            return cmp.jbEmitter
                                .map(function () { return jb_1.jb.val(ref()); })
                                .distinctUntilChanged()
                                .filter(function (x) { return x && x != 'undefined'; })
                                .map(function (x) { console.log('group.data: ref changed', x); return x; })
                                .flatMap(function (val) {
                                return originalCtrlsEmFunc(ctxWithItemVar(ctx.setData(val), val));
                            });
                            function ctxWithItemVar(ctx, val) { return itemVariable ? ctx.setVars(jb_1.jb.obj(itemVariable, val)) : ctx; }
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            jb_1.jb.component('group.watch', {
                type: 'feature',
                params: {
                    data: { essential: true, dynamic: true },
                },
                impl: function (context, data, emptyGroupWhenDataEmpty) {
                    return {
                        ctrlsEmFunc: function (originalCtrlsEmFunc, ctx, cmp) {
                            return cmp.jbEmitter
                                .map(function () {
                                return jb_1.jb.val(data());
                            })
                                .distinctUntilChanged()
                                .map(function (x) {
                                console.log('group.watch: data changed', x);
                                return x;
                            })
                                .flatMap(function (x) {
                                return originalCtrlsEmFunc(ctx);
                            });
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            jb_1.jb.component('feature.init', {
                type: 'feature',
                params: {
                    action: { type: 'action[]', essential: true, dynamic: true }
                },
                impl: function (ctx, action) { return ({ init: function (cmp) {
                        return action(cmp.ctx);
                    }
                }); }
            });
            jb_1.jb.component('ngAtts', {
                type: 'feature',
                params: {
                    atts: { as: 'object' }
                },
                impl: function (ctx, atts) {
                    return ({ atts: atts });
                }
            });
            jb_1.jb.component('feature.afterLoad', {
                type: 'feature',
                params: {
                    action: { type: 'action[]', essential: true, dynamic: true }
                },
                impl: function (context) {
                    return {
                        afterViewInit: function (cmp) { return jb_1.jb.delay(1).then(function () { return context.params.action(cmp.ctx); }); }
                    };
                }
            });
            jb_1.jb.component('feature.emitter', {
                type: 'feature',
                params: {
                    varName: { as: 'string' },
                },
                impl: function (context, varName) {
                    return {
                        extendCtx: function (ctx, cmp) { return ctx.setVars(jb_1.jb.obj(varName, cmp.jbEmitter)); },
                        observable: function (obs, ctx) { },
                    };
                }
            });
            jb_1.jb.component('hidden', {
                type: 'feature',
                params: {
                    showCondition: { type: 'boolean', essential: true, dynamic: true },
                },
                impl: function (context, showCondition) {
                    return {
                        init: function (cmp) {
                            cmp.jb_hidden = function () {
                                return !showCondition(cmp.ctx);
                            };
                        },
                        atts: { '[hidden]': 'jb_hidden()' }
                    };
                }
            });
            jb_1.jb.component('oneWayBind', {
                type: 'feature',
                params: {
                    value: { essential: true, dynamic: true },
                    to: { essential: true, as: 'ref' },
                },
                impl: function (context, value, to) {
                    return {
                        doCheck: function (cmp) {
                            jb_1.jb.writeValue(jb_ui.ngRef(to, cmp), value(cmp.ctx));
                        }
                    };
                }
            });
            jb_1.jb.component('css', {
                type: 'feature',
                params: {
                    css: { essential: true, as: 'string' },
                },
                impl: function (context, css) { return jb_1.jb.obj('styles', css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; })); }
            });
            jb_1.jb.component('cssClass', {
                type: 'feature',
                params: {
                    cssClass: { essential: true, as: 'string' },
                },
                impl: function (context, cssClass) { return jb_1.jb.obj('atts', { class: cssClass }); }
            });
            jb_1.jb.component('feature.keyboard-shortcut', {
                type: 'feature',
                params: {
                    key: { as: 'string', description: 'e.g. alt-C' },
                    action: { type: 'action', dynamic: true }
                },
                impl: function (context, key, action) {
                    return ({
                        init: function (cmp) {
                            var doc = cmp.elementRef.nativeElement.ownerDocument;
                            $(doc).keydown(function (event) {
                                var keyCode = key.split('-').pop().charCodeAt(0);
                                var helper = (key.match('([a-z]*)-') || ['', ''])[1];
                                if (helper == 'ctrl' && !event.ctrlKey)
                                    return;
                                if (helper == 'alt' && !event.altKey)
                                    return;
                                if (event.keyCode == keyCode)
                                    action();
                            });
                        }
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=features.js.map