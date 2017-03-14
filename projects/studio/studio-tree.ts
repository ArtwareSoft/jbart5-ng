import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model,TgpModel} from './studio-tgp-model';
import {pathChangesEm} from './studio-utils';

jb.component('studio.open-control-tree', {
  type: 'action', 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-floating', id: 'studio-outline', width: '350' }, 
    content :{$: 'studio.control-tree' }, 
    menu :{$: 'button', 
      title: ' ', 
      action :{$: 'studio.open-tree-menu', path: '%$globals/profile_path%' }, 
      style :{$: 'button.mdl-icon', icon: 'menu' }, 
      features :{$: 'css', css: 'button { background: none }' }
    }, 
    title: 'Outline'
  }
})

jb.component('studio.open-tree-menu', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'menu.open-context-menu', menu :{$: 'studio.tree-menu', path: '%$path%'} }
})

jb.component('studio.tree-menu', {
  type: 'menu.option', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'menu.menu',
      options: [
        {$: 'menu.action', 
          title: 'Insert', 
          action :{$: 'studio.open-new-control-dialog' }
        }, 
        {$: 'menu.action', 
          title: 'Wrap with group', 
          action : [ 
              {$: 'studio.wrap-with-group', path: '%$path%' },
              {$: 'onNextTimer', 
                  action: [
                    {$: 'writeValue', 
                        to: '%$globals/profile_path%', 
                        value: '%$path%~controls~0'
                    },
                    {$ : 'tree.regain-focus' }
                  ]
              }
            ]
        }, 
        {$: 'menu.action', 
          title: 'Duplicate', 
          action :{$: 'studio.duplicate', path: '%$path%' }
        }, 
        {$: 'menu.separator' }, 
        {$: 'menu.action', 
          title: 'inteliscript editor', 
          action :{$: 'studio.open-jb-editor', path: '%$path%' }
        }, 
        {$: 'menu.action', 
          title: 'context viewer', 
          action :{$: 'studio.open-context-viewer', path: '%$path%' }
        }, 
        {$: 'menu.action', 
          title: 'javascript editor', 
          action :{$: 'studio.editSource', path: '%$path%' }
        }, 
        {$: 'menu.action', 
          $vars: {
            compName :{$: 'studio.comp-name', path: '%$path%' }
          }, 
          title: 'Goto %$compName%', 
          showCondition: '%$compName%', 
          action :{$: 'studio.goto-path', path: '%$compName%' }
        }, 
        {$: 'studio.goto-sublime', path: '%$path%' },
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
        }
      ]
    }
  }
})

jb.component('studio.control-tree', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'tree', 
        nodeModel :{$: 'studio.control-tree.nodes' }, 
        features: [
          {$: 'css.class', class: 'jb-control-tree studio-control-tree' }, 
          {$: 'tree.selection', 
            databind: '%$globals/profile_path%', 
            onSelection: [
              {$: 'studio.open-properties' }, 
              {$: 'studio.highlight-in-preview', 
                path :{$: 'studio.currentProfilePath' }
              }
            ], 
            autoSelectFirst: true,
          }, 
          {$: 'tree.keyboard-selection', 
            onEnter :{$: 'studio.open-properties', focus: true },
            onRightClickOfExpanded :{$: 'studio.open-tree-menu', path: '%%' }, 
            applyMenuShortcuts :{$: 'studio.tree-menu', path: '%%' },
            autoFocus: true,
          }, 
          {$: 'tree.drag-and-drop' }, 
          // {$: 'tree.keyboard-shortcut', 
          //   key: 'Ctrl+Right', 
          //   action :{$: 'studio.open-properties', path: '%%' }
          // }, 
          // {$: 'tree.keyboard-shortcut', 
          //   key: 'Ctrl+V', 
          //   action :{$: 'studio.paste', path: '%%' }
          // }, 
          // {$: 'tree.keyboard-shortcut', 
          //   key: 'Ctrl+Z', 
          //   action :{$: 'studio.undo', path: '%%' }
          // }, 
          // {$: 'tree.keyboard-shortcut', 
          //   key: 'Ctrl+Y', 
          //   action :{$: 'studio.redo', path: '%%' }
          // }, 
          // {$: 'tree.keyboard-shortcut', 
          //   key: 'Delete', 
          //   action :{$: 'studio.delete', path: '%%' }
          // }, 
          {$: 'studio.control-tree.refresh-path-changes' }, 
          {$: 'tree.onMouseRight', 
            action :{$: 'studio.open-tree-menu', path: '%%' }
          }
        ]
      }
    ], 
    features :[ 
        {$: 'css.padding', top: '10' },
        {$: 'group.studio-watch-path', path :{$: 'studio.currentProfilePath' } },
    ]
  }
})

jb.component('studio.control-tree.nodes', {
	type: 'tree.nodeModel',
	impl: function(context) {
		var currentPath = context.run({ $: 'studio.currentProfilePath' });
		var compPath = currentPath.split('~')[0] || '';
		return new TgpModel(compPath);
	}
})

// after model modifications the paths of the selected and expanded nodes may change and the tree should fix it.
jb.component('studio.control-tree.refresh-path-changes', {
  type: 'feature',
  impl: ctx => ({
    init : cmp => {
      var tree = ctx.vars.$tree; 
      pathChangesEm.takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
        .subscribe(fixer => {
          var new_expanded = {};
          jb_entries(tree.expanded)
            .filter(e=>e[1])
            .forEach(e => new_expanded[fixer.fix(e[0])] = true)
          tree.expanded = new_expanded;
          tree.selected = fixer.fix(tree.selected);
        })
    }
  })
})
