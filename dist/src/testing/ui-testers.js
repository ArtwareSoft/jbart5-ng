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
                                            return cmp.renderer.setElementAttribute(inp, 'title2', inp.value || '');
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
