System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    var suggestionObj;
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
            }],
        execute: function() {
            suggestionObj = (function () {
                function suggestionObj(input, lastKey) {
                    this.input = input;
                    this.pos = input.selectionStart + (lastKey ? 1 : 0);
                    this.text = (input.value + lastKey).substr(0, this.pos).trim();
                    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, function (match, contents) {
                        return '{' + contents + '}';
                    });
                    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['', ''])[1]);
                    this.tail = rev((rev(this.exp).match(/([^%.\/]*)(\/|\.|%)/) || ['', ''])[1]);
                    this.tailSymbol = this.text_with_open_close.slice(-1 - this.tail.length).slice(0, 1); // % or /
                    if (this.tailSymbol == '%' && this.exp.slice(0, 2) == '%$')
                        this.tailSymbol = '%$';
                    this.base = this.exp.slice(0, -1 - this.tail.length) + '%';
                }
                suggestionObj.prototype.adjustPopupPlace = function (cmp) {
                    var temp = $('<span></span>').css('font', $(this.input).css('font')).css('width', '100%')
                        .css('z-index', '-1000').text($(this.input).val().substr(0, this.pos)).appendTo('body');
                    var offset = temp.width();
                    temp.remove();
                    $(cmp.elementRef.nativeElement).parents('.jb-dialog')
                        .css('margin-left', offset + "px");
                };
                suggestionObj.prototype.extendWithSuggestions = function (probeCtx) {
                    var _this = this;
                    var vars = jb_core_1.jb.entries(probeCtx.vars).map(function (x) { return '$' + x[0]; })
                        .concat(jb_core_1.jb.entries(probeCtx.resources).map(function (x) { return '$' + x[0]; }));
                    if (this.tailSymbol == '%')
                        this.suggestions = jb_core_1.jb.toarray(probeCtx.exp('%%'))
                            .concat(vars);
                    else if (this.tailSymbol == '%$')
                        this.suggestions = vars;
                    else
                        this.suggestions = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp(this.base))
                            .map(function (x) {
                            return jb_core_1.jb.entries(x).map(function (x) { return x[0]; });
                        }));
                    this.suggestions = this.suggestions
                        .filter(jb_onlyUnique)
                        .filter(function (p) {
                        return _this.tail == '' || typeof p != 'string' || p.indexOf(_this.tail) == 0;
                    });
                    return this;
                };
                suggestionObj.prototype.paste = function (selection) {
                    var input = this.input;
                    var pos = this.pos + 1;
                    input.value = input.value.substr(0, this.pos - this.tail.length) + selection + input.value.substr(pos);
                    jb_core_1.jb.delay(100).then(function () {
                        input.selectionStart = pos + selection.length;
                        input.selectionEnd = input.selectionStart;
                    });
                };
                return suggestionObj;
            }());
            exports_1("suggestionObj", suggestionObj);
            jb_core_1.jb.component('editable-text.studio-jb-detect-suggestions', {
                type: 'feature',
                params: {
                    path: { as: 'string' },
                    action: { type: 'action', dynamic: true }
                },
                impl: function (ctx) { return ({
                    innerhost: {
                        'md-input': { '(keydown)': 'keyEm.next($event)' }
                    },
                    init: function (cmp) {
                        cmp.keyEm = cmp.keyEm || new Subject();
                        ctx.run({ $: 'studio.probe', path: ctx.params.path }).then(function (probeResult) {
                            var suggestionEm = cmp.keyEm
                                .map(function (e) {
                                return new suggestionObj(e.srcElement, e.key.length == 1 ? e.key : '');
                            })
                                .distinctUntilChanged(null, function (e) { return e.input.value; })
                                .filter(function (e) {
                                return e.exp;
                            })
                                .map(function (e) {
                                return e.extendWithSuggestions(probeResult[0].in);
                            });
                            suggestionEm.subscribe(function (e) {
                                if (!$(e.input).hasClass('dialog-open')) {
                                    var ctx2 = ctx.setVars({ suggestionContext: { suggestionEm: suggestionEm.startWith(e), keyEm: cmp.keyEm } });
                                    jb_ui.wrapWithLauchingElement(ctx.params.action, ctx2, e.input)();
                                }
                            });
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('studio.jb-open-suggestions', {
                type: 'action',
                impl: { $: 'openDialog',
                    style: { $: 'dialog.studio-suggestions-popup' },
                    content: { $: 'group',
                        features: { $: 'studio.suggestions-emitter' },
                        controls: { $: 'itemlist',
                            items: '%$suggestionContext/suggestionObj/suggestions%',
                            controls: { $: 'label', title: '%%' },
                            features: [
                                { $: 'itemlist.studio-suggestions-selection',
                                    onEnter: [
                                        { $: 'studio.jb-paste-suggestion', toPaste: '%%' },
                                        { $: 'closeContainingPopup' }
                                    ]
                                },
                                { $: 'itemlist.selection' },
                            ]
                        }
                    }
                }
            });
            jb_core_1.jb.component('studio.suggestions-emitter', {
                type: 'feature',
                params: {
                    into: { as: 'ref' }
                },
                impl: function (ctx, into) {
                    return ({
                        init: function (cmp) {
                            ctx.vars.suggestionContext.suggestionEm
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) { return e.type == 'close'; }))
                                .subscribe(function (e) {
                                e.adjustPopupPlace(cmp);
                                ctx.vars.suggestionContext.suggestionObj = e;
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
                            keyEm.filter(function (e) { return e.keyCode == 13; })
                                .subscribe(function (x) {
                                return ctx.params.onEnter(ctx.setData(itemlist.selected));
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
                            ctx.vars.suggestionContext.suggestionEm
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) { return e.type == 'close'; }))
                                .distinctUntilChanged(null, function (e) { return e.suggestions.join(','); })
                                .subscribe(function (e) {
                                if (!e.suggestions[0])
                                    console.log(e);
                                itemlist.selected = e.suggestions[0];
                            });
                        }
                    });
                }
            });
            jb_core_1.jb.component('studio.jb-paste-suggestion', {
                params: {
                    toPaste: { as: 'string' },
                },
                type: 'action',
                impl: function (ctx, toPaste) {
                    return ctx.vars.suggestionContext.suggestionObj.paste(toPaste);
                }
            });
        }
    }
});
