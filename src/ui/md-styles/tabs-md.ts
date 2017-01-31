import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import { MdTabsModule } from '@angular/material';

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

