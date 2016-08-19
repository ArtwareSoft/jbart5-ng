System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.component('group.wait', {
                type: 'feature',
                params: {
                    for: { essential: true },
                    loadingControl: { type: 'control', defaultValue: { $: 'label', title: 'loading ...' }, dynamic: true },
                    error: { type: 'control', defaultValue: { $: 'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}' }, dynamic: true },
                    resource: { as: 'string' },
                    mapToResource: { dynamic: true, defaultValue: '%%' },
                },
                impl: function (context, waitFor, loading, error) {
                    return {
                        beforeInit: function (cmp) {
                            var waiting = cmp.jbWait();
                            cmp.jbGroupChildrenEm = jb_rx.observableFromCtx(context.setData(waitFor))
                                .flatMap(function (x) {
                                var data = context.params.mapToResource(x);
                                jb_core_1.jb.writeToResource(context.params.resource, data, context);
                                return [context.vars.$model.controls(cmp.ctx.setData(data))];
                            })
                                .do(function (x) {
                                return waiting.ready();
                            })
                                .startWith([loading(context)])
                                .catch(function (e) {
                                return jb_rx.Observable.of([error(context.setVars({ error: e }))]);
                            });
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            // bind data and watch the data to refresh the control
            jb_core_1.jb.component('group.data', {
                type: 'feature',
                params: {
                    data: { essential: true, dynamic: true, as: 'ref' },
                    itemVariable: { as: 'string' },
                    watch: { type: 'boolean', as: 'boolean', defaultValue: true }
                },
                impl: function (context, data, itemVariable, watch) {
                    return {
                        beforeInit: function (cmp) {
                            var dataEm = cmp.jbEmitter
                                .filter(function (x) { return x == 'check'; })
                                .map(function () {
                                return jb_core_1.jb.val(data());
                            })
                                .distinctUntilChanged(jb_compareArrays)
                                .map(function (val) {
                                var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx).setData(val);
                                var ctx3 = itemVariable ? ctx2.setVars(jb_core_1.jb.obj(itemVariable, val)) : ctx2;
                                return context.vars.$model.controls(ctx3);
                            });
                            cmp.jbGroupChildrenEm = watch ? dataEm : dataEm.take(1);
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            jb_core_1.jb.component('group.watch', {
                type: 'feature',
                params: {
                    data: { essential: true, dynamic: true },
                },
                impl: function (context, data) { return ({
                    beforeInit: function (cmp) {
                        cmp.jbWatchGroupChildrenEm = (cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
                            .merge(cmp.jbEmitter
                            .filter(function (x) { return x == 'check'; })
                            .map(function () {
                            return jb_core_1.jb.val(data());
                        })
                            .filter(function (x) { return x != null; })
                            .distinctUntilChanged(jb_compareArrays)
                            .map(function (val) {
                            var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx);
                            return context.vars.$model.controls(ctx2);
                        }));
                    },
                    observable: function () { } // to create jbEmitter
                }); }
            });
            jb_core_1.jb.component('group-item.if', {
                type: 'feature',
                params: {
                    showCondition: { type: 'boolean', as: 'boolean', essential: true },
                },
                impl: function (context, condition) { return ({
                    invisible: !condition
                }); }
            });
            jb_core_1.jb.component('feature.init', {
                type: 'feature',
                params: {
                    action: { type: 'action[]', essential: true, dynamic: true }
                },
                impl: function (ctx, action) { return ({ init: function (cmp) {
                        return action(cmp.ctx);
                    }
                }); }
            });
            jb_core_1.jb.component('feature.ng-attach-object', {
                type: 'feature',
                params: {
                    data: { as: 'single', dynamic: true }
                },
                impl: function (ctx, data) { return ({ init: function (cmp) {
                        var obj = data(cmp.ctx);
                        jb_core_1.jb.extend(cmp, obj);
                        jb_core_1.jb.extend(cmp.constructor.prototype, obj.constructor.prototype || {});
                    } }); }
            });
            jb_core_1.jb.component('feature.disableChangeDetection', {
                type: 'feature',
                impl: function (ctx) { return ({
                    disableChangeDetection: true }); }
            });
            jb_core_1.jb.component('feature.onEnter', {
                type: 'feature',
                params: {
                    action: { type: 'action[]', essential: true, dynamic: true }
                },
                impl: function (ctx) { return ({
                    host: {
                        '(keydown)': 'keydown.next($event)',
                        'tabIndex': '0',
                    },
                    init: function (cmp) {
                        cmp.keydown = cmp.keydown || new Subject();
                        cmp.keydown.filter(function (e) { return e.keyCode == 13; })
                            .subscribe(function () {
                            return jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx, cmp.elementRef)();
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('ngAtts', {
                type: 'feature',
                params: {
                    atts: { as: 'object' }
                },
                impl: function (ctx, atts) {
                    return ({ atts: atts });
                }
            });
            jb_core_1.jb.component('feature.afterLoad', {
                type: 'feature',
                params: {
                    action: { type: 'action[]', essential: true, dynamic: true }
                },
                impl: function (context) {
                    return {
                        afterViewInit: function (cmp) { return jb_core_1.jb.delay(1).then(function () { return context.params.action(cmp.ctx); }); }
                    };
                }
            });
            jb_core_1.jb.component('feature.emitter', {
                type: 'feature',
                params: {
                    varName: { as: 'string' },
                },
                impl: function (context, varName) {
                    return {
                        extendCtx: function (ctx, cmp) {
                            return ctx.setVars(jb_core_1.jb.obj(varName, cmp.jbEmitter));
                        },
                        observable: function (obs, ctx) { },
                    };
                }
            });
            jb_core_1.jb.component('var', {
                type: 'feature',
                params: {
                    name: { as: 'string' },
                    value: { dynamic: true },
                },
                impl: function (context, name, value) {
                    return jb_core_1.jb.extend({}, name && {
                        extendCtx: function (ctx) {
                            return ctx.setVars(jb_core_1.jb.obj(name, value(ctx)));
                        }
                    });
                }
            });
            jb_core_1.jb.component('hidden', {
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
            jb_core_1.jb.component('field.style-on-focus', {
                type: 'feature',
                params: {
                    style: { type: 'style', essential: true, dynamic: true },
                },
                impl: function (ctx) { return ({
                    extendComp: { jb_styleOnFocus: ctx.profile.style }
                }); }
            });
            jb_core_1.jb.component('css', {
                type: 'feature,dialogFeature',
                params: {
                    css: { essential: true, as: 'string' },
                },
                impl: function (context, css) {
                    return ({ css: css });
                }
            });
            jb_core_1.jb.component('css.width', {
                type: 'feature,dialogFeature',
                params: {
                    width: { essential: true, as: 'number' },
                },
                impl: function (context, width) {
                    return ({ css: "{ width: " + width + "px}" });
                }
            });
            jb_core_1.jb.component('css.padding', {
                type: 'feature,dialogFeature',
                params: {
                    top: { as: 'number' },
                    left: { as: 'number' },
                    right: { as: 'number' },
                    bottom: { as: 'number' },
                    selector: { as: 'string' },
                },
                impl: function (ctx) {
                    var css = ['top', 'left', 'right', 'bottom']
                        .filter(function (x) { return ctx.params[x] != null; })
                        .map(function (x) { return ("padding-" + x + ": " + ctx.params[x] + "px"); })
                        .join('; ');
                    return { css: ctx.params.selector + " {" + css + "}" };
                }
            });
            jb_core_1.jb.component('css.margin', {
                type: 'feature,dialogFeature',
                params: {
                    top: { as: 'number' },
                    left: { as: 'number' },
                    right: { as: 'number' },
                    bottom: { as: 'number' },
                    selector: { as: 'string' },
                },
                impl: function (ctx) {
                    var css = ['top', 'left', 'right', 'bottom']
                        .filter(function (x) { return ctx.params[x] != null; })
                        .map(function (x) { return ("margin-" + x + ": " + ctx.params[x] + "px"); })
                        .join('; ');
                    return { css: ctx.params.selector + " {" + css + "}" };
                }
            });
            jb_core_1.jb.component('css.box-shadow', {
                type: 'feature,dialogFeature',
                params: {
                    blurRadius: { as: 'number', defaultValue: 5 },
                    spreadRadius: { as: 'number', defaultValue: 0 },
                    shadowColor: { as: 'string', defaultValue: '#000000' },
                    opacity: { as: 'number', min: 0, max: 1, defaultValue: 0.75, step: 0.01 },
                    horizontal: { as: 'number', defaultValue: 10 },
                    vertical: { as: 'number', defaultValue: 10 },
                    selector: { as: 'string' },
                },
                impl: function (context, blurRadius, spreadRadius, shadowColor, opacity, horizontal, vertical, selector) {
                    var color = [parseInt(shadowColor.slice(1, 3), 16) || 0, parseInt(shadowColor.slice(3, 5), 16) || 0, parseInt(shadowColor.slice(5, 7), 16) || 0]
                        .join(',');
                    return ({ css: selector + " { box-shadow: " + horizontal + "px " + vertical + "px " + blurRadius + "px " + spreadRadius + "px rgba(" + color + "," + opacity + ") }" });
                }
            });
            jb_core_1.jb.component('cssClass', {
                type: 'feature,dialogFeature',
                params: {
                    cssClass: { essential: true, as: 'string' },
                },
                impl: function (context, cssClass) {
                    return ({ atts: { class: cssClass } });
                }
            });
            jb_core_1.jb.component('feature.keyboard-shortcut', {
                type: 'feature',
                params: {
                    key: { as: 'string', description: 'e.g. Alt+C' },
                    action: { type: 'action', dynamic: true }
                },
                impl: function (context, key, action) {
                    return ({
                        init: function (cmp) {
                            var doc = cmp.elementRef.nativeElement.ownerDocument;
                            $(doc).keydown(function (event) {
                                var keyCode = key.split('+').pop().charCodeAt(0);
                                if (key == 'Delete')
                                    keyCode = 46;
                                var helper = (key.match('([A-Za-z]*)+') || ['', ''])[1];
                                if (helper == 'Ctrl' && !event.ctrlKey)
                                    return;
                                if (helper == 'Alt' && !event.altKey)
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
