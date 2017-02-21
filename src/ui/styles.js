jb.component('customStyle', {
	typePattern: /.*-style/,
	params: [
		{ id: 'template', as: 'string', essential: true},
		{ id: 'css', as: 'string'},
    	{ id: 'features', type: 'feature[]', dynamic: true },
		{ id: 'methods', as: 'object'},
		{ id: 'atts', as: 'object'},
		{ id: 'imports', ignore: true },
//		{ id: 'noTemplateParsing', as: 'boolean', defaultValue: true},
	],
	impl: function (context,template,css,features,methods,atts) {
//		var defaultOptions = {directives: [], // jb.entries(jbart.ng.directives).map(x=>x[0]};
		var options = jb.extend({
				template: template,
				css: css,
				atts: atts,
				imports: context.profile.imports,
				featuresOptions: features(),
			},methods);
//		options[context.params.noTemplateParsing ? 'template' : 'jbTemplate'] = template;
		return options;
	}
})

jb.component('style-by-control', {
	typePattern: /.*-style/,
	params: [
		{ id: 'control', type: 'control', essential: true, dynamic: true },
		{ id: 'modelVar', as: 'string', essential: true }
	],
	impl: (ctx,control,modelVar) =>
		control(ctx.setVars( jb.obj(modelVar,ctx.vars.$model)))
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
			template: `<div jb-ctx="${ctx.id}">${html}</div>`, //jb_ui.parseHTML(`<div>${html || ''}</div>`).innerHTML, 
			css: css, 
			featuresOptions: features(),
			imports: ctx.profile.imports,
			providers: ctx.profile.providers,
		},options),ctx)
	}
})
