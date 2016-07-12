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
            jb_core_1.jb.type('theme');
            jb_core_1.jb.component('group.theme', {
                type: 'feature',
                params: {
                    theme: { type: 'theme' },
                },
                impl: function (context, theme) { return ({
                    extendCtx: function (ctx, cmp) {
                        return ctx.setVars(theme);
                    }
                }); }
            });
            jb_core_1.jb.component('theme.material-design', {
                type: 'theme',
                impl: function () { return ({
                    '$editable-text.default-style-profile': 'editable-text.md-input'
                }); }
            });
        }
    }
});
