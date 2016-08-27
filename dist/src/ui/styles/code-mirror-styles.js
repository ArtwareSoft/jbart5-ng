System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    function enableFullScreen(cmSettings) {
        var settings = {};
        jb_core_1.jb.extend(settings, {
            escText: "<span>Press ESC or F11 to exit full screen</span>",
            fullScreenBtnHtml: '<div><img title="Full Screen (F11)" src="http://png-1.findicons.com/files/icons/1150/tango/22/view_fullscreen.png"/></div>',
            lineNumbers: true
        });
        var css = "\n\t\t.jb-codemirror-escCss { cursor:default; text-align: center; width: 100%; position:absolute; top:0px; left:0px; font-family: arial; font-size: 11px; color: #a00; padding: 2px 5px 3px; } \n\t\t.jb-codemirror-escCss:hover { text-decoration: underline; }\n\t\t.jb-codemirror-fullScreenBtnCss { position:absolute; bottom:5px; right:5px; -webkit-transition: opacity 1s; z-index: 20; } \n\t\t.jb-codemirror-fullScreenBtnCss.hidden { opacity:0; }\n\t\t.jb-codemirror-editorCss { position:relative; }\n\t\t.jb-codemirror-fullScreenEditorCss { padding-top: 20px, display: block; position: fixed !important; top: 0; left: 0; z-index: 9999; }\n\t";
        if (!$('#jb_codemirror_fullscreen')[0])
            $("<style id=\"jb_codemirror_fullscreen\" type=\"text/css\">" + css + "</style>").appendTo($('head'));
        var prevOnInit = cmSettings.oninit;
        var prevOverflow = document.documentElement.style.overflow;
        cmSettings.oninit = function (editor) {
            if (prevOnInit)
                prevOnInit(editor);
            var jEditorElem = $(editor.getWrapperElement()).addClass('jb-codemirror-editorCss');
            var prevLineNumbers = editor.getOption("lineNumbers");
            var jFullScreenButton = $(settings.fullScreenBtnHtml).addClass('jb-codemirror-fullScreenBtnCss').appendTo(jEditorElem)
                .addClass('hidden').click(function () {
                switchMode();
            });
            jEditorElem.
                mouseover(function () {
                jFullScreenButton.removeClass('hidden');
            }).
                mouseout(function () {
                jFullScreenButton.addClass('hidden');
            });
            var fullScreenClass = 'jb-codemirror-fullScreenEditorCss';
            function onresize() {
                editor.setSize(window.innerWidth, window.innerHeight - 20);
                // jEditorElem.height( aa_document_height() + 'px' );
            }
            function switchMode(onlyBackToNormal) {
                if (jEditorElem.hasClass(fullScreenClass)) {
                    jEditorElem.removeClass(fullScreenClass);
                    window.removeEventListener('resize', onresize);
                    document.documentElement.style.overflow = prevOverflow;
                    editor.setOption("lineNumbers", prevLineNumbers);
                    editor.setSize(cmSettings.width, cmSettings.height);
                    editor.refresh();
                    jEditorElem[0].jEsc.remove();
                }
                else if (!onlyBackToNormal) {
                    jEditorElem.addClass(fullScreenClass);
                    window.addEventListener('resize', onresize);
                    onresize();
                    document.documentElement.style.overflow = "hidden";
                    if (settings.lineNumbers)
                        editor.setOption("lineNumbers", true);
                    editor.refresh();
                    var jEsc = $(settings.escText).addClass('jb-codemirror-escCss').click(function () {
                        switchMode(true);
                    });
                    jEditorElem.append(jEsc);
                    jEditorElem[0].jEsc = jEsc;
                    editor.focus();
                }
            }
            editor.addKeyMap({
                "F11": function (editor) {
                    switchMode();
                },
                "Esc": function (editor) {
                    switchMode(true);
                }
            });
        };
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('editable-text.codemirror', {
                type: 'editable-text.style',
                params: {
                    cm_settings: { as: 'single' },
                    enableFullScreen: { type: 'boolean', as: 'boolean', defaultValue: true },
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
                                try {
                                    var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
                                }
                                catch (e) {
                                    jb_core_1.jb.logException(e, 'editable-text.codemirror');
                                    return;
                                }
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
