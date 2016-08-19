System.register(['jb-core', 'jb-ui', '@angular2-material/tabs/tabs.js', '@angular2-material/toolbar/toolbar'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, tabs_js_1, toolbar_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (tabs_js_1_1) {
                tabs_js_1 = tabs_js_1_1;
            },
            function (toolbar_1_1) {
                toolbar_1 = toolbar_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MD_TABS_DIRECTIVES: tabs_js_1.MD_TABS_DIRECTIVES, MdToolbar: toolbar_1.MdToolbar, TABS_INTERNAL_DIRECTIVES: tabs_js_1.TABS_INTERNAL_DIRECTIVES });
            jb_core_1.jb.component('tabs.md-tabs', {
                params: {
                    tabWidth: { as: 'number' }
                },
                type: 'tabs.style',
                impl: { $: 'customStyle',
                    template: "<div><md-tab-group>\n  <md-tab *ngFor=\"let tab of comps\">\n    <template md-tab-label>{{tab.jb_title()}}</template>\n    <template md-tab-content>\n      <jb_comp [comp]=\"tab\"></jb_comp>\n    </template>\n  </md-tab>\n</md-tab-group></div>",
                    css: '{?!.md-tab-label { min-width: %$tabWidth%px} ?}',
                    features: { $: 'tabs.initTabs' },
                    directives: ['MD_TABS_DIRECTIVES']
                }
            });
        }
    }
});
