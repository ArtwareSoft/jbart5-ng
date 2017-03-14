jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('material-demo','person',{
  "company": "google",
  "firstName": 'Dave',
  "lastName": 'Smith',
  "address": "1600 Amphitheatre Pkway",
  "address2": '',
  "city": 'mountain view',
  "state": 'CA',
  "postalCode": "94043",
})

jb.component('material-demo.form', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'input', 
    style :{$: 'layout.vertical', spacing: '33' }, 
    controls: [
      {$: 'editable-text', 
        title: 'Company (disabled)', 
        databind :{$: 'pipeline', items: ['%$person/company%'] }, 
//        features :{$: 'feature.debounce', debounceTime: '30' }
      }, 
      {$: 'group', 
        title: 'Name', 
        style :{$: 'layout.horizontal', spacing: '25' }, 
        controls: [
          {$: 'editable-text', 
            title: 'Long Last Name That Will Be Truncated', 
            databind: '%$person/lastName%'
          }, 
          {$: 'editable-text', 
            title: 'First Name aa', 
            databind :{$: 'pipeline', items: ['%$person/firstName%'] }, 
            style :{$: 'editable-text.md-input' }
          }
        ]
      }, 
      {$: 'group', 
        title: 'address', 
        style :{$: 'layout.vertical' }, 
        controls: [
          {$: 'editable-text', title: 'Address', databind: '%$person/address%' }, 
          {$: 'editable-text', title: 'Address2', databind: '%$person/address2%' }
        ]
      }, 
      {$: 'group', 
        title: 'City State', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'editable-text', 
            title: 'City', 
            databind: '%$person/city%', 
            style :{$: 'editable-text.md-input', width: '122' }
          }, 
          {$: 'editable-text', title: 'State', databind: '%$person/state%' }, 
          {$: 'editable-text', 
            title: 'Postal Code', 
            databind: '%$person/postalCode%'
          }
        ]
      }, 
      {$: 'label', 
        title: '%$person/company%', 
        style :{$: 'label.span' }
      }
    ], 
    features: [
      {$: 'group.theme', 
        theme :{$: 'theme.material-design' }
      }, 
      {$: 'css.box-shadow', 
        blurRadius: '10', 
        spreadRadius: '', 
        shadowColor: '#cdcdcd', 
        opacity: '1', 
        horizontal: '', 
        vertical: ''
      }, 
      {$: 'css.padding', top: '10', left: '10' }, 
      {$: 'css.width', width: '700' }, 
      {$: 'css.margin', top: '10', left: '10' }
    ]
  }
})

jb.component('material-demo.single-demo', {
  impl :{$: 'custom-control', 
    html: '%$demo/html%', 
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
      {$: 'css', css: '{ min-width: 600px; max-width: 600px; }' }
    ]
  }
})



jb.component('material-demo.main', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'layout.vertical', spacing: 3 }, 
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
            style :{$: 'button.mdl-icon', padding: '5', icon: 'call_made', size: '34' }, 
            features: [{$: 'css.transform-rotate', angle: '-90', selector: 'i' }, {  }]
          }, 
          {$: 'editable-text', 
            databind: '%$globals/ngPath%', 
            style :{$: 'editable-text.md-input', width: '800' }, 
            features: [
              {$: 'css.margin', top: '', left: '20' }, 
              {$: 'css.padding', left: '7', selector: '!.md-input-element' }, 
              {$: 'hidden' }
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
                style :{$: 'button.md-flat-no-background' }, 
                features :{$: 'css', css: 'button { text-align: left; width: 200px}' }
              }
            ], 
            style :{$: 'itemlist.ul-li' }, 
            watchItems: true, 
            itemVariable: 'item'
          }, 
          {$: 'group', 
            title: 'demo', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'group', 
                title: 'single demo', 
                controls: [{$: 'material-demo.single-demo' }], 
                features :{$: 'group.watch', data: '%$demo/html%' }
              }, 
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
                    features: [{$: 'css.width', width: '450' }]
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
                    title: 'readme', 
                    features :{$: 'css.width', width: '450', overflow: 'hidden' }
                  }
                ], 
                features :{$: 'css.width', width: '400' }
              }
            ], 
            features: [
              {$: 'group.data', 
                data: '%$globals/demoId%', 
                itemVariable: 'demoId', 
                watch: true
              }, 
              {$: 'var', 
                name: 'demo', 
                value :{
                  $pipeline: [
                    '%$demos%', 
                    {$: 'filter', filter: '%id% == %$globals/demoId%' }
                  ]
                }
              }, 
              {$: 'group.watch', data: '%$demo/html' }
            ]
          }
        ]
      }
    ]
  }
})


})