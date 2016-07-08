import {jb} from 'jb-core';
import * as suggestions from 'studio/studio-suggestions';

jb.component('simple-vars', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestionObj({ value: '%', selectionStart: 1 }).extendWithSuggestions(ctx);
			return JSON.stringify(obj.suggestions);
		},
		expectedResult :{$: 'contains', text: '$win' }
	},
})

jb.component('vars-filter', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestionObj({ value: '%$p', selectionStart: 3 }).extendWithSuggestions(ctx);
			return JSON.stringify(obj.suggestions);
		},
		expectedResult :{ $and: [{$: 'contains', text: '$people' }, { $not: { $contains: '$win'}}]}
	},
})

jb.component('inside-array', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestionObj({ value: '%$people/', selectionStart: 9 }).extendWithSuggestions(ctx);
			return JSON.stringify(obj.suggestions);
		},
		expectedResult :{ $and: [{$: 'contains', text: 'people' }, { $not: { $contains: '$people'}}]}
	},
})


