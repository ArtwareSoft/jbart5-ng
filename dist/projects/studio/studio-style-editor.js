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
            jb_core_1.jb.component('studio.open-style-editor', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    $vars: {
                        styleSource: { $: 'studio.style-source', path: '%$path%' }
                    },
                    title: 'Style Editor - %$styleSource/path%',
                    style: { $: 'dialog.studio-floating', id: 'style editor' },
                    content: { $: 'studio.style-editor', path: '%$path%' },
                    menu: { $: 'button',
                        title: 'style menu',
                        style: { $: 'button.md-icon', icon: 'menu' },
                        action: { $: 'studio.open-style-menu', path: '%$path%' }
                    }
                }
            });
            jb_core_1.jb.component('studio.open-style-menu', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'pulldownPopup.contextMenuPopup' },
                    content: { $: 'group',
                        controls: [
                            { $: 'pulldown.menu-item',
                                title: 'Clone as local style',
                                icon: 'build',
                                action: [
                                    { $: 'studio.make-local', path: '%$path%' },
                                    { $: 'studio.open-style-editor', path: '%$styleSource/innerPath%' },
                                    { $: 'studio.open-properties' },
                                ],
                                features: { $: 'hidden', showCondition: "%$styleSource/type% == 'global'" },
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Extract style as a reusable component',
                                icon: 'build',
                                action: { $: 'studio.open-make-global-style', path: '%$path%' },
                                features: { $: 'hidden', showCondition: "%$styleSource/type% == 'inner'" },
                            },
                            { $: 'pulldown.menu-item',
                                title: 'Format css',
                                action: { $: 'writeValue',
                                    to: { $: 'studio.profile-as-text', path: '%$styleSource/path%~css', stringOnly: true },
                                    value: { $: 'studio.format-css',
                                        css: { $: 'studio.profile-as-text', path: '%$styleSource/path%~css' }
                                    }
                                }
                            }
                        ]
                    }
                }
            });
            jb_core_1.jb.component('studio.style-editor', {
                type: 'control',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'group',
                    style: { $: 'property-sheet.titles-above' },
                    controls: [
                        { $: 'editable-text',
                            title: 'css',
                            databind: { $: 'studio.profile-as-text', path: '%$styleSource/path%~css', stringOnly: true },
                            features: { $: 'studio.undo-support', path: '%styleSource/path%' },
                            style: { $: 'editable-text.codemirror', mode: 'css', height: 300 }
                        },
                        { $: 'editable-text',
                            title: 'template',
                            databind: { $: 'studio.profile-as-text', path: '%$styleSource/path%~template', stringOnly: true },
                            style: { $: 'editable-text.codemirror', mode: 'htmlmixed', height: '200' },
                            features: { $: 'studio.undo-support', path: '%$styleSource/path%' }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.style-source', {
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    return studio.model.getStyleComp(path);
                }
            });
            jb_core_1.jb.component('studio.format-css', {
                params: {
                    css: { as: 'string' }
                },
                impl: function (ctx, css) {
                    return css
                        .replace(/{\s*/g, '{ ')
                        .replace(/;\s*/g, ';\n')
                        .replace(/}[^$]/mg, '}\n\n')
                        .replace(/^\s*/mg, '');
                }
            });
            jb_core_1.jb.component('studio.open-make-global-style', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'Style Name',
                    style: { $: 'dialog.md-dialog-ok-cancel',
                        features: { $: 'dialogFeature.autoFocusOnFirstInput' }
                    },
                    content: { $: 'editable-text',
                        databind: '%$dialogData/name%',
                        features: { $: 'onEnter', action: { $: 'closeContainingPopup' } }
                    },
                    onOK: function (ctx) {
                        debugger;
                        var path = ctx.componentContext.params.path;
                        var id = ctx.exp('%$globals/project%.%$dialogData/name%');
                        var profile = {
                            type: studio.model.paramDef(path).type,
                            impl: studio.model.val(path)
                        };
                        studio.model.modify(studio.model.newComp, id, { profile: profile }, ctx);
                        studio.model.modify(studio.model.writeValue, path, { value: { $: id } }, ctx);
                    }
                }
            });
        }
    }
});
