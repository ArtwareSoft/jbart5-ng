System.register(['jb-core/jb', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_rx;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            ;
            jb_1.jb.component('itemlist', {
                type: 'control',
                params: {
                    title: { as: 'string' },
                    items: { as: 'array', dynamic: true, essential: true },
                    controls: { type: 'control[]', essential: true, dynamic: true },
                    style: { type: 'itemlist.style', dynamic: true, defaultValue: { $: 'itemlist.ul-li' } },
                    watchItems: { type: 'boolean', as: 'boolean', defaultValue: false },
                    itemVariable: { as: 'string', defaultValue: 'item' },
                    heading: { type: 'control', dynamic: true, defaultValue: { $: 'itemlist-heading', title: '%title%' } },
                    features: { type: 'feature[]', dynamic: true, flattenArray: true },
                },
                impl: { $: 'group',
                    title: '%$title%',
                    style: { $call: 'style' },
                    controls: { $: 'dynamic-controls',
                        controlItems: '%$items_array%',
                        genericControl: { $if: '%heading%',
                            then: { $call: 'heading' },
                            else: { $call: 'controls' },
                        },
                        itemVariable: '%$itemVariable%'
                    },
                    features: [
                        { $call: 'features' },
                        { $: 'itemlist.watch-items', items: { $call: 'items' }, watch: '%$watchItems%', itemVariable: 'items_array' },
                    ]
                }
            });
            jb_1.jb.component('itemlist.watch-items', {
                type: 'feature',
                params: {
                    items: { essential: true, dynamic: true },
                    itemVariable: { as: 'string' },
                    watch: { type: 'boolean', as: 'boolean', defaultValue: true }
                },
                impl: function (context, items, itemVariable, watch) {
                    return {
                        beforeInit: function (cmp) {
                            var itemsEm = cmp.jbEmitter
                                .filter(function (x) { return x == 'check'; })
                                .map(function () {
                                return cmp.calc_heading ? cmp.calc_heading(items()) : items();
                            })
                                .filter(function (items) {
                                return !jb_compareArrays(items, (cmp.ctrls || []).map(function (ctrl) { return ctrl.comp.ctx.data; }));
                            })
                                .map(function (items) {
                                cmp.items = items;
                                var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx).setData(items);
                                var ctx3 = itemVariable ? ctx2.setVars(jb_1.jb.obj(itemVariable, items)) : ctx2;
                                var ctrls = context.vars.$model.controls(ctx3);
                                return ctrls;
                            });
                            cmp.jbGroupChildrenEm = watch ? itemsEm : itemsEm.take(1);
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            jb_1.jb.component('itemlist.ul-li', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    template: "<div><ul class=\"jb-itemlist\">\n      <li *ngFor=\"let ctrl of ctrls\" class=\"jb-item\" [class.not-heading]=\"!ctrl.comp.ctx.data.heading\">\n        <jb_comp [comp]=\"ctrl.comp\" [flatten]=\"true\"></jb_comp>\n      </li>\n      </ul></div>",
                    css: 'ul, li { list-style: none; padding: 0; margin: 0;}'
                }
            });
            jb_1.jb.component('itemlist.divider', {
                type: 'feature',
                params: {
                    space: { as: 'number', defaultValue: 5 }
                },
                impl: function (ctx, space) {
                    return ({ css: ".jb-item:not(:first-of-type) { border-top: 1px solid rgba(0,0,0,0.12); padding-top: " + space + "px }" });
                }
            });
            // ****************** Selection ******************
            jb_1.jb.component('itemlist.selection', {
                type: 'feature',
                params: {
                    databind: { as: 'ref' },
                    onSelection: { type: 'action', dynamic: true },
                    onDoubleClick: { type: 'action', dynamic: true },
                    autoSelectFirst: { type: 'boolean' }
                },
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        cmp.clickSrc = new jb_rx.Subject();
                        cmp.click = cmp.clickSrc
                            .takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }))
                            .do(function () {
                            if (cmp.selected && cmp.selected.heading)
                                cmp.selected = null;
                        })
                            .filter(function () {
                            return cmp.selected;
                        });
                        var doubleClick = cmp.click.buffer(cmp.click.debounceTime(250))
                            .filter(function (buff) { return buff.length === 2; });
                        var databindEm = cmp.jbEmitter.filter(function (x) { return x == 'check'; })
                            .map(function () {
                            return jb_1.jb.val(ctx.params.databind);
                        })
                            .filter(function (x) {
                            return x != cmp.selected;
                        })
                            .distinctUntilChanged();
                        var selectionEm = cmp.jbEmitter.filter(function (x) { return x == 'check'; })
                            .map(function () { return cmp.selected; })
                            .distinctUntilChanged();
                        doubleClick.subscribe(function () {
                            return ctx.params.onDoubleClick(ctx.setData(cmp.selected));
                        });
                        selectionEm.subscribe(function (selected) {
                            if (jb_1.jb.val(ctx.params.databind) != selected)
                                jb_1.jb.writeValue(ctx.params.databind, selected);
                            ctx.params.onSelection(ctx.setData(cmp.selected));
                        });
                        databindEm.subscribe(function (x) {
                            return cmp.selected = x;
                        });
                    },
                    afterViewInit: function (cmp) {
                        var items = cmp.items.filter(function (item) { return !item.heading; });
                        if (ctx.params.autoSelectFirst && items[0])
                            cmp.selected = items[0];
                    },
                    innerhost: {
                        '.jb-item': {
                            '[class.active]': 'active == ctrl.comp.ctx.data',
                            '[class.selected]': 'selected == ctrl.comp.ctx.data',
                            '(mouseenter)': 'active = ctrl.comp.ctx.data',
                            '(mouseleave)': 'active = null',
                            '(click)': 'selected = ctrl.comp.ctx.data ; clickSrc.next($event)'
                        }
                    },
                    css: ".jb-item.selected { background: #bbb; color: #fff }\n    .jb-item.not-heading.active { background: #337AB7; color: #fff }\n    ",
                    observable: function () { } // create jbEmitter
                }); }
            });
            jb_1.jb.component('itemlist.keyboard-selection', {
                type: 'feature',
                params: {
                    onKeyboardSelection: { type: 'action', dynamic: true },
                    autoFocus: { type: 'boolean' }
                },
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            cmp.keydownSrc = new jb_rx.Subject();
                            cmp.keydown = cmp.keydownSrc
                                .takeUntil(cmp.jbEmitter.filter(function (x) { return x == 'destroy'; }));
                            if (context.params.autoFocus)
                                setTimeout(function () {
                                    return cmp.elementRef.nativeElement.focus();
                                }, 1);
                            cmp.keydown.filter(function (e) {
                                return e.keyCode == 38 || e.keyCode == 40;
                            })
                                .map(function (event) {
                                event.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                var items = cmp.items.filter(function (item) { return !item.heading; });
                                return items[(items.indexOf(cmp.selected) + diff + items.length) % items.length] || cmp.selected;
                            }).subscribe(function (x) {
                                return cmp.selected = x;
                            });
                        },
                        host: {
                            '(keydown)': 'keydownSrc.next($event)',
                            'tabIndex': '0'
                        }
                    };
                }
            });
            jb_1.jb.component('itemlist.drag-and-drop', {
                type: 'feature',
                params: {},
                impl: function (ctx) { return ({
                    init: function (cmp) {
                        var drake = dragula($(cmp.elementRef.nativeElement).findIncludeSelf('.jb-itemlist').get(), {
                            moves: function (el) { return $(el).hasClass('jb-item') && !$(el).hasClass('jb-heading'); }
                        });
                        drake.on('drag', function (el, source) {
                            el.dragged = {
                                obj: cmp.active,
                                remove: function (obj) { return cmp.items.splice(cmp.items.indexOf(obj), 1); }
                            };
                        });
                        drake.on('drop', function (dropElm, target, source, sibling) {
                            dropElm.dragged && dropElm.dragged.remove(dropElm.dragged.obj);
                            if (!sibling)
                                cmp.items.push(dropElm.dragged.obj);
                            else
                                cmp.items.splice($(sibling).index() - 1, 0, dropElm.dragged.obj);
                            dropElm.dragged = null;
                        });
                    }
                }); }
            });
        }
    }
});
