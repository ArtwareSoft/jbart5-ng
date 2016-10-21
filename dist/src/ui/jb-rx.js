System.register(['rxjs/Subject', 'rxjs/Observable', 'rxjs/add/operator/merge', 'rxjs/add/operator/concat', 'rxjs/add/operator/mergeMap', 'rxjs/add/operator/concatMap', 'rxjs/add/operator/startWith', 'rxjs/add/operator/takeUntil', 'rxjs/add/observable/fromPromise', 'rxjs/add/observable/fromEvent', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/debounceTime', 'rxjs/add/operator/buffer', 'rxjs/add/operator/skip', 'rxjs/add/operator/last', 'rxjs/add/operator/delay', 'rxjs/add/operator/take', 'rxjs/add/operator/toArray', 'rxjs/add/operator/toPromise', 'jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Subject_1, Observable_1, jb_1;
    function tap(label) { return function (ctx) { console.log('tap' + label || '', ctx.data); return ctx.data; }; }
    exports_1("tap", tap);
    function concat(obs_array) {
        return Observable_1.Observable.prototype.concat.apply(Observable_1.Observable.of(), obs_array)
            .map(function (x) { return (x instanceof jb_1.jb.Ctx) ? x.data : x; });
    }
    exports_1("concat", concat);
    function refObservable(ref, cmp) {
        if (!cmp.jbEmitter) {
            console.log('no emitter in cmp');
            return Observable_1.Observable.of();
        }
        return cmp.jbEmitter
            .filter(function (x) { return x == 'check'; })
            .map(function () {
            return jb_1.jb.val(ref);
        })
            .distinctUntilChanged(jb_compareArrays);
    }
    exports_1("refObservable", refObservable);
    function observableFromCtx(ctx) {
        var res, obj = ctx.data;
        if (!obj)
            return Observable_1.Observable.of(ctx.setData('starter'));
        else if (obj.$pipe)
            return obj.$pipe(Observable_1.Observable.of(ctx.setData('starter')));
        else if (obj.subscribe)
            return mapToCtx(obj);
        else if (obj.then)
            return mapToCtx(Observable_1.Observable.fromPromise(obj));
        else if (Array.isArray(obj))
            return mapToCtx(Observable_1.Observable.fromArray(obj));
        else
            return Observable_1.Observable.of(ctx);
        function mapToCtx(obs) {
            return obs.map(function (x) { return (x instanceof jb_1.jb.Ctx) ? x : ctx.setData(x); });
        }
    }
    exports_1("observableFromCtx", observableFromCtx);
    function pipe(profiles, observable, context) {
        return profiles.reduce(function (aggregated, prof, _index) {
            if (jb_1.jb.isProfOfType(prof, 'rx.elem'))
                return context.runInner(prof, null, _index).$pipe(aggregated);
            return aggregated.concatMap(function (ctx) {
                //var ctx = context.setData(ctx.data);
                var res = jb_1.jb.toarray(ctx.runInner(prof, null, _index)).map(function (data) {
                    return ctxWithVar(ctx.setData(data), prof);
                });
                return Observable_1.Observable.prototype.concat.apply(Observable_1.Observable.of(), res.map(function (ctx2) {
                    return observableFromCtx(ctx2).catch(function (e) { debugger; });
                }));
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
            if (Observable_1.Observable.isObservable(ret))
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
            function (Subject_1_1) {
                Subject_1 = Subject_1_1;
                exports_1({
                    "Subject": Subject_1_1["Subject"]
                });
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
                exports_1({
                    "Observable": Observable_1_1["Observable"]
                });
            },
            function (_1) {},
            function (_2) {},
            function (_3) {},
            function (_4) {},
            function (_5) {},
            function (_6) {},
            function (_7) {},
            function (_8) {},
            function (_9) {},
            function (_10) {},
            function (_11) {},
            function (_12) {},
            function (_13) {},
            function (_14) {},
            function (_15) {},
            function (_16) {},
            function (_17) {},
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            ;
            // for debug console
            window.Observable = Observable_1.Observable;
            window.Subject = Subject_1.Subject;
            jb_initJstypes();
            jbart.jstypes.observable = function (obj, ctx) {
                return observableFromCtx(ctx.setData(obj));
            };
            jb_1.jb.type('rx.elem');
            jb_1.jb.component('rxLog', {
                type: 'rx.elem',
                params: [
                    { id: 'pipe', as: 'observable' }
                ],
                impl: function (ctx, pipe) {
                    return pipe.subscribe(function (x) { return console.log(x.data); });
                }
            });
            jb_1.jb.component('rxPipe', {
                type: 'rx.elem',
                params: [
                    { id: 'items', type: 'data,rx.elem[]', ignore: true, essential: true }
                ],
                impl: function (context) {
                    return {
                        $pipe: function (obs) {
                            var profiles = jb_toarray(context.profile.items || context.profile['$rxPipe'] || context.profile['$pipeline']);
                            return pipe(profiles, obs, context);
                        }
                    };
                }
            });
            jb_1.jb.component('rxFilter', {
                type: 'rx.elem',
                params: [
                    { id: 'filter', type: 'boolean', dynamic: true }
                ],
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
                params: [
                    { id: 'item', dynamic: true },
                ],
                impl: function (context, item, keepOrder) {
                    return { $pipe: function (obs) {
                            return obs.flatMap(function (ctx) {
                                return Observable_1.Observable.prototype.merge.apply(Observable_1.Observable.of(), jb_1.jb.toarray(item(ctx)).map(function (data) { return observableFromCtx(ctx.setData(data)); }));
                            });
                        }
                    };
                }
            });
            jb_1.jb.component('rxParallelKeepOrder', {
                type: 'rx.elem',
                params: [
                    { id: 'item', dynamic: true },
                ],
                impl: function (context, item, keepOrder) {
                    return { $pipe: function (obs) {
                            var parallel_results = [], emitted = 0;
                            var out = new Subject_1.Subject();
                            obs.flatMap(function (ctx, i) {
                                return Observable_1.Observable.prototype.concat.apply(Observable_1.Observable.of(), jb_1.jb.toarray(item(ctx)).map(function (data) {
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
                            }, function (x) { return jb_1.jb.logError('rxParallelKeepOrder'); }, function () {
                                return out.complete();
                            });
                            return out;
                        } };
                }
            });
            jb_1.jb.component('rx.distinctUntilChanged', {
                type: 'rx.elem',
                params: [
                    { id: 'keySelector', type: 'rx.keySelector' },
                    { id: 'comparer', type: 'rx.comparer' },
                ],
                impl: function (context) { return ({ $pipe: function (obs) {
                        return obs.concatMap(function (ctx) {
                            return obs.map(function (ctx) { return ctx.data; })
                                .distinctUntilChanged(keySelector, comparer)
                                .flatMap(function (x) { return ctx; });
                        });
                    }
                }); }
            });
            jb_1.jb.component('rx.concat', {
                type: 'rx.elem',
                params: [
                    { id: 'items', type: 'data,rx.elem[]', ignore: true, essential: true }
                ],
                impl: function (context, items) { return ({
                    $pipe: function (obs) {
                        var profiles = jb_toarray(context.profile.items);
                        var inner_pipe = pipe(profiles, Observable_1.Observable.of(context), context);
                        return obs.concat(inner_pipe);
                    }
                }); }
            });
            jb_1.jb.component('rx.subject', {
                type: 'rx.subject,rx.observable,rx.observer',
                params: [
                    { id: 'pipe', type: 'rx.elem', dynamic: true, defaultValue: { $: 'rx.distinctUntilChanged' } },
                ],
                impl: function (context, pipe) {
                    var subject = new Subject_1.Subject();
                    return Subject_1.Subject.create(function (x) { return subject.next(x); }, pipe().$pipe(subject));
                }
            });
            jb_1.jb.component('rx.emit', {
                type: 'action',
                params: [
                    { id: 'from', as: 'observable' },
                    { id: 'to', type: 'rx.observer' },
                ],
                impl: function (context, from, _to) {
                    from.subscribe(function (item) { return _to.next(item); });
                }
            });
            jb_1.jb.component('rx.urlPath', {
                type: 'application-feature',
                params: [
                    { id: 'params', type: 'data[]', as: 'array' },
                    { id: 'databind', as: 'single', essential: true },
                    { id: 'base', as: 'string' },
                    { id: 'zoneId', as: 'string' },
                ],
                impl: function (context, params, databind, base, zoneId) {
                    if (jbart.location)
                        return;
                    if (!databind || typeof databind != 'object')
                        return console.log('no databind for rx.urlPath');
                    var browserUrlEm = new Subject_1.Subject();
                    jbart.location = History.createHistory();
                    jbart.location.path = function () { return location.pathname; };
                    jbart.location.listen(function (x) {
                        return browserUrlEm.next(x.pathname);
                    });
                    function urlToObj(path) {
                        var vals = path.substring(path.indexOf(base) + base.length).split('/')
                            .map(function (x) { return decodeURIComponent(x); });
                        var res = {};
                        params.forEach(function (p, i) {
                            return res[p] = (vals[i + 1] || '');
                        });
                        return res;
                    }
                    function objToUrl(obj) {
                        var split_base = jbart.location.path().split("/" + base);
                        var url = split_base[0] + ("/" + base + "/") +
                            params.map(function (p) { return obj[p] || ''; })
                                .join('/');
                        return url.replace(/\/*$/, '');
                    }
                    var databindEm = context.vars.ngZone.onUnstable
                        .map(function () { return databind; })
                        .filter(function (obj) {
                        return obj.project;
                    })
                        .map(function (obj) {
                        return objToUrl(obj);
                    });
                    browserUrlEm.merge(databindEm)
                        .startWith(jbart.location.path())
                        .distinctUntilChanged()
                        .subscribe(function (url) {
                        jbart.location.push(url);
                        jb_1.jb.extend(databind, urlToObj(url));
                    });
                }
            });
            // ************** tests ******************
            jb_1.jb.component('rx-test', {
                type: 'test',
                params: [
                    { id: 'result', as: 'observable', dynamic: true },
                    { id: 'expectedResult', type: 'boolean', dynamic: true },
                    { id: 'timeout', as: 'number', defaultValue: 5000 }
                ],
                impl: function (context, result, expectedResult, timeout) {
                    var res = result();
                    return expectedResult(context.setData(res))
                        .map(function (ctx) {
                        return ({ id: context.vars.testID, success: ctx.data });
                    });
                }
            });
            jb_1.jb.component('containsSeq', {
                type: 'boolean',
                params: [
                    { id: 'seq', type: 'data[]', as: 'array' },
                    { id: 'observable', defaultValue: '%%', as: 'observable' }
                ],
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
