System.register(['jb-core', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, http_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('http.get', {
                params: {
                    url: { as: 'string' },
                },
                impl: function (ctx, url, resource) {
                    return new http_1.Http(new http_1.XHRBackend(new http_1.BrowserXhr(), null, new http_1.CookieXSRFStrategy()), new http_1.RequestOptions())
                        .get(url)
                        .map(function (x) {
                        return x.json();
                    });
                }
            });
        }
    }
});
