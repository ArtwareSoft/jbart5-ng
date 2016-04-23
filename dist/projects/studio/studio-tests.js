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
            if (window.jbartTest) {
                // jb.resource('ui-tests','UrlPathEm',{ $: 'rx.urlPath', base: 'ui-tests', zoneId: 'single-test', 
                // 	params: [ 'test','project', 'page', 'profile_path' ] , databind: '{%$globals%}' } );
                jb_core_1.jb.resource('ui-tests', 'DragScriptEm', { $: 'rx.subject' });
                jb_core_1.jb.resource('ui-tests', 'WidgetLoaded', { $: 'rx.subject' });
            }
            jb_tests('studio-tests', {
                'studio-label': { $: 'studio-test',
                    control: { $: 'label', title: 'Hello World2' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-codemirror': { $: 'studio-test',
                    page: 'main',
                    control: { $: 'editable-text',
                        databind: { $: 'studio.currentProfileAsScript' },
                        style: { $: 'editable-text.codemirror' }
                    },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-control-tree': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.controlTree' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-properties': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.properties', path: '%$globals/profile_path%' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-propertyField-Primitive': { $: 'studio-test',
                    page: 'main',
                    profile_path: 'hello-world.main',
                    control: { $: 'studio.propertyField-Primitive', path: 'hello-world.main~title' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
                'studio-propertyField-TgpType': { $: 'studio-test',
                    page: 'group1',
                    profile_path: 'hello-world.group1',
                    control: { $: 'studio.propertyField-TgpType', path: 'hello-world.group1~style' },
                    expectedHtmlResult: { $: 'contains', text: 'Hello World2' }
                },
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
                                features: { $: 'wait', for: { $: 'studio.waitForPreviewIframe' } }
                            }
                        ]
                    },
                    checkAfterCmpEvent: 'ready',
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
                                { $: 'wait', for: { $: 'studio.waitForPreviewIframe' } },
                            ]
                        }
                    ]
                }
            });
        }
    }
});
// jb.component('in-project-context', {
// 	params: { 
// 		project : { as: 'string', defaultValue: 'hello-world'},
// 		page : { as: 'string', defaultValue: 'group1'},
// 		profile_path: { as: 'string', defaultValue: 'hello-world.group1'},
// 		control : { dynamic: true },
// 	},
// 	impl :{$: 'group',
// 		features :{$: 'feature.init', action: [
// 			{ $: 'writeValue', to: '%$globals/project%', value: '%$project%' },
// 			{ $: 'writeValue', to: '%$globals/page%', value: '%$page%' },
// 			{ $: 'writeValue', to: '%$globals/profile_path%', value: '%$profile_path%' },
// 		] },
// 		controls: [
// 			{ $: 'studio.renderWidget' },
// 			{ $: 'group', controls: { $call: 'control' },
// 		    	features : [
// 		    		{ $: 'wait', for :{$: 'studio.waitForPreviewIframe' }},
// 		    	]
// 		    }
// 		]
// 	}
// }) 
