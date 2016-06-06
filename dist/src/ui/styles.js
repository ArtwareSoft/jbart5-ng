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
                    css: { as: 'string' },
                    features: { type: 'feature[]', dynamic: true },
                    methods: { as: 'object' },
                    atts: { as: 'object' },
                },
                impl: function (context, template, css, features, methods, atts, directives) {
                    var options = jb_core_1.jb.extend({
                        jbTemplate: template,
                        css: css,
                        atts: atts,
                        directives: context.profile.directives,
                        featuresOptions: features()
                    }, methods);
                    return options;
                }
            });
            // jb.component('customCssStyle', {
            // 	typePattern: /.*-style/,
            // 	params: {
            // 		basedOn: {},
            // 		css: { as: 'string'},
            // 	},
            // 	impl: function (context,basedOn,css) {
            // 		return jb.extend({},basedOn, { css: css })
            // 	}
            // })
            jb_core_1.jb.component('custom-control', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    html: { as: 'string', essential: true, defaultValue: '<div></div>' },
                    css: { as: 'string' },
                    methods: { as: 'object' },
                },
                impl: function (ctx, html, css) {
                    return jb_ui.Comp({ template: html, css: css, methods: methods }, ctx);
                }
            });
        }
    }
});
