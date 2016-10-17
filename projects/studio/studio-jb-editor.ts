import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {model,TgpModel} from './studio-tgp-model';
import {findjBartToLook} from './studio-utils';


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
        style :{$: 'button.md-icon', icon: 'menu'},
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
    style :{$: 'layout.horizontal', spacing: 3 }, 
    controls: [
      {$: 'tree', 
        cssClass: 'jb-control-tree studio-control-tree', 
        nodeModel :{$: 'studio.jb-editor.nodes', path: '%$path%' }, 
        features: [
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
          {$: 'css.width', width: '500' }
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
            features :{$: 'group-item.if', 
              showCondition: '%$globals/jb_editor_selection%'
            }
          }
        ], 
        features :{$: 'group.watch', data: '%$globals/jb_editor_selection%' }
      }
    ]
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
    controls :{$: 'tree', cssClass: 'jb-control-tree', 
        nodeModel :{$: 'tree.json-read-only', 
          object: '%$data%', rootPath: '%$title%' 
        },
        features: [
            { $: 'tree.selection' },
            { $: 'tree.keyboard-selection'},
        ] 
     },
    }
})

jb.component('studio.jb-editor.nodes', {
	type: 'tree.nodeModel',
	params: [ {id: 'path', as: 'string' } ],
	impl: function(context,path) {
		return new TgpModel(path,'jb-editor');
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

jb.component('studio.profile-value-as-text', {
  type: 'data',
  params: [
    { id: 'path', as: 'string' }
  ],
  impl: (context,path) => ({
      $jb_val: function(value) {
        if (typeof value == 'undefined') {
          var val = model.val(path);
          if (val == null)
            return '';
          if (typeof val == 'string')
            return val;
          if (model.compName(path))
            return '=' + model.compName(path);
        }
        else if (value.indexOf('=') != 0)
          model.modify(model.writeValue, path, { value: value },context);
      }
    })
})

jb.component('studio.open-jb-editor-menu', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'openDialog', 
    style :{$: 'pulldownPopup.contextMenuPopup' }, 
    content :{$: 'studio.jb-editor-menu', path: '%$path%' } ,
    features :{$: 'css.margin', top: '17', left: '31' }
  }
})

jb.component('studio.jb-editor-menu', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    controls: [
      {$: 'dynamic-controls', 
        controlItems :{$: 'studio.more-params', path: '%$path%' }, 
        genericControl :{$: 'pulldown.menu-item', 
          title :{
            $pipeline: [
              '%$controlItem%', 
              {$: 'suffix', separator: '~' }
            ]
          }, 
          action :{$: 'runActions', 
            $vars: { nextPath: '%$path%~%$controlItem%' }, 
            actions: [
              {$: 'studio.add-property', path: '%$controlItem%' }, 
              {$: 'closeContainingPopup' }, 
              {$: 'writeValue', 
                to: '%$globals/jb_editor_selection%', 
                value: '%$nextPath%'
              }, 
              {$: 'studio.open-jb-editor-menu', path: '%$nextPath%' }
            ]
          }
        }
      }, 
      {$: 'divider', 
        style :{$: 'divider.br' }, 
        title: 'divider'
      }, 
      {$: 'pulldown.menu-item', 
        $vars: {
          compName :{$: 'studio.comp-name', path: '%$path%' }
        }, 
        title: 'Goto %$compName%', 
        action :{$: 'studio.open-jb-editor', path: '%$compName%' }, 
        features :{$: 'hidden', showCondition: '%$compName%' }
      }, 
      {$: 'studio.goto-sublime', path: '%$path%' }, 
      {$: 'pulldown.menu-item-separator' }, 
      {$: 'pulldown.menu-item', 
        title: 'Delete', 
        icon: 'delete', 
        shortcut: 'Delete', 
        action: [
          {$: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false }, 
          {$: 'studio.delete', path: '%$path%' }
        ]
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Copy', 
        icon: 'copy', 
        shortcut: 'Ctrl+C', 
        action :{$: 'studio.copy', path: '%$path%' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Paste', 
        icon: 'paste', 
        shortcut: 'Ctrl+V', 
        action :{$: 'studio.paste', path: '%$path%' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Undo', 
        icon: 'undo', 
        shortcut: 'Ctrl+Z', 
        action :{$: 'studio.undo' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Redo', 
        icon: 'redo', 
        shortcut: 'Ctrl+Y', 
        action :{$: 'studio.redo' }
      }, 
      {$: 'divider', 
        style :{$: 'divider.br' }, 
        title: 'divider'
      }, 
      {$: 'pulldown.studio-wrap-with', 
        path: '%$path%', 
        type: 'data', 
        components :{$: 'list', items: ['pipeline', 'list', 'firstSucceeding'] }
      }, 
      {$: 'pulldown.studio-wrap-with', 
        path: '%$path%', 
        type: 'boolean', 
        components :{$: 'list', items: ['and', 'or', 'not'] }
      }, 
      {$: 'pulldown.studio-wrap-with', 
        path: '%$path%', 
        type: 'action', 
        components :{$: 'list', items: ['runActions', 'runActionOnItems'] }
      }, 
      {$: 'pulldown.menu-item', 
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
      }
    ], 
    features :{$: 'group.menu-keyboard-selection', autoFocus: true }
  }
})

jb.component('pulldown.studio-wrap-with', {
  type: 'control', 
  params: [
    { id: 'path', as: 'string'},
    { id: 'type', as: 'string' },
    { id: 'components', as: 'array' },
  ], 
  impl :{$: 'dynamic-controls',
            controlItems : { 
              $if: {$: 'studio.is-of-type', path: '%$path%', type: '%$type%' }, 
              then: '%$components%', 
              else: [] 
            },
            genericControl :{$: 'pulldown.menu-item', 
              title: 'Wrap with %$controlItem%',
              action :{$: 'studio.wrap', path: '%$path%', compName: '%$controlItem%' }
        },
      }
})