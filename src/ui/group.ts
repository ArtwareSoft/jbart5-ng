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

    function disposeChildren(cmp) {
        (cmp.jb_disposable||[]).forEach(del=>del()); // ugly - dispose the jb_comp components
        cmp.jb_disposable = []; 
        $(cmp.elementRef.nativeElement).find('jb_comp').remove(); // even uglier - clean the elements
    }

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
          var cmpEmitterFunc = jb_ui.controlsToGroupEmitter(context.params.controls,cmp);
          cmpEmitterFunc(cmp.ctx).subscribe(comps=> {
            cmp.ctrls = [];
            cmp.jb_disposable && cmp.jb_disposable.forEach(d=>d());
            jb.logPerformance('group-change');
            comps.forEach((comp,i)=>{
              if (!comp)
                return;
              if (cmp.jbToExtend[i])
                 comp.jbExtend(cmp.jbToExtend[i]);
              if (!comp.jb_title)
                debugger;
              cmp.ctrls.push({ title: comp.jb_title ? comp.jb_title() : '' , comp: comp } );
            })
          })
        }
      },
      directives: [jb_ui.jbComp]
    })
  }
})

jb.component('dynamic-controls', {
  type: 'control',
  params: {
    controlItems: { type: 'data[]', essential: true, dynamic: true },
    genericControl: { type: 'control', essential: true, dynamic: true },
    controlItemVariable: { as: 'string', defaultValue: 'controlItem'}
  },
  impl: function(context,controlItems,genericControl,controlItemVariable) {
    return controlItems().map(controlItem => genericControl(context.setVars(
      jb.obj(controlItemVariable,controlItem))))
  }
})

jb.component('group.initGroup', {
  type: 'feature',
  impl: ctx => jb.obj('init', cmp => cmp.initGroup())
})

// ** sample style 

jb.component('group.section', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: '<section class="jb-group"><jb_comp *ngFor="var ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true"></jb_comp></section>',
    features :{$: 'group.initGroup'}
  }
})

