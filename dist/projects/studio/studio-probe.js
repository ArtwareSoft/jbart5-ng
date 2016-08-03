System.register(['jb-core', './studio-model', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio, jb_rx;
    var Probe, bridge;
    function testControl(ctx) {
        // test the control as a dialog
        return new Promise(function (resolve, reject) {
            var _jbart = studio.jbart_base();
            var _win = jbart.previewWindow || window;
            var dialog = {
                id: 'test-control',
                em: new jb_rx.Subject(),
                comp: _win.jb_run(ctx).jbExtend({
                    observable: function (cmp_obs, cmp) {
                        return cmp_obs.filter(function (e) {
                            return e == 'ready';
                        })
                            .take(1)
                            .catch(function (e) {
                            dialog.close();
                            resolve();
                        })
                            .subscribe(function (x) {
                            dialog.close();
                            resolve();
                            console.log('close dialog');
                        });
                    },
                    css: '{display: none}'
                })
            };
            console.log('add dialog');
            _win.jbart.jb_dialogs.addDialog(dialog, ctx);
            _win.setTimeout(function () { }, 1); // refresh
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            Probe = (function () {
                function Probe(pathToTrace, context, depth) {
                    this.pathToTrace = pathToTrace;
                    this.context = context;
                    this.depth = depth;
                    this.probe = {};
                    this.circuit = this.context.profile;
                }
                Probe.prototype.traceGaps = function (context, parentParam) {
                    var _this = this;
                    if (context.path.indexOf('data-tests') == 0)
                        console.log('running at', context.path, 'looking for ' + this.pathToTrace);
                    if (typeof context.profile == 'object' && jb_core_1.jb.compName(context.profile))
                        jb_core_1.jb.entries(context.profile)
                            .filter(function (p) {
                            return p[0].indexOf('on') == 0 || p[0].indexOf('action') == 0;
                        })
                            .forEach(function (p) {
                            return _this.doTraceGaps(p[0], context);
                        });
                };
                Probe.prototype.doTraceGaps = function (prop, context) {
                    var _this = this;
                    var _win = jbart.previewWindow || window;
                    var path = context.path + '~' + prop;
                    var compName = studio.model.compName(path);
                    var ctx = _win.jb_ctx(context, { profile: context.profile[prop], path: prop });
                    var propCtx = _win.jb_prepare(ctx).ctx;
                    this.probe[path] = [{ in: propCtx }];
                    jb_core_1.jb.entries(bridge[compName])
                        .map(function (p) { return path + '~' + p[0]; })
                        .forEach(function (inner_path) {
                        _this.probe[inner_path] = [{ in: propCtx }];
                    });
                };
                Probe.prototype.runCircuitNoGaps = function () {
                    var _win = jbart.previewWindow || window;
                    if (studio.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'control'))
                        return testControl(this.context);
                    else if (!studio.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'action'))
                        return Promise.resolve(_win.jb_run(this.context));
                };
                Probe.prototype.runCircuitWithGaps = function () {
                    var _this = this;
                    var _jbart = studio.jbart_base();
                    _jbart.probe = this;
                    this.probe[this.pathToTrace] = [];
                    return this.runCircuitNoGaps().then(function () {
                        if (_this.probe[_this.pathToTrace].length > 0) {
                            _jbart.probe = null;
                            return _this.probe[_this.pathToTrace];
                        }
                        else {
                            return _this.rerunCircuit();
                        }
                    });
                };
                Probe.prototype.rerunCircuit = function () {
                    var _this = this;
                    var path_parts = this.pathToTrace.split('~');
                    var sub_paths = path_parts.map(function (e, i) {
                        return path_parts.slice(0, i + 1).join('~');
                    }).reverse();
                    var gapToRun = sub_paths
                        .filter(function (p) {
                        return _this.probe[p] && _this.probe[p].length;
                    })
                        .map(function (p) {
                        return _this.bridge(p, _this.probe[p][0].in);
                    })
                        .filter(function (x) { return x; })[0];
                    if (gapToRun)
                        return new Probe(this.pathToTrace, gapToRun, (this.depth || 0) + 1).runCircuitWithGaps();
                };
                Probe.prototype.record = function (context, parentParam) {
                    var input = new jbCtx(context, {});
                    var out = jb_run(context, parentParam, { noprobe: true });
                    this.probe[context.path].push({ in: input, out: jb_val(out) });
                    return out;
                };
                Probe.prototype.bridge = function (path, inCtx) {
                    var compName = studio.model.compName(studio.parentPath(path));
                    var prop = path.split('~').pop();
                    if (!bridge[compName] || !bridge[compName][prop])
                        return;
                    if (bridge[compName][prop] == 'default')
                        return jb_core_1.jb.ctx(ctx, { profile: profile[prop], path: prop });
                    return bridge[compName][prop](path, inCtx);
                };
                return Probe;
            }());
            bridge = {
                openDialog: {
                    content: function (path, inCtx) {
                        return jb_core_1.jb.ctx(inCtx, {
                            profile: inCtx.profile.content,
                            path: 'content',
                            vars: { dialogData: {} }
                        });
                    }
                },
                writeValue: {
                    to: 'default',
                    value: 'default',
                }
            };
            jb_core_1.jb.component('studio.probe', {
                type: 'data',
                params: { path: { as: 'string', dynamic: true } },
                impl: function (ctx, path) {
                    var _jbart = studio.jbart_base();
                    var _win = jbart.previewWindow || window;
                    var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
                    var context = _win.jb_ctx(_jbart.initialCtx, { profile: { $: circuit }, comp: circuit, path: '', data: '' });
                    return new Probe(path(), context).runCircuitWithGaps();
                }
            });
        }
    }
});
