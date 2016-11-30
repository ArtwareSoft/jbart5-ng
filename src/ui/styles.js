jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.component('customStyle', {
	typePattern: /.*-style/,
	params: [
		{ id: 'template', as: 'string', essential: true},
		{ id: 'css', as: 'string'},
    	{ id: 'features', type: 'feature[]', dynamic: true },
		{ id: 'methods', as: 'object'},
		{ id: 'atts', as: 'object'},
		{ id: 'imports', ignore: true }
	],
	impl: function (context,template,css,features,methods,atts) {
//		var defaultOptions = {directives: [], // jb.entries(jbart.ng.directives).map(x=>x[0]};
		var options = jb.extend({
				jbTemplate: template,
				css: css,
				atts: atts,
				imports: context.profile.imports,
				featuresOptions: features()
			},methods);
//		jb.extend(options,defaultOptions);

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
		{ id: 'imports', ignore: true },
		{ id: 'providers', ignore: true },
	],
	impl: (ctx,title,html,css,options,features) => {
		jbart.ctxDictionary[ctx.id] = ctx;
		return jb_ui.Comp(jb.extend({ 
			jbTemplate: `<div jb-ctx="${ctx.id}">${html}</div>`, //jb_ui.parseHTML(`<div>${html || ''}</div>`).innerHTML, 
			css: css, 
			featuresOptions: features(),
			imports: ctx.profile.imports,
			providers: ctx.profile.providers,
		},options),ctx)
	}
})

})