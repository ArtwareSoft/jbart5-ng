import {jb} from 'jb-core';

jb.component('layout.vertical', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 3 }
  },
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
      css: `.group-item { margin-bottom: %$spacing%px; display: block }
        .group-item:last-child { margin-bottom:0 }`,
    features :{$: 'group.initGroup'}
  }
})

jb.component('layout.horizontal', {
  type: 'group.style',
  params: {
    spacing: { as: 'number', defaultValue: 3 }
  },
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
    css: `{display: flex}
        .group-item { margin-right: %$spacing%px }
        .group-item:last-child { margin-right:0 }`,
    features :{$: 'group.initGroup'}
  }
})


