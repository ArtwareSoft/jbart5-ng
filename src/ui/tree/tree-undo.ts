import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {NodeModel,jbTree} from 'jb-ui/tree/tree';
import {Directive, Component, View, DynamicComponentLoader, ElementRef, Injector, Input} from 'angular2/core';

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

class Undo {
	clipboard: string;
	history = [];
	index = 0;
	constructor(private tree :jbTree) {}
	store() {
		var newContent = jb.stringify(this.tree.root.parent);
		if (this.index > 0 && newContent == this.history[this.index - 1].content) return;
		if (this.index != this.history.length)
	     	this.history = this.history.slice(0, this.index);
		this.history.push({ path: this.tree.selectedNode.path(), content: newContent });
		this.index++;
	}
	undo() {
		if (this.index > 1) {
			this.index--;
			this.tree.root.parent = JSON.parse(this.history[this.index - 1].content);
		}
	}
	redo() {
		if (this.index < this.history.length) {
			this.tree.root.parent = JSON.parse(this.history[this.index].content);
			this.index++;
		}
	}
	copy() {
		var selectedNode = this.tree.selectedNode();
		if (selectedNode)
	     	this.clipboard = jb.stringify(selectedNode.val());
	}
	paste() {
		var selectedNode = this.tree.selectedNode();
		if (this.clipboard && selectedNode) {
			selectedNode.assign(JSON.parse(this.clipboard));
			this.store();
		}
	}
}
