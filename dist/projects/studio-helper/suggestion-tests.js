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
                        var obj = new suggestions.suggestionObj({ value: '%', selectionStart: 1 }).extendWithSuggestions(ctx);
                        return JSON.stringify(obj.suggestions);
                    },
                    expectedResult: { $: 'contains', text: '$people' }
                },
            });
        }
    }
});
