System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
// not working yet ...
// jb.component('tabs.md-tabs', {
//   params: [
//     { id: 'tabWidth', as: 'number' }
//   ],
//   type: 'tabs.style',
//     impl :{$: 'customStyle', noTemplateParsing: true,
//       template: `<div><md-tab-group [selectedIndex]="0">
//   <md-tab *ngFor="let tab of comps">
//     <template md-tab-label>{{tab.jb_title()}}c</template>
//     <template md-tab-content>
//        <jb_comp *ngFor="let comp of selectedTabContent(selectedIndex)" [comp]="comp"></jb_comp>
//     </template>
//   </md-tab>
// </md-tab-group></div>`,
//        css: '{?!.md-tab-label { min-width: %$tabWidth%px} ?}',
//       features :{$: 'tabs.initTabs'},
//       imports: MdTabsModule
//     }
// })
