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
                params: {
                    expression: { as: 'string' },
                    selectionStart: { as: 'number', defaultValue: -1 },
                    expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
                },
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
                params: {
                    path: { as: 'string' },
                    childrenType: { as: 'string', type: ',jb-editor' },
                    expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
                },
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
                params: {
                    controlWithMark: { type: 'control', dynamic: true },
                    staticPath: { as: 'string' },
                    expectedDynamicCounter: { as: 'number' },
                    probeCheck: { type: 'boolean', dynamic: true, as: 'boolean' }
                },
                impl: function (ctx, control, staticPath, expectedDynamicCounter, probeCheck) {
                    var testId = ctx.vars.testID;
                    // ********** static path
                    var probProf = findProbeProfile(control.profile);
                    if (!probProf)
                        return;
                    // var static_path = jb_ui.profilePath(probProf.$parent ? probProf.$parent : probProf);
                    // if (probProf.$parent)
                    //   static_path += '~' + probProf.$prop;
                    // var static_path = static_path.replace('~controlWithMark','');
                    // var staticPathTst = (static_path.split('controlWithMark~')[1] == staticPath) ? jb_rx.Observable.of(success('static path')) :
                    //   jb_rx.Observable.of(failure('static path','static paths match error: ' + staticPathTst + ' expected ' + staticPath ));
                    // ********** dynamic counter
                    var static_path = testId + '~' + staticPath;
                    var probeObs = new studio_probe_1.Probe(static_path, jb_core_1.jb.ctx(ctx, { profile: control.profile, comp: testId, path: '' }), true).observable();
                    var expectedDynamicCounterTst = probeObs.filter(function (res) { return res.element; })
                        .map(function (res) {
                        try {
                            var match = Array.from(res.element.querySelectorAll("[jb-path=\"" + static_path + "\"]"));
                        }
                        catch (e) {
                            var match = [];
                        }
                        if (match.length == expectedDynamicCounter)
                            return success('dynamic counter');
                        else
                            return failure('dynamic counter', 'jb-path error: ' + staticPath + ' found ' + match.length + ' times. expecting ' + expectedDynamicCounter + ' occurrences');
                    }).take(1);
                    // ********** prob check
                    var probeCheckTst = probeObs.filter(function (res) { return res.finalResult; })
                        .map(function (res) {
                        if (res.finalResult[0] && probeCheck(res.finalResult[0].in))
                            return success('probe');
                        else {
                            debugger;
                            return failure('probe');
                        }
                    }).take(1);
                    return expectedDynamicCounterTst.merge(probeCheckTst);
                    function failure(part, reason) { return { id: testId, title: testId + '- ' + part, success: false, reason: reason }; }
                    ;
                    function success(part) { return { id: testId, title: testId + '- ' + part, success: true }; }
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
// jb.component('studio-test', {
//   params: {
//     project : { as: 'string', defaultValue: 'hello-world'},
//     page : { as: 'string', defaultValue: 'group1'},
//     profile_path: { as: 'string', defaultValue: 'hello-world.group1'},
//     control: { type: 'control', dynamic: true },
//     expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
//   },
//   impl :{$: 'ng2-ui-test', 
//     control :{$: 'group',
//       features :
//         [ 
//           { $: 'feature.init', action:
//             [
//               { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
//               { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
//               { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
//             ]
//           },
//           { $: 'feature.emitter', varName: 'studioTestEm' }
//         ],
//       controls: [
//         { $: 'studio.renderWidget' },
//         { $: 'group', 
//             controls :{$: 'group',
//                 features :{$: 'feature.afterLoad', action :{$: 'rx.emit', from: 'ready', to: '%$studioTestEm%' }},
//                 controls :{$call: 'control' } 
//             },
//             features :{$: 'group.wait', for :{$: 'studio.waitForPreviewIframe' }}
//         }
//       ]
//     },
//     expectedHtmlResult: { $call: 'expectedHtmlResult' }
//   }
// })
// jb.component('run-studio-test', {
//   params: { 
//     project : { as: 'string', defaultValue: 'hello-world'},
//     page : { as: 'string', defaultValue: 'group1'},
//     profile_path: { as: 'string', defaultValue: 'hello-world.group1'},
//     control : { dynamic: true },
//   },
//   impl :{$: 'group',
//     features :{$: 'feature.init', action: [
//       { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
//       { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
//       { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
//     ] },
//     controls: [
//       { $: 'studio.renderWidget' },
//       { $: 'group', controls: { $call: 'control' }, 
//           atts: {style: 'margin-left: 100px'},
//           features : [
//             { $: 'group.wait', for :{$: 'studio.waitForPreviewIframe' }},
//           ]
//         }
//     ]
//   }
// })
//  
