import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as ui_utils from 'jb-ui/jb-ui-utils';

declare var $: any;
declare var jbart: any;
declare var System: any;

jb.component('add-css-class',{
	type: 'action',
	params: {
		cssClass: { as: 'string' }
	},
	impl: function(context,cssClass) {
		if (context.vars.control && context.vars.control.$el) 
			context.vars.control.$el.addClass(cssClass);
	}
});

jb.component('url-param',{
	type: 'data',
	params: {
		param: { as: 'string' }
	},
	impl: function(context,param) {
		return ui_utils.urlParam(param);
	}
});


jb.component('sessionStorage',{
	type: 'data',
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

jb.component('goto-url', {
	type: 'action',
	description: 'navigate/open a new web page, change href location',
	params: {
		url: { as:'string', essential: true },
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

jb.component('search-filter',{
	type: 'aggregator',
	params: {
		pattern: { as: 'string' }
	},
	impl: (context,pattern) =>
		context.data.filter(item => {
			var itemText = JSON.stringify(item).toLowerCase();
			return !pattern || itemText.indexOf(pattern.toLowerCase()) != -1;
		})
})

jb.component('new-instance', {
	type: 'data',
	params: {
		module: { as: 'string', essential: true },
		class: { as: 'string', essential: true},
		// todo - constructor
	},
	impl: (ctx,module,_class) => {
		try {
			return new (jb.entries(System._loader.modules).filter(p=>p[0].indexOf(module) != -1)[0][1].module[_class])()
		} catch (e) {
			return;
		}
	}
})

jb.component('injector-get', {
	type: 'data',
	params: {
		provider: { as: 'string', essential: true },
	},
	impl: (ctx,providerId) => {
		var provider = jbart.ng.providers[providerId];
		if (provider)
			return ctx.vars.injector.get(provider);
		jb.logError('injector-get: provider ' + providerId + ' is not registered. Use jb_ui.registerProviders to register it');
	}
})
