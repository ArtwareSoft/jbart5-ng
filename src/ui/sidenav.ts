import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('sidenav.style');

jb.component('sidenav',{
  type: 'control',
  params: {
    controls: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
    title: { as: 'string' , dynamic: true },
    style: { type: 'sidenav.style', defaultValue: { $: 'sidenav.md' }, essential: true , dynamic: true },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: ctx =>
    jbart.comps.group.impl(ctx)
})

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
        <jb_comp *ngFor="var ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" align="%$align%" mode="%$mode%"></jb_comp>
      </md-sidenav>
      </md-sidenav-layout>`,
    css: `md-sidenav { width: %$width%px }`,
    features :{$: 'group.initGroup'}
  }
})