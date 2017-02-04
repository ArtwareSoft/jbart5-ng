jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('itemlists','people',[
  { "name": "Homer Simpson" ,age: 42 , male: true},
  { "name": "Marge Simpson" ,age: 38 , male: false},
  { "name": "Bart Simpson"  ,age: 12 , male: true}
]);


jb.component('itemlists.master-detail', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'itemlist', 
    style :{$: 'layout.horizontal', spacing: '33' }, 
    controls: [
      {$: 'itemlist', 
        items: '%$people%', 
        controls: [
          {$: 'label', 
            title: '%name%', 
            style :{$: 'label.mdl-button' }
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: false, 
        itemVariable: 'item', 
        features: [
          {$: 'itemlist.selection', 
            autoSelectFirst: true, 
            cssForSelected: '', 
            cssForActive: ''
          }, 
          {$: 'itemlist.keyboard-selection' }
        ]
      }, 
      {$: 'group', 
        title: 'details', 
        style :{$: 'group.section' }, 
        controls: [
          {$: 'label', 
            title: '%name%', 
            style :{$: 'label.span' }
          }, 
          {$: 'label', 
            title: 'hello', 
            style :{$: 'label.span' }
          }
        ], 
        features: [
          {$: 'group.itemlist-selected' }, 
          {$: 'css.padding', top: '26', left: '0' }
        ]
      }
    ], 
    features :{$: 'group.itemlist-container', autoSelectFirst: 'true' }
  }
})



})