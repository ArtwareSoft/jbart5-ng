jb_component('ng2-ui-test', {
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
            console.log('starting test ' + ctx.vars.testID, ctx);
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
                                return inp.setAttribute('title2', inp.value || '');
                            });
                            var html = cmp.elementRef.nativeElement.outerHTML;
                            resolve({
                                id: ctx.vars.testID,
                                success: ctx.params.expectedHtmlResult(ctx.setData(html))
                            });
                            if (!jbart.singleTestID)
                                ctx2.run({ $: 'closeContainingPopup' });
                            console.log('finished test ' + ctx.vars.testID, ctx);
                        });
                    },
                    css: jbart.singleTestID ? '' : '{display: none}'
                }); }
            });
        });
    }
});
