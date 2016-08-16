import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {ViewEncapsulation} from '@angular/core';

jb.component('customStyle', {
	typePattern: /.*-style/,
	params: {
		template: { as: 'string', essential: true},
		css: { as: 'string'},
    	features: { type: 'feature[]', dynamic: true },
		methods: { as: 'object'},
		atts: { as: 'object'},
		noViewEncapsulation: { as: 'boolean', type: 'boolean'},
		directives: { ignore: true }
	},
	impl: function (context,template,css,features,methods,atts,noViewEncapsulation) {
		var defaultOptions = {directives: jb.entries(jbart.ng.directives)
			.map(x=>x[0])
		};
		var options = jb.extend({
				jbTemplate: template,
				css: css,
				atts: atts,
				directives: context.profile.directives,
				featuresOptions: features()
			},methods);
		if (noViewEncapsulation)
			jb.extend(options,{encapsulation: ViewEncapsulation.None})
		jb.extend(options,defaultOptions);

		return options;
	}
})

jb.component('custom-control', {
	type: 'control',
	params: {
		title: { as: 'string', dynamic: true },
		html: { as: 'string', essential: true, defaultValue: '<div></div>'},
		css: { as: 'string'},
		options: { as: 'object'},
    	features: { type: 'feature[]', dynamic: true },
		directives: { ignore: true },
	},
	impl: (ctx,title,html,css,options,features) => {
		var defaultOptions = {directives: jb.entries(jbart.ng.directives)
			.map(x=>x[0])
		};
		return jb_ui.Comp(jb.extend({ 
			jbTemplate: `<div jb-path="${ctx.path}">${html}</div>`, //jb_ui.parseHTML(`<div>${html || ''}</div>`).innerHTML, 
			css: css, 
			featuresOptions: features(),
			directives: ctx.profile.directives,
		},defaultOptions,options),ctx)
	}
})
