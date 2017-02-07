jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('itemlists','people',[
  { "name": "Homer Simpson" ,age: 42 , male: true},
  { "name": "Marge Simpson" ,age: 38 , male: false},
  { "name": "Bart Simpson"  ,age: 12 , male: true}
]);


jb.component('itemlists.master-detail-readonly', {
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
            style :{$: 'label.mdl-ripple-effect' }, 
            features: [
              {$: 'css.width', width: '150' }, 
              {$: 'css', css: '{text-align: left}' }
            ]
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
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'label', 
            title: 'Hello', 
            style :{$: 'label.span' }
          }, 
          {$: 'label', 
            title: '%name%', 
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

jb.component('itemlists.master-detail-writable', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'itemlist', 
    style :{$: 'layout.vertical', spacing: '23' }, 
    controls: [
      {$: 'group', 
        title: 'master details', 
        style :{$: 'layout.horizontal', spacing: '43' }, 
        controls: [
          {$: 'itemlist', 
            items: '%$people%', 
            controls: [
              {$: 'label', 
                title: '%name%', 
                style :{$: 'label.mdl-ripple-effect' }, 
                features: [
                  {$: 'css.width', width: '150' }, 
                  {$: 'css', css: '{text-align: left}' }
                ]
              }
            ], 
            style :{$: 'itemlist.ul-li' }, 
            watchItems: true, 
            itemVariable: 'item', 
            features: [
              {$: 'itemlist.selection', 
                autoSelectFirst: true, 
                cssForSelected: 'background: #bbb', 
                cssForActive: 'background: #bbb'
              }, 
              {$: 'itemlist.keyboard-selection' }, 
              {$: 'css.height', height: '300', overflow: 'auto' }
            ]
          }, 
          {$: 'group', 
            title: 'details', 
            style :{$: 'layout.vertical', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'name', 
                databind: '%name%', 
                style :{$: 'editable-text.md-input' }
              }, 
              {$: 'editable-text', 
                title: 'age', 
                databind: '%age%', 
                style :{$: 'editable-text.md-input' }
              }
            ], 
            features: [{$: 'group.itemlist-selected' }]
          }
        ]
      }, 
      {$: 'group', 
        title: 'toolbar', 
        style :{$: 'layout.horizontal', spacing: '21' }, 
        controls: [
          {$: 'button', 
            title: 'add', 
            action :{$: 'itemlist-container.add' }, 
            style :{$: 'button.md-raised' }
          }, 
          {$: 'button', 
            title: 'delete', 
            action :{$: 'itemlist-container.delete', item: '%$itemlistCntr/selected%' }, 
            style :{$: 'button.md-raised' }
          }
        ]
      }
    ], 
    features: [
      {$: 'group.itemlist-container', 
        defaultItem :{
          $asIs: { name: 'no name' }
        }
      }, 
      {$: 'css.padding', top: '10', left: '10' }
    ]
  }
})

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'itemlist.obj-as-items', obj: '%$people[0]%' }, 
        controls: [
          {$: 'group', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'key', 
                databind: '%key%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'editable-text', 
                title: 'value', 
                databind: '%val%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'button', 
                title: 'delete', 
                action :{$: 'itemlist-container.delete', item: '%%' }, 
                style :{$: 'button.x', size: '21' }
              }
            ]
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'group', 
        controls: [
          {$: 'editable-text', 
            databind: '%%', 
            style :{$: 'editable-text.codemirror', 
              enableFullScreen: true, 
              debounceTime: 300
            }
          }
        ], 
        features :{$: 'group.data', 
          data :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
          watch: true
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})

})