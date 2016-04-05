System.register(['js/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            jb_1.jb.component('customStyle', {
                typePattern: /.*-style/,
                params: {
                    template: { as: 'string', essential: true },
                    isInnerTemplate: { type: 'boolean', as: 'boolean' },
                    css: { as: 'string' },
                    atts: { as: 'object' },
                    methods: { as: 'object' },
                    features: { ignore: true },
                },
                impl: function (context, template, isInner, css, atts, methods) {
                    var options = jb_1.jb.extend(jb_1.jb.obj(isInner ? 'template' : 'jbTemplate', template), {
                        styles: css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }),
                        atts: atts,
                    }, methods);
                    if (context.profile.features)
                        jb_1.jb.extend(options, { features: jb_1.jb.toarray(context.profile.features) });
                    return options;
                }
            });
            jb_1.jb.component('customCssStyle', {
                typePattern: /.*-style/,
                params: {
                    basedOn: {},
                    css: { as: 'string' },
                },
                impl: function (context, basedOn, css) {
                    return jb_1.jb.extend({}, basedOn, {
                        styles: css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }),
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=styles.js.map