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
                                    title: 'New Project',
                                    icon: 'new',
                                    shortcut: '',
                                    action: { $: 'studio.saveComponents' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Open Project ...',
                                    action: { $: 'studio.open-project' }
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
                                    action: { $: 'studio.open-source-dialog' }
                                }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'View',
                            controls: [
                                { $: 'pulldown.menu-item',
                                    title: 'Refresh Preview',
                                    spritePosition: '10,0',
                                    action: { $: 'studio.refreshPreview' }
                                },
                                { $: 'pulldown.menu-item',
                                    title: 'Redraw Studio',
                                    spritePosition: '10,0',
                                    action: { $: 'studio.redrawStudio' }
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
                                { $: 'pulldown.menu-item', title: 'Field' },
                                { $: 'pulldown.menu-item', title: 'Control' },
                                { $: 'pulldown.menu-item', title: 'Group' }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'Data',
                            controls: [
                                { $: 'dynamic-controls',
                                    controlItems: function (ctx) {
                                        var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources']);
                                        return Object.getOwnPropertyNames(res)
                                            .filter(function (x) { return x != 'window'; });
                                    },
                                    genericControl: { $: 'pulldown.menu-item',
                                        action: { $: 'studio.open-resource',
                                            resource: function (ctx) {
                                                return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources', ctx.exp('%$controlItem%')]);
                                            },
                                            id: '%$controlItem%'
                                        },
                                        title: '%$controlItem%'
                                    }
                                },
                                { $: 'pulldown.menu-item-separator' },
                                { $: 'pulldown.menu-item',
                                    action: { $: 'studio.addDataResource' },
                                    title: 'Add Data Resource...'
                                }
                            ]
                        },
                        { $: 'pulldown.topMenuItem',
                            title: 'Tests',
                            controls: [
                                { $: 'dynamic-controls',
                                    controlItems: function (ctx) {
                                        var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests']);
                                        return Object.getOwnPropertyNames(res)
                                            .filter(function (x) { return x != 'window'; });
                                    },
                                    genericControl: { $: 'pulldown.menu-item',
                                        action: { $: 'studio.run-test',
                                            resource: function (ctx) {
                                                return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests', ctx.exp('%$controlItem%')]);
                                            },
                                            id: '%$controlItem%'
                                        },
                                        title: '%$controlItem%'
                                    }
                                },
                                { $: 'pulldown.menu-item-separator' },
                                { $: 'pulldown.menu-item',
                                    action: { $: 'studio.add-test' },
                                    title: 'Add Test...'
                                },
                                { $: 'pulldown.menu-item',
                                    action: { $: 'studio.run-all-tests' },
                                    title: 'Run All Tests...'
                                }
                            ]
                        }
                    ]
                }
            });
        }
    }
});
