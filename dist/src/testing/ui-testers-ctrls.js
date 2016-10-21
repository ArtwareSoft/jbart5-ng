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
            // jb.component('ui-tests.show-project-tests', {
            // 	type: 'control',
            // 	impl :{$: 'group',
            // 	    features: {$: 'group.watch', data: '%$window/jbart/studioGlobals/profile_path%' }, 
            //  		controls: {$: 'itemlog',
            // 			items: [
            // 				'%$window.jbart.comps%',
            // 				{ $: 'objectToArray' },
            // 				{$filter: '%val/type% == "test"' },
            // 				{$filter: ctx => {
            // 						var selectedTst = ctx.exp('%$window/jbart/studioGlobals/profile_path%');
            // 						if (!selectedTst)
            // 							selectedTst = location.href.split('/')[6];
            // 						if (!selectedTst || selectedTst.slice(-6) == '.tests') 
            // 							return true;
            // 						return ctx.data.id == selectedTst;
            // 					}
            // 				},
            // 				ctx => 
            // 					ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl),
            // 				// { $rxParallelKeepOrder: ctx => 
            // 				// 	ctx.setVars({testID:ctx.data.id}).run(ctx.data.val) },
            // 			],
            // 			controls :{$: 'ui-tests.show-one-test-in-project' } 
            // 		}
            // 	}
            // })
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
                            ] },
                        serial_tests: { $pipeline: ['%$tests%',
                                { $filter: { $: 'equals', item1: 'path-test1', item2: { $: 'prefix', text: '%id%', separator: '.' } } },
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
//var testModules = ['ng-ui-tests','md-ui-tests']
// var allTestModules = ['ng-ui-tests','md-ui-tests','studio-tests','rx-tests'];
// var testModules = ['ng-ui-tests','rx-tests'];
// //testModules = allTestModules;
// //testModules = ['studio-tests'];
// function testComp(compID,ngZone) {
// 	var ns = 'ui-tests';
// 	var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
// 	jb.extend(resources, { window: window, globals: {} });
// 	var ctx = jb.ctx({ resources: resources, vars: {ngZone: ngZone},  }, {});
// 	// Object.getOwnPropertyNames(resources).forEach(id=> {
// 	// 	var r = resources[id];
// 	// 	if (r && r.$) resources[id] = ctx.run(r);
// 	// })
// 	var profile = allTestModules.reduce((found,module) => found || (jb.widgets[module]||{}).tests[compID],false);
// 	if (!profile)
// 		console.log('can not find a test ' + compID);
// 	else if (profile.control && profile.$ == 'studio-test') {
// 		return ctx.run(jb.extend({},profile,{$:'run-studio-test'}));
// 	}
// 	else if (profile.control)
// 		return jb_run(jb.ctx(ctx,{profile:profile.control, comp: 'tests~'+compID, path: ''}));
// 	else if (profile.result)
// 		return jb_ui.Comp({ 
// 			template: '<div>{{result}}</div>',
// 			methods: {
// 				init: function(cmp) {
// 					cmp.result = 'start: ';
// 					ctx.run(profile.result,{ as: 'observable'}).map(ctx=>ctx.data).subscribe(x=>cmp.result += x + ', ');
// 				}
// 			}
// 		},ctx)
// }
// @Component({
//     selector: 'jBartSingleTest',
// 	template: '<div #single_test></div>',
// })
// export class jBartSingleTest {
//   @ViewChild('single_test', {read: ViewContainerRef}) childView;
//   constructor(private compiler:Compiler, private ngZone: NgZone, private elementRef: ElementRef) {
// 		window.ngZone = this.ngZone;
// 		jbart.zones['single-test'] = this.ngZone;
// 		if ((this.elementRef.nativeElement.getAttribute('compID')||'').indexOf('studio') == 0)
// 			jbart.zones['studio.all'] = this.ngZone;
// 	}
//   ngOnInit() {
// 	this.counter = 0;
//   	var comp = testComp(this.elementRef.nativeElement.getAttribute('compID'),this.ngZone);
//   	comp.compile(this.compiler).then(componentFactory => 
//   		comp.registerMethods(this.childView.createComponent(componentFactory),comp)
//     );
//   }
// }
