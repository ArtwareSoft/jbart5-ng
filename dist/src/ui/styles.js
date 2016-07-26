System.register(['jb-core', 'jb-ui', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('customStyle', {
                typePattern: /.*-style/,
                params: {
                    template: { as: 'string', essential: true },
                    css: { as: 'string' },
                    features: { type: 'feature[]', dynamic: true },
                    methods: { as: 'object' },
                    atts: { as: 'object' },
                    noViewEncapsulation: { as: 'boolean', type: 'boolean' },
                    directives: { ignore: true }
                },
                impl: function (context, template, css, features, methods, atts, noViewEncapsulation) {
                    var options = jb_core_1.jb.extend({
                        jbTemplate: template,
                        css: css,
                        atts: atts,
                        directives: context.profile.directives,
                        featuresOptions: features()
                    }, methods);
                    if (noViewEncapsulation)
                        jb_core_1.jb.extend(options, { encapsulation: core_1.ViewEncapsulation.None });
                    return options;
                }
            });
            jb_core_1.jb.component('custom-control', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    html: { as: 'string', essential: true, defaultValue: '<div></div>' },
                    css: { as: 'string' },
                    options: { as: 'object' },
                },
                impl: function (ctx, title, html, css, options) {
                    var defaultOptions = { directives: jb_core_1.jb.entries(jbart.ng.directives)
                            .map(function (x) { return x[0]; })
                    };
                    return jb_ui.Comp(jb_core_1.jb.extend({ template: html, css: css }, defaultOptions, options), ctx);
                }
            });
        }
    }
});
