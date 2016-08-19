System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            jb_1.jb.resource('ui-tests', 'people-array', { "people": [
                    { "name": "Homer Simpson", "age": 42, "male": true },
                    { "name": "Marge Simpson", "age": 38, "male": false },
                    { "name": "Bart Simpson", "age": 12, "male": true }
                ]
            });
            //jb.resource('studio-helper','settings', { "currentProfilePath": "studio-helper.sample-control"})
            jb_1.jb.resource('studio-helper', 'group-with-custom-style', { $: 'group',
                title: 'main',
                style: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    css: ".group-item { margin-bottom: %$spacing%px; display: block }\n        .group-item:last-child { margin-bottom:0 }",
                    features: { $: 'group.initGroup' }
                },
                controls: [
                    { $: 'group', title: '2.0', controls: [
                            { $: 'label', title: '2.1' },
                            { $: 'button', title: '2.2' },
                        ]
                    },
                    { $: 'label', title: '1.0' },
                ] });
            // fake current path
            jb_1.jb.component('studio-helper.properties', {
                type: 'control',
                params: {
                    path: { defaultValue: 'studio-helper-dummy.label' }
                },
                impl: { $: 'group',
                    $vars: { circuit: 'studio-helper-dummy.label' },
                    style: { $: 'group.studio-properties-accordion' },
                    controls: [
                        { $: 'group',
                            title: 'Properties',
                            style: { $: 'property-sheet.studio-properties' },
                            controls: { $: 'dynamic-controls',
                                controlItems: [
                                    { $: 'studio.non-control-children', path: '%$path%' },
                                    { $: 'filter',
                                        filter: { $: 'not',
                                            of: { $: 'endsWith', endsWith: '~features', text: '%%' }
                                        }
                                    }
                                ],
                                genericControl: { $: 'studio.property-field', path: '%$controlItem%' }
                            },
                            features: { $: 'group.studio-watch-path', path: '%$path%' }
                        },
                        { $: 'group',
                            title: [
                                { $: 'studio.val', path: '%$path%' },
                                { $: 'count', items: '%features%' },
                                'Features (%%)'
                            ],
                            features: { $: 'group.studio-watch-path', path: '%$path%' },
                            controls: [{ $: 'studio-helper.property-array', path: '%$path%~features' }]
                        }
                    ],
                    features: [
                        { $: 'css.width', width: '540' },
                        { $: 'group.dynamic-sub-titles' }
                    ],
                    title: ''
                }
            });
            jb_1.jb.component('studio-helper.property-array', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    $vars: {
                        arrayCtrl: { $: 'object', expanded: true }
                    },
                    controls: [
                        { $: 'group',
                            controls: [
                                { $: 'itemlist',
                                    items: { $: 'studio.array-children', path: '%$path%' },
                                    controls: { $: 'group',
                                        style: { $: 'property-sheet.studio-properties' },
                                        controls: { $: 'studio.property-tgp-in-array', path: '%$arrayItem%' }
                                    },
                                    itemVariable: 'arrayItem',
                                    features: [
                                        { $: 'hidden', showCondition: true },
                                        { $: 'itemlist.divider' },
                                        { $: 'itemlist.drag-and-drop' }
                                    ]
                                }
                            ],
                            title: 'items'
                        },
                        { $: 'button',
                            title: 'new feature',
                            action: { $: 'studio.newArrayItem', path: '%$path%' },
                            style: { $: 'button.md-raised' },
                            features: { $: 'css.margin', top: '20', left: '20' }
                        }
                    ],
                    features: [],
                    style: { $: 'layout.vertical', spacing: '7' }
                }
            });
            jb_1.jb.component('studio-helper.control-tree', {
                type: 'control',
                params: {
                    path: { defaultValue: 'studio-helper.sample-control' }
                },
                impl: { $: 'studio.control-tree',
                    $vars: {
                        simulateProfilePath: '%$path%'
                    }
                }
            });
            jb_1.jb.component('studio-helper.jb-editor', {
                type: 'control',
                params: {
                    path: { defaultValue: 'studio-helper-dummy.label' }
                },
                impl: { $: 'group',
                    $vars: { circuit: 'studio-helper-dummy.label' },
                    title: 'main',
                    controls: [
                        //      {$: 'studio.jb-edit-property', path: '%$path%~title~0' }, 
                        { $: 'studio.jb-editor', path: '%$path%' },
                    ],
                    features: { $: 'css', css: '{ height: 200px; padding: 50px }' }
                }
            });
            jb_1.jb.component('studio-helper.jb-editor-fullpath', {
                type: 'control',
                params: {
                    path: { defaultValue: 'studio-helper.insert-control' }
                },
                impl: { $: 'group',
                    $vars: { circuit: 'studio-helper.insert-control' },
                    title: 'main',
                    controls: [
                        //      {$: 'studio.jb-edit-property', path: '%$path%~title~0' }, 
                        { $: 'studio.jb-editor', path: '%$path%' },
                    ],
                    features: { $: 'css', css: '{ height: 200px; padding: 50px }' }
                }
            });
            jb_1.jb.component('studio-helper.sample-control', {
                type: 'control',
                impl: { $: 'group',
                    title: 'main',
                    controls: [
                        { $: 'group',
                            title: '2.0',
                            controls: [
                                { $: 'label', title: '2.1' },
                                { $: 'button', title: '2.2' }
                            ]
                        },
                        { $: 'label', title: '1.0' }
                    ]
                }
            });
            jb_1.jb.component('studio-helper.edit-style', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'editable-text',
                            title: 'aaa',
                            databind: '%$group-with-custom-style/title%',
                            style: { $: 'editable-text.input' }
                        },
                        { $: 'tabs',
                            tabs: [
                                { $: 'editable-text',
                                    title: 'css',
                                    databind: '%$group-with-custom-style/style/css%',
                                    style: { $: 'editable-text.codemirror' },
                                    features: { $: 'css', css: '{ width: 700px }' }
                                },
                                { $: 'editable-text',
                                    title: 'template',
                                    databind: '%$group-with-custom-style/style/template%',
                                    style: { $: 'editable-text.codemirror' },
                                    features: { $: 'css', css: '{ width: 700px }' }
                                }
                            ]
                        }
                    ]
                }
            });
            jb_1.jb.component('studio-helper.expandable', {
                type: 'control',
                impl: { $: 'group',
                    title: 'expandable',
                    style: { $: 'group.expandable' },
                    controls: [
                        { $: 'label',
                            title: 'label',
                            style: { $: 'label.span' },
                            features: { $: 'css', css: undefined }
                        },
                        { $: 'button',
                            title: 'Hello',
                            style: { $: 'button.md-flat' }
                        }
                    ]
                }
            });
            jb_1.jb.component('studio-helper-dummy.label', {
                type: 'control',
                impl: { $: 'label',
                    title: ['%$people-array/people%',
                        { $filter: '%age% == 42' },
                        '%name%'
                    ],
                    features: [
                        { $: 'css',
                            css: '{ position: absolute; margin-left: -20px; margin-top: 2px }'
                        },
                        { $: 'hidden',
                            showCondition: true
                        }
                    ]
                },
            });
            jb_1.jb.component('studio-helper.group-with-label', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'label',
                            title: ['%$people-array/people%',
                                { $filter: '%age% == 42' },
                                '%name%'
                            ]
                        },
                    ]
                }
            });
            jb_1.jb.component('studio-helper.itemlist-with-find', {
                type: 'control',
                impl: { $: 'group',
                    title: 'itemlist-with-find',
                    controls: [
                        { $: 'editable-text',
                            databind: '%$globals/project_pattern%',
                            style: { $: 'editable-text.md-input' },
                            title: 'search'
                        },
                        { $: 'itemlist',
                            items: [
                                '%$people-array/people%',
                                { $: 'search-filter', pattern: '%$globals/project_pattern%' }
                            ],
                            controls: [
                                { $: 'button',
                                    title: '%name%',
                                    style: { $: 'customStyle',
                                        template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
                                        directives: 'MdButton',
                                        css: 'button { width: 200px; text-align: left }'
                                    }
                                }
                            ],
                            style: { $: 'itemlist.ul-li' }
                        }
                    ]
                }
            });
            jb_1.jb.component('studio-helper.menu-selection', {
                type: 'control',
                impl: { $: 'group',
                    title: 'menu selection',
                    features: { $: 'group.menu-keyboard-selection', autoFocus: true },
                    controls: [
                        { $: 'pulldown.menu-item', title: '1', icon: 'code', action: function (ctx) {
                                return ctx.resources.window.console.log(1);
                            } },
                        { $: 'pulldown.menu-item', title: '2', action: function (ctx) { return ctx.resources.window.console.log(2); } },
                        { $: 'pulldown.menu-item', title: '3', icon: 'delete', action: function (ctx) { return ctx.resources.window.console.log(3); } },
                    ]
                },
            });
            jb_1.jb.component('studio-helper.jb-editor-menu', {
                type: 'control',
                impl: { $: 'studio.jb-editor-menu', path: 'studio-helper-dummy.label' }
            });
            jb_1.jb.component('studio-helper.open-dialog', {
                type: 'control',
                impl: { $: 'group',
                    controls: [
                        { $: 'button',
                            title: 'open dialog',
                            action: { $: 'openDialog',
                                style: { $: 'dialog.md-dialog-ok-cancel' },
                                content: { $: 'group',
                                    controls: [
                                        { $: 'editable-text',
                                            style: { $: 'editable-text.md-input', width: '230' },
                                            features: { $: 'css.margin', top: '19', left: '23' },
                                            title: 'name'
                                        }
                                    ],
                                    features: { $: 'css.margin', top: '', left: '' },
                                    title: ''
                                },
                                modal: false,
                                title: 'new property'
                            }
                        }
                    ]
                }
            });
            jb_1.jb.component('studio-helper.insert-control', {
                type: 'control',
                impl: { $: 'group',
                    title: 'itemlist-with-find',
                    controls: [
                        { $: 'group',
                            style: { $: 'layout.horizontal', spacing: '23' },
                            title: 'buttons',
                            controls: [
                                { $: 'button',
                                    title: 'Insert group',
                                    style: { $: 'button.md-raised' }
                                },
                                { $: 'button',
                                    title: 'Insert editable-text',
                                    style: { $: 'button.md-raised' }
                                },
                                { $: 'button',
                                    title: 'Insert button',
                                    style: { $: 'button.md-raised' },
                                    features: { $: 'css.margin', left: '' }
                                }
                            ],
                            features: { $: 'css.margin', bottom: '7' }
                        },
                        { $: 'editable-text',
                            databind: '%$globals/ctrl_pattern%',
                            title: 'search',
                            style: { $: 'editable-text.md-input' },
                        },
                        { $: 'itemlist-with-heading',
                            items: [
                                { $: 'studio.PTs-of-type', type: 'control' },
                                { $: 'search-filter', pattern: '%$globals/ctrl_pattern%' }
                            ],
                            controls: [
                                { $: 'button',
                                    title: '%%',
                                    style: { $: 'customStyle',
                                        template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
                                        directives: 'MdButton',
                                        css: 'button { width: 300px; text-align: left }'
                                    },
                                }
                            ],
                            groupBy: { $: 'itemlist-heading.group-by' },
                            headingCtrl: { $: 'label',
                                title: '%title%',
                                features: { $: 'css.margin', top: '10' },
                                style: { $: 'label.md-card-title' }
                            }
                        }
                    ],
                    style: { $: 'group.md-card' }
                }
            });
        }
    }
});
