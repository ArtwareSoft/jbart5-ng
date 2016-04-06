import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

jb.type('editable-boolean.style');
jb.type('editable-boolean.yes-no-settings');

jb.component('editable-boolean',{
  type: 'control',
  params: {
    databind: { as: 'ref'},
    style: { type: 'editable-boolean.style', defaultValue: { $: 'editable-boolean.switch' }, dynamic: true },
    title: { as: 'string' , dynamic: true },
    yesNoSettings: { type: 'editable-boolean.yes-no-settings', defaultValue :{ $: 'editable-boolean.yes-no-settings'}, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
  },
  impl: (ctx,databind) => {
  	return jb_ui.ctrl(ctx).jbExtend({
  		init: function(cmp) {
  			var setting = ctx.params.yesNoSettings() || {};
  			databind = jb_ui.ngRef(databind,cmp);

  			cmp.bindViaSettings = () => {
  				jb_rx.refObservable(databind,ctx)
  					.map(setting.toBool||(x=>x))
  					.subscribe(x=>{cmp.yesNo=x;jb_ui.apply(ctx)});

  				jb_rx.refObservable(jb_ui.ngRef('{{yesNo}}',cmp),ctx)
  					.map(setting.fromBool||(x=>x))
  					.subscribe(x=>{jb.writeValue(databind,x);jb_ui.apply(ctx)});
  			}
			   
        cmp.toggle = () => { 
          cmp.yesNo = !cmp.yesNo; jb_ui.apply(ctx);
        };
  			cmp.text = () => (setting.textFromBool || (x=>x))(cmp.yesNo);
  		}
  	},ctx);
  }
})

jb.component('editable-boolean.yes-no-settings',{
  type: 'editable-boolean.yes-no-settings',
  params: {
  	textForTrue: { as: 'string'},
  	textForFalse: { as: 'string'},
  	codeForTrue: { as: 'string', defaultValue: true},
  	codeForFalse: { as: 'string', defaultValue: false},
  },
  impl: function(context,textForTrue,textForFalse,codeForTrue,codeForFalse) {
  	return {
  		toBool: val => val == codeForTrue,
  		fromBool: yesNo => yesNo ? codeForTrue : codeForFalse,
  		textFromBool: yesNo => yesNo ? textForTrue : textForFalse,
  	}
  }
})

jb.component('editable-boolean.md-switch', {
  type: 'editable-boolean.style',
  impl: function(context) {
	  return { 
	  	template: '<md-switch [(checked)]="yesNo">{{text()}}</md-switch>',
	  	afterViewInit: cmp => cmp.bindViaSettings()
	  }
	}
})

jb.component('editable-boolean.expand-collapse', {
  type: 'editable-boolean.style',
  impl: function(context) {
	  return { 
	  	template: `<button><span class="frame"></span><span class="line1"></span><span [ngClass]="{line2: !yesNo}"></span></button>`,
	  	host: { '(click)': 'toggle()' },
      styles: [
        'button { margin-left: 3px; border: none; background: none; width: 11px; height: 11px; position: relative; padding: 0;}',
        'button .frame { background: #F8FFF9; border-radius: 3px;  border: 1px solid #91B193;  position: absolute;  top: 0px;  left: 0px;  right: 0px;  bottom: 0px; }',
        'button .line1 { position: absolute; background: #91B193; top: 5px; left: 3px; width: 5px; height: 1px; box-shadow: 1px 1px 1px -1px #89A385; }',
        'button .line2 { position: absolute; background: #91B193; left: 5px; top: 3px; height: 5px; width: 1px; box-shadow: 1px 1px 1px -1px #89A385; }',
      ],
	  	afterViewInit: cmp => cmp.bindViaSettings()
	  }
	}
})

