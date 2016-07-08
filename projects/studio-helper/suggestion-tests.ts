import {jb} from 'jb-core';
import * as suggestions from 'studio/studio-suggestions';


jb_tests('studio-suggestions', {
	'simple-vars' :{$: 'data-test', 
		calculate: ctx => {
			var obj = new suggestions.suggestionsObj({ value: '%', selectionStart: 1 }).extendWithSuggestions(ctx);
			return JSON.serialize(obj.suggestions);
		},
		expectedResult :{$: 'contains', text: '$people' }
	},

})

