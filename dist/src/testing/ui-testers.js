System.register(['jb-core/jb', 'jb-ui/jb-ui', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var jb_1, jb_ui, core_1;
    var testModules, allTestModules, jBartSingleTest;
    //testModules = allTestModules;
    //testModules = ['studio-tests'];
    function testComp(compID, ngZone) {
        var ns = 'ui-tests';
        var resources = (jb_1.jb.widgets[ns] && jb_1.jb.widgets[ns].resources) || {};
        jb_1.jb.extend(resources, { window: window, globals: {} });
        var ctx = jb_1.jb.ctx({ ngMode: true, resources: resources, vars: { ngZone: ngZone }, }, {});
        // Object.getOwnPropertyNames(resources).forEach(id=> {
        // 	var r = resources[id];
        // 	if (r && r.$) resources[id] = ctx.run(r);
        // })
        var profile = allTestModules.reduce(function (found, module) { return found || (jb_1.jb.widgets[module] || {}).tests[compID]; }, false);
        if (!profile)
            console.log('can not find a test ' + compID);
        else if (profile.control && profile.$ == 'studio-test') {
            return ctx.run(jb_1.jb.extend({}, profile, { $: 'run-studio-test' }));
        }
        else if (profile.control)
            return jb_run(jb_1.jb.ctx(ctx, { profile: profile.control, comp: 'tests~' + compID, path: '' }));
        else if (profile.result)
            return jb_ui.Comp({
                template: '<div>{{result}}</div>',
                methods: {
                    init: function (cmp) {
                        cmp.result = 'start: ';
                        ctx.run(profile.result, { as: 'observable' }).map(function (ctx) { return ctx.data; }).subscribe(function (x) { return cmp.result += x + ', '; });
                    }
                }
            }, ctx);
    }
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            testModules = ['ng-ui-tests', 'md-ui-tests'];
            allTestModules = ['ng-ui-tests', 'md-ui-tests', 'studio-tests', 'rx-tests'];
            testModules = ['ng-ui-tests', 'rx-tests'];
            jBartSingleTest = (function () {
                function jBartSingleTest(compiler, ngZone, elementRef) {
                    this.compiler = compiler;
                    this.ngZone = ngZone;
                    this.elementRef = elementRef;
                    window.ngZone = this.ngZone;
                    jbart.zones['single-test'] = this.ngZone;
                    if ((this.elementRef.nativeElement.getAttribute('compID') || '').indexOf('studio') == 0)
                        jbart.zones['studio.all'] = this.ngZone;
                }
                jBartSingleTest.prototype.ngOnInit = function () {
                    var _this = this;
                    this.counter = 0;
                    var comp = testComp(this.elementRef.nativeElement.getAttribute('compID'), this.ngZone);
                    comp.compile(this.compiler).then(function (componentFactory) {
                        return comp.registerMethods(_this.childView.createComponent(componentFactory), comp);
                    });
                };
                __decorate([
                    core_1.ViewChild('single_test', { read: core_1.ViewContainerRef }), 
                    __metadata('design:type', Object)
                ], jBartSingleTest.prototype, "childView", void 0);
                jBartSingleTest = __decorate([
                    core_1.Component({
                        selector: 'jBartSingleTest',
                        template: '<div #single_test></div>',
                    }), 
                    __metadata('design:paramtypes', [core_1.Compiler, core_1.NgZone, core_1.ElementRef])
                ], jBartSingleTest);
                return jBartSingleTest;
            }());
            exports_1("jBartSingleTest", jBartSingleTest);
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
                                        if (!jbart.singleTestID)
                                            ctx2.run({ $: 'closeContainingPopup' });
                                    });
                                },
                                css: jbart.singleTestID ? '' : '{display: none}'
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
                impl: { $: 'group',
                    features: { $: 'group.watch', data: '%$window/jbart/studioGlobals/profile_path%' },
                    controls: { $: 'itemlog',
                        items: [
                            '%$window.jbart.comps%',
                            { $: 'objectToArray' },
                            { $filter: '%val/type% == "test"' },
                            { $filter: function (ctx) {
                                    var selectedTst = ctx.exp('%$window/jbart/studioGlobals/profile_path%');
                                    if (!selectedTst)
                                        selectedTst = location.href.split('/')[6];
                                    if (!selectedTst || selectedTst.slice(-6) == '.tests')
                                        return true;
                                    return ctx.data.id == selectedTst;
                                }
                            },
                            function (ctx) {
                                return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val.impl);
                            },
                        ],
                        controls: { $: 'ui-tests.show-one-test-in-project' }
                    }
                }
            });
            jb_1.jb.component('ui-tests.show-tests', {
                type: 'control',
                impl: { $: 'group',
                    $vars: {
                        tst: {
                            counter: 0,
                            failures: '',
                        },
                        total: function (ctx) {
                            return jb_1.jb.entries(jbart.comps)
                                .map(function (x) { return x[1]; })
                                .filter(function (x) { return x.type == 'test'; })
                                .reduce(function (acc, test) { return acc + (test.impl.$ == 'jb-path-test' ? 3 : 1); }, 0);
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
                            items: [
                                //				{$list: jbart.testProjects , $var: 'project'},
                                '%$window.jbart.comps%',
                                { $: 'objectToArray' },
                                { $filter: '%val/type% == "test"' },
                                //				{$filter: {$: 'equals', item1: '%$project%', item2: {$: 'prefix', text: '%id%', separator: '.' } }},
                                // ctx => 
                                // 	ctx.setVars({testID:ctx.data.id}).run(ctx.data.val.impl),
                                { $rxParallelKeepOrder: function (ctx) {
                                        return ctx.setVars({ testID: ctx.data.id }).run(ctx.data.val.impl);
                                    } },
                                function (ctx) {
                                    if (!ctx.data.success)
                                        ctx.vars.tst.failures = (ctx.vars.tst.failures || 0) + 1;
                                    return ctx.data;
                                }
                            ],
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
            // jb.component('ui-tests.show-tests2', {
            // 	type: 'control',
            // 	impl :{$: 'itemlog',
            // 		items: [
            // 			() => testModules,
            // //			'just-a-label',
            // 			'%$window.jbart_widgets.{%%}.tests%',
            // 			{ $: 'objectToArray' },
            // //			{ $pipeline: [{ $: 'objectToArray' }, { $: 'slice', start: 26, end: 27 }]} ,
            // 			{ $rxFilter: ctx => (!jb_urlParam('test')) || jb_urlParam('test') == ctx.data.id },
            // //		    tap('test'),
            // //			ctx => ctx.setVars({testID:ctx.data.id}).run(ctx.data.val),
            // 			{ $rxParallelKeepOrder: ctx => ctx.setVars({testID:ctx.data.id}).run(ctx.data.val) },
            // //		    tap('test result'),
            // 		],
            // 		controls :{$: 'ui-tests.show-one-test' } 
            // 	}
            // })
            jb_1.jb.component('ui-tests.show-one-test', {
                type: 'control',
                params: {
                    testResult: { as: 'single', defaultValue: '%%' },
                },
                impl: { $: 'group',
                    layout: { $: 'md-layout', layout: 'row', },
                    controls: [
                        { $: 'button', title: '%$testResult/id%',
                            style: { $: 'button.href' },
                            features: { $: 'css', css: '{ padding: 0 5px 0 5px }' },
                            action: { $: 'openUrl', url: '/projects/ui-tests/single-test.html?test=%$testResult/id%' }
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
