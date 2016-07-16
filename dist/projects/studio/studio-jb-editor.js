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
                                    for: { $: 'studio.probe', path: '%$globals/jb_editor_selection%' },
                                    resource: 'probeResult'
                                },
                                title: 'wait for probe',
                                controls: { $: 'itemlist',
                                    items: '%$probeResult%',
                                    controls: [
                                        { $: 'studio.data-browse', data: '%in/data%', title: 'in' },
                                        { $: 'studio.data-browse', data: '%out%', title: 'out' }
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
                    content: { $: 'studio.jb-floating-input', path: '%$path%' },
                    features: { $: 'dialogFeature.autoFocusOnFirstInput' }
                }
            });
            jb_core_1.jb.component('studio.jb-floating-input', {
                type: 'control',
                params: { path: { as: 'string' } },
                impl: { $: 'editable-text',
                    databind: { $: 'studio.profile-value-as-text', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'css.padding', left: '4', right: '4' },
                        { $: 'editable-text.suggestions-input-feature',
                            mdInput: true,
                            floatingInput: true,
                            path: '%$path%',
                            action: { $: 'studio.jb-open-suggestions', path: '%$path%' },
                            onEnter: [
                                { $: 'closeContainingPopup', OK: true },
                                { $: 'tree.regain-focus' }
                            ]
                        }
                    ],
                    style: {
                        $if: { $: 'studio.is-primitive-value', path: '%$path%' },
                        then: { $: 'editable-text.md-input', width: '400' },
                        else: { $: 'editable-text.codemirror', mode: 'javascript' }
                    }
                }
            });
            jb_core_1.jb.component('studio.profile-value-as-text', {
                type: 'data',
                params: {
                    path: { as: 'string' }
                },
                impl: function (context, path) { return ({
                    $jb_val: function (value) {
                        if (typeof value == 'undefined') {
                            var val = studio.model.val(path);
                            if (typeof val == 'string')
                                return val;
                            if (studio.model.compName(path))
                                return '=' + studio.model.compName(path);
                            return typeof val;
                        }
                        else {
                            if (value.indexOf('=') == 0) {
                                var comp = value.substr(2);
                                if (comp == 'pipeline')
                                    studio.model.modify(studio.model.writeValue, path, { value: [] }, context);
                                else if (studio.findjBartToLook(path).comps[comp])
                                    studio.model.modify(studio.model.setComp, path, { comp: value.substr(2) }, context);
                            }
                            else {
                                studio.model.modify(studio.model.writeValue, path, { value: value }, context);
                            }
                        }
                    }
                }); }
            });
        }
    }
});
