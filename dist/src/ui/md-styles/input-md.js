System.register(['jb-core', '@angular/material'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, material_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (material_1_1) {
                material_1 = material_1_1;
            }],
        execute: function() {
            //jb_ui.registerDirectives({MdInput: MdInput});
            jb_core_1.jb.component('editable-text.md-input', {
                type: 'editable-text.style',
                params: [
                    { id: 'width', as: 'number' },
                ],
                impl: { $: 'customStyle',
                    features: { $: 'field.databind' },
                    template: "<div><md-input [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\" (keyup)=\"jbModel($event.target.value,'keyup')\" placeholder=\"{{title}}\"></md-input></div>",
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            return cmp.title = ctx.vars.$model.title();
                        }; }
                    },
                    css: 'md-input { {?width: %$width%px?} }',
                    imports: material_1.MdInputModule
                }
            });
        }
    }
});
