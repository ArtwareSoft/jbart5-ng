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
            jb_core_1.jb.type('editable-text.style');
            jb_core_1.jb.component('editable-text', {
                type: 'control',
                params: {
                    title: { as: 'string', dynamic: true },
                    databind: { as: 'ref' },
                    style: { type: 'editable-text.style', defaultValue: { $: 'editable-text.input' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx.setVars({ field: jb_ui.twoWayBind(ctx.params.databind) }));
                }
            });
            jb_core_1.jb.component('editable-text.bindField', {
                type: 'feature',
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        return ctx.vars.field.bindToCmp(cmp, ctx);
                    }
                }); }
            });
            jb_core_1.jb.component('editable-text.input', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: "<div><input %$field.modelExp%></div>",
                    css: 'input {height: 16px}'
                }
            });
            jb_core_1.jb.component('editable-text.textarea', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: '<textarea %$field/modelExp%></textarea>',
                }
            });
            jb_core_1.jb.component('editable-text.codemirror', {
                type: 'editable-text.style',
                params: {
                    cm_settings: { as: 'single' },
                    resizer: { type: 'boolean', as: 'boolean', description: 'resizer id or true (id is used to keep size in session storage)' },
                    height: { as: 'number' },
                    mode: { as: 'string' },
                    debounceTime: { as: 'number', defaultValue: 300 },
                    lineWrapping: { as: 'boolean' },
                },
                impl: function (context, cm_settings, resizer, height, mode, debounceTime, lineWrapping) {
                    return {
                        template: '<textarea></textarea>',
                        cssClass: 'jb-codemirror',
                        init: function (cmp) {
                            mode = mode || 'javascript';
                            var field = context.vars.field;
                            cm_settings = jb_core_1.jb.extend(cm_settings || {}, {
                                mode: mode,
                                lineWrapping: lineWrapping,
                                theme: 'solarized light',
                                // mode: 'jbart5',
                                extraKeys: {
                                    'Ctrl-Space': 'autocomplete',
                                    'Ctrl-Enter': function () { }
                                },
                            });
                            var $el = $(cmp.elementRef.nativeElement);
                            var $textarea = $el.findIncludeSelf('textarea');
                            $textarea.val(field.getValue());
                            //if (resizer) jb_codemirrorResizer(editor, $el);
                            context.vars.ngZone.runOutsideAngular(function () {
                                var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
                                cmp.codeMirror = editor;
                                $(editor.getWrapperElement()).css('box-shadow', 'none');
                                if (height)
                                    $(editor.getWrapperElement()).css('height', height + 'px');
                                field.observable(context)
                                    .filter(function (x) {
                                    return x != editor.getValue();
                                })
                                    .subscribe(function (x) {
                                    return editor.setValue(x || '');
                                });
                                var editorTextChange = new jb_rx.Subject();
                                editorTextChange.distinctUntilChanged()
                                    .debounceTime(debounceTime)
                                    .filter(function (x) {
                                    return x != field.getValue();
                                })
                                    .subscribe(function (x) {
                                    field.writeValue(x);
                                    jb_ui.apply(context);
                                });
                                editor.on('change', function () {
                                    return editorTextChange.next(editor.getValue());
                                });
                            });
                        }
                    };
                }
            });
        }
    }
});
