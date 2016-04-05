System.register(['js/jb', 'ui/jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_1.jb.component('button', {
                type: "control",
                params: {
                    title: { as: 'string', dynamic: true, essential: true, defaultValue: 'Hello' },
                    //    icon: { type: 'icon', dynamic: true },
                    action: { type: 'action', essential: true, dynamic: true },
                    //   disabled: { type: 'boolean', dynamic: true },
                    //   description: { as: 'string' },
                    style: { type: 'button.style', defaultValue: { $: 'button.md' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                    $click: { type: 'boolean' },
                },
                impl: function (context) {
                    if (context.params.$click)
                        try {
                            context.params.action();
                        }
                        catch (e) {
                            debugger;
                        } // for test debug
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.title = context.params.title();
                            cmp.clicked = jb_ui.wrapWithLauchingElement(context.params.action, context, cmp.elementRef);
                        }
                    });
                }
            });
            jb_1.jb.type('button.style');
            // jb.component('label.bounded-span', {
            //     type: 'label.style',
            //     impl :{$: 'customStyle', 
            //         template: '<span>{{title}}</span>',
            //         features :{$ 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
            //     }
            // })
            jb_1.jb.component('button.href', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<a href="javascript:;" (click)="clicked()">{{title}}</a>',
                }
            });
            jb_1.jb.component('button.x', {
                type: 'button.style',
                params: {
                    size: { as: 'number', defaultValue: '21' }
                },
                impl: { $: 'customStyle',
                    template: '<span><button (click)="clicked()" [title]="title" style=":hover { opacity: .5 }">&#215;</button></span>',
                    css: "button {\n            cursor: pointer; \n            font: %$size%px sans-serif; \n            border: none; \n            background: transparent; \n            color: #000; \n            text-shadow: 0 1px 0 #fff; \n            font-weight: 700; \n            opacity: .2;\n        }\n        button:hover { opacity: .5 }"
                }
            });
            jb_1.jb.component('button.md-icon', {
                type: 'button.style',
                params: {
                    icon: { as: 'string' },
                    aria: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<span><button md-button class=\"md-icon-button\" aria-label=\"%$aria%\" (click)=\"clicked()\" title=\"{{title}}\">\n                <i md-icon>%$icon%</i>\n              </button></span>",
                }
            });
            jb_1.jb.component('button.md', {
                type: 'button.style',
                params: {
                    flat: { type: 'boolean' },
                    primary: { type: 'boolean' },
                    warning: { type: 'boolean' },
                    noInk: { type: 'boolean' },
                    cornered: { type: 'boolean' },
                },
                impl: function (context, flat, primary, warning, noInk, cornered, cssClass) {
                    var button = context.vars.$model;
                    var noInkAtt = noInk ? 'md-no-ink' : '';
                    var atts = [button.icon ? 'icon-button' : '',
                        primary ? 'primary ' : '', flat ? '' : 'raised-button',
                        cornered ? 'cornered' : '', warning ? 'warn' : '', cssClass]
                        .filter(function (x) { return x; }).map(function (x) { return 'md-' + x; }).join(' ');
                    return {
                        jbTemplate: "<button " + atts + " (click)=\"clicked()\" " + noInkAtt + ">{{title}}</button>"
                    };
                }
            });
            jb_1.jb.component('button.md2', {
                type: 'button.style',
                params: {
                    flat: { type: 'boolean' },
                    primary: { type: 'boolean' },
                    warning: { type: 'boolean' },
                    noInk: { type: 'boolean' },
                    cornered: { type: 'boolean' },
                },
                impl: { $: 'customStyle',
                    template: '<button (click)="clicked()">{{title}}</button>',
                    atts: {
                        'icon-button:notEmpty': '%$$model/icon%',
                        'primary:boolean': '%$primary%',
                        'raised-button:!boolean': '%$flat%',
                        'corenered:boolean': '%$corenered%',
                        'warn:boolean': '%$warning%',
                        'md-no-ink:boolean': '%$noInk%'
                    },
                }
            });
        }
    }
});
//# sourceMappingURL=button.js.map