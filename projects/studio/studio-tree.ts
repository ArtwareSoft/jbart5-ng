import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.openControlTree', {
	type: 'action',
	impl :{$: 'openDialog',
		title: 'Control Tree',
//		styles: ['* {padding:3px}'],
		style :{$: 'dialog.studioFloating', id: 'studio control tree', width: 600 },
		content :{$: 'studio.controlTree' }
	}
});

jb.component('studio.controlTree',{
	type: 'control',
	impl: {
		$: 'tree', cssClass1: 'jb-control-tree studio-control-tree',
		nodeModel: { $: 'studio.controlTree.nodes' },
		features: [
			{ $: 'tree.selection', 
				autoSelectFirst: true, 
				databind: '{%$globals/profile_path%}',
				onSelection :{$: 'studio.highlight-in-preview'},
				onDoubleClick: [
					{$: 'studio.openProperties'},
					{$: 'studio.highlight-in-preview'},
				],
    //   				{ $: 'writeValue', to: '%$globals/profile_path%', value: '%%' },
				// 	{ $: 'studio.openProperties'}
				// ]
			},
			{ $: 'tree.keyboard-selection', onEnter :{$: 'studio.openProperties'} }, 
			{ $: 'tree.drag-and-drop' },
			{ $: 'studio.controlTree.refreshPathChanges'},
		  // { $: 'studio.controlTreeIcon' },
		  // { $: 'treeSelection',
		  //   onSelection: [
			 //    { $: 'writeValue', value: { '$studio.profilePath': '{{.}}'}, to: { $: 'studio.currentProfilePath'} },
			 //    { $: 'studio.openProperties'},
			 //    { $: 'studio.highlightProfileInPreview', profile: '{{.}}' }
		  //   ]
		  // },
		  // { $: 'studioControlTree.autoSelect'},
		  // { $rightClickToAddItems: { $if: { $: 'studio.profileHasParam', profile: '{{}}', param: 'controls' }, then: { $: 'studio.addToControlTreePopup', parentProfile: '{{$controlProfile}}' } } },
		  // { $deleteNode: { $: 'studio.deleteProfileInControlTree' } },
		  // { $id: 'studio-control-tree' }
		]
	}
})

jb.component('studio.controlTree.nodes', {
	type: 'tree.nodeModel',
	params: {},
	impl: function(context) {
		var currentPath = context.str({ $firstSucceeding: ['{%$globals/profile_path%}', '{%$globals/project%}.{%$globals/page%}'] });
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
