System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    function runCircuit(context, circuit) {
        if (studio.model.isOfType(circuit, 'control'))
            return testControl(circuit, context);
        else
            return Promise.resolve(_win.jb_run(context));
    }
    function testControl(compName, ctx) {
        return new Promise(function (resolve, reject) {
            ctx.run({ $: 'openDialog',
                content: { $: compName },
                features: function (ctx2) { return ({
                    observable: function (cmp_obs) {
                        return cmp_obs.filter(function (x) {
                            return x == 'ready';
                        })
                            .take(1)
                            .catch(function (e) {
                            return resolve();
                        })
                            .subscribe(function (x) {
                            resolve();
                            ctx2.run({ $: 'closeContainingPopup' });
                        });
                    },
                    css: '{display: none}'
                }); }
            });
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.probe', {
                type: 'data',
                params: { path: { as: 'string', dynamic: true } },
                impl: function (ctx, path) {
                    var _path = path();
                    if (!_path)
                        return [];
                    var _jbart = studio.jbart_base();
                    var _win = (jbart.previewWindow || window);
                    _jbart.probe = _jbart.probe || {};
                    _jbart.probe[_path] = [];
                    _jbart.probe.trace = _path;
                    //     _jbart.trace_paths = true;
                    var circuit = ctx.exp('%$circuit%') || ctx.exp('%$globals/project%.%$globals/page%');
                    var context = _win.jb_ctx(_jbart.initialCtx, { profile: { $: circuit }, comp: circuit, path: '', data: '' });
                    return runCircuit(context, circuit).then(function () {
                        if (_jbart.probe[_path].length == 0)
                            _jbart.probe[_path].push({ in: context });
                        return _jbart.probe[_path];
                    });
                }
            });
        }
    }
});
