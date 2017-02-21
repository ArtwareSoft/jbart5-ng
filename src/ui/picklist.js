jb.type('picklist.style');
jb.type('picklist.options');
jb.type('picklist.promote');

jb.component('picklist', {
  type: 'control', category: 'field:80',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'databind', as: 'ref'},
    { id: 'options', type: 'picklist.options', dynamic: true, essential: true, defaultValue: {$ : 'picklist.optionsByComma'} },
    { id: 'promote', type: 'picklist.promote', dynamic: true },
    { id: 'style', type: 'picklist.style', defaultValue: { $: 'picklist.native' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: ctx => {
    return jb_ui.ctrl(ctx).jbExtend({
      beforeInit: function(cmp) {
        cmp.recalcOptions = function() {
          cmp.options = ctx.params.options(ctx);
          var groupsHash = {};
          var promotedGroups = (ctx.params.promote() || {}).groups || [];
          cmp.groups = [];
          cmp.options.filter(x=>x.text).forEach(o=>{
            var groupId = groupOfOpt(o);
            var group = groupsHash[groupId] || { options: [], text: groupId};
            if (!groupsHash[groupId]) {
              cmp.groups.push(group);
              groupsHash[groupId] = group;
            }
            group.options.push({text: o.text.split('.').pop(), code: o.code });
          })
          cmp.groups.sort((p1,p2)=>promotedGroups.indexOf(p2.text) - promotedGroups.indexOf(p1.text));
          cmp.hasEmptyOption = cmp.options.filter(x=>!x.text)[0];
        }
        cmp.recalcOptions();
      },
     observable: () => {} // to create jbEmitter
    },ctx);
  }
})

function groupOfOpt(opt) {
  if (!opt.group && opt.text.indexOf('.') == -1)
    return '---';
  return opt.group || opt.text.split('.').shift();
}

jb.component('picklist.dynamic-options', {
  type: 'feature',
  params: [
    { id: 'recalcEm', as: 'observable'}
  ],
  impl: (ctx,recalcEm) => ({
    observable: () => {},
    init: cmp => 
      recalcEm && recalcEm
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
    return emptyValue.concat((options||'').split(',').map(code=> ({ code: code, text: code })));
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
    return emptyValue.concat(options.map(code=> ({ code: code, text: code })));
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

jb.component('picklist.promote',{
  type: 'picklist.promote',
  params: [ 
    { id: 'groups', as: 'array'},
    { id: 'options', as: 'array'},
  ],
  impl: (context,groups,options) => 
    ({ groups: groups, options: options})
});
