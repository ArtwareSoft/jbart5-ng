import {jb} from 'jb-core';
import * as studio from './studio-model';

jb.component('studio.editSource', {
	type: 'action',
	params: {
		path: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
	},
	impl: {
		$: 'openDialog',
		title :{$: 'studio.short-title', path: '%$path%' },
		style :{$: 'dialog.studio-floating', id: 'edit source', width: 600 },
		features :{$: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}'},
		content :{$: 'editable-text', 
			databind :{$: 'studio.profile-as-text', path: '%$path%' },
			style :{$: 'editable-text.codemirror', mode: 'javascript'},
			features: {$: 'studio.undo-support', path: '%$path%' },
		}
	}
})

jb.component('studio.profile-as-text', {
	type: 'data',
	params: {
		path: { as: 'string' }
	},
	impl: (context,path) => ({
			$jb_val: function(value) {
				if (typeof value == 'undefined') {
					var val = studio.model.val(path);
					if (typeof val == 'string')
						return val;
					return jb.prettyPrint(val);
				} else {
					var newVal = value.match(/^\s*({|\[)/) ? studio.evalProfile(value) : value;
					if (newVal != null)
						studio.model.modify(studio.model.writeValue, path, { value: newVal },context);
				}
			}
		})
})

jb.component('studio.goto-sublime', {
	type: 'action',
	params: {
		path: { as: 'string'}
	},
	impl: (ctx,path) => {
		var compName = path.indexOf('~') == -1 ? path : studio.model.compName(path);
		compName && $.ajax(`/?op=gotoSource&comp=${compName}`)
	}
}) 

