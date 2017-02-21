jb.component('editable-text.codemirror', {
    type: 'editable-text.style',
    params: [
        { id: 'cm_settings', as: 'single' },
        { id: 'enableFullScreen', type: 'boolean', as: 'boolean', defaultValue: true },
        { id: 'resizer', type: 'boolean', as: 'boolean', description: 'resizer id or true (id is used to keep size in session storage)' },
        { id: 'height', as: 'number' },
        { id: 'mode', as: 'string' },
        { id: 'debounceTime', as: 'number', defaultValue: 300 },
        { id: 'lineWrapping', as: 'boolean' },
        { id: 'onCtrlEnter', type: 'action', dynamic: true },
    ],
    impl: function (context, cm_settings, _enableFullScreen, resizer, height, mode, debounceTime, lineWrapping) {
        return {
            template: '<textarea></textarea>',
            cssClass: 'jb-codemirror',
            init: function (cmp) {
                mode = mode || 'javascript';
                var data_ref = cmp.ctx.vars.$model.databind;
                cm_settings = jb.extend(cm_settings || {}, {
                    mode: mode,
                    lineWrapping: lineWrapping,
                    theme: 'solarized light',
                    // mode: 'jbart5',
                    extraKeys: {
                        'Ctrl-Space': 'autocomplete',
                        'Ctrl-Enter': function () { return context.params.onCtrlEnter(); }
                    },
                });
                var $el = $(cmp.elementRef.nativeElement);
                var $textarea = $el.findIncludeSelf('textarea');
                $textarea.val(jb.val(data_ref));
                //if (resizer) jb_codemirrorResizer(editor, $el);
                context.vars.ngZone.runOutsideAngular(function () {
                    try {
                        var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
                        var $wrapper = $(editor.getWrapperElement());
                        if (height)
                            $wrapper.css('height', height + 'px');
                        jb.delay(1).then(function () {
                            if (_enableFullScreen)
                                enableFullScreen(editor, $wrapper.width(), $wrapper.height());
                        });
                    }
                    catch (e) {
                        jb.logException(e, 'editable-text.codemirror');
                        return;
                    }
                    cmp.codeMirror = editor;
                    $(editor.getWrapperElement()).css('box-shadow', 'none');
                    jb_rx.refObservable(data_ref, cmp)
                        .filter(function (x) {
                        return x != editor.getValue();
                    })
                        .subscribe(function (x) {
                        return editor.setValue(x || '');
                    });
                    var editorTextChange = new jb_rx.Subject();
                    editorTextChange.takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                        .distinctUntilChanged()
                        .debounceTime(debounceTime)
                        .filter(function (x) {
                        return x != jb.val(data_ref);
                    })
                        .subscribe(function (x) {
                        jb.writeValue(data_ref, x);
                        if (cmp.onChange)
                            cmp.onChange(x);
                        jb_ui.apply(context);
                    });
                    editor.on('change', function () {
                        return editorTextChange.next(editor.getValue());
                    });
                });
            },
            observable: function () { }
        };
    }
});
function enableFullScreen(editor, width, height) {
    var escText = "<span>Press ESC or F11 to exit full screen</span>";
    var fullScreenBtnHtml = '<div><img title="Full Screen (F11)" src="http://png-1.findicons.com/files/icons/1150/tango/22/view_fullscreen.png"/></div>';
    var lineNumbers = true;
    var css = "\n\t\t.jb-codemirror-escCss { cursor:default; text-align: center; width: 100%; position:absolute; top:0px; left:0px; font-family: arial; font-size: 11px; color: #a00; padding: 2px 5px 3px; } \n\t\t.jb-codemirror-escCss:hover { text-decoration: underline; }\n\t\t.jb-codemirror-fullScreenBtnCss { position:absolute; bottom:5px; right:5px; -webkit-transition: opacity 1s; z-index: 20; } \n\t\t.jb-codemirror-fullScreenBtnCss.hidden { opacity:0; }\n\t\t.jb-codemirror-editorCss { position:relative; }\n\t\t.jb-codemirror-fullScreenEditorCss { padding-top: 20px, display: block; position: fixed !important; top: 0; left: 0; z-index: 99999999; }\n\t";
    if (!$('#jb_codemirror_fullscreen')[0])
        $("<style id=\"jb_codemirror_fullscreen\" type=\"text/css\">" + css + "</style>").appendTo($('head'));
    var jEditorElem = $(editor.getWrapperElement()).addClass('jb-codemirror-editorCss');
    var prevLineNumbers = editor.getOption("lineNumbers");
    var jFullScreenButton = $(fullScreenBtnHtml).addClass('jb-codemirror-fullScreenBtnCss').appendTo(jEditorElem)
        .addClass('hidden').click(function () {
        switchMode();
    });
    jEditorElem.mouseover(function () {
        jFullScreenButton.removeClass('hidden');
    }).
        mouseout(function () {
        jFullScreenButton.addClass('hidden');
    });
    var fullScreenClass = 'jb-codemirror-fullScreenEditorCss';
    function onresize() {
        var $wrapper = $(editor.getWrapperElement());
        $wrapper.css('width', window.innerWidth + 'px');
        $wrapper.css('height', window.innerHeight + 'px');
        //editor.setSize(window.innerWidth, window.innerHeight - 20);
        // jEditorElem.height( aa_document_height() + 'px' );
    }
    function switchMode(onlyBackToNormal) {
        if (jEditorElem.hasClass(fullScreenClass)) {
            jEditorElem.removeClass(fullScreenClass);
            window.removeEventListener('resize', onresize);
            editor.setOption("lineNumbers", prevLineNumbers);
            editor.setSize(width, height);
            editor.refresh();
            jEditorElem[0].jEsc.remove();
        }
        else if (!onlyBackToNormal) {
            jEditorElem.addClass(fullScreenClass);
            window.addEventListener('resize', onresize);
            onresize();
            document.documentElement.style.overflow = "hidden";
            if (lineNumbers)
                editor.setOption("lineNumbers", true);
            editor.refresh();
            var jEsc = $(escText).addClass('jb-codemirror-escCss').click(function () {
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
}
jb.component('text.codemirror', {
    type: 'text.style',
    params: [
        { id: 'cm_settings', as: 'single' },
        { id: 'enableFullScreen', type: 'boolean', as: 'boolean', defaultValue: true },
        { id: 'resizer', type: 'boolean', as: 'boolean', description: 'resizer id or true (id is used to keep size in session storage)' },
        { id: 'height', as: 'number' },
        { id: 'mode', as: 'string', options: 'htmlmixed,javascript,css' },
        { id: 'lineWrapping', as: 'boolean' },
    ],
    impl: function (context, cm_settings, _enableFullScreen, resizer, height, mode, lineWrapping) {
        return {
            template: '<textarea></textarea>',
            cssClass: 'jb-codemirror',
            observable: function () { },
            init: function (cmp) {
                mode = mode || 'javascript';
                cm_settings = {
                    readOnly: true,
                    mode: mode,
                    lineWrapping: lineWrapping,
                    theme: 'solarized light',
                };
                var $el = $(cmp.elementRef.nativeElement);
                var $textarea = $el.findIncludeSelf('textarea');
                //if (resizer) jb_codemirrorResizer(editor, $el);
                context.vars.ngZone.runOutsideAngular(function () {
                    try {
                        var editor = CodeMirror.fromTextArea($textarea[0], cm_settings);
                        var $wrapper = $(editor.getWrapperElement());
                        if (height)
                            $wrapper.css('height', height + 'px');
                        jb.delay(1).then(function () {
                            if (_enableFullScreen)
                                enableFullScreen(editor, $wrapper.width(), $wrapper.height());
                        });
                    }
                    catch (e) {
                        jb.logException(e, 'editable-text.codemirror');
                        return;
                    }
                    $(editor.getWrapperElement()).css('box-shadow', 'none'); //.css('height', '200px');
                    var modelChangeEm = cmp.jbEmitter.filter(function (x) { return x == 'check'; })
                        .map(function () { return context.vars.$model.text(); })
                        .filter(function (x) { return x; })
                        .distinctUntilChanged()
                        .skip(1);
                    modelChangeEm.subscribe(function (x) {
                        return editor.setValue(x);
                    });
                });
            }
        };
    }
});
