jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('editable-boolean.style');
jb.type('editable-boolean.yes-no-settings');

jb.component('editable-boolean',{
  type: 'control',
  params: [
    { id: 'databind', as: 'ref'},
    { id: 'style', type: 'editable-boolean.style', defaultValue: { $: 'editable-boolean.checkbox' }, dynamic: true },
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'textForTrue', as: 'string', defaultValue: 'yes' },
    { id: 'textForFalse', as: 'string', defaultValue: 'no' },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: (ctx) => {
    var ctx2 = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
  	return jb_ui.ctrl(ctx2).jbExtend({
  		beforeInit: function(cmp) {
        ctx2.vars.field.bindToCmp(cmp, ctx2);

        cmp.toggle = () =>  {
          cmp.jbModel = !cmp.jbModel; 
          ctx2.vars.field.writeValue(cmp.jbModel);
        }

  			cmp.text = () => 
          cmp.jbModel ? ctx.params.textForTrue : ctx.params.textForFalse;
  		}
  	});
  }
})


})