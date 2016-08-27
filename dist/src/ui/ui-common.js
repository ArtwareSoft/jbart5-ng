System.register(['jb-core', 'jb-ui', 'jb-ui/jb-ui-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, ui_utils;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (ui_utils_1) {
                ui_utils = ui_utils_1;
            }],
        execute: function() {
            jb_core_1.jb.component('add-css-class', {
                type: 'action',
                params: {
                    cssClass: { as: 'string' }
                },
                impl: function (context, cssClass) {
                    if (context.vars.control && context.vars.control.$el)
                        context.vars.control.$el.addClass(cssClass);
                }
            });
            jb_core_1.jb.component('url-param', {
                type: 'data',
                params: {
                    param: { as: 'string' }
                },
                impl: function (context, param) {
                    return ui_utils.urlParam(param);
                }
            });
            jb_core_1.jb.component('sessionStorage', {
                type: 'data',
                params: {
                    key: { as: 'string' }
                },
                impl: function (context, key) {
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return sessionStorage[key];
                            else
                                sessionStorage[key] = jb_core_1.jb.tostring(value);
                        }
                    };
                }
            });
            jb_core_1.jb.component('goto-url', {
                type: 'action',
                description: 'navigate/open a new web page, change href location',
                params: {
                    url: { as: 'string', essential: true },
                    target: { type: 'enum', values: ['new tab', 'self'], defaultValue: 'new tab', as: 'string' }
                },
                impl: function (context, url, target) {
                    var _target = (target == 'new tab') ? '_blank' : '_self';
                    window.open(url, _target);
                }
            });
            jb_core_1.jb.component('apply', {
                type: 'action',
                impl: jb_ui.apply
            });
            jb_core_1.jb.component('search-filter', {
                type: 'aggregator',
                params: {
                    pattern: { as: 'string' }
                },
                impl: function (context, pattern) {
                    return context.data.filter(function (item) {
                        var itemText = JSON.stringify(item).toLowerCase();
                        return !pattern || itemText.indexOf(pattern.toLowerCase()) != -1;
                    });
                }
            });
            jb_core_1.jb.component('new-instance', {
                type: 'data',
                params: {
                    module: { as: 'string', essential: true },
                    class: { as: 'string', essential: true },
                },
                impl: function (ctx, module, _class) {
                    try {
                        return new (jb_core_1.jb.entries(System._loader.modules).filter(function (p) { return p[0].indexOf(module) != -1; })[0][1].module[_class])();
                    }
                    catch (e) {
                        return;
                    }
                }
            });
            jb_core_1.jb.component('injector-get', {
                type: 'data',
                params: {
                    provider: { as: 'string', essential: true },
                },
                impl: function (ctx, providerId) {
                    var provider = jbart.ng.providers[providerId];
                    if (provider)
                        return ctx.vars.injector.get(provider);
                    jb_core_1.jb.logError('injector-get: provider ' + providerId + ' is not registered. Use jb_ui.registerProviders to register it');
                }
            });
        }
    }
});
