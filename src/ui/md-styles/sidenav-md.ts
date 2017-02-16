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
      <md-sidenav align="%$align%" mode="%$mode%">
        <div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div>
      </md-sidenav>
      </md-sidenav-layout>`,
    css: `md-sidenav { width: %$width%px }`,
    features :{$: 'group.init-group'},
    imports: MdSidenavModule
  }
})
