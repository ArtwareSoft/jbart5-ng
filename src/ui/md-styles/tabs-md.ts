import {jb} from 'jb-core';
import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs/tabs.js';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';

jb.component('tabs.md', {
  type: 'tabs.style',
    impl :{$: 'customStyle',
      template: `<md-tab-group>
  <md-tab *ngFor="let tab of comps">
    <template md-tab-label>aa{{tab.jb_title()}}</template>
    <template md-tab-content>
      <jb_comp [comp]="tab"></jb_comp>
    </template>
  </md-tab>
</md-tab-group>`,
      features :{$: 'tabs.initTabs'},
      directives: [MD_TABS_DIRECTIVES,MdToolbar]
    }
})

