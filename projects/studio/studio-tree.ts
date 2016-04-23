import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.openControlTree', {
	type: 'action',
	impl :{$: 'openDialog',
		title: 'Control Tree',
		style :{$: 'dialog.studioFloating', id: 'studio control tree', width: 300 },
		content :{$: 'group',
			controls: [
				{$: 'button', 
					style :{$: 'button.md-icon', icon: 'menu', css: '{position: fixed; margin-top: -10px; margin-left: 230px; }' },
					action :{$: 'studio.open-tree-menu', path: '%$globals/profile_path%' }
				},
				{$: 'studio.controlTree' },
		] }
	}
})

jb.component('studio.open-tree-menu',{
	type: 'action',
	params: { 
		path: { as: 'string' },
	},
	impl :{$: 'openDialog',
		style :{$: 'pulldownPopup.contextMenuPopup' },
		content :{$: 'group',
			controls: [
	 		    { $: 'pulldown.menu-item', title: 'Delete', icon: 'delete', shortcut: 'Delete',
					action : [ 
						{$: 'writeValue', value: false, to: '%$TgpTypeCtrl.expanded%'},
						{$: 'studio.delete', path: '%$path%' },
					],
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Wrap with group',
				    action :{$: 'studio.openSublime', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Duplicate',
				    action :{$: 'studio.openSublime', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item-separator' },
	 		    { $: 'pulldown.menu-item', title: 'javascript editor',
				    action :{$: 'studio.editSource', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Goto sublime',
				    action :{$: 'studio.openSublime', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item-separator' },
	 		    { $: 'pulldown.menu-item', title: 'Copy', icon: 'copy', shortcut: 'Ctrl+C',
				    action :{$: 'studio.copy', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Paste', icon: 'paste', shortcut: 'Ctrl+V',
				    action :{$: 'studio.paste', path: '%$path%' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Undo', icon: 'undo', shortcut: 'Ctrl+Z',
				    action :{$: 'studio.undo' }
	 		    },
	 		    { $: 'pulldown.menu-item', title: 'Redo', icon: 'redo', shortcut: 'Ctrl+Y',
				    action :{$: 'studio.redo' }
	 		    },
			]
		}
	}
})

jb.component('studio.controlTree',{
	type: 'control',
	impl: {
		$: 'tree', cssClass: 'jb-control-tree studio-control-tree',
		nodeModel: { $: 'studio.controlTree.nodes' },
		features: [
			{ $: 'tree.selection', 
				autoSelectFirst: true, 
				databind: '%$globals/profile_path%',
				onSelection :{$: 'studio.highlight-in-preview', 
					path :{$: 'studio.currentProfilePath' } 
				},
				onDoubleClick: [
					{$: 'studio.openProperties'},
					{$: 'studio.highlight-in-preview'},
				],
			},
			{ $: 'tree.keyboard-selection', onEnter :{$: 'studio.openProperties'} }, 
			{ $: 'tree.drag-and-drop' },
			{ $: 'tree.keyboard-shortcut', key: 'Ctrl-C', action :{$: 'studio.copy', path: '%%' } },
			{ $: 'tree.keyboard-shortcut', key: 'Ctrl-V', action :{$: 'studio.paste', path: '%%' } },
			{ $: 'studio.controlTree.refreshPathChanges'},
		]
	}
})

jb.component('studio.controlTree.nodes', {
	type: 'tree.nodeModel',
	params: {},
	impl: function(context) {
		var currentPath = context.str({ $: 'studio.currentProfilePath' });
		var compPath = currentPath.split('~')[0] || '';
		return new studio.ControlModel(compPath);
	}
})

// after model modifications the paths of the selected and expanded nodes may change and the tree should fix it.
jb.component('studio.controlTree.refreshPathChanges', {
  type: 'feature',
  impl: function(context) {
    var tree = context.vars.$tree; 
    if (jbart._refreshPathTreeObserver)
    	jbart._refreshPathTreeObserver.unsubscribe();
    jbart._refreshPathTreeObserver = studio.pathChangesEm.subscribe(function(fixer) {
    	var new_expanded = {};
    	Object.getOwnPropertyNames(tree.expanded).filter(path=>tree.expanded[path])
    		.forEach(path => new_expanded[fixer.fix(path)] = true)
    	tree.expanded = new_expanded;
    	tree.selected = fixer.fix(tree.selected);
    })
  }
})
