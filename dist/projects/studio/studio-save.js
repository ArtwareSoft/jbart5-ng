System.register(['jb-core', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_utils_1;
    var modified;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            modified = {};
            studio_utils_1.modifyOperationsEm.subscribe(function (e) {
                var comp = e.comp;
                if (!modified[comp]) {
                    modified[comp] = { original: e.before || '' };
                }
            });
            jb_core_1.jb.component('studio.saveComponents', {
                params: [
                    { id: 'force', as: 'boolean', type: 'boolean' }
                ],
                impl: { $rxLog: { $rxPipe: [
                            function (ctx) { return jb_core_1.jb.entries(modified).map(function (x) {
                                return ({ key: x[0], val: x[1] });
                            }); },
                            function (ctx) {
                                var comp = ctx.data.key;
                                studio_utils_1.message('saving ' + comp);
                                if (ctx.exp('%$force%') && !ctx.data.val.original)
                                    ctx.data.val.original = "jb.component('" + comp + "', {";
                                return $.ajax({
                                    url: "/?op=saveComp&comp=" + comp + "&project=" + ctx.exp('%$globals/project%') + "&force=" + ctx.exp('%$force%'),
                                    type: 'POST',
                                    data: JSON.stringify({ original: ctx.data.val && ctx.data.val.original, toSave: studio_utils_1.compAsStr(comp) }),
                                    headers: { 'Content-Type': 'text/plain' }
                                }).then(function (result) {
                                    studio_utils_1.message((result.type || '') + ': ' + (result.desc || '') + (result.message || ''), result.type != 'success');
                                    if (result.type == 'success')
                                        delete modified[comp];
                                }, function (e) {
                                    studio_utils_1.message('error saving: ' + e);
                                    jb_core_1.jb.logException(e, 'error while saving ' + comp);
                                });
                            }
                        ] },
                    $vars: {
                        force: '%$force%'
                    }
                }
            });
        }
    }
});
