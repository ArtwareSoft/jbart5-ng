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
            jb_core_1.jb.component('editable-boolean.md-slide-toggle', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    features: { $: 'field.databind' },
                    template: "<div><md-slide-toggle [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\">{{text()}}</md-slide-toggle></div>",
                    imports: material_1.MdSlideToggleModule
                }
            });
            jb_core_1.jb.component('editable-boolean.md-slide-toggle-fixed', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    features: { $: 'field.databind' },
                    template: "<div><md-slide-toggle color=\"primary\" class=\"fix-slide-toggle\" [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\">{{text()}}</md-slide-toggle></div>",
                    css: "\n  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-thumb {\n    background-color: #1f1f1f !important}\n  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-bar {\n    background-color: #858585 !important; opacity: 0.5 }\n  .fix-slide-toggle.md-primary.md-slide-toggle-focused .md-ink-ripple {\n    opacity: 1; background-color: #858585 !important; \n    background-color-old: rgba(0, 150, 136, 0.26); }\n      ",
                    imports: material_1.MdSlideToggleModule
                }
            });
        }
    }
});
// $mdThemingProvider.definePalette('jbStudio', {
//   '50': '#858585',
//   '100': '#5e5e5e',
//   '200': '#424242',
//   '300': '#1f1f1f',
//   '400': '#0f0f0f',
//   '500': '#000000',
//   '600': '#000000',
//   '700': '#000000',
//   '800': '#000000',
//   '900': '#000000',
//   'A100': '#858585',
//   'A200': '#5e5e5e',
//   'A400': '#0f0f0f',
//   'A700': '#000000',
//   'contrastDefaultColor': 'light',
//   'contrastDarkColors': '50 A100'
// });
