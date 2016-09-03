System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('group.div', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('group.expandable', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<section class=\"jb-group\">\n       <div class=\"header\">\n        <div class=\"title\">{{title}}</div>\n        <button md-icon-button md-button (click)=\"toggle()\" title=\"{{expand_title()}}\">\n        <i *ngIf=\"show\" class=\"material-icons\">keyboard_arrow_down</i>\n        <i *ngIf=\"!show\" class=\"material-icons\">keyboard_arrow_right</i>\n        </button>\n      </div>\n      <div *ngIf=\"show\">\n          <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\"></jb_comp>\n      </div>\n</section>",
                    methods: {
                        init: function (ctx) {
                            return function (cmp) {
                                cmp.show = true;
                                cmp.expand_title = function () { return cmp.show ? 'collapse' : 'expand'; };
                                cmp.toggle = function () { cmp.show = !cmp.show; };
                            };
                        }
                    },
                    css: ".header { display: flex; flex-direction: row; }\n        button:hover { background: none }\n        button { margin-left: auto }\n        i { color: #}\n        .title { margin: 5px }",
                    features: { $: 'group.initGroup' }
                },
            });
            jb_core_1.jb.component('group.accordion', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<section class=\"jb-group\">\n      <div *ngFor=\"let ctrl of ctrls\" class=\"accordion-section\">\n        <div class=\"header\">\n          <div class=\"title\">{{ctrl.title}}</div>\n          <button md-icon-button md-button (click)=\"toggle(ctrl)\" title=\"{{expand_title(ctrl)}}\">\n                <i *ngIf=\"ctrl.show\" class=\"material-icons\">keyboard_arrow_down</i>\n                <i *ngIf=\"!ctrl.show\" class=\"material-icons\">keyboard_arrow_right</i>\n          </button>\n        </div>\n        <jb_comp *ngIf=\"ctrl.show\" [comp]=\"ctrl.comp\"></jb_comp>\n      </div>\n  </section>",
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.expand_title = function (ctrl) {
                                return ctrl.show ? 'collapse' : 'expand';
                            };
                            cmp.toggle = function (newCtrl) {
                                return cmp.ctrls.forEach(function (ctrl) {
                                    return ctrl.show = ctrl == newCtrl ? !ctrl.show : false;
                                });
                            };
                        }; },
                        afterViewInit: function (ctx) { return function (cmp) {
                            if (cmp.ctrls && cmp.ctrls[0])
                                cmp.ctrls[0].show = true;
                        }; },
                    },
                    css: ".header { display: flex; flex-direction: row; }\n        button:hover { background: none }\n        button { margin-left: auto }\n        i { color: #}\n        .title { margin: 5px }",
                    features: { $: 'group.initGroup' }
                },
            });
            jb_core_1.jb.component('toolbar.simple', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div class=\"toolbar\">\n        <jb_comp *ngFor=\"let ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\"></jb_comp>\n      </div>",
                    css: ".toolbar { \n            display: flex;\n            background: #F5F5F5; \n            height: 33px; \n            width: 100%;\n            border-bottom: 1px solid #D9D9D9; \n            border-top: 1px solid #fff;\n        }\n        * { margin-right: 0 }"
                }
            });
        }
    }
});
