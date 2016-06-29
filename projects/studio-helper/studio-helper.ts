import {jb} from 'jb-core/jb';

jb.resource('studio-helper','people', { "people": [
  { "name": "Homer Simpson" ,"age": 42 , "male": true},
  { "name": "Marge Simpson" ,"age": 38 , "male": false},
  { "name": "Bart Simpson"  ,"age": 12 , "male": true}
  ]
})

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

jb.component('studio-helper.itemlist-with-find', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    controls: [
      {$: 'editable-text', 
        databind: '%$globals/project_pattern%', 
        style :{$: 'editable-text.input' }
      }, 
      {$: 'itemlist', 
        items: [
          '%$people/people%', 
          {
            $filter: function (ctx) {
                                        console.log(ctx.exp('%$globals/project_pattern%'));
                                        return !ctx.exp('%$globals/project_pattern%') || ctx.exp('%name%').toLowerCase().indexOf(ctx.exp('%$globals/project_pattern%').toLowerCase()) != -1;
                                    }
          }
        ], 
        controls: [
          {$: 'group', 
            style :{$: 'layout.flex', align: 'space-between' }, 
            controls: [
              {$: 'text', 
                text: '%name%', 
                title: 'text', 
                style :{$: 'text.paragraph' }, 
                features :{$: 'css', css: '{ padding-left: 10px }' }
              }
            ], 
            features: [
              {$: 'css.width', width: '200' }, 
              {$: 'css', 
                css: ':hover { background: #efefef; cursor: pointer; }'
              }
            ], 
            title: 'item'
          }
        ], 
        style :{$: 'itemlist.ul-li' }
      }
    ]
  }
})
