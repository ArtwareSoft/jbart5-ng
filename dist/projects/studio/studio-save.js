System.register(['jb-core', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio;
    var modified;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            modified = {};
            studio.modifyOperationsEm.subscribe(function (e) {
                var comp = e.comp;
                if (!modified[comp])
                    modified[comp] = { original: e.before || '' };
            });
            jb_core_1.jb.component('studio.saveComponents', {
                params: {
                    force: { as: 'boolean', type: 'boolean' }
                },
                impl: { $rxLog: [
                        function (ctx) { return jb_core_1.jb.entries(modified).map(function (x) {
                            return ({ key: x[0], val: x[1] });
                        }); },
                        function (ctx) {
                            var comp = ctx.data.key;
                            if (ctx.exp('%$force%') && !ctx.data.val.original)
                                ctx.data.val.original = "jb.component('" + comp + "', {";
                            return $.ajax({
                                url: "/?op=saveComp&comp=" + comp + "&project=" + ctx.exp('%$globals/project%') + "&force=" + ctx.exp('%$force%'),
                                type: 'POST',
                                data: JSON.stringify({ original: ctx.data.val && ctx.data.val.original, toSave: studio.compAsStr(comp) }),
                                headers: { 'Content-Type': 'text/plain' }
                            }).then(function () {
                                return delete modified[comp];
                            }, function (e) {
                                return jb_core_1.jb.logException(e, 'error while saving ' + comp);
                            });
                        }
                    ],
                    $vars: {
                        force: '%$force%'
                    }
                }
            });
        }
    }
});
