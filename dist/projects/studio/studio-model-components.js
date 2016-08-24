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
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio_tgp_model_1.model.shortTitle(path); }
            });
            jb_core_1.jb.component('studio.val', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.val(path);
                }
            });
            jb_core_1.jb.component('studio.is-primitive-value', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return typeof studio_tgp_model_1.model.val(path) == 'string';
                }
            });
            jb_core_1.jb.component('studio.is-of-type', {
                params: {
                    path: { as: 'string', essential: true },
                    type: { as: 'string', essential: true },
                },
                impl: function (context, path, _type) {
                    return studio_tgp_model_1.model.isOfType(path, _type);
                }
            });
            jb_core_1.jb.component('studio.PTs-of-type', {
                params: {
                    type: { as: 'string', essential: true },
                },
                impl: function (context, _type) {
                    return studio_tgp_model_1.model.PTsOfType(_type);
                }
            });
            jb_core_1.jb.component('studio.short-title', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.shortTitle(path);
                }
            });
            jb_core_1.jb.component('studio.has-param', {
                params: {
                    path: { as: 'string' },
                    param: { as: 'string' },
                },
                impl: function (context, path, param) {
                    return studio_tgp_model_1.model.paramDef(path + '~' + param);
                }
            });
            jb_core_1.jb.component('studio.non-control-children', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.children(path, 'non-controls');
                }
            });
            jb_core_1.jb.component('studio.array-children', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.children(path, 'array');
                }
            });
            jb_core_1.jb.component('studio.compName', {
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio_tgp_model_1.model.compName(path) || ''; }
            });
            jb_core_1.jb.component('studio.paramDef', {
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio_tgp_model_1.model.paramDef(path); }
            });
            jb_core_1.jb.component('studio.enum-options', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return ((studio_tgp_model_1.model.paramDef(path) || {}).options || '').split(',').map(function (x) { return { code: x, text: x }; });
                }
            });
            jb_core_1.jb.component('studio.prop-name', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.propName(path);
                }
            });
            jb_core_1.jb.component('studio.more-params', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.jbEditorMoreParams(path);
                }
            });
            jb_core_1.jb.component('studio.compName-ref', {
                params: { path: { as: 'string' } },
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
            jb_core_1.jb.component('studio.insertComp', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    comp: { as: 'string' },
                },
                impl: function (context, path, comp) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.insertComp, path, { comp: comp }, context);
                }
            });
            jb_core_1.jb.component('studio.wrap', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    compName: { as: 'string' }
                },
                impl: function (context, path, compName) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.wrap, path, { compName: compName }, context);
                }
            });
            jb_core_1.jb.component('studio.wrapWithGroup', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.wrapWithGroup, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.addProperty', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.addProperty, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.wrapWithPipeline', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.wrapWithPipeline, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.duplicate', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.duplicate, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.moveInArray', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    moveUp: { type: 'boolean', as: 'boolean' }
                },
                impl: function (context, path, moveUp) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.moveInArray, path, { moveUp: moveUp }, context);
                }
            });
            jb_core_1.jb.component('studio.newArrayItem', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.addArrayItem, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.delete', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio_tgp_model_1.model.modify(studio_tgp_model_1.model._delete, path, {}, context); }
            });
            jb_core_1.jb.component('studio.make-local', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio_tgp_model_1.model.modify(studio_tgp_model_1.model.makeLocal, path, { ctx: context }, context); }
            });
        }
    }
});
