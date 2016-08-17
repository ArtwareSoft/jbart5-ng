System.register(['jb-core', 'studio/studio-suggestions'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, suggestions;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (suggestions_1) {
                suggestions = suggestions_1;
            }],
        execute: function() {
            jb_core_1.jb.component('simple-vars', {
                type: 'test',
                impl: { $: 'data-test',
                    calculate: function (ctx) {
                        var obj = new suggestions.suggestions({ value: '%', selectionStart: 1 }).extendWithOptions(ctx);
                        return JSON.stringify(JSON.stringify(obj.options.map(function (x) { return x.text; })));
                    },
                    expectedResult: { $: 'contains', text: '$people' }
                },
            });
            jb_core_1.jb.component('vars-filter', {
                type: 'test',
                impl: { $: 'data-test',
                    calculate: function (ctx) {
                        var obj = new suggestions.suggestions({ value: '%$p', selectionStart: 3 }).extendWithOptions(ctx);
                        return JSON.stringify(JSON.stringify(obj.options.map(function (x) { return x.text; })));
                    },
                    expectedResult: { $and: [{ $: 'contains', text: '$people' }, { $not: { $contains: '$win' } }] }
                },
            });
            jb_core_1.jb.component('inside-array', {
                type: 'test',
                impl: { $: 'data-test',
                    calculate: function (ctx) {
                        var obj = new suggestions.suggestions({ value: '%$people/', selectionStart: 9 }).extendWithOptions(ctx);
                        return JSON.stringify(JSON.stringify(obj.options.map(function (x) { return x.text; })));
                    },
                    expectedResult: { $and: [{ $: 'contains', text: 'people' }, { $not: { $contains: '$people' } }] }
                },
            });
        }
    }
});
