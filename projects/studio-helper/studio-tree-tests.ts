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
      style :{$: 'label.span' }
    }
  ], 
}

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

