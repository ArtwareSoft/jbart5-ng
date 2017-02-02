jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];
jb.component('group.wait', {
  type: 'feature',
  params: [ 
    { id: 'for', essential: true, dynamic: true },
    { id: 'loadingControl', type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    { id: 'error', type: 'control', defaultValue: { $:'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}'} , dynamic: true },
    { id: 'resource', as: 'string' },
    { id: 'mapToResource', dynamic: true, defaultValue: '%%' },
  ],
  impl: function(context,waitFor,loading,error) { 
    return {
      beforeInit: function(cmp) {
//          var waiting = cmp.jbWait();
          cmp.jbGroupChildrenEm = jb_rx.observableFromCtx(context.setData(waitFor()))
            .flatMap(x=>{
                var data = context.params.mapToResource(x);
                jb.writeToResource(context.params.resource,data,context);
                return [context.vars.$model.controls(cmp.ctx.setData(data))];
              })
            // .do(x=>
            //   jb_native_delay(10).then(_=> 
            //     waiting.ready()))
            .startWith([loading(context)])
            .catch(e=> 
              jb_rx.Observable.of([error(context.setVars({error:e}))]));
      },
      observable: () => {} // to create jbEmitter
  }}
})

// bind data and watch the data to refresh the control
jb.component('group.data', {
  type: 'feature',
  params: [
    { id: 'data', essential: true, dynamic: true, as: 'ref' },
    { id: 'itemVariable', as: 'string' },
    { id: 'watch', type: 'boolean', as: 'boolean', defaultValue: true }
  ],
  impl: function(context, data_ref, itemVariable,watch) {
    return {
      beforeInit: function(cmp) {
          context.vars.$model.databind = data_ref;
          var dataEm = cmp.jbEmitter
              .filter(x => x == 'check')
              .map(()=> 
                jb.val(data_ref())) 
              .distinctUntilChanged(jb_compareArrays)
              .map(()=> {
                  var ctx2 = cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx;
                  return context.vars.$model.controls(ctx2)
              })

          cmp.jbGroupChildrenEm = watch ? dataEm : dataEm.take(1);
      },
      extendCtx: ctx => {
          var val = data_ref();
          var res = ctx.setData(val);
          if (itemVariable)
            res = res.setVars(jb.obj(itemVariable,val));
          return res;
      },
      observable: () => {} // to create jbEmitter
  }}
})

jb.component('group.watch', {
  type: 'feature',
  params: [
    { id: 'data', essential: true, dynamic: true },
  ],
  impl: (context, data) => ({
      beforeInit: function(cmp) {
          cmp.jbWatchGroupChildrenEm = (cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
              .merge(cmp.jbEmitter
                .filter(x => x == 'check')
                .map(()=> 
                  jb.val(data())) 
                .filter(x=>x != null)
                .distinctUntilChanged(jb_compareArrays)
                .map(val=> {
                    var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx);
                    return context.vars.$model.controls(ctx2)
                })
            )
      },
      observable: () => {} // to create jbEmitter
  })
})

// static if - to watch condition, parent component need to be refreshed
jb.component('group-item.if', {
  type: 'feature',
  params: [
    { id: 'showCondition', type: 'boolean', as: 'boolean', essential: true },
  ],
  impl: (context, condition) => ({
    invisible: !condition
  })
})



jb.component('feature.init', {
  type: 'feature',
  params: [
    { id: 'action', type: 'action[]', essential: true, dynamic: true }
  ],
  impl: (ctx,action) => ({init: cmp => 
      action(cmp.ctx)
  })
})

jb.component('feature.ng-attach-object', {
  type: 'feature',
  params: [
    { id: 'data', as: 'single', dynamic: true }
  ],
  impl: (ctx,data) => 
    ({init: cmp => {
        var obj = data(cmp.ctx);
        if (cmp.constructor && cmp.constructor.prototype && obj) {
          jb.extend(cmp,obj);
          jb.extend(cmp.constructor.prototype,obj.constructor.prototype || {});
        }
    }})
})

jb.component('feature.disableChangeDetection', {
  type: 'feature',
  impl: (ctx) => ({
      disableChangeDetection: true })
})

jb.component('feature.onEnter', {
  type: 'feature',
  params: [
    { id: 'action', type: 'action[]', essential: true, dynamic: true }
  ],
  impl: ctx => ({ 
      host: {
        '(keydown)': 'keydownSrc.next($event)',
        'tabIndex': '0',
      },
      init: cmp=> {
        cmp.keydownSrc = cmp.keydownSrc || new jb_rx.Subject();
        cmp.keydown = cmp.keydownSrc
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

        cmp.keydown.filter(e=> e.keyCode == 13)
            .subscribe(()=>
              jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx, cmp.elementRef)())
      },
      observable: () => {},
  })
})

