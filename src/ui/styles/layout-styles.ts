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


jb.component('layout.flex', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div class="jb-group">
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
    css: `{display: flex }`,
    features :{$: 'group.initGroup'}
  }
})

jb.component('flex-layout-container.align-main-axis', {
    type: 'feature',
    params: {
      align: { as: 'string', options: 'flex-start,flex-end,center,space-between,space-around', defaultValue: 'flex-start' }
    },
    impl : (ctx,factor) => ({
      css: `{ justify-content: ${align} }`
    })
})


jb.component('flex-layout-item.grow', {
    type: 'feature',
    params: {
      factor: { as: 'number', defaultValue: '1' }
    },
    impl : (ctx,factor) => ({
      css: `{ flex-grow: ${factor} }`
    })
})

jb.component('flex-layout-item.basis', {
    type: 'feature',
    params: {
      factor: { as: 'number', defaultValue: '1' }
    },
    impl : (ctx,factor) => ({
      css: `{ flex-basis: ${factor} }`
    })
})

jb.component('flex-layout-item.align-self', {
    type: 'feature',
    params: {
      align: { as: 'string', options: 'auto,flex-start,flex-end,center,baseline,stretch', defaultValue: 'auto' }
    },
    impl : (ctx,align) => ({
      css: `{ align-self: ${align} }`
    })
})
