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
            jb_core_1.jb.component('editable-boolean.checkbox', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><input type=\"checkbox\" %$field.modelExp%></span>",
                }
            });
            jb_core_1.jb.component('editable-boolean.checkbox-with-title', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><input type=\"checkbox\" %$field.modelExp%>{{text()}}</span>",
                }
            });
            jb_core_1.jb.component('editable-boolean.expand-collapse', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><input type=\"checkbox\" %$field.modelExp%>\n      \t<i class=\"material-icons\" (click)=\"toggle()\">{{jbModel ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      </span>",
                    css: "i { font-size:16px; cursor: pointer; user-select: none }\n      \t\tinput { display: none }"
                }
            });
        }
    }
});
