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
            jb_core_1.jb.component('studio.openNewCtrlDialog', {
                type: 'action',
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-floating' },
                    content: { $: 'group',
                        title: 'itemlist-with-find',
                        style: { $: 'layout.vertical', spacing: 3 },
                        controls: [
                            { $: 'editable-text',
                                title: 'search',
                                databind: '%$globals/ctrl_pattern%',
                                style: { $: 'editable-text.md-input' }
                            },
                            { $: 'itemlist-with-groups',
                                items: [
                                    { $: 'studio.PTs-of-type', type: 'control' },
                                    { $: 'search-filter', pattern: '%$globals/ctrl_pattern%' }
                                ],
                                controls: [
                                    { $: 'button',
                                        title: '%%',
                                        action: {
                                            $runActions: [
                                                { $: 'studio.onNextModifiedPath',
                                                    action: [
                                                        { $: 'closeContainingPopup' },
                                                        { $: 'studio.openModifiedPath' },
                                                        { $: 'studio.refreshPreview' }
                                                    ]
                                                },
                                                { $: 'studio.insertComp',
                                                    path: { $: 'studio.currentProfilePath' },
                                                    comp: '%%'
                                                }
                                            ]
                                        },
                                        style: { $: 'customStyle',
                                            template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
                                            css: 'button { width: 300px; text-align: left }',
                                            directives: 'MdButton'
                                        }
                                    }
                                ],
                                groupBy: { $: 'itemlist-heading.group-by' },
                                headingCtrl: { $: 'label',
                                    title: '%title%',
                                    style: { $: 'label.h2' },
                                    features: [{ $: 'css.margin', top: '10' }]
                                },
                                features: { $: 'css.height', height: '400', overflow: 'scroll', minMax: '' }
                            }
                        ],
                        features: [{ $: 'css.margin', top: '10', left: '20' }]
                    },
                    title: 'New Control',
                    modal: true,
                    features: [
                        { $: 'css.height', height: '420', overflow: 'hidden' },
                        { $: 'css.width', width: '350', overflow: 'hidden' },
                        { $: 'dialog-feature.dragTitle', id: 'new control' },
                        { $: 'dialog-feature.nearLauncherLocation', offsetLeft: 0, offsetTop: 0 }
                    ]
                }
            });
            jb_core_1.jb.component('studio.onNextModifiedPath', {
                type: 'action',
                params: [
                    { id: 'action', type: 'action', dynamic: true, essential: true }
                ],
                impl: function (ctx, action) {
                    return studio_utils_1.modifyOperationsEm.take(1)
                        .subscribe(function (e) {
                        return action(ctx.setVars({ modifiedPath: e.args.modifiedPath }));
                    });
                }
            });
            jb_core_1.jb.component('studio.openModifiedPath', {
                type: 'action',
                impl: { $runActions: [
                        { $: 'writeValue', to: '%$globals/profile_path%', value: '%$modifiedPath%' },
                        { $: 'studio.open-properties' },
                        { $: 'studio.open-control-tree' },
                    ] }
            });
            jb_core_1.jb.component('studio.openNewPage', {
                type: 'action',
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'New Page',
                    style: { $: 'dialog.md-dialog-ok-cancel',
                        features: { $: 'dialog-feature.autoFocusOnFirstInput' }
                    },
                    content: { $: 'group',
                        controls: [
                            { $: 'editable-text',
                                databind: '%$dialogData/name%',
                                features: { $: 'onEnter',
                                    action: { $: 'closeContainingPopup' }
                                },
                                title: 'page name',
                                style: { $: 'editable-text.md-input' }
                            }
                        ],
                        features: { $: 'css.padding', top: '14', left: '11' },
                        style: { $: 'group.div' }
                    },
                    onOK: function (ctx) {
                        var id = ctx.exp('%$globals/project%.%$dialogData/name%');
                        var profile = {
                            type: 'control',
                            impl: { $: 'group', title: ctx.exp('%$dialogData/name%') }
                        };
                        studio_tgp_model_1.model.modify(studio_tgp_model_1.model.newComp, id, { profile: profile }, ctx);
                        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
                        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
                    }
                }
            });
        }
    }
});
