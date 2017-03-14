
jb.component('studio.open-jb-editor', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'openDialog', 
      content :{$: 'studio.jb-editor', path: '%$path%' }, 
      style :{$: 'dialog.studio-floating', 
        id: 'jb editor', 
        width: '700', 
        height: '400'
      }, 
      menu :{$: 'button', 
        style :{$: 'button.mdl-icon', icon: 'menu'},
        action :{$: 'studio.open-jb-editor-menu', path: '%$globals/jb_editor_selection%' }
      },
      title: 'Inteliscript'
  }
}) 

jb.component('studio.jb-editor', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    title: 'main', 
    style :{$: 'layout.flex', align: 'space-between', direction: '' }, 
    controls: [
      {$: 'tree', 
        nodeModel :{$: 'studio.jb-editor.nodes', path: '%$path%' }, 
        features: [
          {$: 'css.class', 
            class: 'jb-editor jb-control-tree studio-control-tree'
          }, 
          {$: 'tree.selection', 
            databind: '%$globals/jb_editor_selection%', 
            onDoubleClick :{$: 'studio.open-jb-edit-property', 
              path: '%$globals/jb_editor_selection%'
            }, 
            autoSelectFirst: true
          }, 
          {$: 'tree.keyboard-selection', 
            onEnter :{$: 'studio.open-jb-edit-property', 
              path: '%$globals/jb_editor_selection%'
            }, 
            onRightClickOfExpanded :{$: 'studio.open-jb-editor-menu', path: '%%' }, 
            autoFocus: true
          }, 
          {$: 'tree.drag-and-drop' }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Up', 
            action :{$: 'studio.move-in-array', path: '%%', moveUp: true }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Down', 
            action :{$: 'studio.move-in-array', path: '%%', moveUp: false }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+C', 
            action :{$: 'studio.copy', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+V', 
            action :{$: 'studio.paste', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Z', 
            action :{$: 'studio.undo', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Y', 
            action :{$: 'studio.redo', path: '%%' }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Delete', 
            action :{$: 'studio.delete', path: '%%' }
          }, 
          {$: 'studio.control-tree.refreshPathChanges' }, 
          {$: 'css.width', width: '500', selector: 'jb-editor' }, 
          {$: 'feature.studio-auto-fix-path', 
            path: '%$globals/jb_editor_selection%'
          }
        ]
      }, 
      {$: 'group', 
        title: 'watch selection', 
        controls: [
          {$: 'group', 
            title: 'hide if selection empty', 
            controls: [
              {$: 'group', 
                title: 'watch selection content', 
                controls :{$: 'group', 
                  title: 'wait for probe', 
                  controls :{$: 'itemlist', 
                    items: '%$probeResult/finalResult%', 
                    controls: [
                      {$: 'group', 
                        title: 'in/out', 
                        controls: [
                          {$: 'studio.data-browse', 
                            data: '%in/data%', 
                            title: 'in'
                          }, 
                          {$: 'studio.data-browse', 
                            data: '%out%', 
                            title: 'out'
                          }
                        ]
                      }
                    ]
                  }, 
                  features :{$: 'group.wait', 
                    for :{$: 'studio.probe', path: '%$globals/jb_editor_selection%' }, 
                    loadingControl :{$: 'label', title: 'calculating...' }, 
                    resource: 'probeResult'
                  }
                }, 
                features :{$: 'group.watch', 
                  data :{$: 'pipeline', 
                    items: [
                      {$: 'stringify', 
                        value :{$: 'studio.val', 
                          path: '%$globals/jb_editor_selection%'
                        }
                      }, 
                      '%$globals/jb_editor_selection%:%%'
                    ]
                  }
                }
              }
            ], 
            features :{$: 'feature.if', 
              showCondition: '%$globals/jb_editor_selection%'
            }
          }
        ], 
        features :{$: 'group.watch', data: '%$globals/jb_editor_selection%' }
      }
    ], 
    features :{$: 'css.padding', top: '10' }
  }
})

jb.component('studio.data-browse', {
  type: 'control',
  params: [ 
    { id: 'data', },
    { id: 'title', as: 'string'}
  ],
  impl :{$: 'group', 
    title: '%$title%',
    controls :{$: 'tree',
        nodeModel :{$: 'tree.json-read-only', 
          object: '%$data%', rootPath: '%$title%' 
        },
        features: [
            { $: 'css.class', class: 'jb-control-tree'},
            { $: 'tree.selection' },
            { $: 'tree.keyboard-selection'},
        ] 
     },
    }
})

jb.component('studio.open-jb-edit-property', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-jb-editor-popup' }, 
    content :{$: 'studio.jb-floating-input', path: '%$path%' }, 
    features: [
      {$: 'dialog-feature.autoFocusOnFirstInput' }, 
      {$: 'dialog-feature.onClose', 
        action :{$: 'toggleBooleanValue', of: '%$globals/jb_preview_result_counter%' }
      }
    ]
  }
})

jb.component('studio.open-jb-editor-menu', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'menu.open-context-menu', 
    menu :{$: 'studio.jb-editor-menu', path: '%$path%' } ,
//    features :{$: 'css.margin', top: '17', left: '31' }
  }
})

