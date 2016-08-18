import {jb} from 'jb-core';

function reverseOrderDelayedPromises(ctx) {
  return jb_delay((3-ctx.data)*700).then(()=>ctx.data+1);
}
function tap(label) { return ctx => { console.log('tap: ' +label||'',ctx.data); return ctx.data } }

jb.component('rx-tests.rx-simple', {
  type: 'test',
  impl :{$: 'rx-test',  
  result: [
    {$list: [1,2,3]},
  ],
  expectedResult: { $containsSeq: [1,2,3] }
},
})

jb.component('rx-tests.rx-with-vars', {
  type: 'test',
  impl :{$: 'rx-test',  
  result: [
    {$list: [1,2], $var: 'num'},
    ctx => ctx.data + 1,
    'now we have %%, but %$num% is not lost'
  ],
  expectedResult: { $containsSeq: ['now we have 2, but 1 is not lost'] }
},
})

// the default behavior is to run one-by-one
jb.component('rx-tests.one-by-one',{
  type: 'test',
  impl :{$: 'rx-test',  
  result: [
    {$list: [1,2,3]},
    ctx=> reverseOrderDelayedPromises(ctx),
  ],
  expectedResult: { $containsSeq: [2,3,4] }
},
})

// if we do not want to wait, we can run in parallel
jb.component('rx-tests.rx-parallel',{
  type: 'test',
  impl :{$: 'rx-test',  
  result: [
    {$list: [1,2,3]},
    {$rxParallel: ctx=> reverseOrderDelayedPromises(ctx)} ,
  ],
  expectedResult: { $containsSeq: [4,3,2] }
},
})

// we can run in parallel yet ask to get the results in the original order
jb.component('rx-tests.rx-parallel-keep-order',{
  type: 'test',
  impl :{$: 'rx-test',  
  result: [
    {$list: [1,2,3]},
    {$rxParallelKeepOrder: ctx=> reverseOrderDelayedPromises(ctx) } ,
  ],
  expectedResult: { $containsSeq: [2,3,4] }
},
})
