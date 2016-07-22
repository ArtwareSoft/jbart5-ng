import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as studio from './studio-model';


jb.component('studio.open-jb-editor', {
  type: 'action', 
  params: {
    path: { as: 'string' }
  }, 
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
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    title: 'main', 
    controls: [
      {$: 'tree', 
        cssClass: 'jb-control-tree studio-control-tree', 
        nodeModel :{$: 'studio.jb-editor.nodes', path: '%$path%' }, 
        features: [
          {$: 'tree.selection', 
            autoSelectFirst: true, 
            databind: '%$globals/jb_editor_selection%', 
            onDoubleClick :{$: 'studio.open-jb-edit-property', 
              path: '%$globals/jb_editor_selection%'
            }
          }, 
          {$: 'tree.keyboard-selection', 
            onEnter :{$: 'studio.open-jb-edit-property', 
              path: '%$globals/jb_editor_selection%'
            }, 
            onRightClickOfExpanded :{$: 'studio.open-jb-editor-menu' , path: '%%'},
            autoFocus: true
          }, 
          {$: 'tree.drag-and-drop' }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Up', 
            action :{$: 'studio.moveInArray', path: '%%',moveUp: true }
          }, 
          {$: 'tree.keyboard-shortcut', 
            key: 'Ctrl+Down', 
            action :{$: 'studio.moveInArray', path: '%%',moveUp: false }
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
        title: 'input-output', 
        features :{$: 'group.data', data: '%$globals/jb_editor_selection%' }, 
        controls :{$: 'group', 
          features :{$: 'group.wait', 
            for :{$: 'studio.probe', path: '%$globals/jb_editor_selection%' }, 
            resource: 'probeResult'
          }, 
          title: 'wait for probe', 
          controls :{$: 'itemlist', 
            items: '%$probeResult%', 
            controls: [
              {$: 'studio.data-browse', data: '%in/data%', title: 'in' }, 
              {$: 'studio.data-browse', data: '%out%', title: 'out' }
            ]
          }
        }
      }
    ], 
    style :{$: 'layout.horizontal', spacing: 3 }
  }
})

jb.component('studio.data-browse', {
  type: 'control',
  params: { 
    data: { },
    title: { as: 'string'}
  },
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
	params: { path: { as: 'string'} },
	impl: function(context,path) {
		return new studio.ControlModel(path,'jb-editor');
	}
})

jb.component('studio.open-jb-edit-property', {
  type: 'action', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-jb-editor-popup' }, 
    content :{$: 'studio.jb-floating-input', path: '%$path%' }, 
    features :{$: 'dialogFeature.autoFocusOnFirstInput' }
  }
})

jb.component('studio.jb-floating-input', {
  type: 'control',
  params: { path: { as: 'string'} },
  impl :{$: 'editable-text', 
      databind :{$: 'studio.profile-value-as-text', path: '%$path%' }, 
      features: [
        {$: 'studio.undo-support', path: '%$path%' }, 
        {$: 'css.padding', left: '4', right: '4' }, 
        {$: 'editable-text.suggestions-input-feature', 
          mdInput: true,
          floatingInput: true,
          path: '%$path%',
          action :{$: 'studio.jb-open-suggestions', path: '%$path%' },
          onEnter: [
            {$: 'closeContainingPopup', OK: true }, 
            {$: 'tree.regain-focus' }
          ]  
        }
      ], 
      style :{$: 'editable-text.md-input', width: '400' } 
    }
})

jb.component('studio.profile-value-as-text', {
  type: 'data',
  params: {
    path: { as: 'string' }
  },
  impl: (context,path) => ({
      $jb_val: function(value) {
        if (typeof value == 'undefined') {
          var val = studio.model.val(path);
          if (val == null)
            return '';
          if (typeof val == 'string')
            return val;
          if (studio.model.compName(path))
            return '=' + studio.model.compName(path);
          return typeof val;
        }
       
        var _path = path;
        // if (path.slice(-2)== '~+') {
        //   var arrPath = path.slice(0,-2);
        //   studio.model.modify(studio.model.addArrayItem, arrPath, {}, context);
        //   var ar = studio.model.val(arrPath);
        //   _path = arrPath+'~'+ (ar.length-1);
        // }

        if (value.indexOf('=') == 0) {
          var comp = value.substr(1);
          if (comp == 'pipeline')
            studio.model.modify(studio.model.writeValue, _path, { value: [] },context);  
          else if (studio.findjBartToLook(_path).comps[comp])
            studio.model.modify(studio.model.setComp, _path, { comp: value.substr(1) },context);
        } else {
          studio.model.modify(studio.model.writeValue, _path, { value: value },context);
        }
      }
    })
})

jb.component('studio.open-jb-editor-menu', {
  type: 'action', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'openDialog', 
    style :{$: 'pulldownPopup.contextMenuPopup' }, 
    content :{$: 'studio.jb-editor-menu', path: '%$path%' } ,
    features :{$: 'css.margin', top: '17', left: '31' }
  }
})

jb.component('studio.jb-editor-menu', {
  type: 'control', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'group', 
    features :{$: 'group.menu-keyboard-selection', autoFocus: true }, 
    controls: [
      {$: 'dynamic-controls', 
        controlItems :{$: 'studio.more-params', path: '%$path%' }, 
        genericControl :{$: 'pulldown.menu-item', 
          title: [
            '%$controlItem%', 
            {$: 'suffix', separator: '~' }
          ], 
          action: [
            {$: 'studio.addProperty', path: '%$controlItem%' }, 
            {$: 'writeValue', 
              to: '%$globals/jb_editor_selection%', 
              value: '%$controlItem%'
            }, 
            {$: 'closeContainingPopup' }, 
            {$: 'tree.regain-focus' }
          ]
        }
      }, 
      {$: 'divider', 
        style :{$: 'divider.br' }, 
        title: 'divider'
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Javascript editor', 
        icon: 'code', 
        action :{$: 'studio.editSource', path: '%$path%' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Goto sublime', 
        action :{$: 'studio.goto-sublime', path: '%$path%' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Delete', 
        icon: 'delete', 
        shortcut: 'Delete', 
        action: [
          {$: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false }, 
          {$: 'studio.delete', path: '%$path%' }
        ]
      }, 
      {$: 'divider', 
        style :{$: 'divider.br' }, 
        title: 'divider'
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Wrap with pipeline', 
        icon: '', 
        shortcut: '', 
        action :{$: 'studio.wrapWithPipeline', path: '%$path%' }
      }, 
      {$: 'pulldown.menu-item', 
        title: 'Add property', 
        icon: '', 
        shortcut: '', 
        action :{$: 'openDialog', 
          id: 'add property', 
          modal: true, 
          title: 'Add Property', 
          content :{$: 'group', 
            controls: [
              {$: 'editable-text', 
                style :{$: 'editable-text.md-input' }, 
                title: 'name', 
                databind: ''
              }
            ], 
            features :{$: 'css.padding', top: '9', left: '19' }
          }, 
          style :{$: 'dialog.md-dialog-ok-cancel', 
            okLabel: 'OK', 
            cancelLabel: 'Cancel'
          }
        }
      }
    ]
  }
})
