import {jb} from 'jb-core';
import * as studio from './studio-model';

jb.component('studio.editSource', {
	type: 'action',
	impl: {
		$: 'openDialog',
		title: { $: 'studio.short-title', path: { $: 'studio.currentProfilePath' } },
		style :{$: 'dialog.studio-floating', id: 'edit source', width: 600 },
		features :{$: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}'},
		content :{$: 'editable-text', 
			databind :{$: 'studio.currentProfileAsScript' },
			style :{$: 'editable-text.codemirror', mode: 'javascript'},
		}
	}
})

jb.component('studio.currentProfileAsScript', {
	type: 'data',
	params: {
		path: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
	},
	impl: function(context,path) {
		var ref = studio.profileRefFromPath(path);
		return {
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return jb.prettyPrint(jb.val(ref));
				else {
					var newProf = studio.evalProfile(value);
					if (newProf)
						studio.model.modify(studio.model.writeValue, path, { value: newProf },context);
				}
			}
		}
	}
})

jb.component('studio.openSublime', {
	type: 'action',
	params: {
		path: { as: 'string'}
	},
	impl: (ctx,path) => 
		studio.model.compName(path) && $.ajax(`/?op=gotoSource&comp=${studio.model.compName(path)}`)
}) 

