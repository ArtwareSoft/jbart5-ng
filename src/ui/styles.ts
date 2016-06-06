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
		noViewEncapsulation: { as: 'boolean', type: 'boolean'}
	},
	impl: function (context,template,css,features,methods,atts,noViewEncapsulation) {
		var options = jb.extend({
				jbTemplate: template,
				css: css,
				atts: atts,
				directives: context.profile.directives,
				featuresOptions: features()
			},methods);
		if (noViewEncapsulation)
			jb.extend(options,{encapsulation: ViewEncapsulation.None})

		return options;
	}
})

// jb.component('customCssStyle', {
// 	typePattern: /.*-style/,
// 	params: {
// 		basedOn: {},
// 		css: { as: 'string'},
// 	},
// 	impl: function (context,basedOn,css) {
// 		return jb.extend({},basedOn, { css: css })
// 	}
// })

jb.component('custom-control', {
	type: 'control',
	params: {
		title: { as: 'string', dynamic: true },
		html: { as: 'string', essential: true, defaultValue: '<div></div>'},
		css: { as: 'string'},
		methods: { as: 'object'},
	},
	impl: (ctx,html,css) => 
		jb_ui.Comp({ template: html, css: css, methods: methods },ctx)
})
