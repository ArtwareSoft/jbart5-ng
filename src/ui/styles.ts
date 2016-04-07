import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('customStyle', {
	typePattern: /.*-style/,
	params: {
		template: { as: 'string', essential: true},
		isInnerTemplate: { type: 'boolean', as: 'boolean'},
		css: { as: 'string'},
		atts: { as: 'object'},
		methods: { as: 'object'},
        features: { ignore: true },
	},
	impl: function (context,template,isInner,css,atts,methods) {
		var options = jb.extend(
			jb.obj(isInner ? 'template' : 'jbTemplate',template), {
				styles: css.split(/}$/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'),
				atts: atts,
			},methods)
		if (context.profile.features)
			jb.extend(options,{features: jb.toarray(context.profile.features)})
		return options;
	}
})

jb.component('customCssStyle', {
	typePattern: /.*-style/,
	params: {
		basedOn: {},
		css: { as: 'string'},
	},
	impl: function (context,basedOn,css) {
		return jb.extend({},basedOn, {
				styles: css.split(/}$/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'),
		})
	}
})
