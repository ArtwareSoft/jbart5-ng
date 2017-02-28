jb.component('studio.property-toolbar-feature', {
    type: 'feature',
    params: [
        { id: 'path', as: 'string' }
    ],
    impl: { $: 'field.toolbar',
        toolbar: { $: 'studio.property-toolbar', path: '%$path%' }
    }
});
jb.component('studio.property-toolbar', {
    type: 'control',
    params: [
        { id: 'path', as: 'string' }
    ],
    impl: { $: 'group',
        style: { $: 'layout.horizontal' },
        controls: [
            { $: 'button',
                title: 'Customize style',
                style: { $: 'button.mdl-icon-12', icon: 'build' },
                action: [{ $: 'studio.make-local', path: '%$path%' }, { $: 'studio.open-style-editor', path: '%$path%' }],
                features: { $: 'hidden',
                    showCondition: {
                        $and: [
                            { $: 'endsWith', endsWith: '~style', text: '%$path%' },
                            { $: 'notEquals',
                                item1: { $: 'studio.comp-name', path: '%$path%' },
                                item2: 'customStyle'
                            }
                        ]
                    }
                }
            },
            { $: 'button',
                title: 'style editor',
                action: { $: 'studio.open-style-editor', path: '%$path%' },
                style: { $: 'button.mdl-icon-12', icon: 'build' },
                features: { $: 'hidden',
                    showCondition: { $: 'equals',
                        item1: { $: 'studio.comp-name', path: '%$path%' },
                        item2: 'customStyle'
                    }
                }
            },
            { $: 'button',
                title: 'more...',
                style: { $: 'button.mdl-icon-12', icon: 'more_vert' },
                action: { $: 'studio.open-property-menu', path: '%$path%' }
            }
        ]
    }
});
jb.component('studio.open-property-menu', {
    type: 'action',
    params: [
        { id: 'path', as: 'string' }
    ],
    impl: { $: 'openDialog',
        $vars: {
            compName: { $: 'studio.comp-name', path: '%$path%' }
        },
        style: { $: 'pulldown-popup.context-menu-popup' },
        content: { $: 'group',
            controls: [
                { $: 'pulldown.menu-item',
                    title: 'style editor',
                    action: { $: 'studio.open-style-editor', path: '%$path%' },
                    features: { $: 'hidden',
                        showCondition: { $: 'endsWith', endsWith: '~style', text: '%$path%' }
                    }
                },
                { $: 'pulldown.menu-item',
                    title: 'multiline edit',
                    features: { $: 'hidden',
                        showCondition: { $: 'equals',
                            item1: { $pipeline: [{ $: 'studio.param-def', path: '%$path%' }, '%as%'] },
                            item2: 'string'
                        }
                    },
                    action: { $: 'studio.open-multiline-edit', path: '%$path%' }
                },
                { $: 'pulldown.menu-item',
                    title: 'Goto %$compName%',
                    features: { $: 'hidden', showCondition: '%$compName%' },
                    action: { $: 'studio.goto-path', path: '%$compName%' }
                },
                { $: 'pulldown.menu-item',
                    title: 'Inteliscript editor',
                    icon: 'code',
                    action: { $: 'studio.open-jb-editor', path: '%$path%' }
                },
                { $: 'pulldown.menu-item',
                    title: 'Javascript editor',
                    icon: 'code',
                    action: { $: 'studio.editSource', path: '%$path%' }
                },
                { $: 'studio.goto-sublime', path: '%$path%' },
                { $: 'pulldown.menu-item',
                    title: 'Delete',
                    icon: 'delete',
                    shortcut: 'Delete',
                    action: [
                        { $: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false },
                        { $: 'studio.delete', path: '%$path%' }
                    ]
                }
            ]
        }
    }
});
