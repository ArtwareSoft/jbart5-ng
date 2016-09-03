import {jb} from 'jb-core';

jb.component('studio-tree-test.cmp1', {
  impl :{$: 'list', items: ['a.1', 'b.2'] }, 
})

jb.component('studio-tree-test.cmp2', {
  impl: {$: 'itemlist-with-groups', 
  title: 'itemlist', 
  items :{$: 'list', items: ['a.1', 'b.2'] }, 
  controls: [
    {$: 'label', 
      title: '%%', 
      style :{$: 'label.span' },
    }
  ], 
}})

jb.component('studio-tree-test.actions-sugar-example1', {
  impl: {$: 'button', title : 'hello', action: [ {$: 'goto-url', url: 'google' }] } 
})

jb.component('studio-tree-test.actions-sugar-example2', {
  impl: {$: 'button', title : 'hello', action: {$runActions: [ {$: 'goto-url', url: 'google' }] }} 
})



jb.component('studio-tree-test.extra-elem-in-list', {
	impl :{$: 'studio-tree-children-test',
		path: 'studio-tree-test.cmp1~items', 
		childrenType: 'jb-editor',
		expectedResult :{ $and: [{$: 'contains', text: 'items[2]' }, { $not: { $contains: 'undefined'}}]}
	}
})

jb.component('studio-tree-test.extra-elem-in-list-bug', {
	impl :{$: 'studio-tree-children-test',
		path: 'studio-tree-test.cmp2~items~items', 
		childrenType: 'jb-editor',
		expectedResult :{ $and: [{$: 'contains', text: 'items[2]' }, { $not: { $contains: 'undefined'}}]}
	}
})

jb.component('studio-tree-test.actions-sugar1', {
	impl :{$: 'studio-tree-children-test',
		path: 'studio-tree-test.actions-sugar-example1~action', 
		childrenType: 'jb-editor',
		expectedResult :{ $and: [{$: 'contains', text: ['action[0]','action[1]'] }, { $not: { $contains: 'actions'}}]}
	}
})

jb.component('studio-tree-test.actions-sugar2a', {
	impl :{$: 'studio-tree-children-test',
		path: 'studio-tree-test.actions-sugar-example2~action', 
		childrenType: 'jb-editor',
		expectedResult :{ $contains: '$runActions'}
	}
})

jb.component('studio-tree-test.actions-sugar2b', {
	impl :{$: 'studio-tree-children-test',
		path: 'studio-tree-test.actions-sugar-example2~action~$runActions', 
		childrenType: 'jb-editor',
		expectedResult :{ $and: [{$: 'contains', text: ['runActions[0]','runActions[1]'] }, { $not: { $contains: 'actions'}}]}
	}
})
