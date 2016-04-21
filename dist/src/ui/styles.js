System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
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
        }
    }
});
