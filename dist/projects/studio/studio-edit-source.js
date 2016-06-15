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
            jb_core_1.jb.component('studio.editSource', {
                type: 'action',
                impl: {
                    $: 'openDialog',
                    title: { $: 'studio.short-title', path: { $: 'studio.currentProfilePath' } },
                    style: { $: 'dialog.studio-floating', id: 'edit source', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.currentProfileAsScript' },
                        style: { $: 'editable-text.codemirror', mode: 'javascript' },
                        features: { $: 'studio.undo-support', path: '%$path%' },
                    }
                }
            });
            jb_core_1.jb.component('studio.currentProfileAsScript', {
                type: 'data',
                params: {
                    path: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                },
                impl: function (context, path) {
                    var ref = studio.profileRefFromPath(path);
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return jb_core_1.jb.prettyPrint(jb_core_1.jb.val(ref));
                            else {
                                var newProf = studio.evalProfile(value);
                                if (newProf)
                                    studio.model.modify(studio.model.writeValue, path, { value: newProf }, context);
                            }
                        }
                    };
                }
            });
            jb_core_1.jb.component('studio.openSublime', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    return studio.model.compName(path) && $.ajax("/?op=gotoSource&comp=" + studio.model.compName(path));
                }
            });
        }
    }
});
