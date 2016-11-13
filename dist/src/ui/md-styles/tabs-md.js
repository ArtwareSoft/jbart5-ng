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
            jb_core_1.jb.component('tabs.md-tabs', {
                params: [
                    { id: 'tabWidth', as: 'number' }
                ],
                type: 'tabs.style',
                impl: { $: 'customStyle',
                    template: "<div><md-tab-group>\n  <md-tab *ngFor=\"let tab of comps\">\n    <template md-tab-label>{{tab.jb_title()}}</template>\n    <template md-tab-content>\n      <jb_comp [comp]=\"tab\"></jb_comp>\n    </template>\n  </md-tab>\n</md-tab-group></div>",
                    css: '{?!.md-tab-label { min-width: %$tabWidth%px} ?}',
                    features: { $: 'tabs.initTabs' },
                    imports: material_1.MdTabsModule
                }
            });
        }
    }
});
