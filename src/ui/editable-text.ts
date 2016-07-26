import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('editable-text.style');

jb.component('editable-text',{
  type: 'control',
  params: {
    title: { as: 'string' , dynamic: true },
    databind: { as: 'ref'},
    style: { type: 'editable-text.style', defaultValue: { $: 'editable-text.input' }, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: ctx => 
  	jb_ui.ctrl(ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) }))
});

jb.component('editable-text.bindField', {
  type: 'feature',
  impl: ctx => ({
  	init: cmp => 
  		ctx.vars.field.bindToCmp(cmp, ctx)
  })
})

jb.component('editable-text.input', {
  type: 'editable-text.style',
  impl :{$: 'customStyle', 
      features :{$: 'editable-text.bindField' },
      template: `<div><input %$field.modelExp%></div>`,
	  css: 'input {height: 16px}'
	}
})

jb.component('editable-text.textarea', {
	type: 'editable-text.style',
	impl :{$: 'customStyle', 
      features :{$: 'editable-text.bindField' },
      template: '<textarea %$field/modelExp%></textarea>',
	}
})

jb.component('editable-text.codemirror', {
	type: 'editable-text.style',
	params: {
		cm_settings: { as: 'single' },
		resizer: { type: 'boolean', as: 'boolean', description: 'resizer id or true (id is used to keep size in session storage)' },
		height: { as: 'number' },
		mode: { as: 'string' },
		debounceTime: { as: 'number', defaultValue: 300 },
		lineWrapping: { as: 'boolean' },
	},
	impl: function(context, cm_settings, resizer, height, mode, debounceTime, lineWrapping) {
		return {
			template: '<textarea></textarea>',
			cssClass: 'jb-codemirror',
			init: function(cmp) {
				mode = mode || 'javascript';
				var field = context.vars.field;
				cm_settings = jb.extend(cm_settings||{}, { 
					mode: mode, 
					lineWrapping: lineWrapping,
					theme: 'solarized light', 
					// mode: 'jbart5',
					extraKeys: { 
						'Ctrl-Space': 'autocomplete',
						'Ctrl-Enter': () => {}
					},
				});
				var $el = $(cmp.elementRef.nativeElement);
				var $textarea = $el.findIncludeSelf('textarea');
				$textarea.val(field.getValue());
				//if (resizer) jb_codemirrorResizer(editor, $el);

				context.vars.ngZone.runOutsideAngular(() => {
					var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
					cmp.codeMirror = editor;
					$(editor.getWrapperElement()).css('box-shadow', 'none');
					if (height)
						$(editor.getWrapperElement()).css('height', height + 'px');
					field.observable(context)
						.filter(x => 
							x != editor.getValue())
						.subscribe(x=>
							editor.setValue(x||''));

					var editorTextChange = new jb_rx.Subject();
					editorTextChange.distinctUntilChanged()
						.debounceTime(debounceTime)
						.filter(x => 
							x != field.getValue())
						.subscribe(x=>{ 
							field.writeValue(x); 
							jb_ui.apply(context)
						})

					editor.on('change', () => 
						editorTextChange.next(editor.getValue())
					);
				})
			}
		}
	}
})



