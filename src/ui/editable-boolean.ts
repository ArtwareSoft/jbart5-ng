import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('editable-boolean.style');
jb.type('editable-boolean.yes-no-settings');

jb.component('editable-boolean',{
  type: 'control',
  params: {
    databind: { as: 'ref'},
    style: { type: 'editable-boolean.style', defaultValue: { $: 'editable-boolean.checkbox' }, dynamic: true },
    title: { as: 'string' , dynamic: true },
    textForTrue: { as: 'string', defaultValue: 'yes' },
    textForFalse: { as: 'string', defaultValue: 'no' },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: (ctx) => {
    var ctx2 = ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) });
  	return jb_ui.ctrl(ctx2).jbExtend({
  		beforeInit: function(cmp) {
        ctx2.vars.field.bindToCmp(cmp, ctx2);

        cmp.toggle = () =>  {
          cmp.jbModel = !cmp.jbModel; 
          ctx2.vars.field.writeValue(cmp.jbModel);
        }

  			cmp.text = () => 
          cmp.jbModel ? ctx.params.textForTrue : ctx.params.textForFalse;
  		}
  	});
  }
})


