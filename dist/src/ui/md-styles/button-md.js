System.register(['jb-core', 'jb-ui', '@angular2-material/button/button.js', '@angular2-material/icon/icon.js', '@angular2-material/icon/icon-registry'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, button_js_1, icon_js_1, icon_registry_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (button_js_1_1) {
                button_js_1 = button_js_1_1;
            },
            function (icon_js_1_1) {
                icon_js_1 = icon_js_1_1;
            },
            function (icon_registry_1_1) {
                icon_registry_1 = icon_registry_1_1;
            }],
        execute: function() {
            jb_ui.registerDirectives({ MdButton: button_js_1.MdButton, MdIcon: icon_js_1.MdIcon });
            jb_ui.registerProviders({ MdIconRegistry: icon_registry_1.MdIconRegistry });
            jb_core_1.jb.component('button.md-flat', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<span><button md-button (click)="clicked()">{{title}}</button></span>',
                    directives: 'MdButton'
                }
            });
            jb_core_1.jb.component('button.md-raised', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<span><button md-raised-button (click)="clicked()">{{title}}</button></span>',
                    directives: 'MdButton'
                }
            });
            jb_core_1.jb.component('button.md-icon', {
                type: 'button.style',
                params: {
                    icon: { as: 'string', default: 'code' },
                    size: { as: 'number', defaultValue: 20 },
                    aria: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons\" style=\"font-size:%$size%px;\">%$icon%</i>\n              </button></span>",
                    css: 'button {min-width: 2px; margin-top: -3px; padding: 4px}',
                    directives: 'MdButton'
                }
            });
            jb_core_1.jb.component('button.md-icon-12', {
                type: 'button.style',
                params: {
                    icon: { as: 'string', default: 'code' },
                    aria: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons\">%$icon%</i>\n              </button></span>",
                    css: "button { width: 24px; height: 24px; padding: 0; margin-left: 2px; margin-top: -2px;}\n      .material-icons { font-size:12px;  }\n      ",
                    directives: 'MdButton'
                }
            });
            jb_core_1.jb.component('button.md-icon-fab', {
                type: 'button.style',
                params: {
                    icon: { as: 'string', default: 'code' },
                    size: { as: 'number', defaultValue: '24' },
                    aria: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-fab aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons md-24\">%$icon%</i>\n              </button></span>",
                    directives: 'MdButton'
                }
            });
            jb_core_1.jb.component('button.md-mini-fab', {
                type: 'button.style',
                params: {
                    icon: { as: 'string', default: 'code' },
                    size: { as: 'number', defaultValue: '24' },
                    aria: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-mini-fab aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons md-24\">%$icon%</i>\n              </button></span>",
                    directives: 'MdButton'
                }
            });
        }
    }
});
