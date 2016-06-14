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
            jb_core_1.jb.component('studio.open-style-editor', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    title: 'Style Editor',
                    style: { $: 'dialog.studio-floating', id: 'style editor' },
                    content: { $: 'studio.style-editor', path: '%$path%' },
                    menu: { $: 'button',
                        title: 'style menu',
                        style: { $: 'button.md-icon', icon: 'menu' },
                        action: { $: 'studio.open-style-menu', path: '%$path%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.open-style-menu', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'pulldownPopup.contextMenuPopup' },
                    content: { $: 'group',
                        controls: [
                            { $: 'pulldown.menu-item',
                                title: 'Customize style',
                                icon: 'build',
                                action: { $: 'studio.makeLocal', path: '%$path%' },
                                features: { $: 'hidden',
                                    showCondition: { $and: [
                                            { $: 'endsWith', endsWith: '~style', text: '%$path%' },
                                            { $: 'notEquals',
                                                item1: { $: 'studio.compName', path: '%$path%' },
                                                item2: 'customStyle'
                                            }
                                        ] }
                                }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Save style for reuse',
                                icon: 'build',
                                action: { $: 'studio.open-save-style', path: '%$path%' },
                                features: { $: 'hidden',
                                    showCondition: { $: 'equals',
                                        item1: { $: 'studio.compName', path: '%$path%' },
                                        item2: 'customStyle'
                                    }
                                }
                            },
                        ]
                    }
                }
            });
            jb_core_1.jb.component('studio.style-editor', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    $vars: {
                        source: { $: 'studio.val', path: '%$path%' }
                    },
                    style: { $: 'property-sheet.titles-above' },
                    controls: [
                        { $: 'editable-text',
                            title: 'css',
                            databind: '%$source/css%',
                            style: { $: 'editable-text.codemirror', mode: 'css', height: 300 },
                        },
                        { $: 'editable-text',
                            title: 'template',
                            databind: '%$source/template%',
                            style: { $: 'editable-text.codemirror', mode: 'html', height: 100 },
                        },
                    ]
                }
            });
        }
    }
});
