import {jb} from 'jb-core';
import {model} from './studio-tgp-model';
import {evalProfile} from './studio-utils';

jb.component('studio.editSource', {
	type: 'action',
	params: [
		{ id: 'path', as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
	],
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
	params: [
		{ id: 'path', as: 'string', dynamic: true },
	],
	impl: ctx => ({
			$jb_val: function(value) {
				var path = ctx.params.path();
				if (!path) return;
				if (typeof value == 'undefined') {
					var val = model.val(path);
					if (typeof val == 'string')
						return val;
					return jb.prettyPrint(val);
				} else {
					var newVal = value.match(/^\s*({|\[)/) ? evalProfile(value) : value;
					if (newVal != null)
						model.modify(model.writeValue, path, { value: newVal },ctx);
				}
			}
		})
})

jb.component('studio.string-property-ref', {
	type: 'data',
	params: [
		{ id: 'path', as: 'string' },
	],
	impl: (context,path,stringOnly) => ({
			$jb_val: function(value) {
				if (typeof value == 'undefined') {
					return model.val(path);
				} else {
					model.modify(model.writeValue, path, { value: newVal },context);
				}
			}
		})
})

jb.component('studio.goto-sublime', {
	type: 'control',
	params: [
		{ id: 'path', as: 'string'},
	],
    impl :{$: 'dynamic-controls', 
        controlItems :{$: 'studio.goto-targets', path: '%$path%' }, 
        genericControl :{$: 'pulldown.menu-item', 
          title: { $pipeline: [
            '%$controlItem%', 
            {$: 'split', separator: '~', part: 'first' },
            'goto sublime: %%'
          ]}, 
          action :{$: 'studio.open-sublime-editor', path: '%$controlItem%' } 
        }
      }, 
}) 

jb.component('studio.goto-targets', {
	params: [
		{ id: 'path', as: 'string'},
	],
	impl: (ctx,path) => 
		[model.compName(path),path]
			.filter(x=>x)
			.map(x=>
				x.split('~')[0])
			.filter( jb_unique(x=>x) )
}) 

jb.component('studio.open-sublime-editor', {
	type: 'action',
	params: [
		{ id: 'path', as: 'string'},
	],
	impl: (ctx,path) => {
		path && $.ajax(`/?op=gotoSource&comp=${path.split('~')[0]}`)
	}
}) 

