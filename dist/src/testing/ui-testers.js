System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    var testModules, allTestModules;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            testModules = ['ng-ui-tests', 'md-ui-tests'];
            allTestModules = ['ng-ui-tests', 'md-ui-tests', 'studio-tests', 'rx-tests'];
            //var testModules = ['ng-ui-tests','rx-tests'];
            //testModules = allTestModules;
            //testModules = ['studio-tests'];
            // function testComp(compID,ngZone) {
            // 	var ns = 'ui-tests';
            // 	var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
            // 	jb.extend(resources, { window: window, globals: {} });
            // 	var ctx = jb.ctx({ ngMode: true, resources: resources, vars: {ngZone: ngZone},  }, {});
            // 	// Object.getOwnPropertyNames(resources).forEach(id=> {
            // 	// 	var r = resources[id];
            // 	// 	if (r && r.$) resources[id] = ctx.run(r);
            // 	// })
            // 	var profile = allTestModules.reduce((found,module) => found || jb.widgets[module].tests[compID],false);
            // 	if (!profile)
            // 		console.log('can not find a test ' + compID);
            // 	else if (profile.control && profile.$ == 'studio-test') {
            // 		return ctx.run(jb.extend({},profile,{$:'run-studio-test'}));
            // 	}
            // 	else if (profile.control)
            // 		return ctx.run(profile.control);
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
            //   constructor(private componentResolver:ComponentResolver, private ngZone: NgZone, private elementRef: ElementRef) {
            // 		window.ngZone = this.ngZone;
            // 		jbart.zones['single-test'] = this.ngZone;
            // 		if ((this.elementRef.nativeElement.getAttribute('compID')||'').indexOf('studio') == 0)
            // 			jbart.zones['studio.all'] = this.ngZone;
            // 	}
            //   ngOnInit() {
            // 	this.counter = 0;
            //   	var comp = testComp(this.elementRef.nativeElement.getAttribute('compID'),this.ngZone);
            //   	comp.compile(this.componentResolver).then(componentFactory => 
            //   		comp.registerMethods(this.childView.createComponent(componentFactory),comp)
            //     );
            //     // this.componentResolver.resolveComponent(comp)
            //     //   .then(componentFactory => {
            //     //     this.childView.createComponent(componentFactory);
            //     //   });
            //   }
            // }
            // @Component({
            //     selector: 'jbartTests',
            // 	template: '<div #tests></div>',
            // })
            // export class jBartTests {
            //   @ViewChild('tests', {read: ViewContainerRef}) childView;
            //   constructor(private componentResolver:ComponentResolver, private ngZone: NgZone) {
            // 		window.jbartTestsInstance = this;
            // 		window.jbartTestsNgZone = ngZone;
            // //		window.ngZone = this.ngZone;
            // 	}
            // 	addComp(comp) {
            // 	  	comp.compile(this.componentResolver).then(componentFactory => 
            // 	  		comp.registerMethods(this.childView.createComponent(componentFactory),comp)
            // 	    );
            // 	}
            // }
            jb_1.jb.component('ng2-ui-test', {
                params: {
                    control: { type: 'control', dynamic: true },
                    expectedTemplateResult: { type: 'boolean', dynamic: true, as: 'boolean' },
                    expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
                    runBefore: { type: 'action', dynamic: true },
                    cleanAfter: { type: 'action', dynamic: true },
                    waitFor: {},
                },
                impl: function (ctx) {
                    return new Promise(function (resolve, reject) {
                        ctx.run({ $: 'openDialog', content: ctx.profile.control,
                            features: function (ctx2) { return ({
                                observable: function (observable, cmp) {
                                    return observable.filter(function (x) {
                                        return x == 'ready';
                                    })
                                        .catch(function (e) {
                                        resolve({ id: ctx.vars.testID, success: false });
                                    })
                                        .subscribe(function (x) {
                                        var html = cmp.elementRef.nativeElement.outerHTML;
                                        resolve({
                                            id: ctx.vars.testID,
                                            success: ctx.params.expectedHtmlResult(ctx.setData(html))
                                        });
                                        ctx2.run({ $: 'closeContainingPopup' });
                                    });
                                },
                                css: '{display: none}'
                            }); }
                        });
                    });
                }
            });
            jb_1.jb.component('data-test', {
                params: {
                    calculate: { dynamic: true },
                    runBefore: { type: 'action', dynamic: true },
                    resultVariable: { as: 'string', defaultValue: 'result' },
                    action: { type: 'action', dynamic: true },
                    expectedResult: { type: 'boolean', dynamic: true, as: 'boolean' }
                },
                impl: function (context, calculate, runBefore, resultVariable, action, expectedResult) {
                    runBefore();
                    var value = calculate();
                    if (result(value))
                        return ({ id: context.vars.testID, success: true });
                    else
                        return ({ id: context.vars.testID, success: false });
                    function result(value) {
                        if (context.vars.$testContext)
                            context.vars.$testContext.result = value;
                        action(jb_ctx(context, { data: value, vars: jb_obj(resultVariable, value) }));
                        return expectedResult(jb_ctx(context, { data: value, vars: jb_obj(resultVariable, value) }));
                    }
                }
            });
            jb_1.jb.component('ui-tests.show-project-tests', {
                type: 'control',
                impl: { $: 'itemlog',
                    items: [
                        '%$window.jbart.comps%',
                        { $: 'objectToArray' },
                        { $filter: '%val/type% == "test"' },
                        function (ctx) {
                            return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val.impl);
                        },
                    ],
                    controls: { $: 'ui-tests.show-one-test' }
                }
            });
            jb_1.jb.component('ui-tests.show-tests', {
                type: 'control',
                impl: { $: 'itemlog',
                    items: [
                        function () { return testModules; },
                        //			'just-a-label',
                        '%$window.jbart_widgets.{%%}.tests%',
                        { $: 'objectToArray' },
                        //			{ $pipeline: [{ $: 'objectToArray' }, { $: 'slice', start: 26, end: 27 }]} ,
                        { $rxFilter: function (ctx) { return (!jb_urlParam('test')) || jb_urlParam('test') == ctx.data.id; } },
                        //		    tap('test'),
                        //			ctx => ctx.setVars({testID:ctx.data.id}).run(ctx.data.val),
                        { $rxParallelKeepOrder: function (ctx) { return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val); } },
                    ],
                    controls: { $: 'ui-tests.show-one-test' }
                }
            });
            jb_1.jb.component('ui-tests.show-one-test', {
                type: 'control',
                impl: { $: 'group',
                    layout: { $: 'md-layout', layout: 'row', },
                    controls: [
                        { $: 'button', title: '%id%',
                            style: { $: 'button.href' },
                            features: { $: 'css', css: '{ padding: 0 5px 0 5px }' },
                            action: { $: 'openUrl', url: '/projects/ui-tests/single-test.html?test=%id%' }
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
