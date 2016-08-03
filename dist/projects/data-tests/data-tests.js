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
            jb_core_1.jb.component('data-tests.join', {
                type: 'test',
                impl: { $: 'data-test',
                    calculate: [{ $list: [1, 2] }, { $: 'join' }],
                    expectedResult: { $: 'contains', text: '1,2' }
                },
            });
            jb_core_1.jb.component('data-tests.conditional-text', {
                type: 'test',
                impl: { $: 'data-test',
                    calculate: { $: 'pipeline',
                        $vars: { full: 'full', empty: '' },
                        items: ['{?%$full% is full?} {?%$empty% is empty?}']
                    },
                    expectedResult: { $: 'and',
                        items: [
                            { $: 'contains', text: 'full' },
                            { $: 'not',
                                of: { $: 'contains', text: 'is empty' }
                            }
                        ]
                    }
                }
            });
        }
    }
});
