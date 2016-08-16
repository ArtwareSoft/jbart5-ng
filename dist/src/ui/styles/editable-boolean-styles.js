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
                    template: "<div><input type=\"checkbox\" %$field.modelExp%></div>",
                }
            });
            jb_core_1.jb.component('editable-boolean.checkbox-with-title', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<div><input type=\"checkbox\" %$field.modelExp%>{{text()}}</div>",
                }
            });
            jb_core_1.jb.component('editable-boolean.expand-collapse', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<div><input type=\"checkbox\" %$field.modelExp%>\n      \t<i class=\"material-icons noselect\" (click)=\"toggle()\">{{jbModel ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      </div>",
                    css: "i { font-size:16px; cursor: pointer; }\n      \t\tinput { display: none }"
                }
            });
        }
    }
});
