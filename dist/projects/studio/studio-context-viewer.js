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
            jb_core_1.jb.component('studio.open-context-viewer', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: 'Context Viewer',
                    style: { $: 'dialog.studio-floating', id: 'studio-context-viewer', width: 300 },
                    content: { $: 'studio.context-viewer' },
                }
            });
            jb_core_1.jb.component('studio.context-viewer', {
                type: 'control',
                impl: { $: 'studio.data-browse', data: '%$globals/last_pick_selection%', title: 'context' },
            });
        }
    }
});
