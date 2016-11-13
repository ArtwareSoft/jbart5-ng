import { jb } from 'jb-core/jb';

jb.component('ng2-ui-test', {
	type: 'test',
	params: [
		{ id: 'control', type: 'control', dynamic: true },
		{ id: 'expectedTemplateResult', type: 'boolean', dynamic: true, as: 'boolean' },
		{ id: 'expectedHtmlResult', type: 'boolean', dynamic: true, as: 'boolean' },
		{ id: 'runBefore', type: 'action', dynamic: true },
		{ id: 'cleanAfter', type: 'action', dynamic: true },
		{ id: 'waitFor',},
	],
	impl: ctx=>
		new Promise((resolve,reject)=> {
			console.log('starting test ' + ctx.vars.testID, ctx);
			ctx.run({$:'openDialog', content: ctx.profile.control, 
			features: ctx2 => ({
					observable: (observable,cmp) =>
						observable.filter(e=>
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

jb.component('data-test', {
	type: 'test',
	params: [
		{ id: 'calculate', dynamic: true },
		{ id: 'runBefore', type: 'action', dynamic: true },
		{ id: 'resultVariable', as: 'string', defaultValue:'result' },
		{ id: 'action', type: 'action', dynamic: true },
		{ id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
	],
	impl: function(context,calculate,runBefore,resultVariable,action,expectedResult) {
		runBefore();
		return Promise.resolve(calculate()).then(value=>{
			if (result(value))
				return ({ id: context.vars.testID, success: true })
			else
				return ({ id: context.vars.testID, success: false })
		})

		function result(value) {
			if (context.vars.$testContext) 
				context.vars.$testContext.result = value;
			action(jb_ctx(context, { data: value, vars: jb_obj(resultVariable,value) }));
			return expectedResult(jb_ctx(context,{ data: value, vars: jb_obj(resultVariable,value) }));
		}
	}
})
