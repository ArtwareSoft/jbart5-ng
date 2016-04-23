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
                        jbTemplate: "<section class=\"jb-group\">\n          <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n              <button md-button class=\"md-icon-button\" aria-label=\"Open\" (click)=\"toggle()\">\n                <i md-icon>code</i>\n              </button>\n              <h3>{{title}}</h3>\n              <span flex></span>\n            </div>\n          </md-toolbar>\n          <jb_comp [hidden]=\"show\" *ngFor=\"var ctrl of ctrls\" [comp]=\"ctrl.comp\"></jb_comp>\n      </section>"
                    };
                }
            });
            jb_core_1.jb.component('group.md-expandable', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<section class=\"jb-group\">\n          <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n              <button md-button class=\"md-icon-button\" aria-label=\"Open\" (click)=\"toggle()\">\n                <i md-icon>code</i>\n              </button>\n              <h3>{{title}}</h3>\n              <span flex></span>\n            </div>\n          </md-toolbar>\n          <jb_comp [hidden]=\"show\" *ngFor=\"var ctrl of ctrls\" [comp]=\"ctrl.comp\"></jb_comp>\n      </section>",
                    features: { $: 'group.initGroup' },
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.open = true;
                            cmp.toggle = function () { cmp.show = !cmp.show; };
                        }; }
                    }
                }
            });
            jb_core_1.jb.component('group.div', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group\">\n        <jb_comp *ngFor=\"var ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\" class=\"group-item\"></jb_comp>\n      </div>",
                    features: { $: 'group.initGroup' }
                }
            });
            jb_core_1.jb.component('layout.vertical', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 3 }
                },
                impl: { $: 'customCssStyle',
                    basedOn: { $: 'group.div' },
                    css: ".group-item { margin-bottom: %$spacing%px; display: block }\n        .group-item:last-child { margin-bottom:0 }",
                }
            });
            jb_core_1.jb.component('layout.horizontal', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 3 }
                },
                impl: { $: 'customCssStyle',
                    basedOn: { $: 'group.div' },
                    css: "{display: flex}\n        .group-item { margin-right: %$spacing%px }\n        .group-item:last-child { margin-right:0 }",
                }
            });
            jb_core_1.jb.component('property-sheet.titles-above', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 20 }
                },
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n      <div *ngFor=\"var ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <jb_comp [comp]=\"ctrl.comp\"></jb_comp>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: %$spacing%px }\n      .property:last-child { margin-bottom:0 }\n      .property>.property-title {\n        width:100px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n      }\n      .property>div { display:inline-block }"
                }
            });
            jb_core_1.jb.component('property-sheet.titles-above-float-left', {
                type: 'group.style',
                params: {
                    spacing: { as: 'number', defaultValue: 20 },
                    fieldWidth: { as: 'number', defaultValue: 200 },
                },
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n        <div *ngFor=\"var ctrl of ctrls\" class=\"property\">\n          <label class=\"property-title\">{{ctrl.title}}</label>\n          <jb_comp [comp]=\"ctrl.comp\"></jb_comp>\n        </div>\n        <div class=\"clearfix\"></div>\n      </div>\n    ",
                    css: ".property { \n          float: left;\n          width: %$fieldWidth%px;\n          margin-right: %$spacing}%px \n        }\n      .clearfix { clear: both }\n      .property:last-child { margin-right:0 }\n      .property>.property-title {\n        margin-bottom: 3px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        font-size:14px;\n      }",
                }
            });
            jb_core_1.jb.component('property-sheet.titles-left', {
                type: 'group.style',
                params: {
                    vSpacing: { as: 'number', defaultValue: 20 },
                    hSpacing: { as: 'number', defaultValue: 20 },
                    titleWidth: { as: 'number', defaultValue: 100 },
                },
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div>\n      <div *ngFor=\"var ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.title}}</label>\n        <jb_comp [comp]=\"ctrl.comp\" class=\"property-ctrl\"></jb_comp>\n      </div>\n    </div>",
                    styles: ".property { margin-bottom: %$vSpacing%px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .property>.property-title {\n        width: %$titleWidth%px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: %$hSpacing%px;\n      }\n      .property>*:last-child { margin-right:0 }"
                }
            });
            // Seems that ng.md is not too flexible and dynamic.
            // Needs to build the template with the input fields before loading the comp.
            jb_core_1.jb.component('property-sheet.md', {
                type: 'group.style',
                impl: function (context) {
                    var comps = (context.vars.$model.controls.profile || []).map(function (prof) { return context.run(prof); });
                    return {
                        init: function (cmp) {
                            comps.forEach(function (comp) {
                                comp.prototype.ngOnInit.call(cmp);
                            });
                        },
                        template: comps.map(function (comp) {
                            if (!Reflect.getMetadata('annotations', comp))
                                debugger;
                            var annotations = Reflect.getMetadata('annotations', comp)[0];
                            var title = comp.jb_title ? jb_core_1.jb.val(comp.jb_title(context)) : '';
                            return "<md-input-container class=\"md-block\" flex-gt-sm>\n                  <label>" + title + "</label>\n                  " + annotations.template + "\n                </md-input-container>\n                ";
                        }).join('')
                    };
                }
            });
            jb_core_1.jb.component('group-expandable-subgroups', {
                type: 'group.section_style',
                params: {
                    icon: { as: 'string ', defaultValue: 'code' }
                },
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    methods: {
                        init: function (ctx) { return function (cmp) {
                            cmp.selected = cmp.ctrls[0];
                            cmp.select = function (ctrl) {
                                cmp.selected = ctrl;
                            };
                        }; }
                    },
                    template: "<section class=\"jb-group\">\n        <section *ngFor=\"var ctrl of ctrls\" class=\"md-whiteframe-z3\" [ngClass]=\"{'open': selected==ctrl}\">\n          <md-toolbar class=\"md-primary\">\n            <div class=\"md-toolbar-tools\">\n              <h3>{{ ctrl.title }}</h3>\n              <span flex></span>\n              <button md-button\n                      class=\"md-icon-button\"\n                      aria-label=\"Open\"\n                      (click)=\"select(ctrl)\">\n                <i md-icon>%$icon%</i>\n              </button>\n            </div>\n          </md-toolbar>\n          <jb_comp *ngIf=\"selected==ctrl\" [comp]=\"ctrl.comp\"></jb_comp>\n      </section></section>",
                }
            });
            jb_core_1.jb.component('toolbar.simple', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div class=\"toolbar\">\n        <jb_comp *ngFor=\"var ctrl of ctrls\" [comp]=\"ctrl.comp\" [flatten]=\"true\"></jb_comp>\n      </div>",
                    css: ".toolbar { \n            display: flex;\n            background: #F5F5F5; \n            height: 33px; \n            width: 100%;\n            border-bottom: 1px solid #D9D9D9; \n            border-top: 1px solid #fff;\n        }\n        * { margin-right: 0 }"
                }
            });
        }
    }
});
