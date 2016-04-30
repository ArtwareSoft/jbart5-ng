import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

class Undo {
	history = [];
	index = 0;
	constructor() {
		studio.modifyOperationsEm.subscribe(change=>{
			this.history.push(change);
			this.index = this.history.length;
		})
	}
	undo(ctx) {
		if (this.index > 0) {
			this.index--;
			var change = this.history[this.index];
			setComp(change.before,change.jbart);
			jb_ui.apply(ctx);
		}
	}
	redo(ctx) {
		if (this.index < this.history.length) {
			var change = this.history[this.index];
			setComp(change.after,change.jbart);
			this.index++;
			jb_ui.apply(ctx);
		}
	}
}

var undo = new Undo();

jb.component('studio.undo',{
	impl: ctx => undo.undo(ctx)
})

jb.component('studio.redo',{
	impl: ctx => undo.redo(ctx)
})

function doSetComp(jbart_base,id,comp) {
	jbart_base.comps[id] = comp;
}

function setComp(code,jbart_base) {
	var fixed = code.replace(/^jb.component\(/,'doSetComp(jbart_base,')
	try {
		return eval(`(${fixed})`)
	} catch (e) {
		jb.logException(e,'set comp:'+code);
	}
}
