System.register(['jb-core', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx;
    function eventToProfileElem(e, _window) {
        var $el = $(_window.document.elementFromPoint(e.pageX - $(_window).scrollLeft(), e.pageY - $(_window).scrollTop()));
        if (!$el[0])
            return;
        return $($el.get().concat($el.parents().get()))
            .filter(function (i, e) {
            return $(e).attr('jb-path');
        })
            .first();
    }
    function showBox(cmp, profElem, _window) {
        cmp.top = profElem.offset().top + 'px';
        cmp.left = profElem.offset().left + 'px';
        if (profElem.outerWidth() == $(_window.document.body).width())
            cmp.width = (profElem.outerWidth() - 10) + 'px';
        else
            cmp.width = profElem.outerWidth() + 'px';
        cmp.height = profElem.outerHeight() + 'px';
        cmp.title = studio.model.shortTitle(profElem.attr('jb-path'));
        cmp.titleAbove = cmp.top - 20 > $(_window).scrollTop();
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.pick', {
                type: 'action',
                params: {
                    from: { options: 'studio,preview', as: 'string', defaultValue: 'preview' },
                    onSelect: { type: 'action', dynamic: true }
                },
                impl: { $: 'openDialog',
                    style: 'dialog.studio-pick-dialog',
                    content: { $: 'label', title: '' },
                    onOK: { $call: 'onSelect' }
                }
            });
            jb_core_1.jb.component('dialog.studio-pick-dialog', {
                hidden: true,
                type: 'dialog.style',
                params: {
                    from: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog\">\n<div class=\"outer\" [style.top]=\"top\" [style.left]=\"left\" [style.width]=\"width\" [style.height]=\"height\">\n\t<div class=\"title-above\" [ngIf]=\"titleAbove\">\n\t\t<div class=\"text\">{{title}}</div>\n\t\t<div class=\"triangle\" [style.margin-left]=\"triangleOffset\"></div>\n\t</div>\n\t<div class=\"box\"></div>\n\t<div class=\"title-below\" [ngIf]=\"!titleAbove\">\n\t\t<div class=\"triangle triangle-below\" [style.margin-left]=\"triangleOffset\"></div>\n\t\t<div class=\"text\"></div>\n\t</div>\n</div>\n</div>",
                    css: "\n.outer { \n\tposition: absolute; \n\ttransition:top 100ms, left 100ms ;\n\tcursor: pointer;\n\tbackground: transparent;\n\tbox-shadow: 0 0 6px 1px gray; \n}\n.text {\tbackground: #fff; font: 14px arial; padding: 3px 8px; }\n\n.triangle { width:0;height:0; border-style: solid; border-color: #fff transparent transparent transparent; \n\tborder-width: 6px;\tmargin-left: 14px;\n}\n.triangle-below { transform: rotate(180deg) }\n\t\t\t\t",
                    features: [
                        { $: 'dialogFeature.studio-pick', from: '%$from%' },
                    ]
                }
            });
            jb_core_1.jb.component('dialogFeature.studio-pick', {
                type: 'dialogFeature',
                params: {
                    from: { as: 'string' },
                },
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            var _window = ctx.params.from == 'preview' ? jbart.previewWindow : window;
                            var mouseMoveEm = jb_rx.Observable.fromEvent(_window.document, 'mousemove');
                            var userPick = jb_rx.Observable.fromEvent(cmp.elementRef.nativeElement, 'click');
                            var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'keyup'));
                            mouseMoveEm.takeUntil(keyUpEm.filter(function (e) { return e.keyCode == 27; }).merge(userPick))
                                .map(function (e) {
                                return eventToProfileElem(e, _window);
                            })
                                .filter(function (x) { return x; })
                                .do(function (e) {
                                return showBox(cmp, profElem, _window);
                            })
                                .last()
                                .subscribe(function (x) {
                                ctx.$dialog.close({ OK: OK });
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.highlight-in-preview', {
                params: {
                    path: { as: 'string' }
                },
                impl: function (ctx, path) {
                    var _window = jbart.previewWindow || window;
                    if (!_window)
                        return;
                    var elems = _window.document.querySelectorAll('[jb-path="' + path + '"]');
                    if (elems.length == 0) {
                        elems = window.document.querySelectorAll('[jb-path="' + path + '"]');
                        if (elems.length)
                            _window = window;
                    }
                    var boxes = [];
                    $('.jbstudio_highlight_in_preview').remove();
                    $(elems).each(function () {
                        var $box = $('<div class="jbstudio_highlight_in_preview"/>').css({ position: 'absolute', background: 'rgb(193, 224, 228)', border: '1px solid blue', opacity: '1', zIndex: 5000 });
                        var offset = $(this).offset();
                        $box.css('left', offset.left).css('top', offset.top).width($(this).outerWidth()).height($(this).outerHeight());
                        if ($box.width() == $(_window.document.body).width())
                            $box.width($box.width() - 10);
                        boxes.push($box[0]);
                    });
                    $(_window.document.body).append($(boxes));
                    $(boxes).css({ opacity: 0.5 }).
                        fadeTo(1500, 0, function () {
                        $(boxes).remove();
                    });
                }
            });
        }
    }
});
