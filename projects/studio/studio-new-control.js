jbLoadModules(['studio/studio-tgp-model']).then(loadedModules => { 
  var model = loadedModules['studio/studio-tgp-model'].model;


jb.component('studio.open-new-control-dialog', {
  type: 'action', 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-floating' }, 
    content :{$: 'studio.select-control', 
      onSelect: [
        {$: 'studio.onNextModifiedPath', 
          action: [
            {$: 'studio.openModifiedPath' }, 
            {$: 'studio.refresh-preview' }
          ]
        }, 
        {$: 'studio.insert-comp', 
          path :{$: 'studio.currentProfilePath' }, 
          comp: '%%'
        }
      ]
    }, 
    title: 'new control', 
    modal: true, 
    features: [
      {$: 'css.height', height: '420', overflow: 'hidden' }, 
      {$: 'css.width', width: '450', overflow: 'hidden' }, 
      {$: 'dialog-feature.dragTitle', id: 'new control' }, 
      {$: 'dialog-feature.nearLauncherLocation', offsetLeft: 0, offsetTop: 0 }, 
      {$: 'group.auto-focus-on-first-input' }
    ]
  }
})

jb.component('studio.select-control', {
  type: 'control', 
  params: [{ id: 'onSelect', type: 'action', dynamic: true }], 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'editable-text', 
        title: 'search', 
        databind: '%$SearchPattern%', 
        style :{$: 'editable-text.md-input' }
      }, 
      {$: 'group', 
        title: 'categories and items', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'picklist', 
            title: '', 
            databind: '%$SelectedCategory%', 
            options :{$: 'picklist.sorted-options', 
              options :{$: 'picklist.coded-options', 
                options :{$: 'studio.categories-of-type', type: 'control' }, 
                code: '%name%', 
                text: '%name%'
              }, 
              marks :{$: 'pipeline', 
                items: [
                  {$: 'list', 
                    items: [
                      'control:100', 
                      'input:95', 
                      'group:90', 
                      'studio-helper:0', 
                      'suggestions-test:0', 
                      'studio:0', 
                      'test:0', 
                      'basic:0', 
                      'ui-tests:0', 
                      'studio-helper-dummy:0', 
                      'itemlist-filter:0'
                    ]
                  }, 
                  {$: 'join', separator: ',' }
                ]
              }
            }, 
            style :{$: 'style-by-control', 
              control :{$: 'itemlist', 
                items: '%$picklistModel/options%', 
                controls :{$: 'label', 
                  title: '%text%', 
                  style :{$: 'label.mdl-button' }, 
                  features: [
                    {$: 'css.width', width: '120' }, 
                    {$: 'css', css: '{text-align: left}' }
                  ]
                }, 
                style :{$: 'itemlist.ul-li' }, 
                watchItems: false, 
                features: [
                  {$: 'itemlist.selection', 
                    onSelection :{$: 'writeValue', 
                      to: '%$picklistModel/databind%', 
                      value: '%code%'
                    }, 
                    autoSelectFirst: 'true', 
                    cssForSelected: 'background: #bbb'
                  }, 
                  {$: 'itemlist.keyboard-selection', autoFocus: true }
                ]
              }, 
              modelVar: 'picklistModel'
            }
          }, 
          {$: 'itemlist', 
            title: 'items', 
            items :{
              $pipeline: [
                '%$Categories%', 
                {$: 'filter', 
                  filter :{$: 'equals', item1: '%name%', item2: '%$SelectedCategory%' }
                }, 
                '%pts%', 
                {$: 'search-filter', pattern: '%$SearchPattern%' }
              ]
            }, 
            controls: [
              {$: 'button', 
                title: '%%', 
                action: [{$: 'closeContainingPopup' }, { $call: 'onSelect' }], 
                style :{$: 'customStyle', 
                  template: '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" (click)="clicked()">{{title}}</button>', 
                  css: 'button { text-transform: none }', 
                  features :{$: 'mdl-style.init-dynamic', query: '.mdl-js-button' }
                }, 
                features :{$: 'css', css: '!button { text-align: left; width: 250px }' }
              }
            ], 
            watchItems: true, 
            itemVariable: 'item', 
            features :{$: 'css.height', height: '300', overflow: 'auto', minMax: '' }
          }
        ]
      }
    ], 
    features: [
      {$: 'css.margin', top: '10', left: '20' }, 
      {$: 'var', 
        name: 'SelectedCategory', 
        value :{$: 'editable-primitive', type: 'string', initialValue: 'control' }
      }, 
      {$: 'var', 
        name: 'SearchPattern', 
        value :{$: 'editable-primitive', type: 'string' }
      }, 
      {$: 'var', 
        name: 'Categories', 
        value :{$: 'studio.categories-of-type', type: 'control' }
      }
    ]
  }
})

