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
                params: {
                    path: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                },
                impl: {
                    $: 'openDialog',
                    title: { $: 'studio.short-title', path: '%$path%' },
                    style: { $: 'dialog.studio-floating', id: 'edit source', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.profile-as-text', path: '%$path%' },
                        style: { $: 'editable-text.codemirror', mode: 'javascript' },
                        features: { $: 'studio.undo-support', path: '%$path%' },
                    }
                }
            });
            jb_core_1.jb.component('studio.profile-as-text', {
                type: 'data',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path, stringOnly) { return ({
                    $jb_val: function (value) {
                        if (typeof value == 'undefined') {
                            var val = studio.model.val(path);
                            if (typeof val == 'string')
                                return val;
                            return jb_core_1.jb.prettyPrint(val);
                        }
                        else {
                            var newVal = value.match(/^\s*({|\[)/) ? studio.evalProfile(value) : value;
                            if (newVal != null)
                                studio.model.modify(studio.model.writeValue, path, { value: newVal }, context);
                        }
                    }
                }); }
            });
            jb_core_1.jb.component('studio.string-property-ref', {
                type: 'data',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path, stringOnly) { return ({
                    $jb_val: function (value) {
                        if (typeof value == 'undefined') {
                            return studio.model.val(path);
                        }
                        else {
                            studio.model.modify(studio.model.writeValue, path, { value: newVal }, context);
                        }
                    }
                }); }
            });
            jb_core_1.jb.component('studio.goto-sublime', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    var compName = path.indexOf('~') == -1 ? path : studio.model.compName(path);
                    compName && $.ajax("/?op=gotoSource&comp=" + compName);
                }
            });
        }
    }
});
