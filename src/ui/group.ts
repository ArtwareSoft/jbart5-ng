import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('group.style');

jb.component('group',{
  type: 'control',
  params: {
    title: { as: 'string' , dynamic: true },
    style: { type: 'group.style', defaultValue: { $: 'group.section' }, essential: true , dynamic: true },
    controls: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: function(context) { 
    return jb_ui.ctrl(context).jbExtend({
      beforeInit(cmp) {
        cmp.ctrls = [];
        cmp.jbToExtend = cmp.jbToExtend || {};
        cmp.extendChild = function(index,options) {
          if (options)
            cmp.jbToExtend[index] = options;
        }

        cmp.initGroup = function() {
          cmp.title = context.params.title(context);
//          var cmpEmitterFunc = jb_ui.controlsToGroupEmitter(context.params.controls,cmp);
          (cmp.jbGroupChildrenEm || jb_rx.Observable.of(context.params.controls(cmp.ctx)))
              .merge(cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
              .subscribe(comps=> {
                  cmp.ctrls = [];
                  cmp.jb_disposable && cmp.jb_disposable.forEach(d=>d());
                  jb.logPerformance('group-change');
                  comps.forEach((comp,i)=>{
                    if (!comp || comp.invisible)
                      return;
                    if (cmp.jbToExtend[i])
                       comp.jbExtend(cmp.jbToExtend[i]);
                    if (!comp.jb_title)
                      debugger;
                    cmp.ctrls.push({ title: comp.jb_title ? comp.jb_title() : '' , comp: comp } );
                  })
                })
            }
      }
    })
  }
})

jb.component('group.dynamic-sub-titles', {
  type: 'feature',
  impl: ctx => ({
    doCheck: cmp => 
      (cmp.ctrls || []).forEach(ctrl=>
        ctrl.title = ctrl.comp.jb_title ? ctrl.comp.jb_title() : '')
  })
})

jb.component('dynamic-controls', {
  type: 'control',
  params: {
    controlItems: { type: 'data', as: 'array', essential: true, dynamic: true },
    genericControl: { type: 'control', essential: true, dynamic: true },
    itemVariable: { as: 'string', defaultValue: 'controlItem'}
  },
  impl: function(context,controlItems,genericControl,itemVariable) {
    return controlItems().map(controlItem => genericControl(context.setVars(
      jb.obj(itemVariable,controlItem))))
  }
})

jb.component('group.initGroup', {
  type: 'feature',
  impl: ctx => 
    jb.obj('init', cmp => cmp.initGroup())
})

// ** sample style 

jb.component('group.section', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: '<section class="jb-group"><jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true"></jb_comp></section>',
    features :{$: 'group.initGroup'}
  }
})

jb.component('wait', {
  type: 'control',
  params: {
    title: { as: 'string' , dynamic: true },
    for: { essential: true },
    resource: { as: 'string' },
    dataVariable: { as: 'string' },
    mapToResource: { dynamic: true, defaultValue: '%%' },
    control: { type: 'control' , dynamic: true },
    loadingControl: { type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    errorControl: { type: 'control', defaultValue: { $:'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}'} , dynamic: true },
  },
  impl :{$: 'group', 
      controls :{$: 'group',
          controls :{$call: 'control' },
          features :{$: 'var', name: '%$dataVariable%', value: '%%'}
      },
      features :{$: 'group.wait', 
        for :{$call: 'for' }, 
        resource: '%$resource%', 
        mapToResource :{$call: 'mapToResource' }, 
        loadingControl :{$call: 'loadingControl' }, 
        error :{$call: 'errorControl' }, 
      }
  }
})
