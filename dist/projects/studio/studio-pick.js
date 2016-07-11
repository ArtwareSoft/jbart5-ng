System.register(['jb-core', 'jb-ui', './studio-model', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, studio, jb_rx;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (studio_1) {
                studio = studio_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.component('pick.highlight-box', {
                type: 'control',
                params: {},
                impl: function (ctx) {
                    return jb_ui.Comp({
                        template: "\n<div>\n\t<div class=\"title-above\" [ngIf]=\"titleAbove\">\n\t\t<div class=\"text\">{{title}}</div>\n\t\t<div class=\"triangle\"></div>\n\t</div>\n\t<div class=\"box\"></div>\n\t<div class=\"title-below\" [ngIf]=\"!titleAbove\">\n\t\t<div class=\"text\"></div>\n\t\t<div class=\"triangle\"></div>\n\t</div>\n</div>",
                        css: "\n\n\t\t\t"
                    }, ctx);
                }
            });
            jb_core_1.jb.component('studio.pick', {
                type: 'action',
                params: {
                    from: { options: 'studio,preview', as: 'string', defaultValue: 'preview' },
                    onSelect: { type: 'action', dynamic: true }
                },
                impl: function (context, from, onSelect) {
                    var _window = from == 'preview' ? jbart.previewWindow : window;
                    function eventToProfileElem(e) {
                        var $el1 = $(_window.document.elementFromPoint(e.pageX - $(_window).scrollLeft(), e.pageY - $(_window).scrollTop()));
                        if (!$el1[0])
                            return;
                        return $($el1.get().concat($el1.parents().get()))
                            .filter(function (i, e) {
                            return $(e).attr('jb-path');
                        })
                            .first();
                    }
                    function pick() {
                        var mouseMoveEm = jb_rx.Observable.fromEvent(_window.document, 'mousemove');
                        var mouseUpEm = jb_rx.Observable.fromEvent(_window.document, 'mouseup');
                        var keyDownEm = jb_rx.Observable.fromEvent(document, 'mouseup')
                            .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'mouseup'));
                        mouseMoveEm.takeUntil(keyDownEm.filter(function (e) { return e.keyCode == 27; }).merge(mouseUpEm))
                            .map(function (e) {
                            return eventToProfileElem(e);
                        })
                            .filter(function (x) { return x; })
                            .do(function (e) {
                            return highlightProfElem(profElem);
                        })
                            .last(function (prof) {
                            return onSelect(ctx.setData(prof));
                        });
                        var _window = from == 'preview' ? jbart.previewWindow : window;
                        var _$window = $(_window);
                        var _body = _window.document.body;
                        var _head = _window.document.head || _window.document.body;
                        var prevMouseMove = _window.onmousemove, prevMouseDown = _window.onmousedown, prevKeyup = _window.onkeyup;
                        if (!_window.jbAddedPickCss) {
                            _window.jbAddedPickCss = true;
                            addPickCss();
                        }
                        _window.onmousemove = mousemove;
                        _window.onmousedown = mousedown;
                        _window.onkeyup = keyup;
                        $('.studio-widget-placeholder').addClass('shadow');
                        if (!$(_body).find('#jbs-rect').length) {
                            $('<div id="jbs-rect"/>').appendTo(_body);
                            $('<div id="jbs-title"><div class="text" /><div class="triangle"/></div>').appendTo(_body);
                            $('<div class="jbs-shadow top"/>').appendTo(_body);
                            $('<div class="jbs-shadow bottom"/>').appendTo(_body);
                            $('<div class="jbs-shadow left"/>').appendTo(_body);
                            $('<div class="jbs-shadow right"/>').appendTo(_body);
                        }
                        _$('.jbs-shadow').show();
                        $(_body).addClass('jbs-select');
                        clearSelection();
                        function _$(selector) {
                            return $(_body).find(selector);
                        }
                        function mousemove(e) {
                            _$('#jbs-title,#jbs-rect,.jbs-shadow').css({ zIndex: -1 });
                            var $el1 = $(_window.document.elementFromPoint(e.pageX - _$window.scrollLeft(), e.pageY - _$window.scrollTop()));
                            if (!$el1[0])
                                return;
                            var $el = $($el1.get().concat($el1.parents().get()))
                                .filter(function (i, e) { return $(e).attr('jb-path'); }).first();
                            _$('.jbs-shadow').show().css({ zIndex: 6000 });
                            if (!$el.length) {
                                clearSelection();
                                return;
                            }
                            _$('#jbs-title').show().css({ zIndex: 6000 });
                            _$('.jbs-shadow.top').css({ height: $el.offset().top });
                            _$('.jbs-shadow.bottom').css({ top: $el.offset().top + $el.outerHeight(), height: docHeight() - $el.offset().top - $el.outerHeight() });
                            _$('.jbs-shadow.left').css({ width: $el.offset().left });
                            _$('.jbs-shadow.right').css({ left: $el.offset().left + $el.outerWidth() });
                            _$('.jbs-shadow.left,.jbs-shadow.right').css({ top: $el.offset().top, height: $el.outerHeight() });
                            var $titleText = _$('#jbs-title .text');
                            if ($el.attr('jb-path')) {
                                $titleText.text(studio.model.shortTitle($el.attr('jb-path')));
                            }
                            setTimeout(function () {
                                if ($el.offset().top - $titleText.outerHeight() - 6 > _$window.scrollTop()) {
                                    _$('#jbs-title').css({
                                        top: $el.offset().top - $titleText.outerHeight() - 6,
                                        left: $el.offset().left + ($el.outerWidth() - $titleText.outerWidth()) / 2
                                    }).removeClass('bottom');
                                    _$('#jbs-title .triangle').css({ marginLeft: $titleText.outerWidth() / 2 - 6 });
                                }
                                else {
                                    _$('#jbs-title').css({
                                        top: $el.offset().top + $el.outerHeight(),
                                        left: $el.offset().left + ($el.outerWidth() - $titleText.outerWidth()) / 2
                                    }).addClass('bottom');
                                    _$('#jbs-title .triangle').css({ marginLeft: $titleText.outerWidth() / 2 - 6 });
                                }
                                ;
                            }, 1);
                            jbart.studio.hover = $el[0];
                        }
                        function mousedown(e) {
                            if (jbart.studio.hover && $(jbart.studio.hover).attr('jb-path')) {
                                onSelect(context.setData($(jbart.studio.hover).attr('jb-path')));
                            }
                            finish();
                            // $('<div class="jb-noclick-cover" style="z-index:5000;position:absolute;top:0;left:0;right:0;background:transparent;" />').css('height',docHeight()+'px')
                            // 	.appendTo(_window.document.body);
                            // var mouseUpEm = jb_rx.Observable.fromEvent(document, 'mouseup')
                            //       			.merge(jb_rx.Observable.fromEvent(
                            //       				(jbart.previewWindow || {}).document, 'mouseup'));
                            // mouseUpEm.take(1)
                            // 	.map(()=>
                            // 		$('.jb-noclick-cover').remove()
                            // 	)
                        }
                        function keyup(e) {
                            if (e.keyCode == 27)
                                finish();
                        }
                        function docHeight() {
                            return Math.max($(_window).outerHeight(), $(_window.document).outerHeight());
                        }
                        function clearSelection() {
                            _$('#jbs-title,#jbs-rect,.jbs-shadow').css({ zIndex: -1 });
                            _$('#jbs-title').hide();
                            _$('.jbs-shadow.top').css({ height: 0 });
                            _$('.jbs-shadow.bottom').css({ top: 0, height: docHeight() });
                            _$('.jbs-shadow.left').css({ width: 0 });
                            _$('.jbs-shadow.right').css({ left: 0 });
                            _$('.jbs-shadow.left,.jbs-shadow.right').css({ top: 0, height: 0 });
                        }
                        function finish() {
                            _$('#jbs-title').hide();
                            _$('.jbs-shadow').hide();
                            _window.onmousedown = prevMouseDown;
                            _window.onmousemove = prevMouseMove;
                            _window.onkeyup = prevKeyup;
                            $('.studio-widget-placeholder').removeClass('shadow');
                            $(_body).removeClass('jbs-select');
                        }
                        function addPickCss() {
                            var pickCss = "\n\t\t\t\t#jbs-title {\tz-index: 6001;position: absolute;\ttransition:top 100ms, left 100ms ;}\n\t\t\t\t#jbs-title .triangle {\twidth:0;height:0; border-style: solid; \tborder-color: #fff transparent transparent transparent; border-width: 6px;\tmargin-left: 14px;}\n\t\t\t\t#jbs-title .text {\tbackground: #fff; font: 14px arial; padding: 3px 8px; }\n\t\t\t\t#jbs-title.bottom .triangle { border-color: transparent transparent #fff transparent; transform: translateY(-28px);}\n\t\t\t\t#jbs-title.bottom .text {\ttransform: translateY(6px);}\n\t\t\t\t\n\t\t\t\t.jbs-shadow { display: block; opacity: 0.4; background: rgb(102, 102, 102); position: absolute; z-index:6000; top:0; left:0;}\n\t\t\t\t.jbs-shadow.bottom { right:0;}\n\t\t\t\t.jbs-shadow.top { right:0;}\n\t\t\t\t.jbs-shadow.right { right: 0;}\n\t\t\t\t.jbs-shadow { transition: top 100ms,left 100ms,right 100ms,bottom 100ms,height 100ms,width 100ms; }\n\t\t\t\t.jbs-select * { cursor: default !important; }\n\t\t\t\t';";
                            $('<style/>').text(pickCss).appendTo(_head);
                        }
                    }
                } });
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
