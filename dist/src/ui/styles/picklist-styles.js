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
                    features: { $: 'field.databind' },
                    template: "<div><select [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\">\n                    <option *ngFor=\"let option of options\" [value]=\"option.code\">{{option.text}}</option>\n                 </select></div>",
                    css: "\nselect { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857; color: #555555; background-color: #fff; background-image: none; border: 1px solid #ccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\nselect:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\nselect::-moz-placeholder { color: #999; opacity: 1; }\nselect:-ms-input-placeholder { color: #999; }\nselect::-webkit-input-placeholder { color: #999; }\nselect::-ms-expand { border: 0; background-color: transparent; }\nselect[disabled], select[readonly] { background-color: #eeeeee; opacity: 1; }\n    "
                }
            });
            jb_core_1.jb.component('picklist.groups', {
                type: 'picklist.style',
                impl: { $: 'customStyle',
                    features: { $: 'field.databind' },
                    template: "<div><select [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\">\n      <option *ngIf=\"hasEmptyOption\" [value]=\"\"></option>\n    <optgroup *ngFor=\"let group of groups\" label=\"{{group.text}}\">\n\t    <option *ngFor=\"let option of group.options\" [value]=\"option.code\">{{option.text}}</option>\n    </optgroup>\n    </select></div>",
                    css: "\nselect { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857; color: #555555; background-color: #fff; background-image: none; border: 1px solid #ccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\nselect:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\nselect::-moz-placeholder { color: #999; opacity: 1; }\nselect:-ms-input-placeholder { color: #999; }\nselect::-webkit-input-placeholder { color: #999; }\nselect::-ms-expand { border: 0; background-color: transparent; }\nselect[disabled], select[readonly] { background-color: #eeeeee; opacity: 1; }\n    "
                }
            });
        }
    }
});
