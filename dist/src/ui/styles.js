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
            jb_core_1.jb.component('customStyle', {
                typePattern: /.*-style/,
                params: {
                    template: { as: 'string', essential: true },
                    isInnerTemplate: { type: 'boolean', as: 'boolean' },
                    css: { as: 'string' },
                    atts: { as: 'object' },
                    methods: { as: 'object' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context, template, isInner, css, atts, methods, features) {
                    var options = jb_core_1.jb.extend(jb_core_1.jb.obj(isInner ? 'template' : 'jbTemplate', template), {
                        styles: css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }),
                        atts: atts,
                        featuresOptions: features()
                    }, methods);
                    return options;
                }
            });
            jb_core_1.jb.component('customCssStyle', {
                typePattern: /.*-style/,
                params: {
                    basedOn: {},
                    css: { as: 'string' },
                },
                impl: function (context, basedOn, css) {
                    return jb_core_1.jb.extend({}, basedOn, {
                        styles: css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }),
                    });
                }
            });
            jb_core_1.jb.component('custom-control', {
                type: 'control',
                params: {
                    template: { as: 'string', essential: true },
                    isInnerTemplate: { type: 'boolean', as: 'boolean' },
                    css: { as: 'string' },
                    atts: { as: 'object' },
                    methods: { as: 'object' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context, template, isInner, css, atts, methods, features) {
                    return jb_ui.Comp({}, context).jbExtend(jb_core_1.jb.extend(jb_core_1.jb.obj(isInner ? 'template' : 'jbTemplate', template), {
                        styles: css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }),
                        atts: atts,
                        featuresOptions: features()
                    }, methods));
                }
            });
        }
    }
});