
jb.component('studio.search-component', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'itemlist-container.search', 
        title: 'Search', 
        searchIn: item => 
          item.id,
        databind: '%$itemlistCntr/filter_data/search%', 
        style :{$: 'editable-text.mdl-input', width: '155' }, 
        features: [
          {$: 'editable-text.x-button' }, 
          {$: 'css.margin', top: '-20' }, 
          {$: 'editable-text.helper-popup', 
            features :{$: 'dialog-feature.nearLauncherLocation' }, 
            control :{$: 'itemlist', 
              title: 'items', 
              items :{
                $pipeline: [
                  {$: 'studio.components-cross-ref' }, 
                  {$: 'itemlist-container.filter' }, 
                  {$: 'numeric-sort', propertyName: 'refCount' }, 
                  {$: 'slice', start: '0', end: '50' }
                ]
              }, 
              controls :{$: 'group', 
                style :{$: 'layout.horizontal', spacing: 3 }, 
                controls: [
                  {$: 'material-icon', 
                    icon :{$: 'studio.icon-of-type', type: '%type%' }
                  }, 
                  {$: 'label', 
                    title :{$: 'highlight', 
                      base: '%id% (%refCount%)', 
                      highlight: '%$itemlistCntr/filter_data/search%', 
                      cssClass: 'highlight'
                    }, 
                    style :{$: 'customStyle', template: '<span>%$title%</span>' }, 
                    features :{$: 'css.padding', left: '3' }
                  }
                ]
              }, 
              watchItems: true, 
              itemVariable: 'item', 
              features: [
                {$: 'css.height', height: '300', overflow: 'auto', minMax: '' }, 
                {$: 'itemlist.selection', 
                  onDoubleClick :{$: 'studio.search-component-selected', path: '%id%' }, 
                  autoSelectFirst: true
                }, 
                {$: 'itemlist.keyboard-selection', 
                  onEnter :{$: 'studio.search-component-selected', path: '%id%' }, 
                  autoFocus: false
                }, 
                {$: 'feature.if', 
                  showCondition: '%$itemlistCntr/filter_data/search%'
                }
              ]
            }, 
            popupId: 'search-component', 
            popupStyle :{$: 'dialog.popup' }
          }
        ]
      }
    ], 
    features: [
      {$: 'var', 
        name: 'SearchPattern', 
        value :{$: 'editable-primitive', type: 'string' }
      }, 
      {$: 'group.itemlist-container' }
    ]
  }
})

jb.component('studio.search-component-selected',{
  type: 'action',
  params: [
    {id: 'path', as: 'string'}
  ],
  impl: {$runActions: [
    {$: 'writeValue', to: '%$itemlistCntr/filter_data/search%', value: '' },
    {$: 'studio.goto-path', path: '%$path%' },
    {$: 'closeContainingPopup' }
  ]}
})