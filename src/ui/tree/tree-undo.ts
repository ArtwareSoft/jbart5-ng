import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {NodeModel,jbTree} from 'jb-ui/tree/tree';
import {Directive, Component, View, ElementRef, Injector, Input} from '@angular/core';

jb.component('json.undo', {
	type: 'feature',
	params: {},
	impl: function(context) {
		@Directive({
			selector: '[tree-undo]',
		})
		class TreeUndo {
			@Input() tree: jbTree;
			@Input('tree-undo') treeUndo;
			ngAfterViewInit() {
				var undo = new Undo(this.tree);
				jb.extend(this.tree,{ undo: undo })
				jb.bind(this.tree, 'store', e => { undo.store() })
				jb.bind(this.tree, 'undo', e => { undo.undo() })
				jb.bind(this.tree, 'redo', e => { undo.redo() })
				jb.bind(this.tree, 'copy', e => { undo.copy() })
				jb.bind(this.tree, 'paste', e => { undo.paste() })
			}
		}
		return {
			type: 'directives',
			atts: { '[tree-undo]': '' },
			directives: [TreeUndo]
		}
	}
});

