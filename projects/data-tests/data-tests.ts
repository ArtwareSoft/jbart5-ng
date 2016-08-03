import {jb} from 'jb-core';

jb.component('data-tests.join', {
	type: 'test',
	 impl :{$: 'data-test', 
		calculate: [ {$list: [1,2]}, {$: 'join'} ],
		expectedResult :{$: 'contains', text: '1,2' }
	},
})

jb.component('data-tests.conditional-text', {
	type: 'test',
impl: {$: 'data-test', 
  calculate :{$: 'pipeline', 
    $vars: { full: 'full', empty: '' }, 
    items: ['{?%$full% is full?} {?%$empty% is empty?}']
  }, 
  expectedResult :{$: 'and', 
    items: [
      {$: 'contains', text: 'full' }, 
      {$: 'not', 
        of :{$: 'contains', text: 'is empty' }
      }
    ]
  }
}
})
