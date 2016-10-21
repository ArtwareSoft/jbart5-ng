System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', './studio-tgp-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx, studio_tgp_model_1;
    function pathFromElem(_window, profElem) {
        return _window.jbart.ctxDictionary[profElem.attr('jb-ctx')].path;
        //profElem.attr('jb-path');
    }
    function eventToProfileElem(e, _window) {
        var $el = $(_window.document.elementFromPoint(e.pageX - $(_window).scrollLeft(), e.pageY - $(_window).scrollTop()));
        if (!$el[0])
            return;
        return $($el.get().concat($el.parents().get()))
            .filter(function (i, e) {
            return $(e).attr('jb-ctx');
        })
            .first();
    }
    function showBox(cmp, profElem, _window, previewOffset) {
        if (profElem.offset() == null || $('#jb-preview').offset() == null)
            return;
        cmp.top = previewOffset + profElem.offset().top;
        cmp.left = profElem.offset().left;
        if (profElem.outerWidth() == $(_window.document.body).width())
            cmp.width = (profElem.outerWidth() - 10);
        else
            cmp.width = profElem.outerWidth();
        cmp.height = profElem.outerHeight();
        cmp.title = studio_tgp_model_1.model.shortTitle(pathFromElem(_window, profElem));
        var $el = $(cmp.elementRef.nativeElement);
        var $titleText = $el.find('.title .text');
        console.log('selected', profElem.outerWidth(), profElem.outerHeight());
        Array.from(profElem.parents())
            .forEach(function (el) { return console.log('parent', $(el).outerWidth(), $(el).outerHeight()); });
        var same_size_parents = Array.from(profElem.parents())
            .filter(function (el) {
            return profElem.outerWidth() >= $(el).outerWidth() && profElem.outerHeight() >= $(el).outerHeight();
        })
            .filter(function (el) {
            return $(el).attr('jb-ctx');
        })
            .map(function (el) {
            return studio_tgp_model_1.model.shortTitle(pathFromElem(_window, $(el)));
        })
            .join(', ');
        $el.find('.title .text').text(cmp.title + same_size_parents);
        cmp.titleBelow = top - $titleText.outerHeight() - 6 < $(_window).scrollTop();
        cmp.titleTop = cmp.titleBelow ? cmp.top + cmp.height : cmp.top - $titleText.outerHeight() - 6;
        cmp.titleLeft = cmp.left + (cmp.width - $titleText.outerWidth()) / 2;
        $el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth() / 2 - 6 });
    }
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
            },
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.pick', {
                type: 'action',
                params: [
                    { id: 'from', options: 'studio,preview', as: 'string', defaultValue: 'preview' },
                    { id: 'onSelect', type: 'action', dynamic: true }
                ],
                impl: { $: 'openDialog',
                    $vars: {
                        pickSelection: { path: '' }
                    },
                    style: { $: 'dialog.studio-pick-dialog', from: '%$from%' },
                    content: { $: 'label', title: '' },
                    onOK: function (ctx) {
                        return ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickSelection.ctx));
                    }
                }
            });
            jb_core_1.jb.component('dialog.studio-pick-dialog', {
                hidden: true,
                type: 'dialog.style',
                params: [
                    { id: 'from', as: 'string' },
                ],
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog\">\n<div class=\"edge top\" [style.width]=\"width+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"edge left\" [style.height]=\"height+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"edge right\" [style.height]=\"height+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+width+'px'\"></div>\n<div class=\"edge bottom\" [style.width]=\"width+'px'\" [style.top]=\"top+height+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"title\" [class.bottom]=\"titleBelow\" [style.top]=\"titleTop+'px'\" [style.left]=\"titleLeft+'px'\">\n\t<div class=\"text\">{{title}}</div>\n\t<div class=\"triangle\"></div>\n</div>\n\n</div>",
                    css: "\n.edge { \n\tz-index: 6001;\n\tposition: absolute;\n\tbackground: red;\n\tbox-shadow: 0 0 1px 1px gray;\n\twidth: 1px; height: 1px;\n\tcursor: pointer;\n}\n.title {\n\tz-index: 6001;\n\tposition: absolute;\n\tfont: 14px arial; padding: 0; cursor: pointer;\n\ttransition:top 100ms, left 100ms;\n}\n.title .triangle {\twidth:0;height:0; border-style: solid; \tborder-color: #e0e0e0 transparent transparent transparent; border-width: 6px; margin-left: 14px;}\n.title .text {\tbackground: #e0e0e0; font: 14px arial; padding: 3px; }\n.title.bottom .triangle { background: #fff; border-color: transparent transparent #e0e0e0 transparent; transform: translateY(-28px);}\n.title.bottom .text { transform: translateY(6px);}\n\t\t\t\t",
                    features: [
                        { $: 'dialog-feature.studio-pick', from: '%$from%' },
                    ]
                }
            });
            jb_core_1.jb.component('dialog-feature.studio-pick', {
                type: 'dialog-feature',
                params: [
                    { id: 'from', as: 'string' },
                ],
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            var _window = ctx.params.from == 'preview' ? jbart.previewWindow : window;
                            var previewOffset = ctx.params.from == 'preview' ? $('#jb-preview').offset().top : 0;
                            cmp.titleBelow = false;
                            var mouseMoveEm = jb_rx.Observable.fromEvent(_window.document, 'mousemove');
                            var userPick = jb_rx.Observable.fromEvent(document, 'mousedown')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'mousedown'));
                            var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'keyup'));
                            mouseMoveEm
                                .takeUntil(keyUpEm.filter(function (e) {
                                return e.keyCode == 27;
                            })
                                .merge(userPick))
                                .do(function (e) {
                                if (e.keyCode == 27)
                                    ctx.vars.$dialog.close({ OK: false });
                            })
                                .map(function (e) {
                                return eventToProfileElem(e, _window);
                            })
                                .filter(function (x) { return x && x.length > 0; })
                                .do(function (profElem) {
                                ctx.vars.pickSelection.ctx = _window.jbart.ctxDictionary[profElem.attr('jb-ctx')];
                                showBox(cmp, profElem, _window, previewOffset);
                                jb_ui.apply(ctx);
                            })
                                .last()
                                .subscribe(function (x) {
                                ctx.vars.$dialog.close({ OK: true });
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.highlight-in-preview', {
                params: [
                    { id: 'path', as: 'string' }
                ],
                impl: function (ctx, path) {
                    var _window = jbart.previewWindow || window;
                    if (!_window)
                        return;
                    var elems = Array.from(_window.document.querySelectorAll('[jb-ctx]'))
                        .filter(function (e) {
                        return _window.jbart.ctxDictionary[e.getAttribute('jb-ctx')].path == path;
                    });
                    if (elems.length == 0)
                        elems = Array.from(document.querySelectorAll('[jb-ctx]'))
                            .filter(function (e) {
                            return jbart.ctxDictionary[e.getAttribute('jb-ctx')].path == path;
                        });
                    var boxes = [];
                    //		$('.jbstudio_highlight_in_preview').remove();
                    elems.forEach(function (elem) {
                        var $box = $('<div class="jbstudio_highlight_in_preview"/>');
                        $box.css({ position: 'absolute', background: 'rgb(193, 224, 228)', border: '1px solid blue', opacity: '1', zIndex: 5000 }); // cannot assume css class in preview window
                        var offset = $(elem).offset();
                        $box.css('left', offset.left).css('top', offset.top).width($(elem).outerWidth()).height($(elem).outerHeight());
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
