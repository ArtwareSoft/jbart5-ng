System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', './studio-tgp-model', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx, studio_tgp_model_1, studio_utils_1;
    var suggestions, ValueOption, CompOption;
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
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('studio.property-primitive', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    title: { $: 'studio.prop-name', path: '%$path%' },
                    controls: [
                        { $: 'editable-text',
                            title: '%',
                            databind: { $: 'studio.ref', path: '%$path%' },
                            style: { $: 'editable-text.studio-primitive-text' },
                            features: [
                                { $: 'studio.undo-support', path: '%$path%' },
                                { $: 'studio.property-toobar-feature', path: '%$path%' },
                                { $: 'feature.debounce', debounceTime: '500' }
                            ]
                        },
                        { $: 'itemlist-with-groups',
                            items: '%$suggestionCtx/options%',
                            controls: { $: 'group',
                                style: { $: 'layout.flex', align: 'space-between', direction: 'row' },
                                controls: [
                                    { $: 'label',
                                        title: '%text%',
                                        features: { $: 'css.padding', top: '', left: '3', bottom: '' }
                                    },
                                    { $: 'button',
                                        title: 'select and close',
                                        style: { $: 'button.mdl-icon-12', icon: 'done' },
                                        action: { $: 'studio.paste-suggestion', close: true },
                                    }
                                ]
                            },
                            watchItems: true,
                            features: [
                                { $: 'itemlist.studio-suggestions-options' },
                                { $: 'itemlist.selection',
                                    databind: '%$suggestionCtx/selected%',
                                    onDoubleClick: { $: 'studio.paste-suggestion' },
                                    autoSelectFirst: true
                                },
                                { $: 'hidden', showCondition: '%$suggestionCtx/show%' },
                                { $: 'css.height', height: '500', overflow: 'auto', minMax: 'max' },
                                { $: 'css.width', width: '300', overflow: 'auto' },
                                { $: 'css',
                                    css: '{ position: absolute; z-index:1000; background: white }'
                                },
                                { $: 'css.border', width: '1', color: '#cdcdcd' },
                                { $: 'css.padding', top: '2', left: '3', selector: 'li' }
                            ]
                        }
                    ],
                    features: [
                        { $: 'group.studio-suggestions', path: '%$path%', expressionOnly: true },
                        { $: 'studio.property-toobar-feature', path: '%$path%' }
                    ]
                }
            });
            jb_core_1.jb.component('studio.jb-floating-input', {
                type: 'control',
                params: [{ id: 'path', as: 'string' }],
                impl: { $: 'group',
                    controls: [
                        { $: 'editable-text',
                            databind: { $: 'studio.profile-value-as-text', path: '%$path%' },
                            updateOnBlur: true,
                            style: { $: 'editable-text.md-input', width: '400' },
                            features: [
                                { $: 'studio.undo-support', path: '%$path%' },
                                { $: 'css.padding', left: '4', right: '4' }
                            ]
                        },
                        { $: 'itemlist-with-groups',
                            items: '%$suggestionCtx/options%',
                            controls: { $: 'label', title: '%text%' },
                            watchItems: true,
                            features: [
                                { $: 'itemlist.studio-suggestions-options' },
                                { $: 'itemlist.selection', databind: '%$suggestionCtx/selected%',
                                    onDoubleClick: function (ctx) { return ctx.data.paste(ctx); },
                                    autoSelectFirst: true
                                },
                                { $: 'hidden', showCondition: '%$suggestionCtx/show%' },
                                { $: 'css.height', height: '500', overflow: 'auto', minMax: 'max' },
                                { $: 'css.padding', top: '3', left: '3', selector: 'li' }
                            ]
                        }
                    ],
                    features: [
                        { $: 'group.studio-suggestions',
                            path: '%$path%',
                            closeFloatingInput: [
                                { $: 'closeContainingPopup', OK: true },
                                { $: 'tree.regain-focus' }
                            ]
                        },
                    ]
                }
            });
            jb_core_1.jb.component('studio.paste-suggestion', {
                type: 'control',
                params: [
                    { id: 'option', as: 'single', defaultValue: '%%' },
                    { id: 'close', as: 'boolean', description: 'ends with % or /' }
                ],
                impl: function (ctx, option, close) {
                    return option.paste(ctx, close);
                }
            });
            suggestions = (function () {
                function suggestions(input, expressionOnly) {
                    this.input = input;
                    this.expressionOnly = expressionOnly;
                    this.pos = input.selectionStart;
                    this.text = input.value.substr(0, this.pos).trim();
                    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, function (match, contents) {
                        return '{' + contents + '}';
                    });
                    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['', ''])[1]);
                    this.exp = this.exp || rev((rev(this.text_with_open_close).match(/([^\}=]*=)/) || ['', ''])[1]);
                    this.tail = rev((rev(this.exp).match(/([^%.\/=]*)(\/|\.|%|=)/) || ['', ''])[1]);
                    this.tailSymbol = this.text_with_open_close.slice(-1 - this.tail.length).slice(0, 1); // % or /
                    if (this.tailSymbol == '%' && this.exp.slice(0, 2) == '%$')
                        this.tailSymbol = '%$';
                    this.base = this.exp.slice(0, -1 - this.tail.length) + '%';
                    this.inputVal = input.value;
                    this.inputPos = input.selectionStart;
                }
                suggestions.prototype.suggestionsRelevant = function () {
                    return (this.inputVal.indexOf('=') == 0 && !this.expressionOnly)
                        || ['%', '%$', '/', '.'].indexOf(this.tailSymbol) != -1;
                };
                suggestions.prototype.adjustPopupPlace = function (cmp, options) {
                    // var temp = $('<span></span>').css('font',$(this.input).css('font')).css('width','100%')
                    //   .css('z-index','-1000').text($(this.input).val().substr(0,this.pos)).appendTo('body');
                    // var offset = temp.width();
                    // temp.remove();
                    // var dialogEl = $(cmp.elementRef.nativeElement).parents('.jb-dialog');
                    // dialogEl.css('margin-left', `${offset}px`)
                    //   .css('display', options.length ? 'block' : 'none');
                };
                suggestions.prototype.extendWithOptions = function (probeCtx, path) {
                    var _this = this;
                    this.options = [];
                    probeCtx = probeCtx || (jbart.previewjbart || jbart).initialCtx;
                    var vars = jb_core_1.jb.entries(jb_core_1.jb.extend({}, (probeCtx.componentContext || {}).params, probeCtx.vars, probeCtx.resources))
                        .map(function (x) { return new ValueOption('$' + x[0], x[1], _this.pos, _this.tail); })
                        .filter(function (x) { return x.toPaste.indexOf('$$') != 0; })
                        .filter(function (x) { return ['$ngZone', '$window', '$injector'].indexOf(x.toPaste) == -1; });
                    if (this.inputVal.indexOf('=') == 0 && !this.expressionOnly)
                        this.options = studio_tgp_model_1.model.PTsOfPath(path).map(function (compName) {
                            var name = compName.substring(compName.indexOf('.') + 1);
                            var ns = compName.substring(0, compName.indexOf('.'));
                            return new CompOption(compName, compName, ns ? name + " (" + ns + ")" : name, studio_utils_1.getComp(compName).description || '');
                        });
                    else if (this.tailSymbol == '%')
                        this.options = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp('%%'))
                            .map(function (x) {
                            return jb_core_1.jb.entries(x).map(function (x) { return new ValueOption(x[0], x[1], _this.pos, _this.tail); });
                        }))
                            .concat(vars);
                    else if (this.tailSymbol == '%$')
                        this.options = vars;
                    else if (this.tailSymbol == '/' || this.tailSymbol == '.')
                        this.options = [].concat.apply([], jb_core_1.jb.toarray(probeCtx.exp(this.base))
                            .map(function (x) { return jb_core_1.jb.entries(x).map(function (x) { return new ValueOption(x[0], x[1], _this.pos, _this.tail); }); }));
                    this.options = this.options
                        .filter(jb_unique(function (x) { return x.toPaste; }))
                        .filter(function (x) { return x.toPaste != _this.tail; })
                        .filter(function (x) {
                        return _this.tail == '' || typeof x.toPaste != 'string' || (x.description + x.toPaste).toLowerCase().indexOf(_this.tail) != -1;
                    });
                    if (this.tail)
                        this.options.sort(function (x, y) { return (y.toPaste.toLowerCase().indexOf(_this.tail) == 0 ? 1 : 0) - (x.toPaste.toLowerCase().indexOf(_this.tail) == 0 ? 1 : 0); });
                    this.key = this.options.map(function (o) { return o.toPaste; }).join(',');
                    return this;
                };
                return suggestions;
            }());
            exports_1("suggestions", suggestions);
            ValueOption = (function () {
                function ValueOption(toPaste, value, pos, tail) {
                    this.toPaste = toPaste;
                    this.value = value;
                    this.pos = pos;
                    this.tail = tail;
                    this.text = this.toPaste + this.valAsText();
                }
                ValueOption.prototype.valAsText = function () {
                    var val = this.value;
                    if (typeof val == 'string' && val.length > 20)
                        return " (" + val.substring(0, 20) + "...)";
                    else if (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
                        return " (" + val + ")";
                    return "";
                };
                ValueOption.prototype.paste = function (ctx, close) {
                    var toPaste = this.toPaste + ((typeof this.value != 'object' || close) ? '%' : '/');
                    var suggestionCtx = ctx.vars.suggestionCtx;
                    var input = suggestionCtx.input;
                    var pos = this.pos + 1;
                    input.value = input.value.substr(0, this.pos - this.tail.length) + toPaste + input.value.substr(pos);
                    suggestionCtx.show = false;
                    suggestionCtx.selected = null;
                    return jb_core_1.jb.delay(1, ctx).then(function () {
                        input.selectionStart = pos + toPaste.length;
                        input.selectionEnd = input.selectionStart;
                    });
                };
                ValueOption.prototype.writeValue = function (ctx) {
                    var input = ctx.vars.suggestionCtx.input;
                    var script_ref = ctx.run({ $: 'studio.ref', path: '%$suggestionCtx.path%' });
                    jb_core_1.jb.writeValue(script_ref, input.value);
                };
                return ValueOption;
            }());
            CompOption = (function () {
                function CompOption(toPaste, value, text, description) {
                    this.toPaste = toPaste;
                    this.value = value;
                    this.text = text;
                    this.description = description;
                }
                CompOption.prototype.paste = function (ctx) {
                    ctx.vars.suggestionCtx.input.value = '=' + this.toPaste;
                    ctx.vars.suggestionCtx.closeAndWriteValue();
                };
                CompOption.prototype.writeValue = function (ctx) {
                    ctx.run({ $: 'writeValue', to: { $: 'studio.comp-name-ref', path: '%$suggestionCtx.path%' }, value: this.toPaste });
                    ctx.run({ $: 'studio.expand-and-select-first-child-in-jb-editor' });
                };
                return CompOption;
            }());
            jb_core_1.jb.component('group.studio-suggestions', {
                type: 'feature',
                params: [
                    { id: 'path', as: 'string' },
                    { id: 'closeFloatingInput', type: 'action', dynamic: true },
                    { id: 'expressionOnly', type: 'boolean', as: 'boolean' }
                ],
                impl: function (ctx) {
                    var suggestionCtx = { path: ctx.params.path, options: [], show: false };
                    return {
                        observable: function () { },
                        extendCtx: function (ctx2) {
                            return ctx2.setVars({ suggestionCtx: suggestionCtx });
                        },
                        afterViewInit: function (cmp) {
                            var input = $(cmp.elementRef.nativeElement).findIncludeSelf('input')[0];
                            if (!input)
                                return;
                            suggestionCtx.input = input;
                            var inputClosed = cmp.jbEmitter.filter(function (x) { return x == 'destroy'; });
                            cmp.keyEm = jb_rx.Observable.fromEvent(input, 'keydown')
                                .takeUntil(inputClosed);
                            suggestionCtx.keyEm = cmp.keyEm;
                            suggestionCtx.closeAndWriteValue = function () {
                                ctx.params.closeFloatingInput();
                                var option = input.value.indexOf('=') == 0 ? new CompOption(input.value.substr(1)) : new ValueOption();
                                option.writeValue(cmp.ctx);
                            };
                            cmp.keyEm.filter(function (e) { return e.keyCode == 13; })
                                .subscribe(function (e) {
                                if (!suggestionCtx.show || suggestionCtx.options.length == 0)
                                    suggestionCtx.closeAndWriteValue();
                            });
                            cmp.keyEm.filter(function (e) { return e.keyCode == 27; })
                                .subscribe(function (e) {
                                ctx.params.closeFloatingInput();
                            });
                            suggestionCtx.suggestionEm = cmp.keyEm
                                .filter(function (e) { return e.keyCode != 38 && e.keyCode != 40; })
                                .delay(1) // we use keydown - let the input fill itself
                                .debounceTime(20) // solves timing of closing the floating input
                                .filter(function (e) {
                                return suggestionCtx.show = new suggestions(input, ctx.params.expressionOnly).suggestionsRelevant();
                            })
                                .catch(function (e) {
                                return console.log(1, e);
                            })
                                .map(function (e) {
                                return input.value;
                            })
                                .distinctUntilChanged()
                                .flatMap(function (e) {
                                return getProbe();
                            })
                                .map(function (res) {
                                return res && res.finalResult && res.finalResult[0] && res.finalResult[0].in;
                            })
                                .map(function (probeCtx) {
                                return new suggestions(input, ctx.params.expressionOnly).extendWithOptions(probeCtx, ctx.params.path);
                            })
                                .catch(function (e) {
                                return console.log(2, e);
                            })
                                .distinctUntilChanged(function (e1, e2) {
                                return e1.key == e2.key;
                            })
                                .catch(function (e) {
                                return console.log(3, e);
                            });
                            function getProbe() {
                                if (cmp.probeResult)
                                    return [cmp.probeResult];
                                var _probe = jb_rx.Observable.fromPromise(ctx.run({ $: 'studio.probe', path: ctx.params.path }));
                                _probe.subscribe(function (res) {
                                    return cmp.probeResult = res;
                                });
                                // do not wait more than 500 mSec
                                return _probe.race(jb_rx.Observable.of({ finalResult: [ctx] }).delay(500))
                                    .catch(function (e) {
                                    return jb_core_1.jb.logException(e, 'in probe exception');
                                });
                            }
                        }
                    };
                }
            });
            jb_core_1.jb.component('itemlist.studio-suggestions-options', {
                type: 'feature',
                params: [],
                impl: function (ctx) {
                    return ({
                        afterViewInit: function (cmp) {
                            var suggestionCtx = ctx.vars.suggestionCtx;
                            //        cmp.changeDt.detach();
                            jb_core_1.jb.delay(1, ctx).then(function () {
                                var keyEm = suggestionCtx.keyEm;
                                keyEm.filter(function (e) {
                                    return e.keyCode == 13;
                                }) // ENTER
                                    .subscribe(function () {
                                    suggestionCtx.show = false;
                                    if (suggestionCtx.selected && suggestionCtx.selected.paste) {
                                        suggestionCtx.selected.paste(ctx);
                                        suggestionCtx.selected = null;
                                    }
                                    jb_ui.apply(ctx);
                                });
                                keyEm.filter(function (e) { return e.keyCode == 27; }) // ESC
                                    .subscribe(function (x) {
                                    return suggestionCtx.show = false;
                                });
                                keyEm.filter(function (e) {
                                    return e.keyCode == 38 || e.keyCode == 40;
                                })
                                    .subscribe(function (e) {
                                    var diff = e.keyCode == 40 ? 1 : -1;
                                    var items = cmp.items; //.filter(item=>!item.heading);
                                    suggestionCtx.selected = items[(items.indexOf(suggestionCtx.selected) + diff + items.length) % items.length] || suggestionCtx.selected;
                                    // cmp.changeDt.markForCheck();
                                    // cmp.changeDt.detectChanges();
                                    e.preventDefault();
                                });
                                suggestionCtx.suggestionEm.subscribe(function (e) {
                                    suggestionCtx.show = e.options.length > 0;
                                    suggestionCtx.options = e.options;
                                    suggestionCtx.selected = e.options[0];
                                    cmp.changeDt.markForCheck();
                                    cmp.changeDt.detectChanges();
                                });
                            });
                        },
                    });
                }
            });
        }
    }
});
