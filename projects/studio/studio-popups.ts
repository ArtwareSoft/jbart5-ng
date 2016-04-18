import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.editSource', {
	type: 'action',
	impl: {
		$: 'openDialog',
		title: 'edit source - %$globals/profile_path%',
		style :{$: 'dialog.studioFloating', id: 'edit source', width: 600 },
		features :{$: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}'},
		content :{$: 'editable-text', 
			databind :{$: 'studio.currentProfileAsScript' },
			style :{$: 'editable-text.codemirror', mode: 'javascript'},
		}
	}
})

jb.component('studio.showNgComponent', {
	type: 'action',
	impl: {
		$: 'openDialog',
		title: 'angular component - %$globals/profile_path%',
		style :{$: 'dialog.studioFloating', id: 'angular component', width: 600 },
		features :{$: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}'},
		content :{$: 'editable-text', 
			databind :{$: 'studio.ngComponent' },
			style :{$: 'editable-text.codemirror', mode1: 'javascript'},
		}
	}
})

//   cm_settings: {
//     extraKeys: {
//         "Ctrl-Space": "autocomplete",
//         "Ctrl-Enter": editor => updateJbartScriptFromCM(editor.getValue())
//     }
// }
//			features:  { $onupdate: { $:'studio.markSourceAsDirty' } }

jb.component('studio.currentProfileAsScript', {
	type: 'data',
	params: {
		path: { as: 'string', defaultValue: '%$globals/profile_path%' }
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
					//studio.writeValue(path,newProf);
					//newProf && jb.writeValue(ref,newProf);
				}
			}
		}
	}
})

jb.component('studio.ngComponent', {
	type: 'data',
	params: {
		path: { as: 'string', defaultValue: '{%$globals/project%}.{%$globals/page%}' }
	},
	impl: function(context,path) {
		return { $jb_val: () => studio.ngComponent(path) }
	}
})

jb.component('dialog.studioFloating', {
	type: 'dialog.style',
	params: {
		id: { as: 'string' },
		width: { as: 'number', default: 300},
		height: { as: 'number', default: 100},
	},
	impl :{$: 'customStyle',
			$vars: { dialogID: '%$id%' },
			template: `<div class="jb-dialog jb-default-dialog">
				      		  <div class="dialog-title">{{title}}</div>
							  <button class="dialog-close" (click)="dialogClose()">&#215;</button>
							  <div class="jb-dialog-content-parent">
						  	 	<div #content></div>
						  	  </div>
						</div>`,
			features: [
					{$: 'dialogFeature.dragTitle', id: '%$dialogID%'}, 
					{$: 'dialogFeature.uniqueDialog', id: '%$dialogID%', remeberLastLocation: true },
					{$: 'dialogFeature.maxZIndexOnClick', minZIndex: 5000 },
					{$: 'studio-dialogFeature.studioPopupLocation' },
			],
			css: `{ position: fixed; 
						background: #F9F9F9; 
						width: %$width%px; 
						min-height: %$height%px; 
						overflow: auto;
						border-radius: 4px; 
						padding: 0 12px 12px 12px; 
						box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)
				}
				.dialog-title { background: none }
				.jb-dialog-content-parent { padding: 8px; overflow-y: scroll; max-height: 500px }
				.dialog-close {
						position: absolute; 
						cursor: pointer; 
						right: 4px; top: 4px; 
						font: 21px sans-serif; 
						border: none; 
						background: transparent; 
						color: #000; 
						text-shadow: 0 1px 0 #fff; 
						font-weight: 700; 
						opacity: .2;
				}
				.dialog-close:hover { opacity: .5 }`
	}
})

jb.component('studio-dialogFeature.studioPopupLocation',{
	type: 'dialogFeature',
	impl: function(context) {
		var dialog = context.vars.$dialog;

		jb.bind(dialog,'attach',function() {
			if (sessionStorage[dialog.id]) return;
			if (dialog.id == 'studio properties')
				// dialog.$el.css('top','100px').css('left',(window.outerWidth-320)+'px');
				dialog.$el.css('top','110px').css('right','0px').css('left','initial');
			if (dialog.id == 'studio control tree')
				dialog.$el.css('top','0px').css('right','306px').css('left','initial');
				// dialog.$el.css('top','100px').css('left',(window.outerWidth-320-310)+'px');
			if (dialog.id == 'studio main window')
				dialog.$el.css('top','0px').css('right','0px').css('left','initial');
			if (dialog.id == 'studio templates')
				dialog.$el.css('top','73px').css('right','0px').css('left','initial');
			if (dialog.id == 'studio template code')
				dialog.$el.css('bottom','0px').css('left','0px').css('top','initial');
			if (dialog.id == 'code-mirror')
				dialog.$el.css('top','0px').css('left','0px');
			dialog.$el.addClass('default-location');
		});
	}
})
