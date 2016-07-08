System.register(['studio/studio-suggestions'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var suggestions;
    return {
        setters:[
            function (suggestions_1) {
                suggestions = suggestions_1;
            }],
        execute: function() {
            jb_tests('studio-suggestions', {
                'simple-vars': { $: 'data-test',
                    calculate: function (ctx) {
                        var obj = new suggestions.suggestionsObj({ value: '%', selectionStart: 1 }).extendWithSuggestions(ctx);
                        return JSON.serialize(obj.suggestions);
                    },
                    expectedResult: { $: 'contains', text: '$people' }
                },
            });
        }
    }
});
