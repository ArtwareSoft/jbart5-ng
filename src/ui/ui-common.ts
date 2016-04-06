import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
import * as ui_utils from 'jb-ui/jb-ui-utils';

jb.component('addCssClass',{
	type: 'action',
	params: {
		cssClass: { as: 'string' }
	},
	impl: function(context,cssClass) {
		if (context.vars.control && context.vars.control.$el) 
			context.vars.control.$el.addClass(cssClass);
	}
});

jb.component('setText',{
	type: 'action',
	params: {
		text: { as: 'string' },
		controlID: { as: 'string' }
	},
	impl: function(context,text,controlID) {
		var elem = ui_utils.findControlElement(context.vars.control.$el[0],controlID);
		if (!elem) return;
		var input = $(elem).findIncludeSelf('input,textarea')[0];
		if (input) {
			$(input).val(text);
			input.jbUpdated && input.jbUpdated();
		}
	}
});

jb.component('urlParam',{
	type: 'data',
	params: {
		param: { as: 'string' }
	},
	impl: function(context,param) {
		return ui_utils.urlParam(param);
	}
});

jb.component('url',{
	type: 'data',
	impl: function(context,param) {
		ui_utils.listenToUrlChange();
		return window.location.href;
	}
});

jb.component('urlHashParam',{
	type: 'data',
	params: {
		param: { as: 'string' }
	},
	impl: function(context,param) {
		if (!jbart.classes.urlHashParam) {
			jbart.classes.urlHashParam = function(param) { this.param = this.$jb_property = param; this.type = 'urlHashParam'; }
			jbart.classes.urlHashParam.prototype.$jb_val = function(val) { return ui_utils.urlHashParam(this.param, typeof val == 'undefined' ? undefined : jb.tostring(val)); }
			jbart.classes.urlHashParam.prototype.$jb_equals = function(other) { return other && other.type == this.type && other.param == this.param; }
			}
		return new jbart.classes.urlHashParam(param);
	}
});

jb.component('runDOMEvent',{
	type: 'action',
	params: {
		eventType: { as: 'string' },
		on: { as: 'string' }
	},
	impl: function(context,eventType,on) {
		context.vars.control.$(on).trigger(eventType);
	}
})

jb.component('htmlContainsText',{
	params: {
		text: { type: 'data[]', as: 'array' }
	},
	impl: function(context,text) {
		var htmlText = context.data;
		if (context.data.innerHTML) {
			$htmlText = $(htmlText).clone();
			$htmlText.find('input,textarea').each(function() { 
				this.setAttribute('jb-test-val',this.value); 
			});
			$htmlText.find('*').each(function() { if (this.style.display == 'none') $(this).remove(); });
			var div = $('<div/>').append($htmlText)[0];
			htmlText = div.innerHTML;
		}
		var lastPos = 0;
		for(var i=0;i<text.length;i++)
		  if ((lastPos = htmlText.indexOf(text[i],lastPos)) == -1) return false;

		return true;
	}
});

jb.component('sessionStorage',{
	params: {
		key: { as: 'string'}
	},
	impl: function(context,key) {
		return {
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return sessionStorage[key];
				else
					sessionStorage[key]=jb.tostring(value);
			}
		}
	}
});

jb.component('openUrl', {
	type: 'action',
	params: {
		url: { as:'string' },
		target: { type:'enum', values: ['new tab','self'], defaultValue:'new tab', as:'string'}
	},
	impl: function(context,url,target) {
		var _target = (target == 'new tab') ? '_blank' : '_self';
		window.open(url,_target);
	}
})

jb.component('apply', {
	type: 'action',
	impl: jb_ui.apply
})

