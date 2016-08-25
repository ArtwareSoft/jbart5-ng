System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('suggestions-test.simple-vars', {
                type: 'test',
                impl: { $: 'suggestions-test',
                    expression: '%',
                    expectedResult: { $: 'contains', text: '$people' }
                },
            });
            jb_core_1.jb.component('suggestions-test.vars-filter', {
                type: 'test',
                impl: { $: 'suggestions-test',
                    expression: '%$p',
                    expectedResult: { $and: [{ $: 'contains', text: '$people' }, { $not: { $contains: '$win' } }] }
                },
            });
            jb_core_1.jb.component('suggestions-test.inside-array', {
                type: 'test',
                impl: { $: 'suggestions-test',
                    expression: '%$people-array/',
                    expectedResult: { $and: [{ $: 'contains', text: 'people' }, { $not: { $contains: '$people' } }] }
                },
            });
        }
    }
});
