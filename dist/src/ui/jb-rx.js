System.register(['rxjs/Rx', 'jb-core/jb', 'jb-ui/jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Rx_1, jb_1, jb_ui;
    function tap(label) { return function (ctx) { console.log('tap' + label || '', ctx.data); return ctx.data; }; }
    exports_1("tap", tap);
    function concat(obs_array) {
        return Rx_1.Observable.concat.apply(Rx_1.Observable.of(), obs_array)
            .map(function (x) { return (x instanceof jb_1.jb.Ctx) ? x.data : x; });
    }
    exports_1("concat", concat);
    function refObservable(ref, ctx) {
        if (!ctx.vars.ngZone) {
            console.log('no ngZone in context');
            return Rx_1.Observable.of();
        }
        return ctx.vars.ngZone.onUnstable
            .map(function () { return jb_1.jb.val(ref); })
            .distinctUntilChanged();
    }
    exports_1("refObservable", refObservable);
    function observableFromCtx(ctx) {
        var res, obj = ctx.data;
        if (!obj)
            return Rx_1.Observable.of(ctx.setData('starter'));
        else if (obj.$pipe)
            return obj.$pipe(Rx_1.Observable.of(ctx.setData('starter')));
        else if (obj.subscribe)
            return mapToCtx(obj);
        else if (obj.then)
            return mapToCtx(Rx_1.Observable.fromPromise(obj));
        else if (Array.isArray(obj))
            return mapToCtx(Rx_1.Observable.fromArray(obj));
        else
            return Rx_1.Observable.of(ctx);
        function mapToCtx(obs) {
            return obs.map(function (x) { return (x instanceof jb_1.jb.Ctx) ? x : ctx.setData(x); });
        }
    }
    exports_1("observableFromCtx", observableFromCtx);
    function pipe(profiles, observable, context, sort) {
        return profiles.reduce(function (aggregated, prof) {
            if (jb_1.jb.isProfOfType(prof, 'rx.elem'))
                return context.run(prof).$pipe(aggregated);
            return aggregated.concatMap(function (ctx) {
                //var ctx = context.setData(ctx.data);
                var res = jb_1.jb.toarray(ctx.run(prof)).map(function (data) { return ctxWithVar(ctx.setData(data), prof); });
                return Rx_1.Observable.concat.apply(Rx_1.Observable.of(), res.map(function (ctx2) { return observableFromCtx(ctx2).catch(function (e) { debugger; }); }));
            });
        }, observable);
        function ctxWithVar(ctx, prof) {
            if (prof.$var)
                return ctx.setVars(jb_1.jb.obj(prof.$var, ctx.data));
            return ctx;
        }
    }
    // ************* Subject
    function extendSubject(observable, subject, pipe, context) {
        if (pipe) {
            ret = toRxElem(pipe, context)(observable);
            if (Rx_1.Observable.isObservable(ret))
                observable = ret;
        }
        observable.subscribe(function (x) { return subject.next(x); });
    }
    exports_1("extendSubject", extendSubject);
    function fullRxBind(subject1, subject2, pipe1to2, pipe2to1, context) {
        extendSubject(subject1, subject2, pipe1to2, context);
        extendSubject(subject2, subject1, pipe2to1, context);
    }
    exports_1("fullRxBind", fullRxBind);
    function toRxElem(obj, context) {
        return function (obs) {
            if (obj.profile)
                return obs.flatMap(function (event) { return obj(context.setData(event)); });
            return obj(obs);
        };
    }
    exports_1("toRxElem", toRxElem);
    return {
        setters:[
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
                exports_1({
                    "Observable": Rx_1_1["Observable"],
                    "Subject": Rx_1_1["Subject"]
                });
            },
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            ;
            jb_initJstypes();
            jbart.jstypes.observable = function (obj, ctx) { return observableFromCtx(ctx.setData(obj)); };
            jb_1.jb.type('rx.elem');
            jb_1.jb.component('rxLog', {
                type: 'rx.elem',
                params: {
                    pipe: { as: 'observable' }
                },
                impl: function (ctx, pipe) { return pipe.subscribe(function (x) { return console.log(x.data); }); }
            });
            jb_1.jb.component('rxPipe', {
                type: 'rx.elem',
                params: {
                    items: { type: 'data,rx.elem[]', ignore: true, essential: true }
                },
                impl: function (context) {
                    return {
                        $pipe: function (obs) {
                            var profiles = jb_toarray(context.profile.items || context.profile['$rxPipe'] || context.profile['$pipeline']);
                            return pipe(profiles, obs, context, true);
                        }
                    };
                }
            });
            jb_1.jb.component('rxFilter', {
                type: 'rx.elem',
                params: {
                    filter: { type: 'boolean', dynamic: true }
                },
                impl: function (context, filter) {
                    return {
                        $pipe: function (obs) {
                            return obs.filter(function (ctx) { return filter(ctx); });
                        }
                    };
                }
            });
            jb_1.jb.component('rxParallel', {
                type: 'rx.elem',
                params: {
                    item: { dynamic: true },
                },
                impl: function (context, item, keepOrder) {
                    return { $pipe: function (obs) {
                            return obs.flatMap(function (ctx) {
                                return Rx_1.Observable.merge.apply(Rx_1.Observable.of(), jb_1.jb.toarray(item(ctx)).map(function (data) { return observableFromCtx(ctx.setData(data)); }));
                            });
                        }
                    };
                }
            });
            jb_1.jb.component('rxParallelKeepOrder', {
                type: 'rx.elem',
                params: {
                    item: { dynamic: true },
                },
                impl: function (context, item, keepOrder) {
                    return { $pipe: function (obs) {
                            var parallel_results = [], emitted = 0;
                            var out = new Rx_1.Subject();
                            obs.flatMap(function (ctx, i) {
                                return Rx_1.Observable.concat.apply(Rx_1.Observable.of(), jb_1.jb.toarray(item(ctx)).map(function (data) {
                                    var res = observableFromCtx(ctx.setData(data));
                                    res.subscribe(function (x) {
                                        parallel_results[i] = parallel_results[i] || [];
                                        parallel_results[i].push(x);
                                    });
                                    return res;
                                }));
                            }).catch(function (e) { debugger; })
                                .delay(1) // to let subscribers register to out
                                .subscribe(function () {
                                while (parallel_results[emitted])
                                    parallel_results[emitted++].forEach(function (x) { return out.next(x); });
                            });
                            return out;
                        } };
                }
            });
            jb_1.jb.component('rx.distinctUntilChanged', {
                type: 'rx.elem',
                params: {
                    keySelector: { type: 'rx.keySelector' },
                    comparer: { type: 'rx.comparer' },
                },
                impl: function (context) {
                    return { $pipe: function (obs) { return obs.concatMap(function (ctx) {
                            return obs.map(function (ctx) { return ctx.data; })
                                .distinctUntilChanged(keySelector, comparer)
                                .flatMap(function (x) { return ctx; });
                        }); }
                    };
                }
            });
            jb_1.jb.component('rx.subject', {
                type: 'rx.subject,rx.observable,rx.observer',
                params: {
                    pipe: { type: 'rx.elem', dynamic: true, defaultValue: { $: 'rx.distinctUntilChanged' } },
                },
                impl: function (context, pipe) {
                    var subject = new Rx_1.Subject();
                    return Rx_1.Subject.create(function (x) { return subject.next(x); }, pipe().$pipe(subject));
                }
            });
            jb_1.jb.component('rx.emit', {
                type: 'action',
                params: {
                    from: { as: 'observable' },
                    to: { type: 'rx.observer' },
                },
                impl: function (context, from, _to) {
                    from.subscribe(function (item) { return _to.next(item); });
                }
            });
            jb_1.jb.component('rx.urlPath', {
                type: 'rx.subject',
                params: {
                    params: { type: 'data[]', as: 'array' },
                    databind: { as: 'ref', essential: true },
                    base: { as: 'string' },
                    zoneId: { as: 'string' },
                },
                impl: function (context, params, databind, base, zoneId) {
                    if (!jb_1.jb.val(databind))
                        jb_1.jb.writeValue(databind, {});
                    var dataParent = jb_1.jb.val(databind);
                    if (!dataParent || typeof dataParent != 'object')
                        return console.log('no databind for rx.urlPath');
                    var subject = new Rx_1.Subject();
                    if (jb_ui.injector) {
                        jbart.location = jbart.location || jb_ui.injector.get(Location);
                    }
                    else if (!jbart.location) {
                        jbart.location = History.createHistory();
                        jbart.location.path = function () { return location.pathname; };
                        jbart.location.listen(function (x) { return subject.next(urlToObj(x.pathname)); });
                    }
                    function urlToObj() {
                        var path = jbart.location.path();
                        var vals = path.substring(path.indexOf(base) + base.length).split('/').map(function (x) { return decodeURIComponent(x); });
                        var res = {};
                        params.forEach(function (p, i) {
                            dataParent[p] = res[p] = (vals[i + 1] || '');
                        });
                        return res;
                    }
                    subject.subscribe(function (newVal) {
                        if (JSON.stringify(newVal) == subject.__oldVal)
                            return;
                        subject.__oldVal = JSON.stringify(newVal);
                        params.forEach(function (p) { return dataParent[p] = newVal[p]; });
                        var split_base = jbart.location.path().split("/" + base);
                        var vals = split_base[1].split('/').map(function (x) { return decodeURIComponent(x); });
                        params.forEach(function (p, i) { return vals[i + 1] = p == '*' ? vals[i + 1] : newVal[p]; });
                        var url = split_base[0] + ("/" + base) + vals.join('/');
                        jbart.location.push(url.replace(/\/*$/, ''));
                    });
                    if (jbart.location.subscribe)
                        jbart.location.subscribe(function () { return subject.next(urlToObj()); });
                    subject.next(urlToObj());
                    jb_ui.getZone(zoneId).then(function (zone) { return zone.onStable.subscribe(function () { return subject.next(jb_1.jb.val(databind)); }); });
                    return subject;
                }
            });
            jb_1.jb.component('rx.fullBind', {
                params: {
                    subject1: { type: 'rx.subject' },
                    subject2: { type: 'rx.subject' },
                    pipe1to2: { type: 'rx.elem', dynamic: true },
                    pipe2to1: { type: 'rx.elem', dynamic: true },
                },
                impl: function (ctx, subject1, subject2, pipe1to2, pipe2to1) { return fullRxBind(ctx, subject1, subject2, pipe1to2, pipe2to1, ctx); }
            });
            // ************** tests ******************
            jb_1.jb.component('rx-test', {
                params: {
                    result: { as: 'observable', dynamic: true },
                    expectedResult: { type: 'boolean', dynamic: true },
                    timeout: { as: 'number', defaultValue: 5000 }
                },
                impl: function (context, result, expectedResult, timeout) {
                    var res = result();
                    return expectedResult(context.setData(res))
                        .map(function (ctx) { return { id: context.vars.testID, success: ctx.data }; });
                    //			.map(x=>{console.log('tap',x); return x})
                }
            });
            jb_1.jb.component('containsSeq', {
                type: 'boolean',
                params: {
                    seq: { type: 'data[]', as: 'array' },
                    observable: { defaultValue: '%%', as: 'observable' }
                },
                impl: function (context, seq, observable) {
                    return observable.take(seq.length)
                        .map(function (x) { return x.data; }).toArray()
                        .map(function (arr) { return jb_1.jb.compareArrays(arr, seq); })
                        .map(function (x) { return context.setData(x); });
                }
            });
        }
    }
});