jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.resource('material-demo','demos-enrichment',{
	button: {
		selectors: '[md-button],[md-raised-button],[md-mini-fab],[md-icon-button],[md-fab]',
	},
})


jb.component('material-demo.api-of-elem', {
	type: 'data',
	params: [
		{ id: 'elem', defaultValue: '%$ngElem%', as: 'single' },
		{ id: 'selectors', defaultValue: '%$feature-selectors%', as: 'single' },
		{ id: 'readmes', defaultValue: '%$readmes%' },
	],
	impl: (ctx,elem,selectors,readmes) => {
		var feature = jb.entries(selectors)
			.filter(selector=>
				elem.matches && elem.matches(selector[0])
			).map(x=>x[1])
			[0];
	 	var readme = readmes.filter(readme=>
					readme.id == feature)[0]
	 	return readme && readme.content;
	 }

})

})