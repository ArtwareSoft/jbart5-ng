System.register(['jb-core', 'jb-ui', '@angular2-material/input/input.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, input_js_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (input_js_1_1) {
                input_js_1 = input_js_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MdInput: input_js_1.MdInput });
            jb_core_1.jb.component('editable-text.md-input', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: "<span><md-input %$field.modelExp% placeholder=\"{{title}}\"></md-input></span>",
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.title = ctx.vars.$model.title();
                        }; }
                    },
                    directives: 'MdInput'
                }
            });
        }
    }
});
