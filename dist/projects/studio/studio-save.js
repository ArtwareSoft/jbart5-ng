System.register(['jb-core', 'jb-ui/jb-rx', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx, studio_utils_1;
    var modified;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
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
            jb_core_1.jb.component('studio.save-components', {
                params: [
                    { id: 'force', as: 'boolean', type: 'boolean' }
                ],
                impl: function (ctx, force) {
                    return jb_rx.Observable.from(jb_core_1.jb.entries(modified))
                        .filter(function (x) { return x; })
                        .concatMap(function (toSave) {
                        var comp = toSave[0], val = toSave[1];
                        studio_utils_1.message('saving ' + comp);
                        if (force && !val.original)
                            val.original = "jb.component('" + comp + "', {";
                        return $.ajax({
                            url: "/?op=saveComp&comp=" + comp + "&project=" + ctx.exp('%$globals/project%') + "&force=" + force,
                            type: 'POST',
                            data: JSON.stringify({ original: val && val.original, toSave: studio_utils_1.compAsStr(comp) }),
                            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
                        }).then(function (res) { return ({ res: res, comp: comp }); }, function (e) { throw { e: e, comp: comp }; });
                        // return fetch(`/?op=saveComp&comp=${comp}&project=${ctx.exp('%$globals/project%')}&force=${force}`, {
                        // 	method: 'post',  
                        // 	body: JSON.stringify({ original: val && val.original, toSave: compAsStr(comp) }),
                        //     headers: { 'Content-type': 'application/json; charset=UTF-8' },  
                        // })
                    })
                        .catch(function (e) {
                        studio_utils_1.message('error saving: ' + e.e);
                        jb_core_1.jb.logException(e, 'error while saving ' + e.comp);
                    })
                        .subscribe(function (entry) {
                        var result = entry.res;
                        studio_utils_1.message((result.type || '') + ': ' + (result.desc || '') + (result.message || ''), result.type != 'success');
                        if (result.type == 'success')
                            delete modified[entry.comp];
                    });
                }
            });
        }
    }
});
