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
            jb_core_1.jb.component('studio.data-resources', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'itemlist',
                            items: '%$samples%',
                            controls: [
                                { $: 'button',
                                    title: '%%',
                                    style: { $: 'button.md-flat' }
                                }
                            ],
                            style: { $: 'itemlist.ul-li' },
                            watchItems: true,
                            itemVariable: 'item'
                        },
                        { $: 'button',
                            title: 'add resource',
                            style: { $: 'button.mdl-icon', icon: 'add', size: 20 }
                        },
                        { $: 'group',
                            style: { $: 'group.section' },
                            controls: [
                                { $: 'itemlist',
                                    items: { $: 'list', items: ['1', '2', '3'] },
                                    style: { $: 'itemlist.ul-li' },
                                    watchItems: true,
                                    itemVariable: 'item'
                                }
                            ],
                            features: { $: 'var', name: 'selected_in_itemlist' }
                        }
                    ],
                    features: { $: 'group.wait',
                        for: { $: 'level-up.entries',
                            db: { $: 'level-up.file-db', rootDirectory: '/projects/data-tests/samples' }
                        },
                        resource: 'samples',
                        mapToResource: '%%'
                    }
                }
            });
            jb_core_1.jb.component('studio.open-resource', {
                type: 'action',
                params: [
                    { id: 'resource', type: 'data' },
                    { id: 'id', as: 'string' }
                ],
                impl: { $: 'openDialog',
                    title: '%$id%',
                    style: { $: 'dialog.studio-floating', id: 'resource %$id%', width: 500 },
                    content: { $: 'tree',
                        nodeModel: { $: 'tree.json-read-only',
                            object: '%$resource%', rootPath: '%$id%'
                        },
                        features: [
                            { $: 'css.class', class: 'jb-control-tree' },
                            { $: 'tree.selection' },
                            { $: 'tree.keyboard-selection' }
                        ]
                    },
                }
            });
            jb_core_1.jb.component('studio.data-resource-menu', {
                type: 'menu.option',
                impl: { $: 'menu.menu', title: 'Data',
                    options: [
                        { $: 'dynamic-controls',
                            controlItems: function (ctx) {
                                var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources']);
                                return Object.getOwnPropertyNames(res)
                                    .filter(function (x) { return x != 'window'; });
                            },
                            genericControl: { $: 'menu.action',
                                title: '%$controlItem%',
                                action: { $: 'studio.open-resource',
                                    id: '%$controlItem%',
                                    resource: function (ctx) {
                                        return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources', ctx.exp('%$controlItem%')]);
                                    },
                                }
                            }
                        }
                    ]
                }
            });
        }
    }
});
