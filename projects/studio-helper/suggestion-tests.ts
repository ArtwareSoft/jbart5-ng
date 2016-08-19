import {jb} from 'jb-core';
import * as suggestions from 'studio/studio-suggestions';

jb.component('suggestions-test.simple-vars', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestions({ value: '%', selectionStart: 1 }).extendWithOptions(ctx);
			return JSON.stringify(JSON.stringify(obj.options.map(x=>x.text)));
		},
		expectedResult :{$: 'contains', text: '$people' }
	},
})

jb.component('suggestions-test.vars-filter', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestions({ value: '%$p', selectionStart: 3 }).extendWithOptions(ctx);
			return JSON.stringify(JSON.stringify(obj.options.map(x=>x.text)));
		},
		expectedResult :{ $and: [{$: 'contains', text: '$people' }, { $not: { $contains: '$win'}}]}
	},
})

jb.component('suggestions-test.inside-array', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestions({ value: '%$people-array/', selectionStart: 15 }).extendWithOptions(ctx);
			return JSON.stringify(JSON.stringify(obj.options.map(x=>x.text)));
		},
		expectedResult :{ $and: [{$: 'contains', text: 'people' }, { $not: { $contains: '$people'}}]}
	},
})

