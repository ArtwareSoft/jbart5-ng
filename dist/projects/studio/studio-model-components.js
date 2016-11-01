System.register(['jb-core', './studio-tgp-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_tgp_model_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.short-title', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) { return studio_tgp_model_1.model.shortTitle(path); }
            });
            jb_core_1.jb.component('studio.val', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.val(path);
                }
            });
            jb_core_1.jb.component('studio.is-primitive-value', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return typeof studio_tgp_model_1.model.val(path) == 'string';
                }
            });
            jb_core_1.jb.component('studio.is-of-type', {
                params: [
                    { id: 'path', as: 'string', essential: true },
                    { id: 'type', as: 'string', essential: true },
                ],
                impl: function (context, path, _type) {
                    return studio_tgp_model_1.model.isOfType(path, _type);
                }
            });
            jb_core_1.jb.component('studio.PTs-of-type', {
                params: [
                    { id: 'type', as: 'string', essential: true },
                ],
                impl: function (context, _type) {
                    return studio_tgp_model_1.model.PTsOfType(_type);
                }
            });
            jb_core_1.jb.component('studio.short-title', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.shortTitle(path);
                }
            });
            jb_core_1.jb.component('studio.has-param', {
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'param', as: 'string' },
                ],
                impl: function (context, path, param) {
                    return studio_tgp_model_1.model.paramDef(path + '~' + param);
                }
            });
            jb_core_1.jb.component('studio.non-control-children', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.children(path, 'non-controls');
                }
            });
            jb_core_1.jb.component('studio.array-children', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.children(path, 'array');
                }
            });
            jb_core_1.jb.component('studio.comp-name', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) { return studio_tgp_model_1.model.compName(path) || ''; }
            });
            jb_core_1.jb.component('studio.param-def', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) { return studio_tgp_model_1.model.paramDef(path); }
            });
            jb_core_1.jb.component('studio.enum-options', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return ((studio_tgp_model_1.model.paramDef(path) || {}).options || '').split(',').map(function (x) { return { code: x, text: x }; });
                }
            });
            jb_core_1.jb.component('studio.prop-name', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.propName(path);
                }
            });
            jb_core_1.jb.component('studio.more-params', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.jbEditorMoreParams(path);
                }
            });
            jb_core_1.jb.component('studio.comp-name-ref', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return studio_tgp_model_1.model.compName(path);
                            else
                                studio_tgp_model_1.model.modify(studio_tgp_model_1.model.setComp, path, { comp: value }, context);
                        }
                    };
                }
            });
            jb_core_1.jb.component('studio.insert-comp', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'comp', as: 'string' },
                ],
                impl: function (context, path, comp) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.insertComp, path, { comp: comp }, context);
                }
            });
            jb_core_1.jb.component('studio.wrap', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'compName', as: 'string' }
                ],
                impl: function (context, path, compName) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.wrap, path, { compName: compName }, context);
                }
            });
            jb_core_1.jb.component('studio.wrap-with-group', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.wrapWithGroup, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.add-property', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.addProperty, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.duplicate', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.duplicate, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.move-in-array', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'moveUp', type: 'boolean', as: 'boolean' }
                ],
                impl: function (context, path, moveUp) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.moveInArray, path, { moveUp: moveUp }, context, true);
                }
            });
            jb_core_1.jb.component('studio.new-array-item', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.addArrayItem, path, {}, context, true);
                }
            });
            jb_core_1.jb.component('studio.add-array-item', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'toAdd' }
                ],
                impl: function (context, path, toAdd) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.addArrayItem, path, { toAdd: toAdd }, context, true);
                }
            });
            jb_core_1.jb.component('studio.delete', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) { return studio_tgp_model_1.model.modify(studio_tgp_model_1.model._delete, path, {}, context, true); }
            });
            jb_core_1.jb.component('studio.make-local', {
                type: 'action',
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) { return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.makeLocal, path, { ctx: context }, context, true); }
            });
        }
    }
});
