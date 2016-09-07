jbLoadModules(['jb-core', 'jb-ui', 'jb-ui/jb-rx']).then(function (loadedModules) {
    var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];
    jb.component('material-demo.pick', {
        type: 'action',
        params: [
            { id: 'onHover', type: 'action', dynamic: true },
            { id: 'onSelect', type: 'action', dynamic: true }
        ],
        impl: { $: 'openDialog',
            $vars: {
                pickPath: { path: '' }
            },
            style: { $: 'dialog.material-demo-pick-dialog', onHover: { $call: 'onHover' } },
            content: { $: 'label', title: '' },
            onOK: function (ctx) {
                return ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickPath.path));
            }
        }
    });
    jb.component('dialog.material-demo-pick-dialog', {
        hidden: true,
        type: 'dialog.style',
        params: [
            { id: 'from', as: 'string' },
            { id: 'onHover', type: 'action', dynamic: true },
        ],
        impl: { $: 'customStyle',
            template: "<div class=\"jb-dialog\">\n<div class=\"edge top\" [style.width]=\"width+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"edge left\" [style.height]=\"height+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"edge right\" [style.height]=\"height+'px'\" [style.top]=\"top+'px'\" [style.left]=\"left+width+'px'\"></div>\n<div class=\"edge bottom\" [style.width]=\"width+'px'\" [style.top]=\"top+height+'px'\" [style.left]=\"left+'px'\"></div>\n<div class=\"title\" [class.bottom]=\"titleBelow\" [style.top]=\"titleTop+'px'\" [style.left]=\"titleLeft+'px'\">\n\t<div class=\"text\">{{title}}</div>\n\t<div class=\"triangle\"></div>\n</div>\n\n</div>",
            css: "\n.edge { \n\tz-index: 6001;\n\tposition: absolute;\n\tbackground: blue;\n\tbox-shadow: 0 0 1px 1px gray;\n\twidth: 1px; height: 1px;\n\tcursor: pointer;\n}\n.title {\n\tz-index: 6001;\n\tposition: absolute;\n\tfont: 14px arial; padding: 0; cursor: pointer;\n\ttransition:top 100ms, left 100ms;\n}\n.title .triangle {\twidth:0;height:0; border-style: solid; \tborder-color: #e0e0e0 transparent transparent transparent; border-width: 6px; margin-left: 14px;}\n.title .text {\tbackground: #e0e0e0; font: 14px arial; padding: 3px; }\n.title.bottom .triangle { background: #fff; border-color: transparent transparent #e0e0e0 transparent; transform: translateY(-28px);}\n.title.bottom .text { transform: translateY(6px);}\n\t\t\t\t",
            features: [
                { $: 'dialog-feature.material-demo-pick', onHover: { $call: 'onHover' } },
            ]
        }
    });
    jb.component('dialog-feature.material-demo-pick', {
        type: 'dialog-feature',
        params: [
            { id: 'onHover', type: 'action', dynamic: true },
        ],
        impl: function (ctx) {
            return ({
                init: function (cmp) {
                    cmp.titleBelow = false;
                    var mouseMoveEm = jb_rx.Observable.fromEvent(document, 'mousemove');
                    var userPick = jb_rx.Observable.fromEvent(document, 'mousedown');
                    var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup');
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
                        return eventToProfileElem(e);
                    })
                        .filter(function (x) { return x.length > 0; })
                        .do(function (profElem) {
                        ctx.vars.pickPath.path = profElem.attr('ng-path');
                        showBox(cmp, profElem);
                        ctx.params.onHover(ctx.setData(profElem.attr('ng-path')).setVars({ ngElem: profElem }));
                        //		  		jb_ui.apply(ctx);
                    })
                        .last()
                        .subscribe(function (x) {
                        ctx.vars.$dialog.close({ OK: true });
                    });
                }
            });
        }
    });
    function eventToProfileElem(e) {
        var $el = $(document.elementFromPoint(e.pageX - $(window).scrollLeft(), e.pageY - $(window).scrollTop()));
        if (!$el[0])
            return;
        return $($el.get().concat($el.parents().get()))
            .filter(function (i, e) {
            return $(e).attr('ng-path');
        })
            .first();
    }
    function showBox(cmp, profElem) {
        if (profElem.offset() == null)
            return;
        cmp.top = profElem.offset().top;
        cmp.left = profElem.offset().left;
        if (profElem.outerWidth() == $(document.body).width())
            cmp.width = (profElem.outerWidth() - 10);
        else
            cmp.width = profElem.outerWidth();
        cmp.height = profElem.outerHeight();
        cmp.title = profElem.tagName;
        var $el = $(cmp.elementRef.nativeElement);
        var $titleText = $el.find('.title .text');
        $el.find('.title .text').text(cmp.title);
        cmp.titleBelow = top - $titleText.outerHeight() - 6 < $(window).scrollTop();
        cmp.titleTop = cmp.titleBelow ? cmp.top + cmp.height : cmp.top - $titleText.outerHeight() - 6;
        cmp.titleLeft = cmp.left + (cmp.width - $titleText.outerWidth()) / 2;
        $el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth() / 2 - 6 });
    }
});
