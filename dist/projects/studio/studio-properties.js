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
            jb_core_1.jb.component('studio.open-properties', {
                type: 'action',
                impl: { $: 'openDialog',
                    title: { $pipeline: [
                            { $: 'object',
                                title: { $: 'studio.short-title',
                                    path: { $: 'studio.currentProfilePath' }
                                },
                                comp: { $: 'studio.comp-name',
                                    path: { $: 'studio.currentProfilePath' }
                                }
                            },
                            'Properties of %comp% %title%'
                        ] },
                    style: { $: 'dialog.studio-floating', id: 'studio-properties', width: '500' },
                    content: { $: 'studio.properties',
                        path: { $: 'studio.currentProfilePath' }
                    },
                }
            });
            jb_core_1.jb.component('studio.open-source-dialog', {
                type: 'action',
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'Source',
                    style: { $: 'dialog.md-dialog-ok-cancel' },
                    content: { $: 'text',
                        text: { $: 'studio.comp-source' },
                        style: { $: 'text.codemirror' }
                    },
                }
            });
            jb_core_1.jb.component('studio.properties', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'group',
                    style: { $: 'group.studio-properties-accordion' },
                    controls: [
                        { $: 'group',
                            title: { $pipeline: [
                                    { $: 'studio.val', path: '%$path%' },
                                    { $: 'count',
                                        items: { $pipeline: [
                                                { $: 'objectProperties' },
                                                { $: 'filter',
                                                    filter: { $: 'notEquals', item1: '%%', item2: 'features' }
                                                },
                                                { $: 'filter',
                                                    filter: { $: 'notEquals', item1: '%%', item2: '$' }
                                                },
                                                { $: 'filter',
                                                    filter: { $: 'notEquals', item1: '%%', item2: 'controls' }
                                                }
                                            ] }
                                    },
                                    'Properties (%%)'
                                ] },
                            style: { $: 'property-sheet.studio-properties' },
                            controls: { $: 'dynamic-controls',
                                controlItems: { $pipeline: [
                                        { $: 'studio.non-control-children', path: '%$path%' },
                                        { $: 'filter',
                                            filter: { $: 'not',
                                                of: { $: 'endsWith', endsWith: '~features', text: '%%' }
                                            }
                                        }
                                    ] },
                                genericControl: { $: 'studio.property-field', path: '%$controlItem%' }
                            },
                            features: { $: 'group.studio-watch-path', path: '%$path%' }
                        },
                        { $: 'group',
                            title: { $pipeline: [
                                    { $: 'studio.val', path: '%$path%' },
                                    { $: 'count', items: '%features%' },
                                    'Features (%%)'
                                ] },
                            features: { $: 'group.studio-watch-path', path: '%$path%' },
                            controls: { $: 'studio.property-array', path: '%$path%~features' }
                        }
                    ],
                    features: [
                        { $: 'css.width', width: '502' },
                        { $: 'group.dynamic-sub-titles' },
                        { $: 'css.margin', left: '-10' },
                        { $: 'hidden',
                            showCondition: { $: 'studio.has-param', param: 'features', path: '%$path%' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.properties-in-tgp', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    style: { $: 'property-sheet.studio-properties' },
                    features: { $: 'group.studio-watch-path', path: '%$path%' },
                    controls: { $: 'dynamic-controls',
                        controlItems: { $: 'studio.non-control-children', path: '%$path%' },
                        genericControl: { $: 'studio.property-field', path: '%$controlItem%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.property-field', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (context, path) {
                    var fieldPT = 'studio.property-label';
                    var val = studio_tgp_model_1.model.val(path);
                    var valType = typeof val;
                    var paramDef = studio_tgp_model_1.model.paramDef(path);
                    if (!paramDef)
                        jb_core_1.jb.logError('property-field: no param def for path ' + path);
                    if (valType == 'function')
                        fieldPT = 'studio.property-javascript';
                    else if (paramDef.as == 'number')
                        fieldPT = 'studio.property-slider';
                    else if (paramDef.options)
                        fieldPT = 'studio.property-enum';
                    else if (['data', 'boolean'].indexOf(paramDef.type || 'data') != -1) {
                        if (studio_tgp_model_1.model.compName(path) || valType == 'object')
                            fieldPT = 'studio.property-script';
                        else if (paramDef.type == 'boolean' && (valType == 'boolean' || val == null))
                            fieldPT = 'studio.property-boolean';
                        else
                            fieldPT = 'studio.property-primitive';
                    }
                    else if ((paramDef.type || '').indexOf('[]') != -1 && isNaN(Number(path.split('~').pop())))
                        fieldPT = 'studio.property-script';
                    else
                        fieldPT = 'studio.property-tgp';
                    return context.run({ $: fieldPT, path: path });
                }
            });
            jb_core_1.jb.component('studio.property-label', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'label',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.property-primitive', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'editable-text',
                    style: { $: 'editable-text.studio-primitive-text' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'studio.property-toobar-feature', path: '%$path%' },
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-script', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'studio.property-toobar-feature', path: '%$path%' },
                    ],
                    controls: { $: 'button',
                        title: { $: 'studio.data-script-summary', path: '%$path%' },
                        action: { $: 'studio.open-jb-editor', path: '%$path%' },
                        style: { $: 'button.studio-script' }
                    }
                }
            });
            jb_core_1.jb.component('studio.data-script-summary', {
                type: 'data',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: function (ctx, path) {
                    var val = studio_tgp_model_1.model.val(path);
                    if (studio_tgp_model_1.model.compName(path))
                        return studio_tgp_model_1.model.compName(path);
                    if (Array.isArray(val))
                        return jb_core_1.jb.prettyPrint(val);
                    if (typeof val == 'function')
                        return 'javascript';
                }
            });
            jb_core_1.jb.component('studio.property-boolean', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'editable-boolean',
                    style: { $: 'editable-boolean.studio-slide-toggle' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    features: [
                        { $: 'studio.undo-support', path: '%$path%' },
                        { $: 'studio.property-toobar-feature', path: '%$path%' }
                    ],
                }
            });
            jb_core_1.jb.component('studio.property-enum', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'picklist',
                    style: { $: 'picklist.studio-enum' },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    options: { $: 'studio.enum-options', path: '%$path%' },
                }
            });
            jb_core_1.jb.component('studio.property-slider', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'editable-number',
                    $vars: {
                        paramDef: { $: 'studio.param-def', path: '%$path%' }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    databind: { $: 'studio.ref', path: '%$path%' },
                    style: { $: 'editable-number.slider', width: '120' },
                    min: '%$paramDef/min%',
                    max: '%$paramDef/max%',
                    step: '%$paramDef/step%',
                    features: { $: 'css', css: '{ margin-left: -5px; }' },
                }
            });
            jb_core_1.jb.component('studio.property-tgp', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: { $: 'group',
                    $vars: {
                        tgpCtrl: { $: 'object', expanded: true }
                    },
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    features: [
                        { $: 'studio.property-toobar-feature', path: '%$path%' },
                        { $: 'studio.bindto-modifyOperations',
                            data: '%$tgpCtrl/expanded%',
                            path: '%$path%'
                        }
                    ],
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    databind: '%$tgpCtrl/expanded%',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: [
                                        { $: 'css',
                                            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
                                        },
                                        { $: 'hidden',
                                            showCondition: {
                                                $and: [
                                                    { $notEmpty: { $: 'studio.non-control-children', path: '%$path%' } },
                                                    { $notEmpty: { $: 'studio.val', path: '%$path%' } },
                                                    { $: 'notEquals',
                                                        item1: { $: 'studio.comp-name', path: '%$path%' },
                                                        item2: 'customStyle'
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                },
                                { $: 'picklist',
                                    databind: { $: 'studio.comp-name-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                    style: { $: 'picklist.groups' },
                                    features: [
                                        { $: 'css',
                                            css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
                                        },
                                        { $: 'picklist.dynamic-options',
                                            recalcEm: function (ctx) {
                                                return studio_utils_1.modifyOperationsEm.filter(function (e) { return e.newComp; });
                                            }
                                        }
                                    ]
                                }
                            ],
                            features: { $: 'css', css: '{ position: relative }' }
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties-in-tgp', path: '%$path%' },
                            features: [
                                { $: 'group.watch',
                                    data: { $: 'studio.comp-name', path: '%$path%' }
                                },
                                { $: 'hidden',
                                    showCondition: {
                                        $and: [
                                            '%$tgpCtrl.expanded%',
                                            { $notEmpty: { $: 'studio.non-control-children', path: '%$path%' } },
                                            { $notEmpty: { $: 'studio.val', path: '%$path%' } },
                                            { $: 'notEquals',
                                                item1: { $: 'studio.comp-name', path: '%$path%' },
                                                item2: 'customStyle'
                                            }
                                        ]
                                    }
                                },
                                { $: 'css',
                                    css: '{ margin-top: 9px; margin-left: -83px; margin-bottom: 4px;}'
                                }
                            ]
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-custom-style', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    features: [
                        { $: 'studio.property-toobar-feature', path: '%$path%' },
                    ],
                    controls: { $: 'picklist',
                        databind: { $: 'studio.comp-name-ref', path: '%$path%' },
                        options: { $: 'studio.tgp-path-options', path: '%$path%' },
                        style: { $: 'picklist.groups' },
                        features: [
                            { $: 'css',
                                css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
                            },
                            { $: 'picklist.dynamic-options',
                                recalcEm: function (ctx) {
                                    return studio_utils_1.modifyOperationsEm.filter(function (e) { return e.newComp; });
                                }
                            }
                        ],
                    }
                }
            });
            jb_core_1.jb.component('studio.property-tgp-in-array', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    $vars: {
                        tgpCtrl: { $: 'object', expanded: false }
                    },
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'editable-boolean',
                                    databind: '%$tgpCtrl/expanded%',
                                    style: { $: 'editable-boolean.expand-collapse' },
                                    features: [
                                        { $: 'studio.bindto-modifyOperations',
                                            path: '%$path%',
                                            data: '%$tgpCtrl/expanded%'
                                        },
                                        { $: 'css',
                                            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
                                        },
                                        { $: 'hidden',
                                            showCondition: {
                                                $notEmpty: { $: 'studio.non-control-children', path: '%$path%' }
                                            }
                                        }
                                    ]
                                },
                                { $: 'picklist',
                                    databind: { $: 'studio.comp-name-ref', path: '%$path%' },
                                    options: { $: 'studio.tgp-path-options', path: '%$path%' },
                                    style: { $: 'picklist.groups' },
                                    features: [
                                        { $: 'css',
                                            css: 'select { padding: 0 0; width: 150px; font-size: 12px; height: 23px;}'
                                        }
                                    ]
                                },
                                { $: 'studio.property-toobar', path: '%$path%' }
                            ],
                            features: [{ $: 'css', css: '{ position: relative; margin-left2: -80px }' }]
                        },
                        { $: 'group',
                            controls: { $: 'studio.properties-in-tgp', path: '%$path%' },
                            features: [
                                { $: 'group.watch',
                                    data: { $: 'studio.comp-name', path: '%$path%' }
                                },
                                { $: 'hidden', showCondition: '%$tgpCtrl.expanded%' },
                                { $: 'css',
                                    css: '{ margin-top: 9px; margin-left2: -100px; margin-bottom: 4px;}'
                                }
                            ]
                        }
                    ],
                    features: [
                        { $: 'studio.bindto-modifyOperations',
                            path: '%$path%',
                            data: '%$tgpCtrl/expanded%'
                        },
                        { $: 'css', css: '{ position: relative; margin-left: -80px }' }
                    ]
                }
            });
            jb_core_1.jb.component('studio.property-array', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    $vars: {
                        arrayCtrl: { $: 'object', expanded: true }
                    },
                    style: { $: 'layout.vertical', spacing: '7' },
                    controls: [
                        { $: 'group',
                            title: 'items',
                            controls: [
                                { $: 'itemlist',
                                    items: { $: 'studio.array-children', path: '%$path%' },
                                    controls: { $: 'group',
                                        style: { $: 'property-sheet.studio-plain' },
                                        controls: { $: 'studio.property-tgp-in-array', path: '%$arrayItem%' }
                                    },
                                    itemVariable: 'arrayItem',
                                    features: [
                                        { $: 'hidden', showCondition: true },
                                        { $: 'itemlist.divider' },
                                        { $: 'itemlist.drag-and-drop' }
                                    ]
                                }
                            ]
                        },
                        { $: 'button',
                            title: 'new feature',
                            action: { $: 'studio.open-new-tgp-dialog',
                                type: 'feature',
                                title: 'new feature',
                                onOK: { $: 'studio.add-array-item',
                                    path: '%$path%',
                                    toAdd: { $object: { $: '%%' } }
                                }
                            },
                            style: { $: 'button.href' },
                            features: { $: 'css.margin', top: '20', left: '20' }
                        }
                    ],
                    features: []
                }
            });
            jb_core_1.jb.component('studio.tgp-path-options', {
                type: 'picklist.options',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (context, path) {
                    return [{ code: '', text: '' }]
                        .concat(studio_tgp_model_1.model.PTsOfPath(path).map(function (op) { return ({ code: op, text: op }); }));
                }
            });
            jb_core_1.jb.component('studio.tgp-type-options', {
                type: 'picklist.options',
                params: [
                    { id: 'type', as: 'string' }
                ],
                impl: function (context, type) {
                    return studio_tgp_model_1.model.PTsOfType(type).map(function (op) { return ({ code: op, text: op }); });
                }
            });
            jb_core_1.jb.component('studio.undo-support', {
                type: 'feature',
                params: [
                    { id: 'path', essential: true, as: 'string' },
                ],
                impl: function (ctx, path) {
                    return ({
                        // saving state on focus and setting the change on blur
                        init: function (cmp) {
                            var before = studio_utils_1.compAsStrFromPath(path);
                            if (cmp.codeMirror) {
                                cmp.codeMirror.on('focus', function () {
                                    return before = studio_utils_1.compAsStrFromPath(path);
                                });
                                cmp.codeMirror.on('blur', function () {
                                    if (before != studio_utils_1.compAsStrFromPath(path))
                                        studio_utils_1.notifyModification(path, before, ctx);
                                });
                            }
                            else {
                                $(cmp.elementRef.nativeElement).findIncludeSelf('input')
                                    .focus(function (e) {
                                    before = studio_utils_1.compAsStrFromPath(path);
                                })
                                    .blur(function (e) {
                                    if (before != studio_utils_1.compAsStrFromPath(path))
                                        studio_utils_1.notifyModification(path, before, ctx);
                                });
                            }
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.bindto-modifyOperations', {
                type: 'feature',
                params: [
                    { id: 'path', essential: true, as: 'string' },
                    { id: 'data', as: 'ref' }
                ],
                impl: function (context, path, data_ref) { return ({
                    init: function (cmp) {
                        return studio_utils_1.modifyOperationsEm
                            .takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                            .filter(function (e) {
                            return e.path == path;
                        })
                            .subscribe(function (e) {
                            return jb_core_1.jb.writeValue(data_ref, true);
                        });
                    },
                    observable: function () { } // to create jbEmitter
                }); }
            });
        }
    }
});
