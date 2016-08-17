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
            jb_core_1.jb.component('path-test-single-control', {
                type: 'test',
                impl: { $: 'jb-path-test',
                    $vars: { tst: 10 },
                    controlWithMark: { $: 'group',
                        controls: { $: 'label', title: 'hello', $mark: true }
                    },
                    expectedStaticPath: 'controls',
                    expectedDynamicCounter: 1,
                    probeCheck: '%$tst% == 10'
                }
            });
        }
    }
});
