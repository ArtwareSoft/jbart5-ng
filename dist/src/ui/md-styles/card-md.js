System.register(['jb-core', 'jb-ui', '@angular2-material/card/card.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, card_js_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (card_js_1_1) {
                card_js_1 = card_js_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MD_CARD_DIRECTIVES: card_js_1.MD_CARD_DIRECTIVES });
            jb_core_1.jb.component('group.md-card', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card>\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </md-card></div>",
                    features: { $: 'group.initGroup' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
            jb_core_1.jb.component('group.md-card-actions', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-actions>\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </md-card-actions></div>",
                    features: { $: 'group.initGroup' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
            jb_core_1.jb.component('group.md-card-content', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-content>\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </md-card-content></div>",
                    features: { $: 'group.initGroup' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
            jb_core_1.jb.component('group.md-card-header', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div><md-card-header>\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </md-card-header></div>",
                    features: { $: 'group.initGroup' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
            jb_core_1.jb.component('label.md-card-title', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<div><md-card-title>{{title}}</md-card-title></div>',
                    features: { $: 'label.bind-title' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
            jb_core_1.jb.component('label.md-card-subtitle', {
                type: 'label.style',
                impl: { $: 'customStyle',
                    template: '<div><md-card-subtitle>{{title}}</md-card-subtitle></div>',
                    ffeatures: { $: 'label.bind-title' },
                    directives: 'MD_CARD_DIRECTIVES'
                }
            });
        }
    }
});
