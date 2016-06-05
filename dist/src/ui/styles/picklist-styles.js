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
            jb_core_1.jb.component('picklist.native', {
                type: 'picklist.style',
                impl: { $: 'customStyle',
                    template: "<div><select %$field.modelExp%>\n                    <option *ngFor=\"let option of options\" [value]=\"option.code\">{{option.text}}</option>\n                 </select></div>",
                    css: 'select {height: 23px}'
                }
            });
            jb_core_1.jb.component('picklist.groups', {
                type: 'picklist.style',
                impl: { $: 'customStyle',
                    template: "<div><select %$field.modelExp%>\n    <optgroup *ngFor=\"let group of groups\" label=\"{{group.text}}\">\n\t    <option *ngFor=\"let option of group.options\" [value]=\"option.code\">{{option.text}}</option>\n    </optgroup>\n    </select></div>"
                }
            });
        }
    }
});
//      	<option *ngFor="let option of optionsOfGroup(group)" [value]="option.code">{{option.text}}</option>
// template: `<div><select %$field.modelExp%>
//   <optgorup *ngFor="let option of options">{{option.text}}
//   </optgorup>
//   </select></div>`,
