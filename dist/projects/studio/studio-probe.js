System.register(['jb-core', './studio-model', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio, jb_rx;
    function probeResult(path, ctx) {
        return jb_rx.Observable.create(function (observer) {
            //studio.model.writeValue(path+'~$jb_probe',{value:path});
            var jbart = studio.jbart_base();
            jbart.probes = jbart.probes || {};
            jbart.probes[path] = new jb_rx.Subject();
            Promise.resolve(runCircuit(path, ctx)).then(function () {
                //studio.model._delete(path+'~$jb_probe');
                jbart.probes[path].onCompleted();
            });
            return jbart.probes[path];
        });
    }
    function runCircuit(path, ctx) {
        return ctx.run({ $: 'studio.refreshPreview' });
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
            jb_core_1.jb.component('studio.probe', {
                type: 'data',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return probeResult(path);
                }
            });
            jb_core_1.jb.component('studio.showProbeData', {
                type: 'action',
                impl: {
                    $: 'openDialog',
                    title: 'probe - %$globals/profile_path%',
                    style: { $: 'dialog.studio-floating', id: 'probe', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'group',
                        $vars: { selected: { $: 'object' } },
                        controls: [
                            { $: 'itemlog',
                                title: 'input',
                                items: { $: 'studio.start-probe', path: { $: 'studio.currentProfilePath' } },
                                controls: { $: 'studio.context-view' },
                                features: { $: 'itemlog.selection', databind: '%$selected/ctx%' },
                            },
                            { $: 'group',
                                features: { $: 'group.watch', data: '%$selected/ctx%' },
                                controls: { $: 'studio.output-view', path: { $: 'studio.currentProfilePath' }, ctx: '%$selected/ctx%' }
                            }
                        ]
                    }
                }
            });
        }
    }
});
// jb.component('studio.context-view', {
//   type: 'control',
//   impl :{$: 'label', title :{$: 'studio.contextToString'} }
// })
// jb.component('studio.output-view', {
//   type: 'control',
//   params: {
//     path: { as: 'string' },
//     ctx: { as: 'single' },
//   },
//   impl: function(context,path,ctx) {
//     var res = ctx.run(studio.profileValFromPath(path));
//     var ctrl = 'single';
//     if (res.jb_title)
//       ctrl = 'comp';
//     else if (Array.isArray(res))
//       ctrl = 'array';
//     return context.setVars({toShow: res}).run({ $: 'studio.output-' + ctrl });
//   }
// })
// jb.component('studio.output-comp', {
//   type: 'control',
//   params: {
//     toShow: { as: 'single' },
//   },
//   impl :{$: 'label', title :{$: 'studio.compToString' , toShow: '%$toShow%'} }
// })
// jb.component('studio.contextToString', {
//   type: 'data',
//   impl: function(context) {
//     return jb_toarray(context.data.data || context.data.vars)
//       .map(val =>(typeof val == 'object') ? JSON.stringify(val,null,' ') : val)
//       .join('\n');
//   }
// });
// jb.component('studio.compToString', {
//   type: 'data',
//   impl: function(context) {
//     var comp = context.vars.toShow;
//     var annotations = Reflect.getMetadata('annotations', comp)[0];
//     return [
//       comp.jb$title, 
//       annotations.template, 
//       JSON.stringify(jb.extend({},annotations.host))
//     ].join('\n');
//   }
// }); 
