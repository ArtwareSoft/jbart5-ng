System.register(['jb-core/jb', 'jb-ui/jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, jb_rx;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('itemlog.style');
            jb_1.jb.component('itemlog', {
                type: 'control',
                params: {
                    title: { as: 'string' },
                    items: { as: 'observable', dynamic: true, essential: true },
                    controls: { type: 'control[]', essential: true, dynamic: true },
                    style: { type: 'itemlog.style', dynamic: true, defaultValue: { $: 'itemlog.div' } },
                    itemVariable: { as: 'string', defaultValue: 'item' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context) {
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.items = [];
                            cmp.comps = [];
                            cmp.itemToComp = function (item) {
                                return cmp.comps[cmp.items.indexOf(item)];
                            };
                            context.params.items(context).subscribe(function (itemCtx) {
                                cmp.items.unshift(itemCtx);
                                var comp = context.params.controls(itemCtx.setVars(jb_1.jb.obj(context.params.itemVariable, itemCtx.data)))[0];
                                cmp.comps.unshift(comp);
                                // context.params.controls(itemCtx.setVars(jb.obj(context.params.itemVariable,itemCtx.data)))
                                //   .forEach(comp=>{ 
                                //       cmp.ctrls.unshift({ title: comp.jb_title ? comp.jb_title() : '' , comp: comp } );
                                //       cmp.items.unshift(itemCtx);
                                //   })
                                //              jb_ui.apply(context);
                            });
                        },
                        directives: [jb_ui.jbComp]
                    });
                }
            });
            jb_1.jb.component('itemlog.div', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-group jb-itemlog\"><div jb-item *ngFor=\"let item of items\">\n        <jb_comp [comp]=\"itemToComp(item)\" flatten=\"true\"></jb_comp>\n      </div></div>"
                }
            });
            jb_1.jb.component('itemlog.selection', {
                type: 'feature',
                params: {
                    databind: { as: 'ref' },
                    onSelection: { type: 'action', dynamic: true },
                },
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            cmp.itemlist = cmp.itemlist || {
                                selectionEmitter: new jb_rx.Subject(),
                                elemToItem: function (elem) {
                                    return cmp.items[$(elem).closest('[jb-item]').index()];
                                }
                            };
                            var itemlist = cmp.itemlist;
                            cmp.click = new jb_rx.Subject();
                            itemlist.selectionEmitter.distinctUntilChanged().subscribe(function (selected) {
                                itemlist.selected = selected;
                                if (context.params.databind)
                                    jb_1.jb.writeValue(context.params.databind, selected);
                            });
                            // first auto selection selection
                            if (jb_1.jb.val(context.params.databind))
                                itemlist.selectionEmitter.next(jb_1.jb.val(context.params.databind));
                            cmp.click.map(function (event) { return itemlist.elemToItem(event.target); })
                                .do(function (selected) {
                                context.params.onSelection(context.setData(selected));
                            }).subscribe(function (x) {
                                return itemlist.selectionEmitter.next(x);
                            });
                        },
                        host: {
                            '(click)': 'click.next($event)',
                        },
                        css: '.selected { background: #337AB7; color: #fff}',
                        innerhost: {
                            '[jb-item]': { '[ng-class]': '{selected: itemlist.selected == item}' },
                        },
                    };
                }
            });
        }
    }
});
