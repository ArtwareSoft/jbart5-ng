System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    var suggestionObj;
    function rev(str) {
        return str.split('').reverse().join('');
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            suggestionObj = (function () {
                function suggestionObj(input) {
                    this.input = input;
                    this.pos = input.selectionStart;
                    this.text = input.value.substr(0, this.pos).trim();
                    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, function (match, contents) {
                        return '{' + contents + '}';
                    });
                    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['', ''])[1]);
                    this.tail = rev((rev(this.exp).match(/([^.\/]*)(\/|\.)/) || ['', ''])[1]);
                    this.lastChar = this.text_with_open_close.slice(-1);
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
                    var base = this.exp.slice(0, -1 - this.tail.length);
                    if (this.lastChar == '%')
                        this.suggestions = jb_core_1.jb.toarray(probeCtx.exp('%%'))
                            .concat(jb_core_1.jb.entries(probeCtx.vars).map(function (x) { return '$' + x[0]; }))
                            .concat(jb_core_1.jb.entries(probeCtx.resources).map(function (x) { return '$' + x[0]; }));
                    else
                        this.suggestions = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp(base + '%'))
                            .map(function (x) {
                            return jb_core_1.jb.entries(x).map(function (x) { return x[0]; });
                        }))
                            .filter(jb_onlyUnique)
                            .filter(function (p) {
                            return _this.tail == '' || p.indexOf(e.tail) == 0;
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
                    action: { type: 'action', dynamic: true }
                },
                impl: function (ctx) { return ({
                    innerhost: {
                        'md-input': { '(keyup)': 'keyEm.next($event)' }
                    },
                    init: function (cmp) {
                        cmp.keyEm = cmp.keyEm || new Subject();
                        var suggestionsEm = cmp.keyEm
                            .map(function (e) { return new suggestionObj(e.srcElement); })
                            .distinctUntilChanged(null, function (e) { return e.input.value; })
                            .filter(function (e) {
                            return e.exp;
                        });
                        suggestionsEm.subscribe(function (e) {
                            if (!$(e.input).hasClass('dialog-open'))
                                jb_ui.wrapWithLauchingElement(ctx.params.action, cmp.ctx.setVars({ keyEmitter: cmp.keyEm,
                                    suggestionsEm: suggestionsEm.startWith(e) }), e.input)();
                        });
                    }
                }); }
            });
            jb_core_1.jb.component('studio.jb-open-suggestions', {
                type: 'action',
                params: {
                    path: { as: 'string' }
                },
                impl: { $: 'openDialog',
                    $vars: { dialogData: { $object: {} } },
                    style: { $: 'dialog.studio-suggestions-popup' },
                    content: { $: 'wait',
                        for: { $: 'studio.probe', path: '%$path%' },
                        dataVariable: 'probeResult',
                        control: { $: 'group',
                            features: { $: 'studio.refresh-suggestions' },
                            controls: { $: 'itemlist',
                                items: '%$dialogData/suggestionObj/suggestions%',
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
                }
            });
            jb_core_1.jb.component('studio.refresh-suggestions', {
                type: 'feature',
                params: {
                    into: { as: 'ref' }
                },
                impl: function (ctx, into) {
                    return ({
                        init: function (cmp) {
                            ctx.exp('%$suggestionsEm%')
                                .do(function (e) { return e.adjustPopupPlace(cmp); })
                                .map(function (e) { return extendWithSuggestions(ctx.exp('%$probeResult%')[0].in); })
                                .subscribe(function (e) {
                                return ctx.vars.dialogData.suggestionObj = e;
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
                            itemlist.selected = itemlist.items[0];
                            var keyEm = ctx.exp('%$keyEmitter%')
                                .takeUntil(ctx.vars.$dialog.em.filter(function (e) {
                                return e.type == 'close';
                            }));
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
                                return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
                            })
                                .subscribe(function (x) {
                                return itemlist.selectionEmitter.next(x);
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
                    return ctx.vars.dialogData.suggestionObj.paste(toPaste);
                }
            });
        }
    }
});
