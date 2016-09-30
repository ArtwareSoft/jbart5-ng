jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.component('customStyle', {
	typePattern: /.*-style/,
	params: [
		{ id: 'template', as: 'string', essential: true},
		{ id: 'css', as: 'string'},
    	{ id: 'features', type: 'feature[]', dynamic: true },
		{ id: 'methods', as: 'object'},
		{ id: 'atts', as: 'object'},
		{ id: 'directives', ignore: true }
	],
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
		jb.extend(options,defaultOptions);

		return options;
	}
})

jb.component('custom-control', {
	type: 'control',
	params: [
		{ id: 'title', as: 'string', dynamic: true },
		{ id: 'html', as: 'string', essential: true, defaultValue: '<div></div>'},
		{ id: 'css', as: 'string'},
		{ id: 'options', as: 'object'},
    	{ id: 'features', type: 'feature[]', dynamic: true },
		{ id: 'directives', ignore: true },
	],
	impl: (ctx,title,html,css,options,features) => {
		var defaultOptions = {directives: jb.entries(jbart.ng.directives)
			.map(x=>x[0])
		};
		return jb_ui.Comp(jb.extend({ 
			jbTemplate: `<div jb-ctx="${ctx.id}">${html}</div>`, //jb_ui.parseHTML(`<div>${html || ''}</div>`).innerHTML, 
			css: css, 
			featuresOptions: features(),
			directives: ctx.profile.directives,
		},defaultOptions,options),ctx)
	}
})

})