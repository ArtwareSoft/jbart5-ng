jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('editable-text.style');

jb.component('editable-text',{
  type: 'control',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'databind', as: 'ref'},
    { id: 'style', type: 'editable-text.style', defaultValue: { $: 'editable-text.input' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
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


})