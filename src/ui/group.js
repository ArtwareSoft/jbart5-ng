jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.type('group.style');

jb.component('group',{
  type: 'control',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'style', type: 'group.style', defaultValue: { $: 'group.section' }, essential: true , dynamic: true },
    { id: 'controls', type: 'control[]', essential: true, flattenArray: true, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: function(context) { 
    return jb_ui.ctrl(context).jbExtend({
      beforeInit: cmp => {
        cmp.ctrls = [];
        cmp.jbToExtend = cmp.jbToExtend || {};
        cmp.extendChild = function(index,options) {
          if (options)
            cmp.jbToExtend[index] = options;
        }

        cmp.initGroup = function() {
          cmp.title = context.params.title(context);
          (cmp.jbGroupChildrenEm || jb_rx.Observable.of(context.params.controls(cmp.ctx)))
              .merge(cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
              .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
              .subscribe(comps=> {
                  var _ctrls = [];
                  cmp.jb_disposable && cmp.jb_disposable.forEach(d=>d());
                  jb.logPerformance('group-change');
                  comps.forEach((comp,i)=>{
                    // if (!comp || comp.invisible)
                    //   return;
                    if (cmp.jbToExtend[i])
                       comp.jbExtend(cmp.jbToExtend[i]);
                    if (!comp.jb_title)
                      debugger;
                    _ctrls.push({ title: comp.jb_title ? comp.jb_title() : '' , comp: comp } );
                  })
                  cmp.ctrls = _ctrls;
                })
            }
      },
      observable: () => {} // to create jbEmitter
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
  params: [
    { id: 'controlItems', type: 'data', as: 'array', essential: true, dynamic: true },
    { id: 'genericControl', type: 'control', essential: true, dynamic: true },
    { id: 'itemVariable', as: 'string', defaultValue: 'controlItem'}
  ],
  impl: function(context,controlItems,genericControl,itemVariable) {
    return controlItems()
      .map(controlItem => jb_tosingle(genericControl(
        jb.ctx(context,{data: controlItem, vars: jb.obj(itemVariable,controlItem)})))
      )
  }
})

jb.component('group.init-group', {
  type: 'feature',
  impl: ctx => ({
    init: cmp => cmp.initGroup()
  })
})

// ** sample style 

jb.component('group.section', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<section class="jb-group">
        <div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div>
        </section>`,
    features :{$: 'group.init-group'},
  }
})

jb.component('wait', {
  type: 'control',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'for', essential: true },
    { id: 'resource', as: 'string' },
    { id: 'dataVariable', as: 'string' },
    { id: 'mapToResource', dynamic: true, defaultValue: '%%' },
    { id: 'control', type: 'control' , dynamic: true },
    { id: 'loadingControl', type: 'control', defaultValue: { $:'label', title: 'loading ...'} , dynamic: true },
    { id: 'errorControl', type: 'control', defaultValue: { $:'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}'} , dynamic: true },
  ],
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

jb.component('control', {
    type: 'control',
    params: [
        { id: 'style', type: 'style', dynamic: true },
        { id: 'title', as: 'string' },
        { id: 'features', type: 'feature[]', dynamic: true },
    ],
    impl: ctx => 
        jb_ui.ctrl(ctx)
})

})