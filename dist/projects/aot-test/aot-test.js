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
            jb_core_1.jb.component('aot-test.main', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'label', title: 'aot title' },
                        { $: 'label',
                            title: 'aot test',
                            style: { $: 'label.aot-test' } // "label.aot-test"
                        }
                    ]
                }
            });
            jb_core_1.jb.component('label.aot-test', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<span>{{title}}</span>',
                    features: { $: 'label.bind-title' }
                }
            });
        }
    }
});
