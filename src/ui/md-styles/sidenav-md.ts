import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav/sidenav';

jb_ui.registerDirectives({MD_SIDENAV_DIRECTIVES: MD_SIDENAV_DIRECTIVES});

jb.component('sidenav.md', {
  type: 'sidenav.style',
  params: {
    width: { as: 'number' },
    align: { options: 'start,end', as: 'string'},
    mode: { options: 'over,push,side', as: 'string'},
    opened: { as: 'boolean', type: 'boolean' }
  },
  impl :{$: 'customStyle',
    template: `<md-sidenav-layout>
      <md-sidenav>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" align="%$align%" mode="%$mode%"></jb_comp>
      </md-sidenav>
      </md-sidenav-layout>`,
    css: `md-sidenav { width: %$width%px }`,
    features :{$: 'group.initGroup'}
  }
})
