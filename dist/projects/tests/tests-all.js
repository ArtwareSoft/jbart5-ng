System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            //import * from './tests-field';
            jb_core_1.jb.component('ui-tests.show-tests', {
                impl: { $: 'itemlog',
                    items: [
                        { $: 'objectToArray', object: '%$window.jbart.comps%' },
                        { $filter: '%val.impl.expectedHtmlResult%' },
                        { $rxFilter: function (ctx) { return (!jb_urlParam('test_index')) || jb_urlParam('test_index') == ctx.data.index; } },
                        { $rxFilter: function (ctx) { return (!jb_urlParam('test')) || jb_urlParam('test') == ctx.data.id; } },
                        //        tap('test'),
                        //      ctx => ctx.setVars({testID:ctx.data.id}).run(ctx.data.val),
                        { $rxParallelKeepOrder: function (ctx) {
                                return ctx.setVars({ testID: ctx.data.id }).run({ $: 'ng2-ui-test', expectedHtmlResult: ctx.data.val.impl.expectedHtmlResult });
                            } },
                    ],
                    controls: { $: 'ui-tests.show-one-test' }
                }
            });
            jb_core_1.jb.component('ui-tests.show-one-test', {
                impl: { $: 'group',
                    layout: { $: 'md-layout', layout: 'row' },
                    controls: [
                        { $: 'button', title: '%id%',
                            style: { $: 'button.href' },
                            features: { $: 'css', css: '{ padding: 0 5px 0 5px }' },
                            action: { $: 'openUrl', url: '/project/ui-tests/%id%' }
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
                    ]
                }
            });
        }
    }
});
