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
            jb_core_1.jb.component('studio.open-control-tree', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: 'Outline',
                    style: { $: 'dialog.studio-floating', id: 'studio outline', width: 300 },
                    content: { $: 'studio.control-tree' },
                    menu: { $: 'button',
                        style: { $: 'button.md-icon', icon: 'menu',
                            css1: '{position: fixed; margin-top: -10px; margin-left: 230px; }' },
                        action: { $: 'studio.open-tree-menu', path: '%$globals/profile_path%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.open-tree-menu', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'pulldownPopup.contextMenuPopup' },
                    content: { $: 'group',
                        controls: [
                            { $: 'pulldown.menu-item',
                                title: 'Insert',
                                action: { $: 'studio.openNewCtrlDialog' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Wrap with group',
                                action: { $: 'studio.wrapWithGroup', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Duplicate',
                                action: { $: 'studio.duplicate', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item-separator' },
                            { $: 'pulldown.menu-item',
                                title: 'javascript editor',
                                action: { $: 'studio.editSource', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Goto sublime',
                                action: { $: 'studio.openSublime', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item-separator' },
                            { $: 'pulldown.menu-item',
                                title: 'Delete',
                                icon: 'delete',
                                shortcut: 'Delete',
                                action: [
                                    { $: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false },
                                    { $: 'studio.delete', path: '%$path%' }
                                ]
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Copy',
                                icon: 'copy',
                                shortcut: 'Ctrl+C',
                                action: { $: 'studio.copy', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Paste',
                                icon: 'paste',
                                shortcut: 'Ctrl+V',
                                action: { $: 'studio.paste', path: '%$path%' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Undo',
                                icon: 'undo',
                                shortcut: 'Ctrl+Z',
                                action: { $: 'studio.undo' }
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Redo',
                                icon: 'redo',
                                shortcut: 'Ctrl+Y',
                                action: { $: 'studio.redo' }
                            }
                        ]
                    }
                }
            });
            jb_core_1.jb.component('studio.control-tree', {
                type: 'control',
                impl: {
                    $: 'tree', cssClass: 'jb-control-tree studio-control-tree',
                    nodeModel: { $: 'studio.control-tree.nodes' },
                    features: [
                        { $: 'tree.selection',
                            autoSelectFirst: true,
                            databind: '%$globals/profile_path%',
                            onSelection: { $: 'studio.highlight-in-preview',
                                path: { $: 'studio.currentProfilePath' }
                            },
                            onDoubleClick: [
                                { $: 'studio.openProperties' },
                                { $: 'studio.highlight-in-preview' },
                            ],
                        },
                        { $: 'tree.keyboard-selection', onEnter: { $: 'studio.openProperties' } },
                        { $: 'tree.drag-and-drop' },
                        { $: 'tree.keyboard-shortcut', key: 'Ctrl-C', action: { $: 'studio.copy', path: '%%' } },
                        { $: 'tree.keyboard-shortcut', key: 'Ctrl-V', action: { $: 'studio.paste', path: '%%' } },
                        { $: 'tree.keyboard-shortcut', key: 'Ctrl-Z', action: { $: 'studio.undo', path: '%%' } },
                        { $: 'tree.keyboard-shortcut', key: 'Ctrl-Y', action: { $: 'studio.redo', path: '%%' } },
                        { $: 'tree.keyboard-shortcut', key: 'Delete', action: { $: 'studio.delete', path: '%%' } },
                        { $: 'studio.control-tree.refreshPathChanges' },
                    ]
                }
            });
            jb_core_1.jb.component('studio.control-tree.nodes', {
                type: 'tree.nodeModel',
                params: {},
                impl: function (context) {
                    var currentPath = context.str({ $: 'studio.currentProfilePath' });
                    var compPath = currentPath.split('~')[0] || '';
                    return new studio.ControlModel(compPath);
                }
            });
            // after model modifications the paths of the selected and expanded nodes may change and the tree should fix it.
            jb_core_1.jb.component('studio.control-tree.refreshPathChanges', {
                type: 'feature',
                impl: function (context) {
                    var tree = context.vars.$tree;
                    if (jbart._refreshPathTreeObserver)
                        jbart._refreshPathTreeObserver.unsubscribe();
                    jbart._refreshPathTreeObserver = studio.pathChangesEm.subscribe(function (fixer) {
                        var new_expanded = {};
                        Object.getOwnPropertyNames(tree.expanded).filter(function (path) { return tree.expanded[path]; })
                            .forEach(function (path) { return new_expanded[fixer.fix(path)] = true; });
                        tree.expanded = new_expanded;
                        tree.selected = fixer.fix(tree.selected);
                    });
                }
            });
        }
    }
});
