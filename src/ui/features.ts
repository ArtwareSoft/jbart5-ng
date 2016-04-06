import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
//import {Location} from '/jbart/node_modules/angular2/router';
import {Observable,Subject} from 'rxjs/Rx';

jb.component('wait', {
  type: 'feature',
  params: { 
    for: { essential: true },
    loadingControl: { type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    error: { type: 'control', defaultValue: { $:'label', title: 'error: %$error%', styles: ['* {color: red; font-weight: bold}']} , dynamic: true },
  },
  impl: function(context,waitFor,loading,error) { 
    return {
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx) {
        return jb_rx.observableFromCtx(ctx.setData(waitFor))
          .flatMap(x=>originalCtrlsEmFunc(ctx))
          .startWith([loading(ctx)])
          .catch(e=>{ return Observable.of([error(ctx.setVars({error:e}))])})
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
          .map(x=>{console.log('group.data: ref changed',x);return x})
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
//    emptyGroupWhenDataEmpty: { type: 'boolean', as: 'boolean'}
  },
  impl: function(context, data,emptyGroupWhenDataEmpty) {
    return {
      ctrlsEmFunc: function(originalCtrlsEmFunc,ctx,cmp) {
        return cmp.jbEmitter
          .map(()=> 
            jb.val(data())) 
          .distinctUntilChanged()
//          .filter(x=>x && x!='undefined')
          .map(x=>{console.log('group.watch: data changed',x);
            return x})
          .flatMap(x=>
              originalCtrlsEmFunc(ctx)
          );
      },
      observable: () => {} // to create jbEmitter
  }}
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
    extendCtx: (ctx,cmp) => ctx.setVars(jb.obj(varName,cmp.jbEmitter)),
    observable: (obs,ctx) => {}, // register
  }}
})

jb.component('hidden', {
  type: 'feature',
  params: {
    showCondition: { type: 'boolean', essential: true, dynamic: true },
  },
  impl: function(context,showCondition) { return {
      init: function(cmp) {
        cmp.jb_hidden = () => {
          return !showCondition(cmp.ctx)
        }
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

jb.component('css', {
  type: 'feature',
  params: {
    css: { essential: true, as: 'string' },
  },
  impl: (context,css) => jb.obj('styles',css.split(/}$/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'))
})

jb.component('cssClass', {
  type: 'feature',
  params: {
    cssClass: { essential: true, as: 'string' },
  },
  impl: (context,cssClass) => jb.obj('atts',{ class: cssClass } )
})

jb.component('feature.keyboard-shortcut', {
  type: 'feature',
  params: {
    key: { as: 'string', description: 'e.g. alt-C' },
    action: { type: 'action', dynamic: true }
  },
  impl: (context,key,action) => 
    ({
      init: function(cmp) {
            var doc = cmp.elementRef.nativeElement.ownerDocument;
            $(doc).keydown(event => {
              var keyCode = key.split('-').pop().charCodeAt(0);
              var helper = (key.match('([a-z]*)-') || ['',''])[1];
              if (helper == 'ctrl' && !event.ctrlKey) return
              if (helper == 'alt' && !event.altKey) return
              if (event.keyCode == keyCode)
                action();
            })
          }
    })
})

