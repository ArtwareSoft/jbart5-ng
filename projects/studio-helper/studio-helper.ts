import {jb} from 'jb-core/jb';

jb.resource('studio-helper','people', { "people": [
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
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </div>`,
      css: `.group-item { margin-bottom: %$spacing%px; display: block }
        .group-item:last-child { margin-bottom:0 }`,
    features :{$: 'group.initGroup'}
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

jb.component('studio-helper.properties', {
  type: 'control', 
  params: {
    path: { defaultValue: 'studio-helper.sample-control' }
  },
  impl :{$: 'studio.properties', path: '%$path%',
      $vars: { circuit: 'studio-helper.sample-control' }, 
  } 
})

jb.component('studio-helper.control-tree', {
  type: 'control', 
  params: {
    path: { defaultValue: 'studio-helper.sample-control' }
  },
  impl :{$: 'studio.control-tree',
    $vars: {
      simulateProfilePath: '%$path%'
    }
  } 
})

jb.component('studio-helper.jb-editor', {
  type: 'control', 
  params: {
    path: { defaultValue: 'studio-helper-dummy.label' }
  }, 
  impl :{$: 'group', 
    $vars: { circuit: 'studio-helper-dummy.label' }, 
    title: 'main', 
    controls: [
      {$: 'studio.jb-edit-property', path: '%$path%~title~0' }, 
      {$: 'group', 
        controls: [{$: 'studio.jb-editor', path: '%$path%' }], 
        features :{$: 'group-item.if', showCondition: false }
      }
    ], 
    features :{$: 'css', css: '{ height: 200px; padding: 50px }' }
  }
})


jb.component('studio-helper.sample-control', {
  type: 'control', 
  impl: {$: 'group', 
    title: 'main', 
    controls : [
    {$: 'group', title: '2.0', controls : 
       [
      { $: 'label', title: '2.1' },
      { $: 'button', title: '2.2' },
      ]
    },
    {$: 'label', title: '1.0' },
  ]}
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
        title: [ '%$people/people%', 
                {$filter: '%age% == 42'},
                '%name%'
        ]
      }, 
})

jb.component('studio-helper.group-with-label', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'label', 
        title: [ '%$people/people%', 
                {$filter: '%age% == 42'},
                '%name%'
        ]
      }, 
    ]
  }
})

jb.component('studio-helper.itemlist-with-find', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    controls: [
      {$: 'editable-text', 
        databind: '%$globals/project_pattern%', 
        style :{$: 'editable-text.md-input' }, 
        title: 'search'
      }, 
      {$: 'itemlist', 
        items: [
          '%$people/people%', 
          {$: 'search-filter', pattern: '%$globals/project_pattern%' }
        ], 
        controls: [
          {$: 'button', 
            title: '%name%', 
            style :{$: 'customStyle', 
              template: '<span><button md-button (click)="clicked()">{{title}}</button></span>', 
              directives: 'MdButton', 
              css: 'button { width: 200px; text-align: left }'
            }
          }
        ], 
        style :{$: 'itemlist.ul-li' }
      }
    ]
  }
})
