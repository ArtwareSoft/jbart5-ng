System.register(['jb-core', './studio-tgp-model', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_tgp_model_1, studio_utils_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.open-control-tree', {
                type: 'action',
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-floating', id: 'studio-outline', width: '350' },
                    content: { $: 'studio.control-tree' },
                    menu: { $: 'button',
                        title: ' ',
                        action: { $: 'studio.open-tree-menu', path: '%$globals/profile_path%' },
                        style: { $: 'button.mdl-icon', icon: 'menu' },
                        features: { $: 'css', css: 'button { background: none }' }
                    },
                    title: 'Outline'
                }
            });
            jb_core_1.jb.component('studio.open-tree-menu', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'menu.open-context-menu', menu: { $: 'studio.tree-menu', path: '%$path%' } }
            });
            jb_core_1.jb.component('studio.tree-menu', {
                type: 'menu.option',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'menu.menu',
                    options: [
                        { $: 'menu.action',
                            title: 'Insert',
                            action: { $: 'studio.open-new-control-dialog' }
                        },
                        { $: 'menu.action',
                            title: 'Wrap with group',
                            action: [
                                { $: 'studio.wrap-with-group', path: '%$path%' },
                                { $: 'onNextTimer',
                                    action: [
                                        { $: 'writeValue',
                                            to: '%$globals/profile_path%',
                                            value: '%$path%~controls~0'
                                        },
                                        { $: 'tree.regain-focus' }
                                    ]
                                }
                            ]
                        },
                        { $: 'menu.action',
                            title: 'Duplicate',
                            action: { $: 'studio.duplicate', path: '%$path%' }
                        },
                        { $: 'menu.separator' },
                        { $: 'menu.action',
                            title: 'inteliscript editor',
                            action: { $: 'studio.open-jb-editor', path: '%$path%' }
                        },
                        { $: 'menu.action',
                            title: 'context viewer',
                            action: { $: 'studio.open-context-viewer', path: '%$path%' }
                        },
                        { $: 'menu.action',
                            title: 'javascript editor',
                            action: { $: 'studio.editSource', path: '%$path%' }
                        },
                        { $: 'menu.action',
                            $vars: {
                                compName: { $: 'studio.comp-name', path: '%$path%' }
                            },
                            title: 'Goto %$compName%',
                            showCondition: '%$compName%',
                            action: { $: 'studio.goto-path', path: '%$compName%' }
                        },
                        { $: 'studio.goto-sublime', path: '%$path%' },
                        { $: 'menu.separator' },
                        { $: 'menu.action',
                            title: 'Delete',
                            icon: 'delete',
                            shortcut: 'Delete',
                            action: [
                                { $: 'writeValue', to: '%$TgpTypeCtrl.expanded%', value: false },
                                { $: 'studio.delete', path: '%$path%' }
                            ]
                        },
                        { $: 'menu.action',
                            title: 'Copy',
                            icon: 'copy',
                            shortcut: 'Ctrl+C',
                            action: { $: 'studio.copy', path: '%$path%' }
                        },
                        { $: 'menu.action',
                            title: 'Paste',
                            icon: 'paste',
                            shortcut: 'Ctrl+V',
                            action: { $: 'studio.paste', path: '%$path%' }
                        },
                        { $: 'menu.action',
                            title: 'Undo',
                            icon: 'undo',
                            shortcut: 'Ctrl+Z',
                            action: { $: 'studio.undo' }
                        },
                        { $: 'menu.action',
                            title: 'Redo',
                            icon: 'redo',
                            shortcut: 'Ctrl+Y',
                            action: { $: 'studio.redo' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.control-tree', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'tree',
                            nodeModel: { $: 'studio.control-tree.nodes' },
                            features: [
                                { $: 'css.class', class: 'jb-control-tree studio-control-tree' },
                                { $: 'tree.selection',
                                    databind: '%$globals/profile_path%',
                                    onSelection: [
                                        { $: 'studio.open-properties' },
                                        { $: 'studio.highlight-in-preview',
                                            path: { $: 'studio.currentProfilePath' }
                                        }
                                    ],
                                    autoSelectFirst: true,
                                },
                                { $: 'tree.keyboard-selection',
                                    onEnter: { $: 'studio.open-properties', focus: true },
                                    onRightClickOfExpanded: { $: 'studio.open-tree-menu', path: '%%' },
                                    applyMenuShortcuts: { $: 'studio.tree-menu', path: '%%' },
                                    autoFocus: true,
                                },
                                { $: 'tree.drag-and-drop' },
                                { $: 'studio.control-tree.refresh-path-changes' },
                            ]
                        }
                    ],
                    features: [
                        { $: 'css.padding', top: '10' },
                        { $: 'group.studio-watch-path', path: { $: 'studio.currentProfilePath' } },
                    ]
                }
            });
            jb_core_1.jb.component('studio.control-tree.nodes', {
                type: 'tree.nodeModel',
                impl: function (context) {
                    var currentPath = context.run({ $: 'studio.currentProfilePath' });
                    var compPath = currentPath.split('~')[0] || '';
                    return new studio_tgp_model_1.TgpModel(compPath);
                }
            });
            // after model modifications the paths of the selected and expanded nodes may change and the tree should fix it.
            jb_core_1.jb.component('studio.control-tree.refresh-path-changes', {
                type: 'feature',
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        var tree = ctx.vars.$tree;
                        studio_utils_1.pathChangesEm.takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                            .subscribe(function (fixer) {
                            var new_expanded = {};
                            jb_entries(tree.expanded)
                                .filter(function (e) { return e[1]; })
                                .forEach(function (e) { return new_expanded[fixer.fix(e[0])] = true; });
                            tree.expanded = new_expanded;
                            tree.selected = fixer.fix(tree.selected);
                        });
                    }
                }); }
            });
        }
    }
});
