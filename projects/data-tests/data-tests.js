jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('data-test.join', {
	 impl :{$: 'data-test', 
		calculate: {$pipeline: [ {$list: [1,2]}, {$: 'join'} ]},
		expectedResult :{$: 'contains', text: '1,2' }
	},
})

jb.component('data-test.conditional-text', {
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

jb.component('data-test.null-param-pt', {
  params: [
    {id: 'tst1', as: 'string'}
  ],
  impl: (ctx,tst1) => 
    tst1
})


jb.component('data-test.empty-param-as-string', {
    impl: {$: 'data-test', 
      calculate :{$: 'data-test.null-param-pt' },
      expectedResult: ctx =>
        ctx.data == '' && ctx.data != null
    }
})


})