jb.component('studio.open-new-feature-dialog', {
  type: 'action', 
  params: [{ id: 'onSelect', type: 'action', dynamic: true }], 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-floating' }, 
    content :{$: 'studio.select-feature', 
      onSelect1: [
        {$: 'studio.onNextModifiedPath', 
          action: [
            {$: 'studio.openModifiedPath' }, 
            {$: 'studio.refresh-preview' }
          ]
        }, 
        {$: 'studio.add-array-item', 
          path :{ $pipeline: [{$: 'studio.currentProfilePath' }, '%%~features'] }, 
          toAdd :{
            $object :{$: '%%' }
          }
        }
      ], 
      onSelect :{ $call: 'onSelect' }
    }, 
    title: 'new feature', 
    modal: true, 
    features: [
      {$: 'css.height', height: '420', overflow: 'hidden' }, 
      {$: 'css.width', width: '450', overflow: 'hidden' }, 
      {$: 'dialog-feature.dragTitle', id: 'new feature' }, 
      {$: 'dialog-feature.nearLauncherLocation', offsetLeft: 0, offsetTop: 0 }
    ]
  }
})

jb.component('studio.select-feature', {
  type: 'control', 
  params: [{ id: 'onSelect', type: 'action', dynamic: true }], 
  impl :{$: 'group', 
    title: 'itemlist-with-find', 
    style :{$: 'layout.vertical', spacing: 3 }, 
    controls: [
      {$: 'editable-text', 
        title: 'search', 
        databind: '%$SearchPattern%', 
        style :{$: 'editable-text.md-input' }
      }, 
      {$: 'group', 
        title: 'categories and items', 
        style :{$: 'layout.horizontal', spacing: 3 }, 
        controls: [
          {$: 'picklist', 
            title: '', 
            databind: '%$SelectedCategory%', 
            options :{$: 'picklist.sorted-options', 
              options :{$: 'picklist.coded-options', 
                options :{$: 'studio.categories-of-type', type: 'feature' }, 
                code: '%name%', 
                text: '%name%'
              }, 
              marks :{$: 'pipeline', 
                items: [
                  {$: 'list', 
                    items: [
                      'css:100', 
                      'feature:95', 
                      'group:90', 
                      'tabs:0,label:0,picklist:0,mdl:0,studio:0,text:0,menu:0,flex-layout-container:0,mdl-style:0', 
                      'mdl-style:0'
                    ]
                  }, 
                  {$: 'join', separator: ',' }
                ]
              }
            }, 
            promote :{$: 'picklist.promote' }, 
            style :{$: 'style-by-control', 
              control :{$: 'itemlist', 
                items: '%$picklistModel/options%', 
                controls :{$: 'label', 
                  title: '%text%', 
                  style :{$: 'label.mdl-ripple-effect' }, 
                  features: [
                    {$: 'css.width', width: '120' }, 
                    {$: 'css', 
                      css: '{text-align: left; text-transform: none}'
                    }
                  ]
                }, 
                style :{$: 'itemlist.ul-li' }, 
                watchItems: false, 
                features: [
                  {$: 'itemlist.selection', 
                    onSelection :{$: 'writeValue', 
                      to: '%$picklistModel/databind%', 
                      value: '%code%'
                    }, 
                    cssForSelected: 'background: #bbb'
                  }, 
                  {$: 'itemlist.keyboard-selection' }
                ]
              }, 
              modelVar: 'picklistModel'
            }
          }, 
          {$: 'itemlist', 
            title: 'items', 
            items :{
              $pipeline: [
                '%$Categories%', 
                {$: 'filter', 
                  filter :{
                    $if: '%$SearchPattern% != ""', 
                    then :{$: 'equals', item1: '%name%', item2: 'all' }, 
                    else :{$: 'equals', 
                      item1: '%name%', 
                      item2: '%$SelectedCategory%'
                    }
                  }
                }, 
                '%pts%', 
                {$: 'search-filter', pattern: '%$SearchPattern%' }
              ]
            }, 
            controls: [
              {$: 'button', 
                title :{$: 'highlight', 
                  base: '%%', 
                  highlight: '%$SearchPattern%', 
                  cssClass: 'highlight'
                }, 
                action: [{$: 'closeContainingPopup' }, { $call: 'onSelect' }], 
                style :{$: 'button.mdl-allow-html' }, 
                features :{$: 'css', 
                  css: '!button { text-align: left; width: 250px; text-transform: none }'
                }
              }
            ], 
            watchItems: true, 
            itemVariable: 'item'
          }
        ]
      }
    ], 
    features: [
      {$: 'css.margin', top: '10', left: '20' }, 
      {$: 'var', 
        name: 'SelectedCategory', 
        value :{$: 'editable-primitive', type: 'string', initialValue: 'css' }
      }, 
      {$: 'var', 
        name: 'SearchPattern', 
        value :{$: 'editable-primitive', type: 'string' }
      }, 
      {$: 'var', 
        name: 'Categories', 
        value :{$: 'studio.categories-of-type', type: 'feature' }
      }
    ]
  }
})


