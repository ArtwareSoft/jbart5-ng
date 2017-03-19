System.register(['jb-core', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx;
    var modifyOperationsEm, pathChangesEm;
    function notifyModification(path, before, ctx, ngPath) {
        var comp = path.split('~')[0];
        modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, ctx: ctx, jbart: findjBartToLook(path), ngPath: ngPath });
    }
    exports_1("notifyModification", notifyModification);
    function message(message, error) {
        $('.studio-message').text(message); // add animation
        $('.studio-message').css('background', error ? 'red' : '#327DC8');
        $('.studio-message').css('animation', '');
        jb_core_1.jb.delay(1).then(function () {
            return $('.studio-message').css('animation', 'slide_from_top 5s ease');
        });
    }
    exports_1("message", message);
    function jbart_base() {
        return jbart.previewjbart || jbart;
    }
    exports_1("jbart_base", jbart_base);
    function findjBartToLook(path) {
        var id = path.split('~')[0];
        if (jbart_base().comps[id])
            return jbart_base();
        if (jbart.comps[id])
            return jbart;
    }
    exports_1("findjBartToLook", findjBartToLook);
    function getComp(id) {
        return jbart_base().comps[id] || jbart.comps[id];
    }
    exports_1("getComp", getComp);
    function compAsStr(id) {
        return jb_prettyPrintComp(id, getComp(id));
    }
    exports_1("compAsStr", compAsStr);
    function compAsStrFromPath(path) {
        return compAsStr(path.split('~')[0]);
    }
    exports_1("compAsStrFromPath", compAsStrFromPath);
    function evalProfile(prof_str) {
        try {
            return eval('(' + prof_str + ')');
        }
        catch (e) {
            jb_core_1.jb.logException(e, 'eval profile:' + prof_str);
        }
    }
    exports_1("evalProfile", evalProfile);
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            exports_1("modifyOperationsEm", modifyOperationsEm = new jb_rx.Subject());
            //export var studioActivityEm = new jb_rx.Subject();
            exports_1("pathChangesEm", pathChangesEm = new jb_rx.Subject());
            // ********* Components ************
            jb_core_1.jb.component('studio.message', {
                type: 'action',
                params: [{ id: 'message', as: 'string' }],
                impl: function (ctx, message) {
                    return message(message);
                }
            });
            jb_core_1.jb.component('studio.redraw-studio', {
                type: 'action',
                impl: function () {
                    return jbart.redrawStudio && jbart.redrawStudio();
                }
            });
            jb_core_1.jb.component('studio.goto-path', {
                type: 'action',
                params: [
                    { id: 'path', as: 'string' },
                ],
                impl: { $runActions: [
                        { $: 'writeValue', to: '%$globals/profile_path%', value: '%$path%' },
                        { $: 'studio.open-properties' },
                        { $: 'studio.open-control-tree' }
                    ] }
            });
            jb_core_1.jb.component('studio.project-source', {
                params: [
                    { id: 'project', as: 'string', defaultValue: '%$globals/project%' }
                ],
                impl: function (context, project) {
                    if (!project)
                        return;
                    var comps = jb_core_1.jb.entries(jbart_base().comps).map(function (x) { return x[0]; }).filter(function (x) { return x.indexOf(project) == 0; });
                    return comps.map(function (comp) { return compAsStr(comp); }).join('\n\n');
                }
            });
            jb_core_1.jb.component('studio.comp-source', {
                params: [
                    { id: 'comp', as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                ],
                impl: function (context, comp) {
                    return compAsStr(comp.split('~')[0]);
                }
            });
            jb_core_1.jb.component('studio.onNextModifiedPath', {
                type: 'action',
                params: [
                    { id: 'action', type: 'action', dynamic: true, essential: true }
                ],
                impl: function (ctx, action) {
                    return modifyOperationsEm.take(1).delay(1)
                        .subscribe(function (e) {
                        return action(ctx.setVars({ modifiedPath: e.args.modifiedPath }));
                    });
                }
            });
            jb_core_1.jb.component('studio.bindto-modifyOperations', {
                type: 'feature',
                params: [
                    { id: 'path', essential: true, as: 'string' },
                    { id: 'data', as: 'ref' }
                ],
                impl: function (context, path, data_ref) { return ({
                    init: function (cmp) {
                        return modifyOperationsEm
                            .takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                            .filter(function (e) {
                            return e.path == path;
                        })
                            .subscribe(function (e) {
                            return jb_core_1.jb.writeValue(data_ref, true);
                        });
                    },
                    jbEmitter: true,
                }); }
            });
            jb_core_1.jb.component('studio.dynamic-options-watch-new-comp', {
                type: 'feature',
                impl: { $: 'picklist.dynamic-options',
                    recalcEm: function () {
                        return modifyOperationsEm.filter(function (e) {
                            return e.newComp;
                        });
                    }
                }
            });
        }
    }
});
