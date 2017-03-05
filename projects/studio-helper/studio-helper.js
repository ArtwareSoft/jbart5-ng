jb.resource('studio-helper','people-array', { "people": [
  { "name": "Homer Simpson" ,"age": 42 , "male": true},
  { "name": "Marge Simpson" ,"age": 38 , "male": false},
  { "name": "Bart Simpson"  ,"age": 12 , "male": true}
  ]
})

//jb.resource('studio-helper','settings', { "currentProfilePath": "studio-helper.sample-control"})

jb.resource('studio-helper','group-with-custom-style',
  {$: 'group', 
    title: 'main', 
    style : {$: 'customStyle',
    template: `<div class="jb-group">
        <div *ngFor="let ctrl of ctrls" class="group-item"><div *jbComp="ctrl"></div></div>
      </div>`,
      css: `.group-item { margin-bottom: %$spacing%px; display: block }
        .group-item:last-child { margin-bottom:0 }`,
    features :{$: 'group.init-group'}
  },
    controls : [
    {$: 'group', title: '2.0', controls : 
       [
      { $: 'label', title: '2.1' },
      { $: 'button', title: '2.2' },
      ]
    },
    {$: 'label', title: '1.0' },
  ]}
)

// fake current path

jb.component('studio-helper.control-tree', {
  type: 'control', 
  params: [
    { id: 'path', defaultValue: 'studio-helper.sample-control' }
  ],
  impl :{$: 'studio.control-tree',
    $vars: {
      simulateProfilePath: '%$path%'
    }
  } 
})

jb.component('studio-helper.jb-editor', {
  type: 'control', 
  params: [{ id: 'path', defaultValue: 'studio-helper-dummy.label' }], 
  impl :{$: 'group', 
    $vars: { circuit: 'studio-helper-dummy.label' }, 
    title: 'main %', 
    style :{$: 'layout.flex', align: 'flex-start' }, 
    controls: [
      {$: 'button', 
        title: 'menu', 
        action :{$: 'studio.open-jb-editor-menu', 
          path: '%$globals/jb_editor_selection%'
        }, 
        style :{$: 'button.md-icon-fab', icon: 'menu', size: '24' }, 
        features :{$: 'css.height', height: '30' }
      }, 
      {$: 'studio.jb-editor', path: '%$path%' }, 
      {$: 'editable-text', 
        databind :{$: 'studio.profile-as-text', path: '%$globals/jb_editor_selection%' }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          mode: 'javascript', 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'css', css: '{ height: 200px; padding: 50px }' }
  }
})


jb.component('studio-helper.studio-properties', {
  type: 'control', 
  impl :{$: 'group', 
    $vars: { circuit: 'studio-helper-dummy.simple-label' }, 
    title: '', 
    controls :{$: 'studio.properties', path: 'studio-helper-dummy.simple-label' }
  }
})

jb.component('studio-helper-dummy.simple-label', {
  type: 'control', 
  impl :{$: 'label', 
    $vars : { check: 2},
    title: 'hello' 
  }
})

jb.component('studio-helper.sample-control', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'main', 
    controls: [
      {$: 'group', 
        title: '2.0', 
        controls: [
          {$: 'label', title: '2.1' }, 
          {$: 'button', 
            title: '2.2', 
            action :{$: 'toggleBooleanValue', of: '' }
          }
        ]
      }, 
      {$: 'label', title: '1.0' }
    ]
  }
})

jb.component('studio-helper.edit-style', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'editable-text', 
        title: 'aaa', 
        databind: '%$group-with-custom-style/title%', 
        style :{$: 'editable-text.input' }
      }, 
      {$: 'tabs', 
        tabs: [
          {$: 'editable-text', 
            title: 'css', 
            databind: '%$group-with-custom-style/style/css%', 
            style :{$: 'editable-text.codemirror' }, 
            features :{$: 'css', css: '{ width: 700px }' }
          }, 
          {$: 'editable-text', 
            title: 'template', 
            databind: '%$group-with-custom-style/style/template%', 
            style :{$: 'editable-text.codemirror' }, 
            features :{$: 'css', css: '{ width: 700px }' }
          }
        ]
      }
    ]
  }
})


jb.component('studio-helper.expandable', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'expandable', 
    style :{$: 'group.expandable' }, 
    controls: [
      {$: 'label', 
        title: 'label', 
        style :{$: 'label.span' }, 
        features :{$: 'css', css: undefined }
      }, 
      {$: 'button', 
        title: 'Hello', 
        style :{$: 'button.md-flat' }
      }
    ]
  }
})

jb.component('studio-helper-dummy.label', {
  type: 'control', 
  impl :{$: 'label', 
        title: {$pipeline: [ '%$people-array/people%', 
                {$filter: '%age% == 42'},
                '%name%'
        ]},
        features: [
          {$: 'css', 
            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
          }, 
          {$: 'hidden', 
            showCondition : true
          }
        ]
      }, 
})


jb.component('studio-helper.group-with-label', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'label', 
        title: [ '%$people-array/people%', 
                {$filter: '%age% == 42'},
                '%name%'
        ]
      }, 
    ]
  }
})

jb.component('studio-helper.menu-selection', {
  type: 'control', 
  impl: {$: 'group', 
    title: 'menu selection', 
    features :{$: 'group.menu-keyboard-selection', autoFocus: true }, 
    controls :[
        { $: 'pulldown.menu-item', title: '1', icon: 'code', action: ctx => 
          ctx.resources.window.console.log(1) },
        { $: 'pulldown.menu-item', title: '2', action: ctx => ctx.resources.window.console.log(2) },
        { $: 'pulldown.menu-item', title: '3', icon: 'delete', action: ctx => ctx.resources.window.console.log(3) },
    ]
  },
})

jb.component('studio-helper.data-resources', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'studio.data-resources' }, 
      {$: 'button', 
        style :{$: 'button.md-flat' }
      }, 
      {$: 'button', 
        style :{$: 'button.md-flat' }
      }
    ]
  }
})

jb.component('studio-helper.select-control', {
  type: 'control', 
  impl :{$: 'studio.select-control' } 
})


jb.component('studio-helper.select-feature', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'select-feature', 
    style :{$: 'layout.horizontal', spacing: '53' }, 
    controls: [{$: 'studio.select-feature' }]
  }
})