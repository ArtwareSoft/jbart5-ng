jb_component('ng2-ui-test', {
	type: 'test',
	params: [
		{ id: 'control', type: 'control', dynamic: true },
		{ id: 'expectedHtmlResult', type: 'boolean', dynamic: true, as: 'boolean' },
		{ id: 'runBefore', type: 'action', dynamic: true },
		{ id: 'cleanAfter', type: 'action', dynamic: true },
		{ id: 'waitFor',},
		{ id: 'disableChangeDetection', type: 'boolean', as: 'boolean', defaultValue: true },
	],
	impl: ctx=>
		jb_new_NativePromise(resolve => {
			console.log('starting test ' + ctx.vars.testID, ctx);
			ctx.run({$:'openDialog', content: ctx.profile.control, 
			  features: ctx2 => ({
					disableChangeDetection: ctx.params.disableChangeDetection,
					jbEmitter: true,
					init: cmp =>
						cmp.jbEmitter.filter(e=>
							e == 'ready' || e == 'destroy')
						.catch(e=>{ 
							resolve({ id: ctx.vars.testID, success:false }) })
						.subscribe(x=>{
							Array.from(cmp.elementRef.nativeElement.querySelectorAll('input')).forEach(inp=>
								inp.setAttribute('title2',inp.value || '')
							)
							var html = cmp.elementRef.nativeElement.outerHTML;
							resolve({ 
								id: ctx.vars.testID,
								success: ctx.params.expectedHtmlResult(ctx.setData(html))
							});
							if (!jbart.singleTestID)
								ctx2.run({$:'closeContainingPopup'})
							console.log('finished test ' + ctx.vars.testID, ctx);
						}),
					css: jbart.singleTestID ? '' : '{display: none}'
			 })
		  })
	})
})
