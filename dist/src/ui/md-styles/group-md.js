System.register(['jb-core', '@angular2-material/button/button.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, button_js_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (button_js_1_1) {
                button_js_1 = button_js_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('group.md-expandable2', {
                type: 'group.style',
                params: {},
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            cmp.initGroup();
                            cmp.open = true;
                            cmp.toggle = function () { cmp.show = !cmp.show; };
                        },
                        jbTemplate: "<section class=\"jb-group\">\n          <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n              <button md-button class=\"md-icon-button\" aria-label=\"Open\" (click)=\"toggle()\">\n                <i md-icon>code</i>\n              </button>\n              <h3>{{title}}</h3>\n              <span flex></span>\n            </div>\n          </md-toolbar>\n          <jb_comp [hidden]=\"show\" *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\"></jb_comp>\n      </section>"
                    };
                }
            });
            jb_core_1.jb.component('group.md-expandable', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<section class=\"jb-group\">\n          <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n              <button md-button class=\"md-icon-button\" aria-label=\"Open\" (click)=\"toggle()\">\n                <i md-icon>code</i>\n              </button>\n              <h3>{{title}}</h3>\n              <span flex></span>\n            </div>\n          </md-toolbar>\n          <jb_comp [hidden]=\"show\" *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\"></jb_comp>\n      </section>",
                    features: { $: 'group.initGroup' },
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.open = true;
                            cmp.toggle = function () { cmp.show = !cmp.show; };
                        }; }
                    },
                    directives: [button_js_1.MdButton]
                }
            });
        }
    }
});
