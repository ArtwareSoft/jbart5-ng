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
            jb_core_1.jb.component('studio.editSource', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                ],
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
                params: [
                    { id: 'path', as: 'string', dynamic: true },
                ],
                impl: function (ctx) { return ({
                    $jb_val: function (value) {
                        var path = ctx.params.path();
                        if (!path)
                            return;
                        if (typeof value == 'undefined') {
                            var val = studio_tgp_model_1.model.val(path);
                            if (typeof val == 'string')
                                return val;
                            return jb_core_1.jb.prettyPrint(val);
                        }
                        else {
                            var newVal = value.match(/^\s*({|\[)/) ? studio_utils_1.evalProfile(value) : value;
                            if (newVal != null)
                                studio_tgp_model_1.model.modify(studio_tgp_model_1.model.writeValue, path, { value: newVal }, ctx);
                        }
                    }
                }); }
            });
            jb_core_1.jb.component('studio.string-property-ref', {
                type: 'data',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (context, path, stringOnly) { return ({
                    $jb_val: function (value) {
                        if (typeof value == 'undefined') {
                            return studio_tgp_model_1.model.val(path);
                        }
                        else {
                            studio_tgp_model_1.model.modify(studio_tgp_model_1.model.writeValue, path, { value: newVal }, context);
                        }
                    }
                }); }
            });
            jb_core_1.jb.component('studio.goto-sublime', {
                type: 'control',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: { $: 'dynamic-controls',
                    controlItems: { $: 'studio.goto-targets', path: '%$path%' },
                    genericControl: { $: 'pulldown.menu-item',
                        title: { $pipeline: [
                                '%$controlItem%',
                                { $: 'split', separator: '~', part: 'first' },
                                'goto sublime: %%'
                            ] },
                        action: { $: 'studio.open-sublime-editor', path: '%$controlItem%' }
                    }
                },
            });
            jb_core_1.jb.component('studio.goto-targets', {
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (ctx, path) {
                    return [studio_tgp_model_1.model.compName(path), path]
                        .filter(function (x) { return x; })
                        .map(function (x) {
                        return x.split('~')[0];
                    })
                        .filter(jb_unique(function (x) { return x; }));
                }
            });
            jb_core_1.jb.component('studio.open-sublime-editor', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (ctx, path) {
                    path && $.ajax("/?op=gotoSource&comp=" + path.split('~')[0]);
                }
            });
        }
    }
});
