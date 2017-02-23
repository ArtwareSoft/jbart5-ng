function () {
    var model = jbStudioModel;
    jb.component('studio.short-title', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.shortTitle(path); }
    });
    jb.component('studio.val', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.val(path);
        }
    });
    jb.component('studio.is-primitive-value', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return typeof model.val(path) == 'string';
        }
    });
    jb.component('studio.is-of-type', {
        params: [
            { id: 'path', as: 'string', essential: true },
            { id: 'type', as: 'string', essential: true },
        ],
        impl: function (context, path, _type) {
            return model.isOfType(path, _type);
        }
    });
    jb.component('studio.PTs-of-type', {
        params: [
            { id: 'type', as: 'string', essential: true },
        ],
        impl: function (context, _type) {
            return model.PTsOfType(_type);
        }
    });
    jb.component('studio.categories-of-type', {
        params: [
            { id: 'type', as: 'string', essential: true },
        ],
        impl: function (context, _type) {
            var comps = (jbart.previewjbart || jbart).comps;
            var pts = model.PTsOfType(_type);
            var categories = Array.concat.apply([], pts.map(function (pt) {
                return (comps[pt].categories || '').split(',').concat(pt.split('.')[0])
                    .filter(function (x) { return x; });
            }))
                .filter(jb_unique(function (x) { return x; }))
                .map(function (c) { return ({
                name: c,
                pts: ptsOfCategory(c)
            }); });
            function ptsOfCategory(category) {
                var pts_with_marks = pts.filter(function (pt) {
                    return pt.pt.split('.')[0] == category ||
                        (comps[pt.pt].categories || '').split(',').map(function (x) { return x.split(':')[0]; }).indexOf(category) == 0;
                })
                    .map(function (pt) { return ({
                    pt: pt,
                    mark: (comps[pt].categories || '').split(',')
                        .filter(function (c) { return indexOf(category) == 0; })
                        .map(function (c) { return Number(c.split(':')[1] || 50); })[0]
                }); });
                pts_with_marks.sort(function (c1, c2) { return c1.mark - c2.mark; });
                return pts_with_marks.map(function (pt) { return pt.pt; });
            }
        }
    });
    jb.component('studio.short-title', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.shortTitle(path);
        }
    });
    jb.component('studio.summary', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.summary(path);
        }
    });
    jb.component('studio.has-param', {
        params: [
            { id: 'path', as: 'string' },
            { id: 'param', as: 'string' },
        ],
        impl: function (context, path, param) {
            return model.paramDef(path + '~' + param);
        }
    });
    jb.component('studio.non-control-children', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.children(path, 'non-controls');
        }
    });
    jb.component('studio.array-children', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.children(path, 'array');
        }
    });
    jb.component('studio.comp-name', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.compName(path) || ''; }
    });
    jb.component('studio.param-def', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.paramDef(path); }
    });
    jb.component('studio.enum-options', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return ((model.paramDef(path) || {}).options || '').split(',').map(function (x) { return { code: x, text: x }; });
        }
    });
    jb.component('studio.prop-name', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.propName(path);
        }
    });
    jb.component('studio.more-params', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.jbEditorMoreParams(path);
        }
    });
    jb.component('studio.comp-name-ref', {
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return {
                $jb_val: function (value) {
                    if (typeof value == 'undefined')
                        return model.compName(path);
                    else
                        model.modify(model.setComp, path, { comp: value }, context);
                }
            };
        }
    });
    jb.component('studio.insert-comp', {
        type: 'action',
        params: [
            { id: 'path', as: 'string' },
            { id: 'comp', as: 'string' },
        ],
        impl: function (context, path, comp) {
            return model.modify(model.insertComp, path, { comp: comp }, context);
        }
    });
    jb.component('studio.wrap', {
        type: 'action',
        params: [
            { id: 'path', as: 'string' },
            { id: 'compName', as: 'string' }
        ],
        impl: function (context, path, compName) {
            return model.modify(model.wrap, path, { compName: compName }, context);
        }
    });
    jb.component('studio.wrap-with-group', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.modify(model.wrapWithGroup, path, {}, context);
        }
    });
    jb.component('studio.add-property', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.modify(model.addProperty, path, {}, context);
        }
    });
    jb.component('studio.duplicate', {
        type: 'action',
        params: [
            { id: 'path', as: 'string' },
        ],
        impl: function (context, path) {
            return model.modify(model.duplicate, path, {}, context);
        }
    });
    jb.component('studio.move-in-array', {
        type: 'action',
        params: [
            { id: 'path', as: 'string' },
            { id: 'moveUp', type: 'boolean', as: 'boolean' }
        ],
        impl: function (context, path, moveUp) {
            return model.modify(model.moveInArray, path, { moveUp: moveUp }, context, true);
        }
    });
    jb.component('studio.new-array-item', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) {
            return model.modify(model.addArrayItem, path, {}, context, true);
        }
    });
    jb.component('studio.add-array-item', {
        type: 'action',
        params: [
            { id: 'path', as: 'string' },
            { id: 'toAdd' }
        ],
        impl: function (context, path, toAdd) {
            return model.modify(model.addArrayItem, path, { toAdd: toAdd }, context, true);
        }
    });
    jb.component('studio.delete', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.modify(model._delete, path, {}, context, true); }
    });
    jb.component('studio.make-local', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.modify(model.makeLocal, path, { ctx: context }, context, true); }
    });
    jb.component('studio.make-local', {
        type: 'action',
        params: [{ id: 'path', as: 'string' }],
        impl: function (context, path) { return model.modify(model.makeLocal, path, { ctx: context }, context, true); }
    });
    jb.component('studio.components-statistics', {
        type: 'data',
        impl: function (ctx) {
            var refs = {};
            Object.getOwnPropertyNames(jbart.comps).forEach(function (k) {
                return refs[k] = { refs: calcRefs(jbart.comps[k].impl), by: [] };
            });
            Object.getOwnPropertyNames(jbart.comps).forEach(function (k) {
                return refs[k].refs.forEach(function (cross) {
                    return refs[cross] && refs[cross].by.push(k);
                });
            });
            var cmps = Object.getOwnPropertyNames(jbart.comps)
                .map(function (k) { return jbart.comps[k]; })
                .map(function (comp) { return ({
                id: k,
                refs: refs[k].refs,
                referredBy: refs[k].by,
                type: jbart.comps[k].type,
                implType: typeof jbart.comps[k].impl,
                text: jb_prettyPrintComp(jbart.comps[k]),
                size: jb_prettyPrintComp(jbart.comps[k]).length
            }); });
            function calcRefs(profile) {
                return Object.getOwnPropertyNames(profile).reduce(function (res, prop) {
                    return res.concat(calcRefs, profile[prop]);
                }, [jb.compName(profile)]);
            }
        }
    });
}
();
