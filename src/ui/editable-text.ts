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