jb.component('feature.afterLoad', {
  type: 'feature',
  params: [
    { id: 'action', type: 'action[]', essential: true, dynamic: true }
  ],
  impl: function(context) { return  { 
    afterViewInit: cmp => jb.delay(1).then(() => context.params.action(cmp.ctx))
  }}
})

jb.component('feature.emitter',{
  type: 'feature',
  params: [
    { id: 'varName', as: 'string'},
  ],
  impl: function(context,varName) { return  { 
    extendCtx: (ctx,cmp) => 
      ctx.setVars(jb.obj(varName,cmp.jbEmitter)),
    observable: () => {},
  }}
})

jb.component('var',{
  type: 'feature',
  params: [
    { id: 'name', as: 'string'},
    { id: 'value', dynamic: true },
  ],
  impl: (context,name,value) => 
    jb.extend({}, name && {
      extendCtx: ctx =>
        ctx.setVars(jb.obj(name,value(ctx)))
    })
})

jb.component('hidden', {
  type: 'feature',
  params: [
    { id: 'showCondition', type: 'boolean', essential: true, dynamic: true },
  ],
  impl: function(context,showCondition) { return {
      init: function(cmp) {
        cmp.jb_hidden = () =>
          !showCondition(cmp.ctx)
      },
      host: { '[hidden]': 'jb_hidden()'}
    }
  }
})

jb.component('field.style-on-focus', {
  type: 'feature',
  params: [
    { id: 'style', type: 'style', essential: true, dynamic: true },
  ],
  impl: ctx => ({
    extendComp: { jb_styleOnFocus: ctx.profile.style }
  })
})

jb.component('feature.debounce', {
  type: 'feature',
  params: [
    { id: 'debounceTime', as: 'number', defaultValue: 500 },
  ],
  impl: (ctx,debounceTime) =>
    ({
      init: cmp => {
          cmp.inputEvents = cmp.inputEvents || new jb_rx.Subject();
          cmp.inputEvents.takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
            .distinctUntilChanged()
            .debounceTime(debounceTime)
            .subscribe(val=>
              jb.writeValue(ctx.vars.$model.databind,val)
          )
      },
      observable: () => {},
    })
})


jb.component('feature.keyboard-shortcut', {
  type: 'feature',
  params: [
    { id: 'key', as: 'string', description: 'e.g. Alt+C' },
    { id: 'action', type: 'action', dynamic: true }
  ],
  impl: (context,key,action) => 
    ({
      init: function(cmp) {
            var doc = cmp.elementRef.nativeElement.ownerDocument;
            $(doc).keydown(event => {
                var keyCode = key.split('+').pop().charCodeAt(0);
                if (key == 'Delete') keyCode = 46;

                var helper = (key.match('([A-Za-z]*)+') || ['',''])[1];
                if (helper == 'Ctrl' && !event.ctrlKey) return
                if (helper == 'Alt' && !event.altKey) return
                if (event.keyCode == keyCode)
                action();
            })
          }
    })
})

})