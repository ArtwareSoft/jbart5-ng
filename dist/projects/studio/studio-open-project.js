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
            jb_core_1.jb.component('studio.open-project', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: 'Outline',
                    style: { $: 'dialog.studio-floating', id: 'studio outline', width: 300 },
                    content: { $: 'studio.choose-project' },
                }
            });
            jb_core_1.jb.component('studio.choose-project', {
                type: 'control',
                impl: { $: 'itemlist',
                    items: { $: 'studio.projects' },
                    controls: { $: 'group',
                        controls: [
                            { $: 'label', title: '%project%' },
                            { $: 'button', title: 'open',
                                action: [
                                    { $: 'closeContainingPopup' },
                                    { $: 'writeValue', value: '%proejct%', to: '%$globals/proejct%' },
                                ]
                            }
                        ]
                    },
                    itemVariable: 'project',
                }
            });
        }
    }
});
