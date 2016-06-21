import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';

jb.type('editable-number.style');

jb.component('editable-number',{
  type: 'control',
  params: {
    databind: { as: 'ref'},
    title: { as: 'string' , dynamic: true },
    style: { type: 'editable-number.style', defaultValue: { $: 'editable-number.input' }, dynamic: true },
    symbol: { as: 'string', description: 'leave empty to parse symbol from value' },
    min: { as: 'number' },
    max: { as: 'number' },
    displayString: { as: 'string', dynamic: true, defaultValue: '%$Value%%$Symbol%' },
    dataString: { as: 'string', dynamic: true, defaultValue: '%$Value%%$Symbol%' },
    features: { type: 'feature[]', dynamic: true },

    step: { as: 'number', defaultValue: 1, description: 'used by slider' },
    initialPixelsPerUnit: { as: 'number', description: 'used by slider' },
  },
  impl: (context,databind,title,style,symbol,min,max,displayString,dataString,features,step,initialPixelsPerUnit) => {
    var ctx = context.setVars({ 
      editableNumber: new editableNumber(symbol,min,max,displayString,dataString,step||1,initialPixelsPerUnit),
      field: jb_ui.twoWayBind(databind)
    });
  	return jb_ui.ctrl(ctx) 
  }
})

jb.component('editable-number.bindField', {
  type: 'feature',
  impl: ctx => jb.obj('init', cmp => ctx.vars.field.bindToCmp(cmp, ctx))
})

jb.component('editable-number.input',{
  type: 'editable-number.style',
  impl :{$: 'customStyle', 
      features :{$: 'editable-number.bindField' },
      template: `<div><input %$field.modelExp%></div>`,
    css: 'input {height: 16px}'
  }
})


class editableNumber {
  constructor(public symbol, public min, public max, public displayString, public dataString, public step, public initialPixelsPerUnit) {
    if (this.min == null) this.min = NaN;
    if (this.max == null) this.max = NaN;
  }
  numericPart(dataString) {
    if (!dataString) return NaN;
    var parts = (''+dataString).match(/([^0-9\.\-]*)([0-9\.\-]+)([^0-9\.\-]*)/); // prefix-number-suffix
    if ((!this.symbol) && parts)
      this.symbol = parts[1] || parts[3] || this.symbol;
    return (parts && parts[2]) || '';
  }

  calcDisplayString(number,ctx) {
    if (isNaN(number)) return this.placeholder || '';
    return this.displayString(ctx.setVars({ Value: ''+number, Symbol: this.symbol }));
  }

  calcDataString(number,ctx) {
    if (isNaN(number)) return '';
    return this.dataString(ctx.setVars({ Value: ''+number, Symbol: this.symbol }));
  }
}