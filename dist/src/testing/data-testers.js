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
            jb_1.jb.component('data-test', {
                type: 'test',
                params: [
                    { id: 'calculate', dynamic: true },
                    { id: 'runBefore', type: 'action', dynamic: true },
                    { id: 'expectedResult', type: 'boolean', dynamic: true, as: 'boolean' }
                ],
                impl: function (context, calculate, runBefore, expectedResult) {
                    return Promise.resolve(runBefore())
                        .then(function (_) {
                        return calculate();
                    })
                        .then(function (value) {
                        return !!expectedResult(jb_ctx(context, { data: value }));
                    })
                        .then(function (result) {
                        return ({ id: context.vars.testID, success: result });
                    });
                }
            });
        }
    }
});
