System.register(['jb-core', '@angular2-material/slide-toggle/slide-toggle.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, slide_toggle_js_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (slide_toggle_js_1_1) {
                slide_toggle_js_1 = slide_toggle_js_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('editable-boolean.md-slide-toggle', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><md-slide-toggle %$field.modelExp% >{{text()}}</md-slide-toggle></span>",
                    directives: [slide_toggle_js_1.MdSlideToggle]
                }
            });
            jb_core_1.jb.component('editable-boolean.md-slide-toggle-fixed', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><md-slide-toggle color=\"primary\" class=\"fix-slide-toggle\" %$field.modelExp% >{{text()}}</md-slide-toggle></span>",
                    css: "\n  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-thumb {\n    background-color: #1f1f1f !important}\n  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-bar {\n    background-color: #858585 !important; opacity: 0.5 }\n  .fix-slide-toggle.md-primary.md-slide-toggle-focused .md-ink-ripple {\n    opacity: 1; background-color: #858585 !important; \n    background-color-old: rgba(0, 150, 136, 0.26); }\n      ",
                    noViewEncapsulation: true,
                    directives: [slide_toggle_js_1.MdSlideToggle]
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
