import {jb} from 'jb-core';
import * as suggestions from 'studio/studio-suggestions';

jb.component('simple-vars', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestionObj({ value: '%', selectionStart: 1 }).extendWithSuggestions(ctx);
			return JSON.stringify(obj.suggestions);
		},
		expectedResult :{$: 'contains', text: '$people' }
	},
})

