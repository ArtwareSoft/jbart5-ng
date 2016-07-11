System.register(['jb-core', 'jb-ui/jb-rx', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx, studio;
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
    function showBox(cmp, profElem, _window, previewOffset) {
        if (profElem.offset() == null || $('#jb-preview').offset() == null)
            return;
        var top = previewOffset + profElem.offset().top;
        var left = profElem.offset().left;
        if (profElem.outerWidth() == $(_window.document.body).width())
            var width = (profElem.outerWidth() - 10);
        else
            var width = profElem.outerWidth();
        var height = profElem.outerHeight();
        var title = studio.model.shortTitle(profElem.attr('jb-path'));
        var $el = $(cmp.elementRef.nativeElement);
        var $titleText = $el.find('.title .text');
        cmp.titleBelow = top - $titleText.outerHeight() - 6 < $(_window).scrollTop();
        $el.find('.top,.bottom').css('width', width + 'px');
        $el.find('.left,.right').css('height', height + 'px');
        $el.find('.top,.left,.bottom,.title').css('left', left + 'px');
        $el.find('.right').css('left', left + width + 'px');
        $el.find('.top,.left,.right').css('top', top + 'px');
        $el.find('.bottom').css('top', top + height + 'px');
        $el.find('.title').css('top', top + (cmp.titleBelow ? height : 0) + 'px');
        $el.find('.title .text').text(title);
        $el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth() / 2 - 6 });
        if (!cmp.titleBelow) {
            $el.find('.title').css({
                top: top - $titleText.outerHeight() - 6,
                left: left + (width - $titleText.outerWidth()) / 2
            }).removeClass('bottom');
        }
        else {
            $el.find('.title').css({
                top: top + height,
                left: left + (width - $titleText.outerWidth()) / 2
            }).addClass('bottom');
        }
        ;
        console.log(cmp.title, profElem);
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.pick', {
                type: 'action',
                params: {
                    from: { options: 'studio,preview', as: 'string', defaultValue: 'preview' },
                    onSelect: { type: 'action', dynamic: true }
                },
                impl: { $: 'openDialog',
                    $vars: {
                        pickPath: { path: '' }
                    },
                    style: { $: 'dialog.studio-pick-dialog', from: '%$from%' },
                    content: { $: 'label', title: '' },
                    onOK: function (ctx) {
                        return ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickPath.path));
                    }
                }
            });
            // <div class="title-above" [ngIf]="titleAbove">
            // 	<div class="text">{{title}}</div>
            // 	<div class="triangle" [style.margin-left]="triangleOffset"></div>
            // </div>
            // <div class="box"></div>
            // <div class="title-below" [ngIf]="!titleAbove">
            // 	<div class="triangle triangle-below" [style.margin-left]="triangleOffset"></div>
            // 	<div class="text"></div>
            // </div>
            // <div class="title">
            // 	<div class="triangle"></div>
            // 	<div class="title">{{title}}</div>
            // </div>
            // <div class="title">
            // 	<div class="title">{{title}}</div>
            // 	<div class="triangle triangle-below"></div>
            // </div>
            // [ngClass]="{bottom: titleBelow}"
            jb_core_1.jb.component('dialog.studio-pick-dialog', {
                hidden: true,
                type: 'dialog.style',
                params: {
                    from: { as: 'string' },
                },
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-dialog\">\n<div class=\"edge top\"></div>\n<div class=\"edge left\"></div>\n<div class=\"edge right\"></div>\n<div class=\"edge bottom\"></div>\n<div class=\"title\" >\n\t<div class=\"text\">{{title}}</div>\n\t<div class=\"triangle\"></div>\n</div>\n\n</div>",
                    css: "\n.edge { \n\tposition: absolute;\n\tbackground: red;\n\tbox-shadow: 0 0 1px 1px gray;\n\twidth: 1px; height: 1px;\n\tcursor: pointer;\n}\n.title {\n\tz-index: 6001;\n\tposition: absolute;\n\tfont: 14px arial; padding: 0; \n\tcursor: pointer;\n\ttransition:top 100ms, left 100ms;\n}\n.title .triangle {\twidth:0;height:0; border-style: solid; \tborder-color: #e0e0e0 transparent transparent transparent; border-width: 6px; margin-left: 14px;}\n.title .text {\tbackground: #e0e0e0; font: 14px arial; padding: 3px; }\n.title.bottom .triangle { background: #fff; border-color: transparent transparent #e0e0e0 transparent; transform: translateY(-28px);}\n.title.bottom .text { transform: translateY(6px);}\n\t\t\t\t",
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
                            var previewOffset = ctx.params.from == 'preview' ? $('#jb-preview').offset().top : 0;
                            cmp.titleBelow = false;
                            var mouseMoveEm = jb_rx.Observable.fromEvent(_window.document, 'mousemove');
                            var userPick = jb_rx.Observable.fromEvent(document, 'mousedown')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'mousedown'));
                            var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup')
                                .merge(jb_rx.Observable.fromEvent((jbart.previewWindow || {}).document, 'keyup'));
                            mouseMoveEm
                                .takeUntil(keyUpEm.filter(function (e) { return e.keyCode == 27; }).merge(userPick))
                                .map(function (e) {
                                return eventToProfileElem(e, _window);
                            })
                                .filter(function (x) { return x.length > 0; })
                                .do(function (profElem) {
                                ctx.vars.pickPath.path = profElem.attr('jb-path');
                                showBox(cmp, profElem, _window, previewOffset);
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
