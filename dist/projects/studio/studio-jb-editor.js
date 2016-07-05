System.register(['jb-core', 'jb-ui', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, studio;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
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
                                    databind: '%$globals/jb_editor_selection%',
                                    onDoubleClick: { $: 'studio.open-jb-edit-property',
                                        path: '%$globals/jb_editor_selection%'
                                    }
                                },
                                { $: 'tree.keyboard-selection',
                                    onEnter: { $: 'studio.open-jb-edit-property',
                                        path: '%$globals/jb_editor_selection%'
                                    },
                                    autoFocus: true
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
                            features: { $: 'group.data', data: '%$globals/jb_editor_selection%' },
                            controls: { $: 'group',
                                features: { $: 'group.wait',
                                    for: { $: 'studio.probe', path: '%$globals/jb_editor_selection%' }
                                },
                                title: 'wait for probe',
                                controls: { $: 'itemlist',
                                    items: '%%',
                                    controls: [
                                        { $: 'studio.data-browse', data: '%data[0]/in/data%', title: 'in' },
                                        { $: 'studio.data-browse', data: '%data[0]/out%', title: 'out' }
                                    ]
                                }
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
                            { $: 'tree.keyboard-selection' },
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
            jb_core_1.jb.component('studio.open-jb-edit-property', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-jb-editor-popup' },
                    content: { $: 'jb-edit-property', path: '%$path%' }
                }
            });
            jb_core_1.jb.component('jb-edit-property', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-text',
                    databind: { $: 'studio.currentProfileAsScript', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'css.padding', left: '4', right: '4' },
                        { $: 'feature.onEnter',
                            action: [
                                { $: 'closeContainingPopup', OK: true },
                                { $: 'tree.regain-focus' }
                            ]
                        },
                        { $: 'editable-text.studio-jb-edit-suggestions' }
                    ],
                    style: {
                        $if: { $: 'studio.is-primitive-value', path: '%$path%' },
                        then: { $: 'editable-text.md-input', width: '400' },
                        else: { $: 'editable-text.codemirror', mode: 'javascript' }
                    }
                }
            });
            jb_core_1.jb.component('editable-text.studio-jb-edit-suggestions', {
                type: 'feature',
                params: {
                    path: { as: 'string' },
                    action: { type: 'action', dynamic: true, defaultValue: { $: 'studio.open-jb-edit-suggestions' } }
                },
                impl: function (ctx) { return ({
                    host: {
                        '(keydown)': 'keydown.next($event)',
                    },
                    init: function (cmp) {
                        cmp.keydown = cmp.keydown || new Subject();
                        cmp.keydown
                            .filter(function (e) {
                            return ['%', '.', '/', '{'].indexOf(e.key) != -1;
                        })
                            .subscribe(function (e) {
                            return jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx.setVars({ jbEditInput: e.srcElement, keyEmitter: cmp.keydown }), e.srcElement)();
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('studio.open-jb-edit-suggestions', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-suggestions-popup' },
                    content: { $: 'itemlist',
                        items: { $: 'studio.jb-suggestions' },
                        controls: { $: 'label', title: 'aa - %%' },
                        features: [
                            { $: 'itemlist.selection' },
                            { $: 'itemlist.studio-suggestions-selection',
                                onEnter: [
                                    { $: 'studio.jb-paste-suggestion', toPaste: '%%' },
                                    { $: 'closeContainingPopup' }
                                ]
                            }
                        ]
                    }
                }
            });
            jb_core_1.jb.component('studio.jb-suggestions', {
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    var text = ctx.exp('%$jbEditInput%').val;
                    var position = ctx.exp('%$jbEditInput%').selectionStart;
                    return [1, 2, 3];
                }
            });
            jb_core_1.jb.component('itemlist.studio-suggestions-selection', {
                type: 'feature',
                params: {
                    onEnter: { type: 'action', dynamic: true },
                },
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        var itemlist = cmp.itemlist;
                        cmp.keydown = ctx.exp('%$keyEmitter%');
                        cmp.keydown.filter(function (e) { return e.keyCode == 13; })
                            .take(1)
                            .subscribe(function (x) {
                            return ctx.params.onEnter(ctx.setData(itemlist.selected));
                        });
                        cmp.keydown && cmp.keydown.filter(function (e) { return e.keyCode == 38 || e.keyCode == 40; })
                            .map(function (event) {
                            var diff = event.keyCode == 40 ? 1 : -1;
                            return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
                        }).subscribe(function (x) {
                            return itemlist.selectionEmitter.next(x);
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('studio.jb-paste-suggestion', {
                params: {
                    toPaste: { as: 'string' },
                },
                type: 'action',
                impl: function (ctx, toPaste) {
                    var input = ctx.exp('%$jbEditInput%');
                    input.value = input.value.substr(0, input.selectionStart) + toPaste + input.value.substr(input.selectionStart);
                }
            });
        }
    }
});
