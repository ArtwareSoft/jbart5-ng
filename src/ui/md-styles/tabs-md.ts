import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MD_TABS_DIRECTIVES} from '@angular2-material/tabs/tabs.js';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';

jb_ui.registerDirectives({MD_TABS_DIRECTIVES: MD_TABS_DIRECTIVES, MdToolbar:MdToolbar});

jb.component('tabs.md', {
  type: 'tabs.style',
    impl :{$: 'customStyle',
      template: `<div><md-tab-group>
  <md-tab *ngFor="let tab of comps">
    <template md-tab-label>{{tab.jb_title()}}</template>
    <template md-tab-content>
      <jb_comp [comp]="tab"></jb_comp>
    </template>
  </md-tab>
</md-tab-group></div>`,
      features :{$: 'tabs.initTabs'},
      directives: ['MD_TABS_DIRECTIVES','MdToolbar']
    }
})

