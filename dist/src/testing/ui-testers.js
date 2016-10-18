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
            jb_1.jb.component('ng2-ui-test', {
                type: 'test',
                params: [
                    { id: 'control', type: 'control', dynamic: true },
                    { id: 'expectedTemplateResult', type: 'boolean', dynamic: true, as: 'boolean' },
                    { id: 'expectedHtmlResult', type: 'boolean', dynamic: true, as: 'boolean' },
                    { id: 'runBefore', type: 'action', dynamic: true },
                    { id: 'cleanAfter', type: 'action', dynamic: true },
                    { id: 'waitFor', },
                ],
                impl: function (ctx) {
                    return new Promise(function (resolve, reject) {
                        ctx.run({ $: 'openDialog', content: ctx.profile.control,
                            features: function (ctx2) { return ({
                                observable: function (observable, cmp) {
                                    return observable.filter(function (e) {
                                        return e == 'ready' || e == 'destroy';
                                    })
                                        .catch(function (e) {
                                        resolve({ id: ctx.vars.testID, success: false });
                                    })
                                        .subscribe(function (x) {
                                        Array.from(cmp.elementRef.nativeElement.querySelectorAll('input')).forEach(function (inp) {
                                            if (inp.parentElement)
                                                inp.parentElement.innerHTML += inp.value || '';
                                        });
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
                type: 'test',
                params: [
                    { id: 'calculate', dynamic: true },
                    { id: 'runBefore', type: 'action', dynamic: true },
                    { id: 'resultVariable', as: 'string', defaultValue: 'result' },
                    { id: 'action', type: 'action', dynamic: true },
                    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
                ],
                impl: function (context, calculate, runBefore, resultVariable, action, expectedResult) {
                    runBefore();
                    return Promise.resolve(calculate()).then(function (value) {
                        if (result(value))
                            return ({ id: context.vars.testID, success: true });
                        else
                            return ({ id: context.vars.testID, success: false });
                    });
                    function result(value) {
                        if (context.vars.$testContext)
                            context.vars.$testContext.result = value;
                        action(jb_ctx(context, { data: value, vars: jb_obj(resultVariable, value) }));
                        return expectedResult(jb_ctx(context, { data: value, vars: jb_obj(resultVariable, value) }));
                    }
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
