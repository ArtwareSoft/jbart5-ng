System.register(['jb-core/jb', 'jb-ui/jb-ui', '@angular/core', 'jb-ui/dialog'], function(exports_1, context_1) {
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
    var jb_1, jb_ui, core_1, dialog_1;
    var testModules, allTestModules, jBartSingleTest, jBartTests;
    //var testModules = ['ng-ui-tests','rx-tests'];
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
        var profile = allTestModules.reduce(function (found, module) { return found || jb_1.jb.widgets[module].tests[compID]; }, false);
        if (!profile)
            console.log('can not find a test ' + compID);
        else if (profile.control && profile.$ == 'studio-test') {
            return ctx.run(jb_1.jb.extend({}, profile, { $: 'run-studio-test' }));
        }
        else if (profile.control)
            return ctx.run(profile.control);
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
            },
            function (dialog_1_1) {
                dialog_1 = dialog_1_1;
            }],
        execute: function() {
            ;
            testModules = ['ng-ui-tests', 'md-ui-tests'];
            allTestModules = ['ng-ui-tests', 'md-ui-tests', 'studio-tests', 'rx-tests'];
            jBartSingleTest = (function () {
                function jBartSingleTest(componentResolver, ngZone, elementRef) {
                    this.componentResolver = componentResolver;
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
                    comp.compile(this.componentResolver).then(function (componentFactory) {
                        return comp.registerMethods(_this.childView.createComponent(componentFactory));
                    });
                    // this.componentResolver.resolveComponent(comp)
                    //   .then(componentFactory => {
                    //     this.childView.createComponent(componentFactory);
                    //   });
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
                    __metadata('design:paramtypes', [core_1.ComponentResolver, core_1.NgZone, core_1.ElementRef])
                ], jBartSingleTest);
                return jBartSingleTest;
            }());
            exports_1("jBartSingleTest", jBartSingleTest);
            jBartTests = (function () {
                function jBartTests(componentResolver, ngZone) {
                    this.componentResolver = componentResolver;
                    this.ngZone = ngZone;
                    window.jbartTestsInstance = this;
                    window.jbartTestsNgZone = ngZone;
                    //		window.ngZone = this.ngZone;
                }
                jBartTests.prototype.addComp = function (comp) {
                    var _this = this;
                    comp.compile(this.componentResolver).then(function (componentFactory) {
                        return comp.registerMethods(_this.childView.createComponent(componentFactory));
                    });
                };
                __decorate([
                    core_1.ViewChild('tests', { read: core_1.ViewContainerRef }), 
                    __metadata('design:type', Object)
                ], jBartTests.prototype, "childView", void 0);
                jBartTests = __decorate([
                    core_1.Component({
                        selector: 'jbartTests',
                        template: '<div #tests></div>',
                    }), 
                    __metadata('design:paramtypes', [core_1.ComponentResolver, core_1.NgZone])
                ], jBartTests);
                return jBartTests;
            }());
            exports_1("jBartTests", jBartTests);
            jb_1.jb.component('ng2-ui-test', {
                params: {
                    control: { type: 'control', dynamic: true },
                    expectedTemplateResult: { type: 'boolean', dynamic: true, as: 'boolean' },
                    expectedHtmlResult: { type: 'boolean', dynamic: true, as: 'boolean' },
                    runBefore: { type: 'action', dynamic: true },
                    cleanAfter: { type: 'action', dynamic: true },
                    checkAfterCmpEvent: { as: 'string', defaultValue: 'after-init-children' },
                    waitFor: {},
                },
                impl: function (ctx) {
                    return new Promise(function (resolve, reject) {
                        console.log('starting ' + ctx.vars.testID);
                        var ctrl = ctx.params.control(ctx.setVars({ ngZone: window.jbartTestsNgZone }));
                        if (!ctrl)
                            return resolve({ id: ctx.vars.testID, success: false, reason: ' can not create control' });
                        return window.jbartTestsInstance.addComp(ctrl.jbExtend({
                            observable: function (observable, cmp) {
                                observable
                                    .map(function (x) { return x.data || x; }) // maybe ctx
                                    .map(function (x) { console.log(ctx.vars.testID, x); return x; })
                                    .filter(function (x) { return x == ctx.params.checkAfterCmpEvent; })
                                    .do(function () {
                                    var promise = ctx.params.waitFor;
                                    if (!promise || !promise.then)
                                        promise = Promise.resolve(1);
                                    promise.then(checkIt, checkIt);
                                    function checkIt() {
                                        //return jb.delay(1).then(()=>{
                                        var html = (cmp._nativeElement || cmp.elementRef.nativeElement).outerHTML;
                                        cmp.elementRef.nativeElement.setAttribute('test', ctx.vars.testID);
                                        //if (ctx.vars.testID == 'picklist') debugger;
                                        if (ctx.params.expectedHtmlResult.profile.lookin == 'popups')
                                            html = $('jb-dialog-parent').html();
                                        resolve({
                                            id: ctx.vars.testID,
                                            success: ctx.params.expectedHtmlResult(ctx.setData(html))
                                        });
                                        dialog_1.jb_dialogs.dialogs
                                            .filter(function (d) { return d.context.vars.testID == ctx.vars.testID; })
                                            .forEach(function (d) {
                                            return d.close();
                                        });
                                        //})
                                    }
                                })
                                    .catch(function (e) { debugger; resolve({ id: ctx.vars.testID, success: false }); })
                                    .subscribe(function () { });
                            } }));
                    });
                }
            });
            jb_1.jb.component('ui-tests.show-tests', {
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
