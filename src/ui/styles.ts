import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('customStyle', {
	typePattern: /.*-style/,
	params: {
		template: { as: 'string', essential: true},
		css: { as: 'string'},
    	features: { type: 'feature[]', dynamic: true },
		methods: { as: 'object'},
		atts: { as: 'object'},
		directives: { type: 'data[]', ignore: true },
		isInnerTemplate: { type: 'boolean', as: 'boolean'},
	},
	impl: function (context,template,css,features,methods,atts,directives,isInner) {
		var options = jb.extend(
			jb.obj(isInner ? 'template' : 'jbTemplate',template), {
				css: css,
				atts: atts,
				directives: context.profile.directives,
				featuresOptions: features()
			},methods)
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

// jb.component('custom-control', {
// 	type: 'control',
// 	params: {
// 		title: { as: 'string', dynamic: true },
// 		template: { as: 'string', essential: true},
// 		isInnerTemplate: { type: 'boolean', as: 'boolean'},
// 		css: { as: 'string'},
// 		atts: { as: 'object'},
// 		methods: { as: 'object'},
//     	features: { type: 'feature[]', dynamic: true },
// 	},
// 	impl: function (context,title,template,isInner,css,atts,methods,features) {
// 		return jb_ui.Comp({},context).jbExtend(jb.extend(
// 			jb.obj(isInner ? 'template' : 'jbTemplate',template), {
// 				styles: css.split(/}$/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'),
// 				atts: atts,
// 				featuresOptions: features()
// 			},methods))
// 	}
// })
