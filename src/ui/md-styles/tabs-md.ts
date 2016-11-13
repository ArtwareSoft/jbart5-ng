import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import { MdTabsModule } from '@angular/material';

jb.component('tabs.md-tabs', {
  params: [
    { id: 'tabWidth', as: 'number' }
  ],
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
       css: '{?!.md-tab-label { min-width: %$tabWidth%px} ?}',
      features :{$: 'tabs.initTabs'},
      imports: MdTabsModule
    }
})

