System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.type('group.style');
            jb_core_1.jb.component('group', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    style: { type: 'group.style', defaultValue: { $: 'group.section' }, essential: true, dynamic: true },
                    controls: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context) {
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.ctrls = [];
                            cmp.jbToExtend = cmp.jbToExtend || {};
                            cmp.extendChild = function (index, options) {
                                if (options)
                                    cmp.jbToExtend[index] = options;
                            };
                            cmp.initGroup = function () {
                                cmp.title = context.params.title(context);
                                var cmpEmitterFunc = jb_ui.controlsToGroupEmitter(context.params.controls, cmp);
                                cmpEmitterFunc(cmp.ctx).subscribe(function (comps) {
                                    cmp.ctrls = [];
                                    cmp.jb_disposable && cmp.jb_disposable.forEach(function (d) { return d(); });
                                    jb_core_1.jb.logPerformance('group-change');
                                    comps.forEach(function (comp, i) {
                                        if (!comp || comp.invisible)
                                            return;
                                        if (cmp.jbToExtend[i])
                                            comp.jbExtend(cmp.jbToExtend[i]);
                                        if (!comp.jb_title)
                                            debugger;
                                        cmp.ctrls.push({ title: comp.jb_title ? comp.jb_title() : '', comp: comp });
                                    });
                                });
                            };
                        }
                    });
                }
            });
            jb_core_1.jb.component('group.dynamic-sub-titles', {
                type: 'feature',
                impl: function (ctx) { return ({
                    doCheck: function (cmp) {
                        return (cmp.ctrls || []).forEach(function (ctrl) {
                            return ctrl.title = ctrl.comp.jb_title ? ctrl.comp.jb_title() : '';
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('dynamic-controls', {
                type: 'control',
                params: {
                    controlItems: { type: 'data', as: 'array', essential: true, dynamic: true },
                    genericControl: { type: 'control', essential: true, dynamic: true },
                    itemVariable: { as: 'string', defaultValue: 'controlItem' }
                },
                impl: function (context, controlItems, genericControl, itemVariable) {
                    return controlItems().map(function (controlItem) { return genericControl(context.setVars(jb_core_1.jb.obj(itemVariable, controlItem))); });
                }
            });
            jb_core_1.jb.component('group.initGroup', {
                type: 'feature',
                impl: function (ctx) {
                    return jb_core_1.jb.obj('init', function (cmp) { return cmp.initGroup(); });
                }
            });
            // ** sample style 
            jb_core_1.jb.component('group.section', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: '<section class="jb-group"><jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true"></jb_comp></section>',
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('wait', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    for: { essential: true },
                    resource: { as: 'string' },
                    dataVariable: { as: 'string' },
                    mapToResource: { dynamic: true, defaultValue: '%%' },
                    control: { type: 'control', dynamic: true },
                    loadingControl: { type: 'control', defaultValue: { $: 'label', title: 'loading ...' }, dynamic: true },
                    errorControl: { type: 'control', defaultValue: { $: 'label', title: 'error: %$error%', css: '{color: red; font-weight: bold}' }, dynamic: true },
                },
                impl: { $: 'group',
                    controls: { $: 'group',
                        controls: { $call: 'control' },
                        features: { $: 'var', name: '%$dataVariable%', value: '%%' }
                    },
                    features: { $: 'group.wait',
                        for: { $call: 'for' },
                        resource: '%$resource%',
                        mapToResource: { $call: 'mapToResource' },
                        loadingControl: { $call: 'loadingControl' },
                        error: { $call: 'errorControl' },
                    }
                }
            });
        }
    }
});
