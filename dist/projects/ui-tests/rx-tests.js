System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    function reverseOrderDelayedPromises(ctx) {
        return jb_delay((3 - ctx.data) * 700).then(function () { return ctx.data + 1; });
    }
    function tap(label) { return function (ctx) { console.log('tap: ' + label || '', ctx.data); return ctx.data; }; }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('rx-test.rx-simple', {
                type: 'test',
                impl: { $: 'rx-test',
                    result: [
                        { $list: [1, 2, 3] },
                    ],
                    expectedResult: { $containsSeq: [1, 2, 3] }
                },
            });
            jb_core_1.jb.component('rx-test.rx-with-vars', {
                type: 'test',
                impl: { $: 'rx-test',
                    result: [
                        { $list: [1, 2], $var: 'num' },
                        function (ctx) { return ctx.data + 1; },
                        'now we have %%, but %$num% is not lost'
                    ],
                    expectedResult: { $containsSeq: ['now we have 2, but 1 is not lost'] }
                },
            });
            // the default behavior is to run one-by-one
            jb_core_1.jb.component('rx-test.one-by-one', {
                type: 'test',
                impl: { $: 'rx-test',
                    result: [
                        { $list: [1, 2, 3] },
                        function (ctx) { return reverseOrderDelayedPromises(ctx); },
                    ],
                    expectedResult: { $containsSeq: [2, 3, 4] }
                },
            });
            // if we do not want to wait, we can run in parallel
            jb_core_1.jb.component('rx-test.rx-parallel', {
                type: 'test',
                impl: { $: 'rx-test',
                    result: [
                        { $list: [1, 2, 3] },
                        { $rxParallel: function (ctx) { return reverseOrderDelayedPromises(ctx); } },
                    ],
                    expectedResult: { $containsSeq: [4, 3, 2] }
                },
            });
            // we can run in parallel yet ask to get the results in the original order
            jb_core_1.jb.component('rx-test.rx-parallel-keep-order', {
                type: 'test',
                impl: { $: 'rx-test',
                    result: [
                        { $list: [1, 2, 3] },
                        { $rxParallelKeepOrder: function (ctx) { return reverseOrderDelayedPromises(ctx); } },
                    ],
                    expectedResult: { $containsSeq: [2, 3, 4] }
                },
            });
        }
    }
});
