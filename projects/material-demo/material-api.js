jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('material-demo.api-of-elem', {
	type: 'data',
	params: [
		{ id: 'elem', defaultValue: '%$ngElem%', as: 'single' },
		{ id: 'readmes', defaultValue: '%$readmes%' },
	],
	impl: (ctx,elem,selectors,readmes) => {
		var toSearch = Array.from(elem.getAttributes())
			.map(att=>
				att.name)
			.push(elem.tagName)
		// var ele
		// var feature = jb.entries(selectors)
		// 	.filter(selector=>
		// 		elem.matches && elem.matches(selector[0])
		// 	).map(x=>x[1])
		// 	[0];
	 	var readme = readmes.filter(readme=>
	 		toSearch.filter(pattern=>pattern.indexOf(readme.id) != -1)[0])
	 	return readme[0] && readme[0].content;
	 }

})

})