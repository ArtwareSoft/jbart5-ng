System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            jb_1.jb.component('ui-tests.show-tests', {
                type: 'control',
                impl: { $: 'group',
                    $vars: {
                        module: function (ctx) {
                            return location.href.split('?module=')[1] || '';
                        },
                        tst: {
                            counter: 0,
                            failures: '',
                        },
                        tests: { $pipeline: ['%$window.jbart.comps%',
                                { $: 'objectToArray' },
                                { $filter: { $: 'studio.is-of-type', type: 'test', path: '%id%' } },
                                { $filter: { $: 'contains', allText: '%id%', text: '.' } },
                                { $filter: { $or: [{ $: 'equals', item1: '%$module%', item2: { $: 'prefix', text: '%id%', separator: '.' } }, { $isEmpty: '%$module%' }] } },
                            ] },
                        parallel_tests: { $pipeline: ['%$tests%',
                                { $filter: false }
                            ] },
                        serial_tests: { $pipeline: ['%$tests%',
                            ] },
                        total: function (ctx) {
                            return ctx.exp('%$tests%')
                                .reduce(function (acc, test) { return acc + (test.val.impl.$ == 'jb-path-test1' ? 2 : 1); }, 0);
                        }
                    },
                    controls: [
                        { $: 'label', title: '{?failures: %$tst/failures%?}',
                            style: { $: 'label.h1' },
                            features: { $: 'css', css: '{ color: red; font-weight: bold }' },
                        },
                        { $: 'label', title: '%$tst/counter% of %$total%' },
                        { $: 'itemlog',
                            counter: '%$tst/counter%',
                            items: { $: 'rxPipe', items: [
                                    '%$parallel_tests%',
                                    // ctx => 
                                    // 	ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl),
                                    { $rxParallelKeepOrder: function (ctx) {
                                            return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val.impl);
                                        } },
                                    { $: 'rx.concat',
                                        items: [
                                            '%$serial_tests%',
                                            function (ctx) {
                                                return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val.impl);
                                            },
                                        ]
                                    },
                                    function (ctx) {
                                        if (!ctx.data.success)
                                            ctx.vars.tst.failures = (ctx.vars.tst.failures || 0) + 1;
                                        return ctx.data;
                                    }
                                ] },
                            controls: { $: 'ui-tests.show-one-test' }
                        }
                    ]
                }
            });
            jb_1.jb.component('ui-tests.single-test', {
                type: 'control',
                impl: { $: 'group',
                    controls: { $: 'itemlog',
                        items: function (ctx) {
                            return ctx.setVars({ testID: jbart.singleTestID }).run(jbart.comps[jbart.singleTestID].impl);
                        },
                        controls: { $: 'ui-tests.show-one-test' }
                    }
                }
            });
            jb_1.jb.component('ui-tests.show-one-test', {
                type: 'control',
                params: [
                    { id: 'testResult', as: 'single', defaultValue: '%%' },
                ],
                impl: { $: 'group',
                    //		layout :{$: 'md-layout', layout: 'row',  },
                    controls: [
                        { $: 'button', title: { $firstSucceeding: ['%$testResult/title%', '%$testResult/id%'] },
                            style: { $: 'button.href' },
                            features: { $: 'css', css: '{ padding: 0 5px 0 5px }' },
                            action: { $: 'goto-url', url: '/projects/ui-tests/single-test.html?test=%$testResult/id%' }
                        },
                        { $: 'label', title: 'success',
                            features: [
                                { $: 'hidden', showCondition: '"%$testResult/success%" == "true"' },
                                { $: 'css', css: '{ color: green; font-weight: bold }' }
                            ]
                        },
                        { $: 'label', title: 'failure',
                            features: [
                                { $: 'hidden', showCondition: '"%$testResult/success%" != "true"' },
                                { $: 'css', css: '{ color: red; font-weight: bold }' }
                            ]
                        },
                        { $: 'label', title: '%$testResult/reason%',
                            features: { $: 'css.padding', left: '15' }
                        },
                        { $: 'button', title: 'sublime',
                            style: { $: 'button.href' },
                            action: { $: 'studio.open-sublime-editor', path: '%$testResult/id%' },
                            features: [
                                { $: 'hidden', showCondition: { $or: ['"%$testResult/success%" != "true"', '%$window.jbart.singleTestID%'] } },
                                { $: 'css.padding', left: '15' },
                            ],
                        },
                    ]
                }
            });
            jb_1.jb.component('ui-tests.show-one-test-in-project', {
                type: 'control',
                impl: { $: 'group',
                    layout: { $: 'md-layout', layout: 'row', },
                    controls: [
                        { $: 'button', title: { $firstSucceeding: ['%title%', '%id%'] },
                            style: { $: 'button.href' },
                            features: { $: 'css', css: '{ padding: 0 5px 0 5px }' },
                            action: [{ $: 'writeValue',
                                    value: '%id%', to: '%$window/jbart/studioGlobals/profile_path%'
                                },
                                function (ctx) {
                                    var studioWin = ctx.resources.window.jbart.studioWindow;
                                    studioWin && studioWin.jbart.zones['studio.all'].run(function () { }); // refresh studio win
                                }
                            ],
                            action2: { $: 'studio.open-jb-editor',
                                $vars: { circuit: '%id%' },
                                path: '%id%',
                            },
                        },
                        { $: 'label', title: 'success',
                            features: [
                                { $: 'hidden', showCondition: '"%success%" == "true"' },
                                { $: 'css', css: '{ color: green; font-weight: bold }' }
                            ]
                        },
                        { $: 'label', title: 'failure',
                            features: [
                                { $: 'hidden', showCondition: '"%success%" != "true"' },
                                { $: 'css', css: '{ color: red; font-weight: bold }' }
                            ]
                        },
                        { $: 'label', title: '%reason%',
                            features: { $: 'css.padding', left: '15' }
                        },
                    ]
                }
            });
        }
    }
});
