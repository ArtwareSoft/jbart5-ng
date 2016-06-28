import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.component('group.wait', {
  type: 'feature',
  params: { 
    for: { essential: true },
    loadingControl: { type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    error: { type: 'control', defaultValue: { $:'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}'} , dynamic: true },
  },
  impl: function(context,waitFor,loading,error) { 
    return {
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx) {
        return jb_rx.observableFromCtx(ctx.setData(waitFor))
          .flatMap(x=>originalCtrlsEmFunc(ctx))
          .startWith([loading(ctx)])
          .catch(e=>{ return jb_rx.Observable.of([error(ctx.setVars({error:e}))])})
      }
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
  impl: function(context, ref, itemVariable,watch) {
    return {
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx,cmp) {
        if (!watch) {
          var val = jb.val(ref());
          return Observable.of([originalCtrlsEmFunc(ctxWithItemVar(ctx.setData(val),val))])
        }

        return cmp.jbEmitter
          .map(()=> jb.val(ref())) 
          .distinctUntilChanged()
          .filter(x=>x && x!='undefined')
//          .map(x=>{console.log('group.data: ref changed',x);return x})
          .flatMap(function(val) {
              return originalCtrlsEmFunc(ctxWithItemVar(ctx.setData(val),val))
            }
          );

        function ctxWithItemVar(ctx,val) { return itemVariable ? ctx.setVars(jb.obj(itemVariable,val)) : ctx } 
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
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx,cmp) {
        return cmp.jbEmitter
          .map(()=> 
            jb.val(data())) 
          .distinctUntilChanged()
          .flatMap(x=>
              originalCtrlsEmFunc(ctx)
          );
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
  impl: (context,name,value) => ({
    extendCtx: ctx => 
      ctx.setVars(jb.obj(name,value(ctx))),
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

jb.component('oneWayBind', {
  type: 'feature',
  params: {
    value: { essential: true, dynamic: true },
    to: { essential: true, as: 'ref' },
  },
  impl: function(context,value,to) { return {
    doCheck: function(cmp) {
      jb.writeValue(jb_ui.ngRef(to,cmp),value(cmp.ctx));
    }
  } }
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
  type: 'feature',
  params: {
    css: { essential: true, as: 'string' },
  },
  impl: (context,css) => 
    ({css:css})
})

jb.component('css.width', {
  type: 'feature',
  params: {
    width: { essential: true, as: 'number' },
  },
  impl: (context,width) => 
    ({css: `{ width: ${width}px}`})
})

jb.component('css.box-shadow', {
  type: 'feature',
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
  type: 'feature',
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

