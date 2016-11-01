jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.component('field.databind', {
  type: 'feature',
  impl: ctx => {
    if (!ctx.vars.$model || !ctx.vars.$model.databind)
      jb.logError('bind-field: No databind in model');
    return {
      init: function(cmp) {
            cmp.jbModel = (val,source) => {
              if (val == undefined) 
                return jb.val(ctx.vars.$model.databind);
              else if (!ctx.vars.$model.updateOnBlur || source != 'keyup')
                jb.writeValue(ctx.vars.$model.databind,val);
            }
      }
  }}
})

jb.component('field.default', {
  type: 'feature',
  params: [
    { id: 'value', type: 'data'},
  ],
  impl: function(context,defaultValue) {
    var data_ref = context.vars.$model.databind;
    if (data_ref && jb.val(data_ref) == null)
      jb.writeValue(data_ref,defaultValue)
  }
})

jb.component('field.subscribe', {
  type: 'feature',
  params: [
    { id: 'action', type: 'action', essential: true, dynamic: true },
    { id: 'includeFirst', type: 'boolean', as: 'boolean'},
  ],
  impl: (context,action,includeFirst) => ({
    init: cmp => {
      var data_ref = context.vars.$model && context.vars.$model.databind;
      if (!data_ref) return;
      var includeFirstEm = includeFirst ? jb_rx.Observable.of(jb.val(data_ref)) : jb_rx.Observable.of();
      jb_rx.refObservable(data_ref,cmp)
            .merge(includeFirstEm)
            .filter(x=>x)
            .subscribe(x=>
              action(context.setData(x)));
    }
  })
})

jb.component('field.onChange', {
  type: 'feature',
  params: [
    { id: 'action', type: 'action[]', essential: true, dynamic: true }
  ],
  impl: ctx => ({ 
    init: cmp =>
      cmp.onChange = () => 
        ctx.params.action(cmp.ctx)
  })
})


jb.component('field.toolbar', {
  type: 'feature',
  params: [
    { id: 'toolbar', type: 'control', essential: true, dynamic: true },
  ],
  impl: (context,toolbar) => ({
    extendComp: { jb_toolbar: toolbar() }
  })
})

})