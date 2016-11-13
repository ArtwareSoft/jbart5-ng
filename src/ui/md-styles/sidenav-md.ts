import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdSidenavModule} from '@angular/material';

jb.component('sidenav.md', {
  type: 'sidenav.style',
  params: [
    { id: 'width', as: 'number' },
    { id: 'align', options: 'start,end', as: 'string'},
    { id: 'mode', options: 'over,push,side', as: 'string'},
    { id: 'opened', as: 'boolean', type: 'boolean' }
  ],
  impl :{$: 'customStyle',
    template: `<md-sidenav-layout>
      <md-sidenav>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" align="%$align%" mode="%$mode%"></jb_comp>
      </md-sidenav>
      </md-sidenav-layout>`,
    css: `md-sidenav { width: %$width%px }`,
    features :{$: 'group.initGroup'},
    imports: MdSidenavModule
  }
})
