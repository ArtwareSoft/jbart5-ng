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
            jb_core_1.jb.component('hello-world.test2', {
                type: 'control',
                impl: { $: 'label', title: 'hello test2' }
            });
            jb_core_1.jb.component('hello-world.main', {
                type: 'control',
                impl: { $: 'label', title: '$log:hello main' }
            });
            jb_core_1.jb.component('hello-world.main1', {
                type: 'control',
                impl: { $: 'group',
                    title: 'main',
                    style: { $: 'layout.vertical', spacing: 30 },
                    controls: [
                        { $: 'group', title: '2.0', controls: [
                                { $: 'label', title: '2.1' },
                                { $: 'button', title: '2.2' },
                            ]
                        },
                        { $: 'label', title: '$log:1.0' },
                    ] }
            });
        }
    }
});
