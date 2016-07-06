System.register(['jb-core', 'jb-ui', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, studio;
    function rev(str) {
        return str.split('').reverse().join('');
    }
    function onCloseingExp(input) {
        return text_with_open_close.slice(-1) == '}';
    }
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
                        { $: 'editable-text.studio-jb-detect-suggestions',
                            action: { $: 'studio.jb-open-suggestions', path: '%$path%' }
                        }
                    ],
                    style: {
                        $if: { $: 'studio.is-primitive-value', path: '%$path%' },
                        then: { $: 'editable-text.md-input', width: '400' },
                        else: { $: 'editable-text.codemirror', mode: 'javascript' }
                    }
                }
            });
            jb_core_1.jb.component('editable-text.studio-jb-detect-suggestions', {
                type: 'feature',
                params: {
                    action: { type: 'action', dynamic: true }
                },
                impl: function (ctx) { return ({
                    innerhost: {
                        'md-input': { '(keyup)': 'keyEm.next($event)' }
                    },
                    init: function (cmp) {
                        cmp.keyEm = cmp.keyEm || new Subject();
                        cmp.keyEm
                            .map(function (e) {
                            var input = e.srcElement;
                            var pos = input.selectionStart;
                            var text = input.value.substr(0, pos).trim();
                            var text_with_open_close = text.replace(/%([^%;{}\s><"']*)%/g, function (match, contents) {
                                return '{' + contents + '}';
                            });
                            var exp = rev((rev(text_with_open_close).match(/([^\}%]*%)/) || ['', ''])[1]);
                            var tail = rev((rev(exp).match(/([^.\/]*)(\/|\.)/) || ['', ''])[1]);
                            var suggestionEvent = { original: e, pos: pos, input: input, tail: tail,
                                text: text, text_with_open_close: text_with_open_close, exp: exp,
                                lastChar: text_with_open_close.slice(-1)
                            };
                            console.log(suggestionEvent.input.value);
                            return suggestionEvent;
                        })
                            .distinctUntilChanged(null, function (e) {
                            return e.input.value;
                        })
                            .filter(function (e) {
                            return e.exp;
                        })
                            .subscribe(function (e) {
                            return jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx.setVars({ jbEditEvent: e, keyEmitter: cmp.keyEm }), e.input)();
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('studio.jb-open-suggestions', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-suggestions-popup' },
                    content: { $: 'group',
                        features: { $: 'group.wait',
                            for: { $: 'studio.probe', path: '%$path%' }
                        },
                        controls: { $: 'itemlist',
                            items: { $: 'studio.jb-suggestions' },
                            controls: { $: 'label', title: '%%' },
                            features: [
                                { $: 'itemlist.studio-suggestions-selection',
                                    onEnter: [
                                        { $: 'studio.jb-paste-suggestion', toPaste: '%%' },
                                        { $: 'closeContainingPopup' }
                                    ]
                                },
                                { $: 'itemlist.selection' },
                            ]
                        }
                    }
                }
            });
            jb_core_1.jb.component('studio.jb-suggestions', {
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    var probeCtx = ctx.data.data[0].in;
                    var e = ctx.exp('%$jbEditEvent%');
                    if (e.lastChar == '%')
                        return jb_core_1.jb.toarray(probeCtx.exp('%%'))
                            .concat(jb_core_1.jb.entries(probeCtx.vars).map(function (x) { return '$' + x[0]; }))
                            .concat(jb_core_1.jb.entries(probeCtx.resources).map(function (x) { return '$' + x[0]; }));
                    var base = e.exp.slice(0, -1 - e.tail.length);
                    return [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp(base + '%'))
                        .map(function (x) {
                        return jb_core_1.jb.entries(x).map(function (x) { return x[0]; });
                    }))
                        .filter(jb_onlyUnique)
                        .filter(function (p) {
                        return e.tail == '' || p.indexOf(e.tail) == 0;
                    });
                }
            });
            jb_core_1.jb.component('itemlist.studio-suggestions-selection', {
                type: 'feature',
                params: {
                    onEnter: { type: 'action', dynamic: true },
                },
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            var itemlist = cmp.itemlist;
                            itemlist.selected = itemlist.items[0];
                            var keyEm = ctx.exp('%$keyEmitter%')
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) {
                                return e.type == 'close';
                            }));
                            keyEm.filter(function (e) { return e.keyCode == 13; })
                                .subscribe(function (x) {
                                return ctx.params.onEnter(ctx.setData(itemlist.selected));
                            });
                            keyEm.filter(function (e) {
                                return e.keyCode == 38 || e.keyCode == 40;
                            })
                                .map(function (event) {
                                // event.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
                            })
                                .subscribe(function (x) {
                                return itemlist.selectionEmitter.next(x);
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.jb-paste-suggestion', {
                params: {
                    toPaste: { as: 'string' },
                },
                type: 'action',
                impl: function (ctx, toPaste) {
                    var e = ctx.exp('%$jbEditEvent%');
                    var input = e.input;
                    var pos = e.pos + 1;
                    input.value = input.value.substr(0, e.pos - e.tail.length) + toPaste + input.value.substr(pos);
                    jb_core_1.jb.delay(100).then(function () {
                        input.selectionStart = pos + toPaste.length;
                        input.selectionEnd = input.selectionStart;
                    });
                }
            });
        }
    }
});
