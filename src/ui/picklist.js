jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('picklist.style');
jb.type('picklist.options');

jb.component('picklist', {
  type: 'control',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'databind', as: 'ref'},
    { id: 'options', type: 'picklist.options', dynamic: true, essential: true, defaultValue: {$ : 'picklist.optionsByComma'} },
    { id: 'style', type: 'picklist.style', defaultValue: { $: 'picklist.native' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: ctx => {
    ctx = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
    return jb_ui.ctrl(ctx).jbExtend({
      beforeInit: function(cmp) {
        ctx.vars.field.bindToCmp(cmp, ctx);

        cmp.recalcOptions = function() {
          cmp.options = ctx.params.options(ctx);
          var groupsHash = {};
          cmp.groups = [];
          cmp.options.forEach(o=>{
            var groupId = groupOfOpt(o);
            var group = groupsHash[groupId] || { options: [], text: groupId};
            if (!groupsHash[groupId]) {
              cmp.groups.push(group);
              groupsHash[groupId] = group;
            }
            group.options.push({text: o.text.split('.').pop(), code: o.code });
          })
        }
        cmp.recalcOptions();
      },
     observable: () => {} // to create jbEmitter
    },ctx);
  }
})

function groupOfOpt(opt) {
  if (!opt.group && opt.text.indexOf('.') == -1)
    return '';
  return opt.group || opt.text.split('.').shift();
}

jb.component('picklist.dynamic-options', {
  type: 'feature',
  params: [
    { id: 'recalcEm', as: 'observable'}
  ],
  impl: (ctx,recalcEm) => ({
    init: cmp => 
      recalcEm
        .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
        .subscribe(e=>
            cmp.recalcOptions()) 
  })
})

// ********* options

jb.component('picklist.optionsByComma',{
  type: 'picklist.options',
  params: [ 
    { id: 'options', as: 'string', essential: true},
    { id: 'allowEmptyValue', type: 'boolean' },
  ],
  impl: function(context,options,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat((options||'').split(',').map(function(code) { 
      return { code: code, text: code }
    }))
  }
});

jb.component('picklist.options',{
  type: 'picklist.options',
  params: [ 
    { id: 'options', as: 'array', essential: true},
    { id: 'allowEmptyValue', type: 'boolean' },
  ],
  impl: function(context,options,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat(options.map(function(code) { return { code: code, text: code } } ));
  }
})

jb.component('picklist.coded-options',{
  type: 'picklist.options',
  params: [ 
    { id: 'options', as: 'array',essential: true },
    { id: 'code', as: 'string', dynamic:true , essential: true }, 
    { id: 'text', as: 'string', dynamic:true, essential: true } ,
    { id: 'allowEmptyValue', type: 'boolean' },
  ],
  impl: function(context,options,code,text,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat(options.map(function(option) { 
      return { 
        code: code(null,option), text: text(null,option) 
      }
    }))
  }
})

})