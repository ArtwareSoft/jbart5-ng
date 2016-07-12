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
            jb_core_1.jb.component('studio.property-toobar-feature', {
                type: 'feature',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'field.toolbar',
                    toolbar: { $: 'studio.property-toobar', path: '%$path%' }
                }
            });
            jb_core_1.jb.component('studio.property-toobar', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    style: { $: 'layout.horizontal' },
                    controls: [
                        { $: 'button',
                            title: 'style editor',
                            action: { $: 'studio.open-style-editor', path: '%$path%' },
                            style: { $: 'button.md-icon-12', icon: 'build' },
                            features: { $: 'hidden',
                                showCondition: { $: 'endsWith', endsWith: '~style', text: '%$path%' }
                            }
                        },
                        { $: 'button',
                            title: 'multiline edit',
                            style: { $: 'button.md-icon-12', icon: 'build' },
                            features: { $: 'hidden',
                                showCondition: { $: 'equals',
                                    item1: [{ $: 'studio.paramDef', path: '%$path%' }, '%as%'],
                                    item2: 'string'
                                }
                            },
                            action: { $: 'studio.open-multiline-edit', path: '%$path%' }
                        },
                        { $: 'button',
                            title: 'more',
                            style: { $: 'button.md-icon-12', icon: 'more_vert' },
                            action: { $: 'studio.open-property-menu', path: '%$path%' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.open-property-menu', {
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
                                $vars: {
                                    compName: { $: 'studio.compName', path: '%$path%' }
                                },
                                title: 'Goto %$compName%',
                                features: { $: 'hidden', showCondition: '%$compName%' },
                                action: { $: 'studio.goto-path', path: '%$compName%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Javascript editor',
                                icon: 'code',
                                action: { $: 'studio.editSource', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Open sublime',
                                action: { $: 'studio.openSublime', path: '%$path%' }
                            },
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
        }
    }
});
