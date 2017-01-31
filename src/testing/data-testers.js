jb_component('data-test', {
	type: 'test',
	params: [
		{ id: 'calculate', dynamic: true },
		{ id: 'runBefore', type: 'action', dynamic: true },
		{ id: 'expectedResult', type: 'boolean', dynamic: true },
		{ id: 'cleanUp', type: 'action', dynamic: true },
	],
	impl: function(context,calculate,runBefore,expectedResult,cleanUp) {
		return Promise.resolve(runBefore())
			.then(_ => 
				calculate())
			.then(v=>
				Array.isArray(v) ? jb_synchArray(v) : v)
			.then(value=>
				!! expectedResult(jb_ctx(context,{ data: value })))
			.then(result =>
					Promise.resolve(cleanUp()).then(_=>result) )
			.then(result =>
					({ id: context.vars.testID, success: result }))
	}
})
