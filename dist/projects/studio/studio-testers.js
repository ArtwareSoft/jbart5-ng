System.register(['jb-core', './studio-probe', './studio-suggestions', './studio-tgp-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_probe_1, studio_suggestions_1, studio_tgp_model_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_probe_1_1) {
                studio_probe_1 = studio_probe_1_1;
            },
            function (studio_suggestions_1_1) {
                studio_suggestions_1 = studio_suggestions_1_1;
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('suggestions-test', {
                type: 'test',
                params: [
                    { id: 'expression', as: 'string' },
                    { id: 'selectionStart', as: 'number', defaultValue: -1 },
                    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
                ],
                impl: { $: 'data-test',
                    calculate: function (ctx) {
                        var params = ctx.componentContext.params;
                        var selectionStart = params.selectionStart == -1 ? params.expression.length : params.selectionStart;
                        var obj = new studio_suggestions_1.suggestions({ value: params.expression, selectionStart: selectionStart })
                            .extendWithOptions(ctx);
                        return JSON.stringify(JSON.stringify(obj.options.map(function (x) { return x.text; })));
                    },
                    expectedResult: { $call: 'expectedResult' }
                },
            });
            jb_core_1.jb.component('studio-tree-children-test', {
                type: 'test',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'childrenType', as: 'string', type: ',jb-editor' },
                    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
                ],
                impl: { $: 'data-test',
                    calculate: function (ctx) {
                        var params = ctx.componentContext.params;
                        var mdl = new studio_tgp_model_1.TgpModel('', params.childrenType);
                        var titles = mdl.children(params.path)
                            .map(function (path) {
                            return mdl.title(path, true);
                        });
                        return JSON.stringify(titles);
                    },
                    expectedResult: { $call: 'expectedResult' }
                },
            });
            jb_core_1.jb.component('jb-path-test', {
                type: 'test',
                params: [
                    { id: 'controlWithMark', type: 'control', dynamic: true },
                    { id: 'staticPath', as: 'string' },
                    { id: 'expectedDynamicCounter', as: 'number' },
                    { id: 'probeCheck', type: 'boolean', dynamic: true, as: 'boolean' }
                ],
                impl: function (ctx, control, staticPath, expectedDynamicCounter, probeCheck) {
                    var testId = ctx.vars.testID;
                    var probProf = findProbeProfile(control.profile);
                    if (!probProf)
                        return failure('no prob prof');
                    // ********** dynamic counter
                    var full_path = testId + '~' + staticPath;
                    var probeRes = new studio_probe_1.Probe(jb_core_1.jb.ctx(ctx, { profile: control.profile, comp: testId, path: '' }), true)
                        .runCircuit(full_path);
                    return probeRes.then(function (res) {
                        try {
                            var match = Array.from(res.element.querySelectorAll('[jb-ctx]'))
                                .filter(function (e) {
                                var ctx2 = jbart.ctxDictionary[e.getAttribute('jb-ctx')];
                                return ctx2.path == full_path || (ctx2.componentContext && ctx2.componentContext.callerPath == full_path);
                            });
                            if (match.length != expectedDynamicCounter)
                                return failure('dynamic counter', 'jb-path error: ' + staticPath + ' found ' + (match || []).length + ' times. expecting ' + expectedDynamicCounter + ' occurrences');
                            if (!res.finalResult[0] || !probeCheck(res.finalResult[0].in))
                                return failure('probe');
                        }
                        catch (e) {
                            return failure('exception');
                        }
                        return success();
                    });
                    function failure(part, reason) { return { id: testId, title: testId + '- ' + part, success: false, reason: reason }; }
                    ;
                    function success() { return { id: testId, title: testId, success: true }; }
                    ;
                    function findProbeProfile(parent) {
                        if (parent.$mark)
                            return parent;
                        if (typeof parent == 'object')
                            return jb_core_1.jb.entries(parent)
                                .map(function (e) { return ({
                                prop: e[0],
                                res: findProbeProfile(e[1])
                            }); })
                                .map(function (e) {
                                return (e.res == 'markInString') ? ({ $parent: parent, $prop: e.prop }) : e.res;
                            })
                                .filter(function (x) { return x; })[0];
                        if (typeof parent == 'string' && parent.indexOf('$mark:') == 0)
                            return 'markInString';
                    }
                }
            });
        }
    }
});
