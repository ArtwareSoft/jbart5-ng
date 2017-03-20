System.register(['jb-core', 'jb-ui/jb-rx', './studio-tgp-model', './studio-utils', './studio-path'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx, studio_tgp_model_1, studio_utils_1, studio_path_1;
    var Probe;
    function testControl(ctx, forTests) {
        // test the control as a dialog
        return new Promise(function (resolve, reject) {
            var _win = ctx.win();
            var dialog = {
                id: 'test-control',
                em: new jb_rx.Subject(),
                comp: ctx.runItself().jbExtend({
                    jbEmitter: true,
                    init: function (cmp) {
                        return cmp.jbEmitter.filter(function (e) {
                            return e == 'ready' || e == 'destroy';
                        })
                            .take(1)
                            .catch(function (e) {
                            debugger;
                            dialog.close();
                            resolve();
                        })
                            .subscribe(function (x) {
                            if (!forTests)
                                jb_core_1.jb.delay(1, ctx).then(function () { return dialog.close(); }); // delay to avoid race conditin with itself
                            //            console.log('close test dialog',ctx.id);
                            resolve({ element: cmp.elementRef.nativeElement });
                        });
                    },
                    css: '{display: none}'
                })
            };
            //    console.log('add test dialog');
            _win.jbart.jb_dialogs.addDialog(dialog, ctx);
            //    console.log('create test dialog',ctx.id);
            _win.setTimeout(function () { }, 1); // refresh
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            },
            function (studio_path_1_1) {
                studio_path_1 = studio_path_1_1;
            }],
        execute: function() {
            Probe = (function () {
                function Probe(ctx, forTests) {
                    this.forTests = forTests;
                    if (ctx.probe)
                        debugger;
                    this.context = ctx.ctx({});
                    this.probe = {};
                    this.context.probe = this;
                    this.circuit = this.context.profile;
                }
                Probe.prototype.runCircuit = function (pathToTrace) {
                    var _this = this;
                    this.pathToTrace = pathToTrace;
                    this.probe[this.pathToTrace] = [];
                    this.probe[this.pathToTrace].visits = 0;
                    return this.simpleRun().then(function (res) {
                        return _this.handleGaps().then(function (res2) {
                            return jb_core_1.jb.extend({ finalResult: _this.probe[_this.pathToTrace],
                                probe: _this,
                                circuit: jb_core_1.jb.compName(_this.circuit),
                            }, res, res2);
                        });
                    });
                };
                Probe.prototype.simpleRun = function () {
                    var _win = jbart.previewWindow || window;
                    if (studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'control'))
                        this.circuitType = 'control';
                    else if (studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'action'))
                        this.circuitType = 'action';
                    else if (studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'data'))
                        this.circuitType = 'data';
                    else
                        this.circuitType = 'unknown';
                    if (this.circuitType == 'control')
                        return testControl(this.context, this.forTests);
                    else if (this.circuitType != 'action')
                        return Promise.resolve(_win.jb_run(this.context));
                };
                Probe.prototype.handleGaps = function () {
                    if (this.probe[this.pathToTrace].length == 0) {
                        // find closest path
                        var _path = studio_path_1.parentPath(this.pathToTrace);
                        while (!this.probe[_path] && _path.indexOf('~') != -1)
                            _path = studio_path_1.parentPath(_path);
                        if (this.probe[_path])
                            this.probe[this.pathToTrace] = this.probe[_path];
                    }
                    return Promise.resolve();
                };
                Probe.prototype.record = function (context, parentParam) {
                    var path = context.path;
                    var input = context.ctx({});
                    var out = input.runItself(parentParam, { noprobe: true });
                    if (!this.probe[path]) {
                        this.probe[path] = [];
                        this.probe[path].visits = 0;
                    }
                    this.probe[path].visits++;
                    var found;
                    this.probe[path].forEach(function (x) {
                        found = jb_compareArrays(x.in.data, input.data) ? x : found;
                    });
                    if (found)
                        found.counter++;
                    else
                        this.probe[path].push({ in: input, out: jb_val(out), counter: 0 });
                    return out;
                };
                return Probe;
            }());
            exports_1("Probe", Probe);
            jb_core_1.jb.component('studio.probe', {
                type: 'data',
                params: [{ id: 'path', as: 'string', dynamic: true }],
                impl: function (ctx, path) {
                    var context = ctx.exp('%$globals/last_pick_selection%');
                    if (!context) {
                        var _jbart = studio_utils_1.jbart_base();
                        var _win = jbart.previewWindow || window;
                        var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
                        context = _win.jb_ctx(_jbart.initialCtx, { profile: { $: circuit }, comp: circuit, path: '', data: null });
                    }
                    return new Probe(context).runCircuit(path());
                }
            });
            // watch & fix path changes
            studio_utils_1.pathChangesEm.subscribe(function (fixer) {
                var ctx = jbart.initialCtx && jbart.initialCtx.exp('%$globals/last_pick_selection%');
                if (ctx && ctx.path)
                    ctx.path = fixer.fix(ctx.path);
            });
        }
    }
});
