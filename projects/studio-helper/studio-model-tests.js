
jb.component('studio-data-test.categories-of-type', {
	 impl :{$: 'data-test', 
		calculate: {$pipeline: [ 
				{$: 'studio.categories-of-type', type: 'control'}, 
				'%name%', 
				{$: 'join'} 
			]},
		expectedResult :{$: 'contains', text: ['control'] }
	},
})

