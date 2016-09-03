System.register(['jb-core', 'jb-ui/jb-rx', './studio-tgp-model', './studio-path'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx, studio_tgp_model_1, studio_path_1;
    var modifyOperationsEm, studioActivityEm, pathChangesEm;
    function notifyModification(path, before, ctx) {
        var comp = path.split('~')[0];
        modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, ctx: ctx, jbart: findjBartToLook(path) });
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
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            },
            function (studio_path_1_1) {
                studio_path_1 = studio_path_1_1;
            }],
        execute: function() {
            exports_1("modifyOperationsEm", modifyOperationsEm = new jb_rx.Subject());
            exports_1("studioActivityEm", studioActivityEm = new jb_rx.Subject());
            exports_1("pathChangesEm", pathChangesEm = new jb_rx.Subject());
            jbart.modifiedCtrlsEm = modifyOperationsEm.flatMap(function (x) {
                var path_parts = x.path.split('~');
                var sub_paths = path_parts.map(function (e, i) {
                    return path_parts.slice(0, i + 1).join('~');
                }).reverse();
                var firstCtrl = sub_paths
                    .filter(function (p) {
                    return studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(studio_path_1.profileFromPath(p)), 'control');
                })[0];
                return firstCtrl ? [{ path: firstCtrl }] : [];
            });
            // ********* Components ************
            jb_core_1.jb.component('studio.message', {
                type: 'action',
                params: [{ id: 'message', as: 'string' }],
                impl: function (ctx, message) {
                    return message(message);
                }
            });
            jb_core_1.jb.component('studio.refreshPreview', {
                type: 'action',
                impl: function () {
                    if (jbart.previewjbart)
                        jbart.previewjbart.previewRefreshCounter = (jbart.previewjbart.previewRefreshCounter || 0) + 1;
                }
            });
            jb_core_1.jb.component('studio.redrawStudio', {
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
            jb_core_1.jb.component('studio.projectSource', {
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
            jb_core_1.jb.component('studio.compSource', {
                params: [
                    { id: 'comp', as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                ],
                impl: function (context, comp) {
                    return compAsStr(comp.split('~')[0]);
                }
            });
        }
    }
});
