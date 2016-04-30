import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

studio.modifyOperationsEm.subscribe(e=>{
})

class Undo {
	clipboard: string;
	history = [];
	index = 0;
	constructor() {}
	store() {
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

export var undo = new Undo();

