jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('material-demo','person',{
  "company": "google",
  "firstName": '',
  "lastName": '',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": '',
  "state": '',
  "postalCode": "94043",
})

jb.component('material-demo.single-demo', {
  impl :{$: 'custom-control', 
        html : '%$demo/html%',
        css: '%$demo/css%',
        features: [
          {$: 'feature.ng-attach-object', 
            data :{$: 'new-instance', 
              module: 'projects/material-demo/ng-material-demo-loader', 
              class :{$: 'pipeline', 
                items: [{$: 'capitalize', text: '%$demo/id%' }, '%%Demo']
              }
            }
          }, 
          {$: 'css', css: '{ min-width: 700px; max-width: 700px; }' }
        ]
      }
})

jb.component('material-demo.main', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'layout.flex', direction: 'column' }, 
    controls: [
      {$: 'group', 
        title: 'toolbar', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'button', 
            title: 'pick & edit', 
            action :{$: 'material-demo.pick', 
              onHover :{$: 'writeValue', to: '%$globals/ngPath%', value: '%%' }
            }, 
            style :{$: 'button.md-icon', padding: '5', icon: 'call_made', size: '34' }, 
            features: [{$: 'css.transform-rotate', angle: '-90', selector: 'i' }, {  }]
          }, 
          {$: 'editable-text', 
            databind: '%$globals/ngPath%', 
            style :{$: 'editable-text.md-input', width: '800' }, 
            features: [
              {$: 'css.margin', top: '', left: '20' }, 
              {$: 'css.padding', left: '7', selector: '!.md-input-element' }
            ]
          }
        ]
      }, 
      {$: 'group', 
        title: 'demos', 
        style :{$: 'layout.flex' }, 
        controls: [
          {$: 'itemlist', 
            items: '%$demos/id%', 
            controls: [
              {$: 'button', 
                title: '%%', 
                action :{$: 'runActions', 
                  actions: [
                    {$: 'writeValue', to: '%$globals/demoId%', value: '%%' }, 
                    {$: 'writeValue', 
                      to: '%$globals/ngPath%', 
                      value: 'material-demo.single-demo:'
                    }
                  ]
                }, 
                style :{$: 'button.md-flat' }, 
                features :{$: 'css', css: 'button { text-align: left; width: 200px}' }
              }
            ], 
            style :{$: 'itemlist.ul-li' }, 
            watchItems: true, 
            itemVariable: 'item'
          }, 
          {$: 'group', 
            title: 'demo', 
            style :{$: 'layout.flex' }, 
            controls: [
              {$: 'material-demo.single-demo'},
              {$: 'group', 
                title: 'editor', 
                controls: [
                  {$: 'editable-text', 
                    title: 'template', 
                    databind :{$: 'studio.ng-template-as-text', 
                      ngPath: '%$globals/ngPath%'
                    }, 
                    style :{$: 'editable-text.codemirror', 
                      enableFullScreen: true, 
                      mode: 'htmlmixed', 
                      debounceTime: 300
                    }, 
                    features: [
                      {$: 'flex-layout-item.grow' }, 
                      {$: 'css.margin', top: '7' }
                    ]
                  }, 
                  {$: 'markdown', 
                    markdown :{$: 'pipeline', 
                      items: [
                        '%$readmes%', 
                        {$: 'filter', filter: '%$globals/demoId% == %id%' }, 
                        '%content%'
                      ]
                    }, 
                    style :{$: 'markdown.showdown' }, 
                    title: 'readme'
                  }
                ], 
                features :{$: 'flex-layout-item.grow', factor: '1' }
              }
            ], 
            features: [
              {$: 'group.data', 
                data: '%$globals/demoId%', 
                itemVariable: 'demoId', 
                watch: true
              },
              {$: 'var', name: 'demo', value: { $pipeline: [
                '%$demos%', 
                {$: 'filter', filter: '%id% == %$globals/demoId%' }, 
              ]}},
              {$: 'group.watch', data: '%$demo/html' }
            ]
          }
        ]
      }
    ]
  }
})


})