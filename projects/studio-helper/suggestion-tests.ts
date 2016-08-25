import {jb} from 'jb-core';

jb.component('suggestions-test.simple-vars', {
	type: 'test',
	 impl :{$: 'suggestions-test', 
	 	expression: '%',
		expectedResult :{$: 'contains', text: '$people' }
	},
})

jb.component('suggestions-test.vars-filter', {
	type: 'test',
	 impl :{$: 'suggestions-test', 
	 	expression: '%$p',
		expectedResult :{ $and: [{$: 'contains', text: '$people' }, { $not: { $contains: '$win'}}]}
	},
})

jb.component('suggestions-test.inside-array', {
	type: 'test',
	 impl :{$: 'suggestions-test', 
	 	expression: '%$people-array/',
		expectedResult :{ $and: [{$: 'contains', text: 'people' }, { $not: { $contains: '$people'}}]}
	},
})

