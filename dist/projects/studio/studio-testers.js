System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', './studio-probe'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx, probe;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (probe_1) {
                probe = probe_1;
            }],
        execute: function() {
            jb_core_1.jb.component('jb-path-test', {
                params: {
                    controlWithMark: { type: 'control', dynamic: true },
                    expectedStaticPath: { as: 'string' },
                    expectedDynamicCounter: { as: 'number' },
                    probeCheck: { type: 'boolean', dynamic: true, as: 'boolean' }
                },
                impl: function (ctx, control, expectedStaticPath, expectedDynamicCounter, probeCheck) {
                    var testId = ctx.vars.testID;
                    // ********** static path
                    var probProf = findProbeProfile(control.profile);
                    if (!probProf)
                        return;
                    var static_path = jb_ui.profilePath(probProf.$parent ? probProf.$parent : probProf);
                    if (probProf.$parent)
                        static_path += '~' + probProf.prop;
                    var staticPathTst = (static_path.split('controlWithMark~')[1] == expectedStaticPath) ? jb_rx.Observable.of(success('static path')) :
                        jb_rx.Observable.of(failure('static path', 'static paths match error: ' + static_path + ' expected ' + expectedStaticPath));
                    // ********** dynamic counter
                    var probeObs = new probe.Probe(static_path, jb_core_1.jb.ctx(ctx, { profile: control.profile, comp: testId, path: '' })).observable();
                    var expectedDynamicCounterTst = probeObs.filter(function (res) { return res.element; })
                        .map(function (res) {
                        try {
                            var path_to_compare = static_path.replace('~controlWithMark', '');
                            var match = Array.from(res.element.querySelectorAll("[jb-path=\"" + path_to_compare + "\"]"));
                        }
                        catch (e) {
                            var match = [];
                        }
                        if (match.length == expectedDynamicCounter)
                            return success('dynamic counter');
                        else
                            return failure('dynamic counter', 'jb-path error: ' + path_to_compare + ' found ' + match.length + ' times. expecting ' + expectedDynamicCounter + ' occurrences');
                    }).take(1);
                    // ********** prob check
                    var probeCheckTst = probeObs.filter(function (res) { return res.finalResult; })
                        .map(function (res) {
                        if (res.finalResult[0] && probeCheck(res.finalResult[0].in))
                            return success('probe');
                        else
                            return failure('probe');
                    }).take(1);
                    return staticPathTst.merge(expectedDynamicCounterTst).merge(probeCheckTst);
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
            jb_core_1.jb.component('studio-test', {
                params: {
                    project: { as: 'string', defaultValue: 'hello-world' },
                    page: { as: 'string', defaultValue: 'group1' },
                    profile_path: { as: 'string', defaultValue: 'hello-world.group1' },
                    control: { type: 'control', dynamic: true },
                    expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
                },
                impl: { $: 'ng2-ui-test',
                    control: { $: 'group',
                        features: [
                            { $: 'feature.init', action: [
                                    { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
                                    { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
                                    { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
                                ]
                            },
                            { $: 'feature.emitter', varName: 'studioTestEm' }
                        ],
                        controls: [
                            { $: 'studio.renderWidget' },
                            { $: 'group',
                                controls: { $: 'group',
                                    features: { $: 'feature.afterLoad', action: { $: 'rx.emit', from: 'ready', to: '%$studioTestEm%' } },
                                    controls: { $call: 'control' }
                                },
                                features: { $: 'group.wait', for: { $: 'studio.waitForPreviewIframe' } }
                            }
                        ]
                    },
                    expectedHtmlResult: { $call: 'expectedHtmlResult' }
                }
            });
            jb_core_1.jb.component('run-studio-test', {
                params: {
                    project: { as: 'string', defaultValue: 'hello-world' },
                    page: { as: 'string', defaultValue: 'group1' },
                    profile_path: { as: 'string', defaultValue: 'hello-world.group1' },
                    control: { dynamic: true },
                },
                impl: { $: 'group',
                    features: { $: 'feature.init', action: [
                            { $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
                            { $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
                            { $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
                        ] },
                    controls: [
                        { $: 'studio.renderWidget' },
                        { $: 'group', controls: { $call: 'control' },
                            atts: { style: 'margin-left: 100px' },
                            features: [
                                { $: 'group.wait', for: { $: 'studio.waitForPreviewIframe' } },
                            ]
                        }
                    ]
                }
            });
        }
    }
});
