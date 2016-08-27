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
            jb_core_1.jb.type('text.style');
            jb_core_1.jb.component('text', {
                type: 'control',
                params: {
                    text: { essential: true, dynamic: true },
                    style: { type: 'text.style', defaultValue: { $: 'text.multi-line' }, dynamic: true },
                    title: { as: 'string', defaultValue: 'text' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx, text) {
                    return jb_ui.ctrl(ctx.setVars({ text: ctx.params.text() }));
                }
            });
            jb_core_1.jb.component('text.bind-text', {
                type: 'feature',
                impl: function (ctx) { return ({
                    doCheck: function (cmp) {
                        cmp.text = ctx.vars.$model.text(cmp.ctx);
                    }
                }); }
            });
            jb_core_1.jb.component('text.multi-line', {
                type: 'text.style',
                params: {
                    rows: { as: 'number', defaultValue: '8' },
                    cols: { as: 'number', defaultValue: '80' },
                },
                impl: { $: 'customStyle',
                    template: '<div><textarea readonly cols="%$cols%" rows="%$rows%">{{text}}</textarea></div>',
                    features: { $: 'text.bind-text' }
                }
            });
            jb_core_1.jb.component('text.paragraph', {
                type: 'text.style',
                impl: { $: 'customStyle',
                    template: '<p>{{text}}</p>',
                    features: { $: 'text.bind-text' }
                }
            });
            jb_core_1.jb.component('rich-text', {
                type: 'control',
                params: {
                    text: { essential: true, as: 'string', dynamic: true },
                    title: { as: 'string', defaultValue: 'rich-text', dynamic: true },
                    style: { type: 'rich-text.style', defaultValue: { $: 'rich-text.html' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx, text, title) {
                    return jb_ui.ctrl(ctx.setVars({ text: text(), title: title() }));
                }
            });
            jb_core_1.jb.component('rich-text.html', {
                type: 'rich-text.style',
                impl: { $: 'customStyle',
                    template: '%$text%',
                }
            });
            jb_core_1.jb.component('rich-text.html-in-section', {
                type: 'rich-text.style',
                impl: { $: 'customStyle',
                    template: "<section>\n                    <div class=\"title\">%$title%</div>\n                    %$text%\n                </section>",
                }
            });
        }
    }
});
