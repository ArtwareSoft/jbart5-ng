System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.type('text.style');
            jb_core_1.jb.component('text', {
                type: "control",
                params: {
                    text: { essential: true, as: 'ref' },
                    style: { type: 'text.style', defaultValue: { $: 'text.multi-line' }, dynamic: true },
                    title: { as: 'string', defaultValue: 'text' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx, text) {
                    return jb_ui.ctrl(ctx.setVars({ text: jb_core_1.jb.val(ctx.params.text) }));
                }
            });
            jb_core_1.jb.component('text.multi-line', {
                type: 'text.style',
                params: {
                    rows: { as: 'number', defaultValue: '8' },
                    cols: { as: 'number', defaultValue: '80' },
                },
                impl: { $: 'customStyle',
                    template: '<div><textarea readonly cols="%$cols%" rows="%$rows%">{{text}}</textarea></div>',
                    features: { $: 'oneWayBind', to: '{{text}}', value: '%$$model/text%' }
                }
            });
            jb_core_1.jb.component('text.paragraph', {
                type: 'text.style',
                impl: { $: 'customStyle',
                    template: '<p>{{text}}</p>',
                    features: { $: 'oneWayBind', to: '{{text}}', value: '%$$model/text%' }
                }
            });
            jb_core_1.jb.component('text.codemirror', {
                type: 'text.style',
                params: {
                    cm_settings: { as: 'single' },
                    resizer: { type: 'boolean', as: 'boolean', description: 'resizer id or true (id is used to keep size in session storage)' },
                    mode: { as: 'string' },
                    lineWrapping: { as: 'boolean' },
                },
                impl: function (context, cm_settings, resizer, mode, lineWrapping) {
                    return {
                        template: '<textarea></textarea>',
                        cssClass: 'jb-codemirror',
                        init: function (cmp) {
                            mode = mode || 'javascript';
                            var field = context.vars.field;
                            cm_settings = {
                                readOnly: true,
                                mode: mode,
                                lineWrapping: lineWrapping,
                                theme: 'solarized light',
                            };
                            var $el = $(cmp.elementRef.nativeElement);
                            var $textarea = $el.findIncludeSelf('textarea');
                            //$textarea.val(field.getValue());
                            //if (resizer) jb_codemirrorResizer(editor, $el);
                            context.vars.ngZone.runOutsideAngular(function () {
                                var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
                                $(editor.getWrapperElement()).css('box-shadow', 'none'); //.css('height', '200px');
                                jb_rx.refObservable(context.vars.$model.text, context)
                                    .subscribe(function (x) {
                                    return editor.setValue(x);
                                });
                            });
                        }
                    };
                }
            });
        }
    }
});
