jb.component('studio.main-menu', {
    type: 'menu.option',
    impl: { $: 'menu.options-group',
        options: [
            { $: 'menu.menu', title: 'File',
                options: [
                    { $: 'menu.action',
                        title: 'New Project',
                        icon: 'new',
                        action: { $: 'studio.save-components' }
                    },
                    { $: 'menu.action',
                        title: 'Open Project ...',
                        action: { $: 'studio.open-project' }
                    },
                    { $: 'menu.action',
                        title: 'Save',
                        icon: 'save',
                        shortcut: 'Ctrl+S',
                        action: { $: 'studio.save-components' }
                    },
                    { $: 'menu.action',
                        title: 'Force Save',
                        icon: 'save',
                        action: { $: 'studio.save-components', force: true }
                    },
                    { $: 'menu.action',
                        title: 'Source ...',
                        action: { $: 'studio.open-source-dialog' }
                    }
                ]
            },
            { $: 'menu.menu', title: 'View',
                options: [
                    { $: 'menu.action',
                        title: 'Refresh Preview',
                        action: { $: 'studio.refresh-preview' }
                    },
                    { $: 'menu.action',
                        title: 'Redraw Studio',
                        action: { $: 'studio.redraw-studio' }
                    },
                    { $: 'menu.action',
                        title: 'Edit source',
                        action: { $: 'studio.editSource' }
                    },
                    { $: 'menu.action',
                        title: 'Outline',
                        action: { $: 'studio.open-control-tree' }
                    },
                    { $: 'menu.action',
                        title: 'jbEditor',
                        action: { $: 'studio.openjbEditor' }
                    }
                ]
            },
            { $: 'studio.insert-control-menu' },
            { $: 'studio.data-resource-menu' },
        ]
    }
});
jb.component('studio.main-menu-old', {
    type: 'control',
    impl: { $: 'group',
        style: { $: 'layout.horizontal', spacing: 3 },
        controls: [
            { $: 'pulldown.top-menu-item',
                title: 'File',
                controls: [
                    { $: 'pulldown.menu-item',
                        title: 'New Project',
                        icon: 'new',
                        shortcut: '',
                        action: { $: 'studio.save-components' }
                    },
                    { $: 'pulldown.menu-item',
                        title: 'Open Project ...',
                        action: { $: 'studio.open-project' }
                    },
                    { $: 'pulldown.menu-item',
                        title: 'Save',
                        icon: 'save',
                        shortcut: 'Ctrl+S',
                        action: { $: 'studio.save-components' }
                    },
                    { $: 'pulldown.menu-item',
                        title: 'Force Save',
                        icon: 'save',
                        action: { $: 'studio.save-components', force: true }
                    },
                    { $: 'pulldown.menu-item',
                        title: 'Source ...',
                        action: { $: 'studio.open-source-dialog' }
                    }
                ]
            },
            { $: 'pulldown.top-menu-item',
                title: 'View',
                controls: [
                    { $: 'pulldown.menu-item',
                        spritePosition: '10,0',
                        title: 'Refresh Preview',
                        action: { $: 'studio.refresh-preview' }
                    },
                    { $: 'pulldown.menu-item',
                        spritePosition: '10,0',
                        title: 'Redraw Studio',
                        action: { $: 'studio.redraw-studio' }
                    },
                    { $: 'pulldown.menu-item',
                        spritePosition: '3,0',
                        title: 'Edit source',
                        action: { $: 'studio.editSource' }
                    },
                    { $: 'pulldown.menu-item',
                        spritePosition: '5,0',
                        title: 'Outline',
                        action: { $: 'studio.open-control-tree' }
                    },
                    { $: 'pulldown.menu-item',
                        spritePosition: '6,0',
                        title: 'jbEditor',
                        action: { $: 'studio.openjbEditor' }
                    }
                ]
            },
            { $: 'pulldown.top-menu-item',
                title: 'Insert',
                controls: []
            },
            { $: 'pulldown.top-menu-item',
                title: 'Data',
                controls: [
                    { $: 'dynamic-controls',
                        controlItems: function (ctx) {
                            var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources']);
                            return Object.getOwnPropertyNames(res)
                                .filter(function (x) { return x != 'window'; });
                        },
                        genericControl: { $: 'pulldown.menu-item',
                            title: '%$controlItem%',
                            action: { $: 'studio.open-resource',
                                resource: function (ctx) {
                                    return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'resources', ctx.exp('%$controlItem%')]);
                                },
                                id: '%$controlItem%'
                            }
                        }
                    },
                    { $: 'pulldown.menu-item-separator' },
                    { $: 'pulldown.menu-item',
                        title: 'Add Data Resource...',
                        action: { $: 'studio.addDataResource' }
                    }
                ]
            },
            { $: 'pulldown.top-menu-item',
                title: 'Tests',
                controls: [
                    { $: 'dynamic-controls',
                        controlItems: function (ctx) {
                            var res = jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests']);
                            return Object.getOwnPropertyNames(res)
                                .filter(function (x) { return x != 'window'; });
                        },
                        genericControl: { $: 'pulldown.menu-item',
                            title: '%$controlItem%',
                            action: { $: 'studio.run-test',
                                resource: function (ctx) {
                                    return jb_path(jbart, ['previewWindow', 'jbart_widgets', ctx.exp('%$globals/project%'), 'tests', ctx.exp('%$controlItem%')]);
                                },
                                id: '%$controlItem%'
                            }
                        }
                    },
                    { $: 'pulldown.menu-item-separator' },
                    { $: 'pulldown.menu-item',
                        title: 'Add Test...',
                        action: { $: 'studio.add-test' }
                    },
                    { $: 'pulldown.menu-item',
                        title: 'Run All Tests...',
                        action: { $: 'studio.run-all-tests' }
                    }
                ]
            }
        ],
        features: { $: 'css.margin', top: '5' }
    }
});
