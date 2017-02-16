jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('sidenav.style');

jb.component('sidenav',{
  type: 'control',
  params: [
    { id: 'controls', type: 'control[]', essential: true, flattenArray: true, dynamic: true },
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'style', type: 'sidenav.style', defaultValue: { $: 'sidenav.md' }, essential: true , dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: ctx =>
    jbart.comps.group.impl(ctx)
})

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
        <div *jbComp="ctrls"></div>
      </md-sidenav>
      </md-sidenav-layout>`,
    css: `md-sidenav { width: %$width%px }`,
    features :{$: 'group.init-group'}
  }
})

})