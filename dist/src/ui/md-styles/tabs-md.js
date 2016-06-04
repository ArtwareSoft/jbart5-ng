System.register(['jb-core', '@angular2-material/tabs/tabs.js', '@angular2-material/toolbar/toolbar'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, tabs_js_1, toolbar_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (tabs_js_1_1) {
                tabs_js_1 = tabs_js_1_1;
            },
            function (toolbar_1_1) {
                toolbar_1 = toolbar_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('tabs.md', {
                type: 'tabs.style',
                impl: { $: 'customStyle',
                    template: "<md-tab-group>\n  <md-tab *ngFor=\"let tab of comps\">\n    <template md-tab-label>aa{{tab.jb_title()}}</template>\n    <template md-tab-content>\n      <jb_comp [comp]=\"tab\"></jb_comp>\n    </template>\n  </md-tab>\n</md-tab-group>",
                    features: { $: 'tabs.initTabs' },
                    directives: [tabs_js_1.MD_TABS_DIRECTIVES, toolbar_1.MdToolbar]
                }
            });
        }
    }
});
