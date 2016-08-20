System.register(['jb-core', 'jb-ui/jb-rx', './studio-tgp-model', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx, studio_tgp_model_1, studio_utils_1;
    var Probe, bridge;
    function testControl(ctx, emitter, forTests) {
        // test the control as a dialog
        return new Promise(function (resolve, reject) {
            var _jbart = studio_utils_1.jbart_base();
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
                            debugger;
                            dialog.close();
                            resolve();
                        })
                            .subscribe(function (x) {
                            emitter.next({ element: cmp.elementRef.nativeElement });
                            if (!forTests)
                                jb_core_1.jb.delay(1).then(function () { return dialog.close(); }); // delay to avoid race conditin with itself
                            resolve();
                            console.log('close test dialog');
                        });
                    },
                    css: '{display: none}'
                })
            };
            console.log('add test dialog');
            _win.jbart.jb_dialogs.addDialog(dialog, ctx);
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
            }],
        execute: function() {
            Probe = (function () {
                function Probe(pathToTrace, context, depth, forTests) {
                    this.pathToTrace = pathToTrace;
                    this.context = context;
                    this.depth = depth;
                    this.forTests = forTests;
                    this.probe = {};
                    context.probe = this;
                    this.circuit = this.context.profile;
                }
                Probe.prototype.runCircuitNoGaps = function () {
                    var _win = jbart.previewWindow || window;
                    if (studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'control')) {
                        return testControl(this.context, this.em, this.forTests);
                    }
                    else if (!studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(this.circuit), 'action')) {
                        return Promise.resolve(_win.jb_run(this.context));
                    }
                };
                Probe.prototype.observable = function () {
                    var _this = this;
                    this.em = new jb_rx.Subject();
                    this.probe[this.pathToTrace] = [];
                    this.probe[this.pathToTrace].visits = 0;
                    this.runCircuitNoGaps().then(function () {
                        _this.em.next({ finalResult: _this.probe[_this.pathToTrace] });
                        _this.em.complete();
                    });
                    return this.em;
                };
                Probe.prototype.record = function (context, parentParam) {
                    var input = context.ctx({});
                    input.probe = null;
                    var out = input.runItself(parentParam);
                    this.probe[this.pathToTrace].visits++;
                    var found = this.probe[this.pathToTrace].map(function (x) { return x.in.data; }).indexOf(input.data);
                    if (found != -1)
                        this.probe[this.pathToTrace][found].counter++;
                    else
                        this.probe[this.pathToTrace].push({ in: input, out: jb_val(out), counter: 0 });
                    return out;
                };
                return Probe;
            }());
            exports_1("Probe", Probe);
            jb_core_1.jb.component('studio.probe', {
                type: 'data',
                params: { path: { as: 'string', dynamic: true } },
                impl: function (ctx, path) {
                    var _jbart = studio_utils_1.jbart_base();
                    var _win = jbart.previewWindow || window;
                    var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
                    var context = _win.jb_ctx(_jbart.initialCtx, { profile: { $: circuit }, comp: circuit, path: '', data: '', fullPath: circuit });
                    return new Probe(path(), context).observable().toPromise();
                }
            });
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
        }
    }
});
// bridge(path,inCtx) {
//   var compName = model.compName(studio.parentPath(path));
//   var prop = path.split('~').pop();
//   if (!bridge[compName] || !bridge[compName][prop])
//     return;
//   if (bridge[compName][prop] == 'default')
//     return jb.ctx(ctx,{ profile: profile[prop], path: prop })
//   return bridge[compName][prop](path,inCtx);
// }
// return this.runCircuitNoGaps().then(()=>{
//   if (this.probe[this.pathToTrace].length > 0) {
//     _jbart.probe = null;
//     return this.probe[this.pathToTrace];
//   } else {
//     return this.rerunCircuit();
//   }
// })
// rerunCircuit() {
//   var path_parts = this.pathToTrace.split('~');
//   var sub_paths = path_parts.map((e,i)=>
//     path_parts.slice(0,i+1).join('~')).reverse();
//   var gapToRun = sub_paths
//     .filter(p=>
//       this.probe[p] && this.probe[p].length)
//     .map(p=>
//       this.bridge(p,this.probe[p][0].in))
//     .filter(x=>x)
//     [0];
//   if (gapToRun)
//     return new Probe(this.pathToTrace,gapToRun,(this.depth||0)+1).run();
// }
// traceGaps(context,parentParam) {
//   if (context.path.indexOf('data-tests') == 0)
//     console.log('running at',context.path, 'looking for ' + this.pathToTrace);
//   if (typeof context.profile == 'object' && jb.compName(context.profile))
//     jb.entries(context.profile)
//       .filter(p=>
//         p[0].indexOf('on') == 0 || p[0].indexOf('action') == 0)
//       .forEach(p => 
//         this.doTraceGaps(p[0],context))
// }
// doTraceGaps(prop,context) { // for action paths
//     var _win = jbart.previewWindow || window;
//     var path = context.path + '~' + prop;
//     var compName = model.compName(path);
//     var ctx = _win.jb_ctx(context, { profile: context.profile[prop], path: prop});
//     var propCtx = _win.jb_prepare(ctx).ctx;
//     this.probe[path] = [{in: propCtx }];
//     jb.entries(bridge[compName])
//       .map(p=>path+'~'+p[0])
//       .forEach(inner_path=> {
//           this.probe[inner_path] = [{in: propCtx }]
//         })
// }
// setTrace() {
//   this.clearTrace();
//   var profile = studio.profileFromPath(this.pathToTrace);
//   if (jb.compName(profile))
//     profile.$jbProbe = true;
//   else if (typeof profile == 'string') {
//     var profileRef = studio.profileRefFromPath(this.pathToTrace);
//     jb.writeValue(profileRef,`$jbProbe:${profile}`)
//   }
// }
// clearTrace() {
//   var profile = studio.profileFromPath(this.pathToTrace);
//   if (jb.compName(profile))
//     delete profile.$jbProbe;
//   else if (typeof profile == 'string' && profile.indexOf('$jbProbe:') == 0) {
//     var profileRef = studio.profileRefFromPath(this.pathToTrace);
//     jb.writeValue(profileRef,profile.substr(7))
//   }
// } 