jb.component('studio.openModifiedPath', {
	type: 'action',
	impl :{ $runActions: [
            { $: 'writeValue', to: '%$globals/profile_path%', value: '%$modifiedPath%' },
            {$: 'studio.open-properties'},
            {$: 'studio.open-control-tree'},
          ]}
})

jb.component('studio.open-new-page', {
  type: 'action', 
  impl :{$: 'openDialog', 
    modal: true, 
    title: 'New Page', 
    style :{$: 'dialog.md-dialog-ok-cancel', 
      features :{$: 'dialog-feature.autoFocusOnFirstInput' }
    }, 
    content :{$: 'group', 
      controls: [
        {$: 'editable-text', 
          databind: '%$dialogData/name%', 
          features :{$: 'feature.onEnter', 
            action :{$: 'closeContainingPopup' }
          }, 
          title: 'page name', 
          style :{$: 'editable-text.md-input' }
        }
      ], 
      features :{$: 'css.padding', top: '14', left: '11' }, 
      style :{$: 'group.div' }
    }, 
    onOK: function (ctx) {
        var id = ctx.exp('%$globals/project%.%$dialogData/name%');
        var profile = {
            type: 'control',
            impl: { $: 'group', title: ctx.exp('%$dialogData/name%') }
        };
        model.modify(model.newComp, id, { profile: profile }, ctx);
        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
    }
  }
})

jb.component('studio.insert-comp-option', {
  params: [ 
    { id: 'title', as: 'string' },
    { id: 'comp', as: 'string' },
  ],
  impl :{$: 'menu.action', title: '%$title%', 
    action :{$: 'studio.insert-comp', comp: '%$comp%' },
  }
})

jb.component('studio.insert-control-menu', {
  impl :{$: 'menu.menu', title: 'Insert',
          options: [
          {$: 'menu.menu', title: 'Control', options: [
              {$: 'studio.insert-comp-option', title:'Label', comp: 'label'},
              {$: 'studio.insert-comp-option', title:'Button', comp: 'button'},
            ]
          },
          {$: 'menu.menu', title: 'Input', options: [ 
              {$: 'studio.insert-comp-option', title:'Editable Text', comp: 'editable-text'},
              {$: 'studio.insert-comp-option', title:'Editable Number', comp: 'editable-number'},
              {$: 'studio.insert-comp-option', title:'Editable Boolean', comp: 'editable-boolean'},
            ]
          }, 
          {$: 'menu.menu', title: 'Group', options: [ 
              {$: 'studio.insert-comp-option', title:'Group', comp: 'group'},
              {$: 'studio.insert-comp-option', title:'Itemlist', comp: 'itemlist'},
            ]
          }, 
          {$: 'menu.action', 
              title: 'More...', 
              action :{$: 'studio.open-new-control-dialog' }
          }
          ]
        },
})


})