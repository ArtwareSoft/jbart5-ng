System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.type('button.style');
            jb_core_1.jb.component('button', {
                type: "control",
                params: {
                    title: { as: 'string', dynamic: true, essential: true, defaultValue: 'Hello' },
                    action: { type: 'action', essential: true, dynamic: true },
                    style: { type: 'button.style', defaultValue: { $: 'button.md-flat' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                    $click: { type: 'boolean' },
                },
                impl: function (context) {
                    if (context.params.$click)
                        try {
                            context.params.action();
                        }
                        catch (e) {
                            jb_core_1.jb.logException(e);
                        } // for test debug
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.title = context.params.title();
                            cmp.clicked = jb_ui.wrapWithLauchingElement(context.params.action, context, cmp.elementRef);
                        }
                    });
                }
            });
            jb_core_1.jb.component('button.href', {
                type: 'button.style',
                impl: { $: 'customStyle',
                    template: '<a href="javascript:;" (click)="clicked()">{{title}}</a>',
                }
            });
            jb_core_1.jb.component('button.x', {
                type: 'button.style',
                params: {
                    size: { as: 'number', defaultValue: '21' }
                },
                impl: { $: 'customStyle',
                    template: '<span><button (click)="clicked()" [title]="title" style=":hover { opacity: .5 }">&#215;</button></span>',
                    css: "button {\n            cursor: pointer; \n            font: %$size%px sans-serif; \n            border: none; \n            background: transparent; \n            color: #000; \n            text-shadow: 0 1px 0 #fff; \n            font-weight: 700; \n            opacity: .2;\n        }\n        button:hover { opacity: .5 }"
                }
            });
        }
    }
});
