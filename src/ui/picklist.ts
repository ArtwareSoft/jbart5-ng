import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';

jb.type('picklist.style');
jb.type('picklist.options');

jb.component('picklist', {
  type: 'control',
  params: {
    title: { as: 'string' , dynamic: true },
    databind: { as: 'ref'},
    options: { type: 'picklist.options', dynamic: true, essential: true, defaultValue: {$ : 'picklist.optionsByComma'} },
    style: { type: 'picklist.style', defaultValue: { $: 'picklist.native' }, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: ctx => {
    ctx = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
    return jb_ui.ctrl(ctx).jbExtend({
      init: function(cmp) {
        ctx.vars.field.bindToCmp(cmp, ctx);
        cmp.options = ctx.params.options(ctx);
      }
    },ctx);
  }
})


// ********* styles

jb.component('picklist.native', {
  type: 'picklist.style',
  impl :{$: 'customStyle', 
    template: `<div><select %$field.modelExp%>
                    <option *ngFor="#option of options" [value]="option.code">{{option.text}}</option>
                 </select></div>`,
    css: 'select {height: 23px}'
  }
  // impl: function(context) {  return { //${context.vars.field.modelExp} value=""
  //     template: `<select ${context.vars.field.modelExp}>
  //                   <option *ngFor="#option of options" [value]="option.code">{{option.text}}</option>
  //                </select>`,
  //     styles: ['* { height: 23px }'],
  //   }
  // }
})

// ********* options

jb.component('picklist.optionsByComma',{
  type: 'picklist.options',
  params: { 
    options: { as: 'string', essential: true},
    allowEmptyValue: { type: 'boolean' },
  },
  impl: function(context,options,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat((options||'').split(',').map(function(code) { 
      return { code: code, text: code }
    }))
  }
});

jb.component('picklist.options',{
  type: 'picklist.options',
  params: { 
    options: { as: 'array', essential: true},
    allowEmptyValue: { type: 'boolean' },
  },
  impl: function(context,options,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat(options.map(function(code) { return { code: code, text: code } } ));
  }
});

jb.component('picklist.coded-options',{
  type: 'picklist.options',
  params: { 
    options: { as: 'array',essential: true },
    code: { as: 'string', dynamic:true , essential: true }, 
    text: { as: 'string', dynamic:true, essential: true } ,
    allowEmptyValue: { type: 'boolean' },
  },
  impl: function(context,options,code,text,allowEmptyValue) {
    var emptyValue = allowEmptyValue ? [{code:'',value:''}] : [];
    return emptyValue.concat(options.map(function(option) { 
      return { 
        code: code(null,option), text: text(null,option) 
      }
    }))
  }
});

