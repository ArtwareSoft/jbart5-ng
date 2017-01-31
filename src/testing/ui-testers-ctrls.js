jb_component('ui-tests.show-tests', {
	type: 'control',
	impl :{$: 'group',
		$vars : {
			module: ctx =>
				location.href.split('?module=')[1] || '',			
			tst: {
				counter: 0,
				failures: '',
			},
			tests: {$pipeline: ['%$window.jbart.comps%',
				{ $: 'objectToArray' },
				{ $filter: {$: 'studio.is-of-type', type: 'test', path: '%id%'} },
				{ $filter: {$: 'contains', allText: '%id%', text: '.' } },
				{ $filter: {$or: [{$: 'equals', item1: '%$module%', item2: {$: 'prefix', text: '%id%', separator: '.' } }, {$isEmpty: '%$module%'} ]} },
			]},
			parallel_tests: {$pipeline: [ '%$tests%', 
			    {$filter: false}
//				{$filter: {$: 'notEquals', item1: 'path-test', item2: {$: 'prefix', text: '%id%', separator: '.' } }},
			]},
			serial_tests: {$pipeline:[ '%$tests%', 
//				{$filter: {$: 'equals', item1: 'path-test1', item2: {$: 'prefix', text: '%id%', separator: '.' } }},
			]},

			total: ctx =>
				ctx.exp('%$tests%')
					.reduce((acc,test)=>acc+(test.val.impl.$ == 'jb-path-test1' ? 2: 1),0)

		},
 		controls: [
 			{$: 'label', title: '{?failures: %$tst/failures%?}',
 				style: {$: 'label.h1'},
 				features: {$: 'css', css: '{ color: red; font-weight: bold }'},
 			},
 			{$: 'label', title: '%$tst/counter% of %$total%' },
 			{$: 'itemlog',
 			counter: '%$tst/counter%',
			items: {$: 'rxPipe', items: [
				'%$parallel_tests%',
				// ctx => 
				// 	ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl),
				{ $rxParallelKeepOrder: ctx => 
					ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl) },
				{$: 'rx.concat', 
					items: [ // serial run of path-tests
					'%$serial_tests%',
					ctx => 
						ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl),
					] 
				},
				ctx => {
					if (!ctx.data.success)
						ctx.vars.tst.failures = (ctx.vars.tst.failures || 0)+1;
					return ctx.data;
				}
			]},
			controls :{$: 'ui-tests.show-one-test' } 
		}
	]
	}
})


jb_component('ui-tests.single-test', {
	type: 'control',
	impl :{$: 'group',
 		controls: {$: 'itemlog',
			items: ctx => {
				if (!jbart.comps[jbart.singleTestID]) {
					jb_logErr('Can not find test ' + jbart.singleTestID)
					return [];
				}
				return ctx.setVars({testID:jbart.singleTestID}).run(jbart.comps[jbart.singleTestID].impl)
			},
			controls :{$: 'ui-tests.show-one-test' } 
		}
	}
})

jb_component('ui-tests.run-test-only', {
	type: 'action',
	impl : ctx => {
		var impl = jbart.comps[jbart.singleTestID].impl;
		return impl && ctx.run(impl.control)
	}
})

jb_component('ui-tests.show-one-test', {
	type: 'control',
	params: [
		{ id: 'testResult',as: 'single', defaultValue: '%%'},
	],
	impl :{$: 'group',
		style: {$: 'layout.flex', direction: 'row' },
		controls: 
			[
				{	$: 'button', title: {$firstSucceeding: ['%$testResult/title%','%$testResult/id%']},
					style :{$: 'button.href' },
					features :{$: 'css', css: '{ padding: 0 5px 0 5px; } a { color: blue}'},
					action :{$: 'goto-url', url: '/projects/ui-tests/single-test.html?test=%$testResult/id%' }
				},
				{ $: 'label', title: 'success', 
					features: [
						{$: 'hidden', showCondition: '"%$testResult/success%" == "true"'},
						{$: 'css', css: '{ color: green; font-weight: bold }'}
					]
				},
				{ $: 'label', title: 'failure', 
					features: [
						{$: 'hidden', showCondition: '"%$testResult/success%" != "true"'},
						{$: 'css', css: '{ color: red; font-weight: bold }'}
					]
				},
				{$: 'label', title: '%$testResult/reason%', 
					features :{$: 'css.padding', left: '15' }
				},
				{	$: 'button', title: 'sublime',
					style :{$: 'button.href' },
					action :{$: 'studio.open-sublime-editor', path: '%$testResult/id%' },
					features: [
						{$: 'hidden', showCondition: { $or: ['"%$testResult/success%" != "true"', '%$window.jbart.singleTestID%'] }},
						{$: 'css.padding', left: '15' },
					],
				},
		]
	}
})

jb_component('ui-tests.show-one-test-in-project', {
	type: 'control',
	impl :{$: 'group',
		layout :{$: 'md-layout', layout: 'row',  },
		controls: 
			[
				{	$: 'button', title: { $firstSucceeding: ['%title%','%id%']},
					style :{$: 'button.href' },
					features :{$: 'css', css: '{ padding: 0 5px 0 5px }'},
  					action : [{$: 'writeValue', 
  						value: '%id%', to: '%$window/jbart/studioGlobals/profile_path%'
  						},
  						ctx => {
  							var studioWin = ctx.resources.window.jbart.studioWindow;
  							studioWin && studioWin.jbart.zones['studio.all'].run(()=>{}); // refresh studio win
  						}
  					], 
  					action2 :{$: 'studio.open-jb-editor', 
  						$vars: { circuit: '%id%' }, 
  						path: '%id%',
  					}, 
				},
				{ $: 'label', title: 'success', 
					features: [
						{$: 'hidden', showCondition: '"%success%" == "true"'},
						{$: 'css', css: '{ color: green; font-weight: bold }'}
					]
				},
				{ $: 'label', title: 'failure', 
					features: [
						{$: 'hidden', showCondition: '"%success%" != "true"'},
						{$: 'css', css: '{ color: red; font-weight: bold }'}
					]
				},
				{$: 'label', title: '%reason%', 
					features :{$: 'css.padding', left: '15' }
				},
			]
	}
})


