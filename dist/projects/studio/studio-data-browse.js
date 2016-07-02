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
            jb_core_1.jb.component('studio.open-resource', {
                type: 'action',
                params: {
                    resource: { type: 'data' },
                    id: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    title: '%$id%',
                    style: { $: 'dialog.studio-floating', id: 'resource %$id%', width: 500 },
                    content: { $: 'tree', cssClass: 'jb-control-tree',
                        nodeModel: { $: 'tree.json-read-only',
                            object: '%$resource%', rootPath: '%$id%'
                        },
                        features: [
                            { $: 'tree.selection' },
                            { $: 'tree.keyboard-selection' }
                        ]
                    },
                }
            });
        }
    }
});