jb.component('studio.jb-editor-menu', {
  type: 'menu.option', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'menu.menu', 
    style :{$: 'menu.context-menu' },
    options: [
      {$:'menu.end-with-separator',
         options :{$:'menu.dynamic-options', endsWithSeparator: true,
            items :{$: 'studio.more-params', path: '%$path%' } ,
            genericOption :{$: 'menu.action', 
            title :{$: 'suffix', separator: '~' },
            action :{$: 'runActions', 
              actions: [
                {$: 'studio.add-property', path: '%%' }, 
                {$: 'closeContainingPopup' }, 
                {$: 'writeValue', 
                  to: '%$globals/jb_editor_selection%', 
                  value: '%$path%~%%'
                }, 
              ]
            }
          }
        }
      }, 
      {$: 'menu.action', 
        $vars: {
          compName :{$: 'studio.comp-name', path: '%$path%' }
        }, 
        title: 'Goto %$compName%', 
        action :{$: 'studio.open-jb-editor', path: '%$compName%' }, 
        showCondition: '%$compName%'
      }, 
      {$:'menu.end-with-separator',
        options: {$: 'studio.goto-sublime', path: '%$path%' }
      },
      {$: 'menu.studio-wrap-with', 
        path: '%$path%', 
        type: 'data', 
        components :{$: 'list', items: ['pipeline', 'list', 'firstSucceeding'] }
      }, 
      {$: 'menu.studio-wrap-with', 
        path: '%$path%', 
        type: 'boolean', 
        components :{$: 'list', items: ['and', 'or', 'not'] }
      }, 
      {$: 'menu.studio-wrap-with', 
        path: '%$path%', 
        type: 'action', 
        components :{$: 'list', items: ['runActions', 'runActionOnItems'] }
      }, 
      {$: 'menu.action', 
        title: 'Add property', 
        action :{$: 'openDialog', 
          id: 'add property', 
          style :{$: 'dialog.md-dialog-ok-cancel', 
            okLabel: 'OK', 
            cancelLabel: 'Cancel'
          }, 
          content :{$: 'group', 
            controls: [
              {$: 'editable-text', 
                title: 'name', 
                databind: '%$dialogData/name%', 
                style :{$: 'editable-text.md-input' }
              }
            ], 
            features :{$: 'css.padding', top: '9', left: '19' }
          }, 
          title: 'Add Property', 
          onOK :{$: 'writeValue', 
            to :{$: 'studio.ref', path: '%$path%~%$dialogData/name%' }, 
            value: ''
          },
          modal: 'true'
        }
      },
      {$: 'menu.separator' }, 
      {$: 'menu.action', 
        title: 'Delete', 
        icon: 'delete', 
        shortcut: 'Delete', 
        action: [
          {$: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false }, 
          {$: 'studio.delete', path: '%$path%' }
        ]
      }, 
      {$: 'menu.action', 
        title: 'Copy', 
        icon: 'copy', 
        shortcut: 'Ctrl+C', 
        action :{$: 'studio.copy', path: '%$path%' }
      }, 
      {$: 'menu.action', 
        title: 'Paste', 
        icon: 'paste', 
        shortcut: 'Ctrl+V', 
        action :{$: 'studio.paste', path: '%$path%' }
      }, 
      {$: 'menu.action', 
        title: 'Undo', 
        icon: 'undo', 
        shortcut: 'Ctrl+Z', 
        action :{$: 'studio.undo' }
      }, 
      {$: 'menu.action', 
        title: 'Redo', 
        icon: 'redo', 
        shortcut: 'Ctrl+Y', 
        action :{$: 'studio.redo' }
      }, 
    ], 
    features :{$: 'group.menu-keyboard-selection', autoFocus: true }
  }
})

jb.component('menu.studio-wrap-with', {
  type: 'menu.option', 
  params: [
    { id: 'path', as: 'string'},
    { id: 'type', as: 'string' },
    { id: 'components', as: 'array' },
  ], 
  impl :{$: 'menu.dynamic-options',
    items : { 
          $if: {$: 'studio.is-of-type', path: '%$path%', type: '%$type%' }, 
          then: '%$components%', 
          else: {$list: [] }
    },
        genericOption :{$: 'menu.action', 
          title: 'Wrap with %%',
          action : [
            {$: 'studio.wrap', path: '%$path%', compName: '%%' },
            {$:'studio.expand-and-select-first-child-in-jb-editor' }
          ]
    },
  }
})

jb.component('studio.expand-and-select-first-child-in-jb-editor', {
  type: 'action',
  impl: ctx => {
    var ctxOfTree = ctx.vars.$tree ? ctx : jbart.ctxDictionary[$('.jb-editor').attr('jb-ctx')];
    var tree = ctxOfTree.vars.$tree;
    // if (!tree) {
    //   var ctxId = $('.jb-editor').attr('jb-ctx');
    //   var ctx = jbart.ctxDictionary[ctxId];
    //   tree = ctx && ctx.vars.$tree;
    // }
    if (!tree) return;
    tree.expanded[tree.selected] = true;
    jb.delay(100).then(()=>{
      var firstChild = tree.nodeModel.children(tree.selected)[0];
      if (firstChild) {
        tree.selectionEmitter.next(firstChild);
        tree.regainFocus && tree.regainFocus();
        jb_ui.apply(ctx);
//        jb.delay(100);
      }
    })
  }
})
