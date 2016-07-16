System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx, studio;
    var suggestions;
    function rev(str) {
        return str.split('').reverse().join('');
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
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            suggestions = (function () {
                function suggestions(input) {
                    this.input = input;
                    this.pos = input.selectionStart;
                    this.text = input.value.substr(0, this.pos).trim();
                    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, function (match, contents) {
                        return '{' + contents + '}';
                    });
                    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['', ''])[1]);
                    this.tail = rev((rev(this.exp).match(/([^%.\/]*)(\/|\.|%)/) || ['', ''])[1]);
                    this.tailSymbol = this.text_with_open_close.slice(-1 - this.tail.length).slice(0, 1); // % or /
                    if (this.tailSymbol == '%' && this.exp.slice(0, 2) == '%$')
                        this.tailSymbol = '%$';
                    this.base = this.exp.slice(0, -1 - this.tail.length) + '%';
                    this.inputVal = input.value;
                    this.inputPos = input.selectionStart;
                }
                suggestions.prototype.adjustPopupPlace = function (cmp, options) {
                    var temp = $('<span></span>').css('font', $(this.input).css('font')).css('width', '100%')
                        .css('z-index', '-1000').text($(this.input).val().substr(0, this.pos)).appendTo('body');
                    var offset = temp.width();
                    temp.remove();
                    var dialogEl = $(cmp.elementRef.nativeElement).parents('.jb-dialog');
                    dialogEl.css('margin-left', offset + "px")
                        .css('display', options.length ? 'block' : 'none');
                };
                suggestions.prototype.extendWithOptions = function (probeCtx, path) {
                    var _this = this;
                    this.options = [];
                    if (!probeCtx)
                        return this;
                    var vars = jb_core_1.jb.entries(probeCtx.vars).map(function (x) { return ({ text: '$' + x[0], value: x[1] }); })
                        .concat(jb_core_1.jb.entries(probeCtx.resources).map(function (x) { return ({ text: '$' + x[0], value: x[1] }); }));
                    if (this.inputVal == '=')
                        this.options = studio.model.PTsOfPath(path).map(function (compName) {
                            return ({ text: compName.substring(compName.indexOf('.') + 1), value: compName });
                        });
                    else if (this.tailSymbol == '%')
                        this.options = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp('%%'))
                            .map(function (x) {
                            return jb_core_1.jb.entries(x).map(function (x) {
                                return ({ text: x[0], value: x[1] });
                            });
                        }))
                            .concat(vars);
                    else if (this.tailSymbol == '%$')
                        this.options = vars;
                    else if (this.tailSymbol == '/' || this.tailSymbol == '.')
                        this.options = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp(this.base))
                            .map(function (x) { return jb_core_1.jb.entries(x).map(function (x) { return ({ text: x[0], value: x[1] }); }); }));
                    this.options = this.options
                        .filter(jb_onlyUniqueFunc(function (x) { return x.text; }))
                        .filter(function (x) { return x.text != _this.tail; })
                        .filter(function (x) { return x.text.indexOf('$$') != 0; })
                        .filter(function (x) { return ['$ngZone', '$window'].indexOf(x.text) == -1; })
                        .filter(function (x) {
                        return _this.tail == '' || typeof x.text != 'string' || x.text.indexOf(_this.tail) == 0;
                    });
                    return this;
                };
                suggestions.prototype.paste = function (selection) {
                    var toPaste = selection.text + (typeof selection.value == 'object' ? '/' : '%');
                    var input = this.input;
                    var pos = this.pos + 1;
                    input.value = input.value.substr(0, this.pos - this.tail.length) + toPaste + input.value.substr(pos);
                    jb_core_1.jb.delay(100).then(function () {
                        input.selectionStart = pos + toPaste.length;
                        input.selectionEnd = input.selectionStart;
                    });
                };
                return suggestions;
            }());
            exports_1("suggestions", suggestions);
            jb_core_1.jb.component('editable-text.suggestions-input-feature', {
                type: 'feature',
                params: {
                    path: { as: 'string' },
                    action: { type: 'action', dynamic: true },
                    onEnter: { type: 'action', dynamic: true },
                    floatingInput: { type: 'boolean', as: 'boolean', description: 'used to close the floating input popup' }
                },
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            var input = $(cmp.elementRef.nativeElement).findIncludeSelf('input')[0];
                            if (!input)
                                return;
                            cmp.keyEm = jb_rx.Observable.fromEvent(input, 'keydown');
                            cmp.keyEm.filter(function (e) { return e.keyCode == 38 || e.keyCode == 40; })
                                .subscribe(function (e) {
                                return e.preventDefault();
                            });
                            cmp.keyEm.filter(function (e) { return e.keyCode == 13; })
                                .subscribe(function (e) {
                                if (!$(input).hasClass('dialog-open'))
                                    ctx.params.onEnter();
                            });
                            var suggestionEm = cmp.keyEm.filter(function (e) {
                                var inpValue = e.srcElement.value + (e.key.length == 1 ? e.key : '');
                                return inpValue.indexOf('%') != -1; // || inpValue.indexOf('=') == 0;
                            })
                                .flatMap(function (e) {
                                return getProbe().then(function (probeResult) {
                                    return ({ keyEv: e, ctx: probeResult[0] && probeResult[0].in });
                                });
                            })
                                .delay(1) // we use keydown - let the input fill itself
                                .map(function (e) {
                                return new suggestions(e.keyEv.srcElement, '').extendWithOptions(e.ctx, ctx.params.path);
                            })
                                .filter(function (e) {
                                return e.text;
                            })
                                .distinctUntilChanged(null, function (e) { return e.options.join(','); });
                            suggestionEm.subscribe(function (e) {
                                if (!$(e.input).hasClass('dialog-open') && e.options.length > 0) {
                                    var suggestionContext = {
                                        suggestionEm: suggestionEm
                                            .startWith(e)
                                            .do(function (e) {
                                            return suggestionContext.suggestionObj = e;
                                        }),
                                        suggestionObj: e,
                                        keyEm: cmp.keyEm,
                                        closeFloatingInput: function () {
                                            if (ctx.params.floatingInput)
                                                ctx.run({ $: 'closeContainingPopup' });
                                        }
                                    };
                                    jb_ui.wrapWithLauchingElement(ctx.params.action, ctx.setVars({ suggestionContext: suggestionContext }), e.input)();
                                }
                            });
                            function getProbe() {
                                cmp.probeResult = cmp.probeResult || ctx.run({ $: 'studio.probe', path: ctx.params.path });
                                return cmp.probeResult;
                            }
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.jb-open-suggestions', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-suggestions-popup' },
                    content: { $: 'group',
                        features: { $: 'studio.suggestions-emitter' },
                        controls: { $: 'itemlist',
                            items: '%$suggestionContext/suggestionObj/options%',
                            controls: { $: 'label', title: '%text%' },
                            features: [
                                { $: 'itemlist.studio-suggestions-selection',
                                    onEnter: [
                                        { $: 'studio.jb-paste-suggestion', path: '%$path%' },
                                        { $: 'closeContainingPopup' }
                                    ]
                                },
                                { $: 'itemlist.selection',
                                    onDoubleClick: [
                                        { $: 'studio.jb-paste-suggestion', path: '%$path%' },
                                        { $: 'closeContainingPopup' }
                                    ]
                                },
                            ]
                        }
                    }
                }
            });
            jb_core_1.jb.component('studio.suggestions-emitter', {
                type: 'feature',
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            // gain focus back to input after clicking the popup
                            jb_core_1.jb.delay(1).then(function () {
                                return ctx.vars.$dialog.$el.find('.jb-itemlist').attr('tabIndex', '0').focus(function () {
                                    return $(ctx.vars.suggestionContext.suggestionObj.input).focus();
                                });
                            });
                            // adjust popup position
                            ctx.vars.suggestionContext.suggestionEm
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) { return e.type == 'close'; }))
                                .subscribe(function (e) {
                                return e.adjustPopupPlace(cmp, e.options);
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('itemlist.studio-suggestions-selection', {
                type: 'feature',
                params: {
                    onEnter: { type: 'action', dynamic: true },
                },
                impl: function (ctx) {
                    return ({
                        init: function (cmp) {
                            var itemlist = cmp.itemlist;
                            itemlist.selected = cmp.items[0];
                            var keyEm = ctx.vars.suggestionContext.keyEm
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) { return e.type == 'close'; }));
                            keyEm.filter(function (e) { return e.keyCode == 13; }) // ENTER
                                .subscribe(function (x) {
                                if (itemlist.selected)
                                    ctx.params.onEnter(ctx.setData(itemlist.selected));
                            });
                            keyEm.filter(function (e) { return e.keyCode == 27; }) // ESC
                                .subscribe(function (x) {
                                return ctx.run({ $: 'closeContainingPopup' });
                            });
                            keyEm.filter(function (e) {
                                return e.keyCode == 38 || e.keyCode == 40;
                            })
                                .map(function (event) {
                                // event.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                return cmp.items[cmp.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
                            })
                                .subscribe(function (x) {
                                return itemlist.selectionEmitter.next(x);
                            });
                            // change selection if options are changed
                            ctx.vars.suggestionContext.suggestionEm
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) { return e.type == 'close'; }))
                                .distinctUntilChanged(null, function (e) { return e.options.join(','); })
                                .subscribe(function (e) {
                                itemlist.selected = e.options[0];
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.jb-paste-suggestion', {
                params: {
                    path: { as: 'string' }
                },
                type: 'action',
                impl: function (ctx, path) {
                    var suggestions = ctx.vars.suggestionContext.suggestionObj;
                    if (suggestions.inputVal.indexOf('=') == 0)
                        ctx.vars.suggestionContext.closeFloatingInput();
                    suggestions.paste(ctx.data);
                }
            });
        }
    }
});
