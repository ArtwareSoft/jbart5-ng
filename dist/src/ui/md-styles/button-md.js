System.register(['jb-core', '@angular/material'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, material_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (material_1_1) {
                material_1 = material_1_1;
            }],
        execute: function() {
            //jb_ui.registerDirectives({MdButton: MdButton,MdIcon: MdIcon});
            //jb_ui.registerProviders({MdIconRegistry: MdIconRegistry});
            jb_core_1.jb.component('button.md-flat', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
                    imports: material_1.MdButtonModule
                }
            });
            jb_core_1.jb.component('button.md-raised', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<div><button md-raised-button (click)="clicked()">{{title}}</button></div>',
                    imports: material_1.MdButtonModule
                }
            });
            jb_core_1.jb.component('button.md-icon', {
                type: 'button.style',
                params: [
                    { id: 'icon', as: 'string', default: 'code' },
                    { id: 'size', as: 'number', defaultValue: 20 },
                    { id: 'aria', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    template: "<div><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons\" style=\"font-size:%$size%px;\">%$icon%</i>\n              </button></div>",
                    css: 'button {min-width: 2px; padding: 4px; height: 100%; margin-left: 4px; border-radius: 10%;}',
                    imports: material_1.MdButtonModule,
                    providers: material_1.MdIconRegistry,
                }
            });
            jb_core_1.jb.component('button.md-icon2', {
                type: 'button.style2',
                params: [
                    { id: 'icon', as: 'string', default: 'code' },
                    { id: 'size', as: 'number', defaultValue: 20 },
                    { id: 'padding', as: 'number', defaultValue: 4 },
                    { id: 'aria', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    // $vars: {
                    //   fontSize: ctx => 
                    //     ctx.componentContext.params.size - ctx.componentContext.params.padding
                    // }, 
                    template: "<div><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons\">%$icon%</i>\n              </button></div>",
                    css: ".md-button-ripple11 { width: %$size%px; height: %$size%px;  }\n      button { width: %$size%px; height: %$size%px; padding: %$padding%px }\n      i { font-size:%$size%px; }",
                    imports: material_1.MdButtonModule,
                    providers: material_1.MdIconRegistry,
                }
            });
            jb_core_1.jb.component('button.md-icon-12', {
                type: 'button.style',
                params: [
                    { id: 'icon', as: 'string', default: 'code' },
                    { id: 'aria', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    template: "<div><button md-icon-button md-button aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons\">%$icon%</i>\n              </button></div>",
                    css: "button { width: 24px; height: 24px; padding: 0; margin-left: 2px; margin-top: -2px;}\n      .material-icons { font-size:12px;  }\n      ",
                    imports: material_1.MdButtonModule,
                    providers: material_1.MdIconRegistry,
                }
            });
            jb_core_1.jb.component('button.md-icon-fab', {
                type: 'button.style',
                params: [
                    { id: 'icon', as: 'string', default: 'code' },
                    { id: 'size', as: 'number', defaultValue: '24' },
                    { id: 'aria', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    template: "<div><button md-fab aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons md-24\">%$icon%</i>\n              </button></div>",
                    imports: material_1.MdButtonModule,
                    providers: material_1.MdIconRegistry,
                }
            });
            jb_core_1.jb.component('button.md-mini-fab', {
                type: 'button.style',
                params: [
                    { id: 'icon', as: 'string', default: 'code' },
                    { id: 'size', as: 'number', defaultValue: '24' },
                    { id: 'aria', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    template: "<div><button md-mini-fab aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\" tabIndex=\"-1\">\n                <i class=\"material-icons md-24\">%$icon%</i>\n              </button></div>",
                    imports: material_1.MdButtonModule,
                    providers: material_1.MdIconRegistry,
                }
            });
        }
    }
});
