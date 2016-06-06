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
        }
    }
});
