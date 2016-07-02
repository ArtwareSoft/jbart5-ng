System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.jb-editor', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    title: 'main',
                    controls: [
                        { $: 'tree',
                            cssClass: 'jb-control-tree studio-control-tree',
                            nodeModel: { $: 'studio.jb-editor.nodes', path: '%$path%' },
                            features: [
                                { $: 'tree.selection',
                                    autoSelectFirst: true,
                                    databind: '%$globals/jb_editor_selection%'
                                },
                                { $: 'tree.keyboard-selection',
                                    onEnter: { $: 'studio.openProperties' }
                                },
                                { $: 'tree.drag-and-drop' },
                                { $: 'tree.keyboard-shortcut',
                                    key: 'Ctrl-C',
                                    action: { $: 'studio.copy', path: '%%' }
                                },
                                { $: 'tree.keyboard-shortcut',
                                    key: 'Ctrl-V',
                                    action: { $: 'studio.paste', path: '%%' }
                                },
                                { $: 'tree.keyboard-shortcut',
                                    key: 'Ctrl-Z',
                                    action: { $: 'studio.undo', path: '%%' }
                                },
                                { $: 'tree.keyboard-shortcut',
                                    key: 'Ctrl-Y',
                                    action: { $: 'studio.redo', path: '%%' }
                                },
                                { $: 'tree.keyboard-shortcut',
                                    key: 'Delete',
                                    action: { $: 'studio.delete', path: '%%' }
                                },
                                { $: 'studio.control-tree.refreshPathChanges' },
                                { $: 'css.width', width: '500' }
                            ]
                        },
                        { $: 'group',
                            title: 'input-output',
                            features: { $: 'group.data', data: '%$globals/jb_editor_selection' },
                            $vars: {
                                probeResult: { $: 'studio.probe', path: '%%' }
                            },
                            controls: { $: 'itemlog',
                                items: '%$probeResult%',
                                controls: [
                                    { $: 'studio.data-browse',
                                        data: '%input%',
                                        title: 'input'
                                    },
                                    { $: 'studio.data-browse',
                                        data: '%output%',
                                        title: 'output'
                                    }
                                ],
                            }
                        }
                    ],
                    style: { $: 'layout.horizontal', spacing: 3 }
                }
            });
            jb_core_1.jb.component('studio.data-browse', {
                type: 'control',
                params: {
                    data: {},
                    title: { as: 'string' }
                },
                impl: { $: 'group',
                    title: '%$title%',
                    controls: { $: 'tree', cssClass: 'jb-control-tree',
                        nodeModel: { $: 'tree.json-read-only',
                            object: '%$data%', rootPath: '%$title%'
                        },
                        features: [
                            { $: 'tree.selection' },
                            { $: 'tree.keyboard-selection' }
                        ]
                    },
                }
            });
            jb_core_1.jb.component('studio.jb-editor.nodes', {
                type: 'tree.nodeModel',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return new studio.ControlModel(path, 'jb-editor');
                }
            });
        }
    }
});
