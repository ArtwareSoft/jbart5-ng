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
            jb_core_1.jb.component('studio.openNewCtrlDialog', {
                type: 'action',
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'New Control',
                    style: { $: 'dialog.md-dialog-ok-cancel',
                        features: [
                            { $: 'dialogFeature.autoFocusOnFirstInput' },
                            { $: 'dialogFeature.nearLauncherLocation' }
                        ]
                    },
                    content: { $: 'picklist',
                        databind: '%$dialogData/comp%',
                        options: { $: 'studio.tgp-type-options', type: 'control' },
                        features: { $: 'field.onChange',
                            action: { $: 'closeContainingPopup' }
                        }
                    },
                    onOK: { $runActions: [
                            { $: 'studio.onNextModifiedPath',
                                action: { $: 'studio.openModifiedPath' }
                            },
                            { $: 'studio.insertComp',
                                path: { $: 'studio.currentProfilePath' },
                                comp: '%$dialogData/comp%'
                            }
                        ] }
                }
            });
            jb_core_1.jb.component('studio.onNextModifiedPath', {
                type: 'action',
                params: {
                    action: { type: 'action', dynamic: true, essential: true }
                },
                impl: function (ctx, action) {
                    return studio.modifyOperationsEm.take(1)
                        .subscribe(function (e) {
                        return action(ctx.setVars({ modifiedPath: e.args.modifiedPath }));
                    });
                }
            });
            jb_core_1.jb.component('studio.openModifiedPath', {
                type: 'action',
                impl: { $runActions: [
                        { $: 'writeValue', to: '%$globals/profile_path%', value: '%$modifiedPath%' }
                    ] }
            });
            jb_core_1.jb.component('studio.openNewPage', {
                type: 'action',
                impl: { $: 'openDialog',
                    modal: true,
                    title: 'New Page',
                    style: { $: 'dialog.md-dialog-ok-cancel',
                        features: { $: 'dialogFeature.autoFocusOnFirstInput' }
                    },
                    content: { $: 'editable-text',
                        databind: '%$dialogData/name%',
                        features: { $: 'onEnter', action: { $: 'closeContainingPopup' } }
                    },
                    onOK: function (ctx) {
                        var id = ctx.exp('%$globals/project%.%$dialogData/name%');
                        var profile = {
                            type: 'control',
                            impl: { $: 'group', title: ctx.exp('%$dialogData/name%') }
                        };
                        studio.model.modify(studio.model.newComp, id, { profile: profile }, ctx);
                        ctx.run({ $: 'writeValue', to: '%$globals/page%', value: '%$dialogData/name%' });
                        ctx.run({ $: 'writeValue', to: '%$globals/profile_path%', value: id });
                    }
                }
            });
        }
    }
});
