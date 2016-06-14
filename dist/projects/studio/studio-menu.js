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
            jb_core_1.jb.component('studio.main-menu', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'layout.horizontal', spacing: 3 },
                    controls: [
                        { $: 'pulldown.topMenuItem',
                            title: 'File',
                            controls: [
                                { $: 'pulldown.menu-item',
                                    title: 'Open ...',
                                    action: { $: 'studio.openWidget' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Save',
                                    icon: 'save',
                                    action: { $: 'studio.saveComponents' },
                                    shortcut: 'Ctrl+S'
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Force Save',
                                    icon: 'save',
                                    action: { $: 'studio.saveComponents', force: true }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Source ...',
                                    action: { $: 'studio.openSourceDialog' }
                                }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'View',
                            controls: [
                                { $: 'pulldown.menu-item',
                                    title: 'Refresh',
                                    spritePosition: '10,0',
                                    action: { $: 'studio.refreshPreview' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Edit source',
                                    spritePosition: '3,0',
                                    action: { $: 'studio.editSource' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Outline',
                                    spritePosition: '5,0',
                                    action: { $: 'studio.open-control-tree' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'jbEditor',
                                    spritePosition: '6,0',
                                    action: { $: 'studio.openjbEditor' }
                                }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'Insert',
                            controls: [
                                { $: 'pulldown.menu-item',
                                    title: 'Field',
                                    action: { $: 'studio.refreshPreview' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Control',
                                    action: { $: 'studio.editSource' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Group',
                                    action: { $: 'studio.open-control-tree' }
                                }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'Data',
                            controls: [
                                { $: 'dynamic-controls',
                                    controlItems: function (ctx) { return Object.getOwnPropertyNames(ctx.resources); },
                                    genericControl: { $: 'pulldown.menu-item',
                                        title: '%$controlItem%',
                                        action: { $: 'studio.showDataResource', resource: '%$controlItem%' }
                                    }
                                },
                                { $: 'pulldown.menu-item-separator' },
                                { $: 'pulldown.menu-item',
                                    title: 'Add Data Resource...',
                                    action: { $: 'studio.addDataResource' }
                                }
                            ]
                        }
                    ]
                }
            });
        }
    }
});
