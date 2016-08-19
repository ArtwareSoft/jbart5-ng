import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.component('group.wait', {
  type: 'feature',
  params: { 
    for: { essential: true },
    loadingControl: { type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    error: { type: 'control', defaultValue: { $:'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}'} , dynamic: true },
    resource: { as: 'string' },
    mapToResource: { dynamic: true, defaultValue: '%%' },
  },
  impl: function(context,waitFor,loading,error) { 
    return {
      beforeInit: function(cmp) {
          var waiting = cmp.jbWait();
          cmp.jbGroupChildrenEm = jb_rx.observableFromCtx(context.setData(waitFor))
            .flatMap(x=>{
                var data = context.params.mapToResource(x);
                jb.writeToResource(context.params.resource,data,context);
                return [context.vars.$model.controls(cmp.ctx.setData(data))];
              })
            .do(x=>
              waiting.ready())
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
  params: {
    data: { essential: true, dynamic: true, as: 'ref' },
    itemVariable: { as: 'string' },
    watch: { type: 'boolean', as: 'boolean', defaultValue: true }
  },
  impl: function(context, data, itemVariable,watch) {
    return {
      beforeInit: function(cmp) {
          var dataEm = cmp.jbEmitter
              .filter(x => x == 'check')
              .map(()=> 
                jb.val(data())) 
              .distinctUntilChanged(jb_compareArrays)
              .map(val=> {
                  var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx).setData(val);
                  var ctx3 = itemVariable ? ctx2.setVars(jb.obj(itemVariable,val)) : ctx2;
                  return context.vars.$model.controls(ctx3)
              })

          cmp.jbGroupChildrenEm = watch ? dataEm : dataEm.take(1);
      },
      observable: () => {} // to create jbEmitter
  }}
})

jb.component('group.watch', {
  type: 'feature',
  params: {
    data: { essential: true, dynamic: true },
  },
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

jb.component('group-item.if', {
  type: 'feature',
  params: {
    showCondition: { type: 'boolean', as: 'boolean', essential: true },
  },
  impl: (context, condition) => ({
    invisible: !condition
  })
})



jb.component('feature.init', {
  type: 'feature',
  params: {
    action: { type: 'action[]', essential: true, dynamic: true }
  },
  impl: (ctx,action) => ({init: cmp => 
      action(cmp.ctx)
  })
})

jb.component('feature.ng-attach-object', {
  type: 'feature',
  params: {
    data: { as: 'single', dynamic: true }
  },
  impl: (ctx,data) => ({init: cmp => {
      var obj = data(cmp.ctx);
      jb.extend(cmp,obj);
      jb.extend(cmp.constructor.prototype,obj.constructor.prototype || {});
  }})
})

jb.component('feature.disableChangeDetection', {
  type: 'feature',
  impl: (ctx) => ({
      disableChangeDetection: true })
})

jb.component('feature.onEnter', {
  type: 'feature',
  params: {
    action: { type: 'action[]', essential: true, dynamic: true }
  },
  impl: ctx => ({ 
      host: {
        '(keydown)': 'keydown.next($event)',
        'tabIndex': '0',
      },
      init: cmp=> {
        cmp.keydown = cmp.keydown || new Subject();
        cmp.keydown.filter(e=> e.keyCode == 13)
            .subscribe(()=>
              jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx, cmp.elementRef)())
      }
  })
})


jb.component('ngAtts', {
  type: 'feature',
  params: {
    atts: { as: 'object' }
  },
  impl: (ctx,atts) => 
    ({atts:atts})
})

jb.component('feature.afterLoad', {
  type: 'feature',
  params: {
    action: { type: 'action[]', essential: true, dynamic: true }
  },
  impl: function(context) { return  { 
    afterViewInit: cmp => jb.delay(1).then(() => context.params.action(cmp.ctx))
  }}
})

jb.component('feature.emitter',{
  type: 'feature',
  params: {
    varName: { as: 'string'},
  },
  impl: function(context,varName) { return  { 
    extendCtx: (ctx,cmp) => 
      ctx.setVars(jb.obj(varName,cmp.jbEmitter)),
    observable: (obs,ctx) => {}, // register
  }}
})

jb.component('var',{
  type: 'feature',
  params: {
    name: { as: 'string'},
    value: { dynamic: true },
  },
  impl: (context,name,value) => 
    jb.extend({}, name && {
      extendCtx: ctx =>
        ctx.setVars(jb.obj(name,value(ctx)))
    })
})

jb.component('hidden', {
  type: 'feature',
  params: {
    showCondition: { type: 'boolean', essential: true, dynamic: true },
  },
  impl: function(context,showCondition) { return {
      init: function(cmp) {
        cmp.jb_hidden = () =>
          !showCondition(cmp.ctx)
      },
      atts: { '[hidden]': 'jb_hidden()'}
    }
  }
})

jb.component('field.style-on-focus', {
  type: 'feature',
  params: {
    style: { type: 'style', essential: true, dynamic: true },
  },
  impl: ctx => ({
    extendComp: { jb_styleOnFocus: ctx.profile.style }
  })
})

jb.component('css', {
  type: 'feature,dialogFeature',
  params: {
    css: { essential: true, as: 'string' },
  },
  impl: (context,css) => 
    ({css:css})
})

jb.component('css.width', {
  type: 'feature,dialogFeature',
  params: {
    width: { essential: true, as: 'number' },
  },
  impl: (context,width) => 
    ({css: `{ width: ${width}px}`})
})

jb.component('css.padding', {
  type: 'feature,dialogFeature',
  params: {
    top: { as: 'number' },
    left: { as: 'number' },
    right: { as: 'number' },
    bottom: { as: 'number' },
    selector: { as: 'string' },
  },
  impl: (ctx) => {
    var css = ['top','left','right','bottom']
      .filter(x=>ctx.params[x] != null)
      .map(x=> `padding-${x}: ${ctx.params[x]}px`)
      .join('; ');
    return {css: `${ctx.params.selector} {${css}}`};
  }
})

jb.component('css.margin', {
  type: 'feature,dialogFeature',
  params: {
    top: { as: 'number' },
    left: { as: 'number' },
    right: { as: 'number' },
    bottom: { as: 'number' },
    selector: { as: 'string' },
  },
  impl: (ctx) => {
    var css = ['top','left','right','bottom']
      .filter(x=>ctx.params[x] != null)
      .map(x=> `margin-${x}: ${ctx.params[x]}px`)
      .join('; ');
    return {css: `${ctx.params.selector} {${css}}`};
  }
})

jb.component('css.box-shadow', {
  type: 'feature,dialogFeature',
  params: {
    blurRadius: { as: 'number', defaultValue: 5 },
    spreadRadius: { as: 'number', defaultValue: 0 },
    shadowColor: { as: 'string', defaultValue: '#000000'},
    opacity: { as: 'number', min: 0, max: 1, defaultValue: 0.75, step: 0.01 },
    horizontal: { as: 'number', defaultValue: 10},
    vertical : { as: 'number', defaultValue: 10},
    selector: { as: 'string' },
  },
  impl: (context,blurRadius,spreadRadius,shadowColor,opacity,horizontal,vertical,selector) => {
    var color = [parseInt(shadowColor.slice(1,3),16) || 0, parseInt(shadowColor.slice(3,5),16) || 0, parseInt(shadowColor.slice(5,7),16) || 0]
      .join(',');
    return ({css: `${selector} { box-shadow: ${horizontal}px ${vertical}px ${blurRadius}px ${spreadRadius}px rgba(${color},${opacity}) }`})
  }
})

jb.component('cssClass', {
  type: 'feature,dialogFeature',
  params: {
    cssClass: { essential: true, as: 'string' },
  },
  impl: (context,cssClass) => 
    ({ atts:{ class: cssClass } })
})

jb.component('feature.keyboard-shortcut', {
  type: 'feature',
  params: {
    key: { as: 'string', description: 'e.g. Alt+C' },
    action: { type: 'action', dynamic: true }
  },
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

