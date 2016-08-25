System.register(['jb-core', 'jb-ui', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, http_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            jb_ui.registerProviders({ HTTP_PROVIDERS: http_1.HTTP_PROVIDERS });
            jb_core_1.jb.component('http.get', {
                params: {
                    url: { as: 'string' },
                },
                impl: function (ctx, url) {
                    return ctx.vars.injector.get(http_1.Http)
                        .get(url)
                        .map(function (x) {
                        return x.json();
                    });
                }
            });
        }
    }
});
