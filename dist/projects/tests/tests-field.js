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
            jb_core_1.jb.component('ui-tests.label', {
                type: 'control',
                impl: { $: 'label', title: 'Hello World2' },
                test: { $: 'ng-ui-test',
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                }
            });
        }
    }
});
