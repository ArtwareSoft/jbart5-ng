System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('itemlist.heading', 'inject headings to itemlist');
            jb_1.jb.type('itemlist-heading.style');
            jb_1.jb.component('itemlist-with-heading', {
                type: 'control',
                params: {
                    title: { as: 'string' },
                    items: { as: 'array', dynamic: true, essential: true },
                    controls: { type: 'control[]', essential: true, dynamic: true },
                    style: { type: 'itemlist.style', dynamic: true, defaultValue: { $: 'itemlist.ul-li' } },
                    groupBy: { type: 'itemlist.group-by', essential: true, dynamic: true },
                    headingCtrl: { type: 'control', dynamic: true, defaultValue: { $: 'label', title: '%title%' } },
                    watchItems: { type: 'boolean', as: 'boolean', defaultValue: true },
                    itemVariable: { as: 'string', defaultValue: 'item' },
                    features: { type: 'feature[]', dynamic: true, flattenArray: true },
                },
                impl: { $: 'group',
                    title: '%$title%',
                    style: { $call: 'style' },
                    controls: { $: 'dynamic-controls',
                        controlItems: '%$items_array%',
                        genericControl: { $if: '%heading%',
                            then: { $call: 'headingCtrl' },
                            else: { $call: 'controls' },
                        },
                        itemVariable: '%$itemVariable%'
                    },
                    features: [
                        { $call: 'features' },
                        { $: 'itemlist.watch-items-with-heading',
                            items: { $call: 'items' },
                            groupBy: { $call: 'groupBy' },
                            watch: '%$watchItems%',
                            itemsArrayVariable: 'items_array'
                        },
                    ]
                }
            });
            jb_1.jb.component('itemlist.watch-items-with-heading', {
                type: 'feature',
                params: {
                    items: { essential: true, dynamic: true },
                    itemsArrayVariable: { as: 'string' },
                    watch: { type: 'boolean', as: 'boolean', defaultValue: true },
                    groupBy: { type: 'itemlist.group-by', essential: true, dynamic: true },
                },
                impl: function (context, items, itemsArrayVariable, watch, groupBy) {
                    return {
                        beforeInit: function (cmp) {
                            var itemsEm = cmp.jbEmitter
                                .filter(function (x) { return x == 'check'; })
                                .map(function (x) {
                                return items(cmp.ctx);
                            })
                                .filter(function (items) {
                                return !jb_compareArrays(items, cmp.original_items);
                            }) // compare before injecting headings
                                .do(function (items) {
                                return cmp.original_items = items;
                            })
                                .map(function (items) {
                                return groupBy(cmp.ctx.setData(items)) || items;
                            })
                                .do(function (items) {
                                return cmp.items_with_headings = items;
                            })
                                .map(function (items) {
                                cmp.items = items.filter(function (item) { return !item.heading; });
                                var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx).setData(items);
                                var ctx3 = itemsArrayVariable ? ctx2.setVars(jb_1.jb.obj(itemsArrayVariable, items)) : ctx2;
                                var ctrls = context.vars.$model.controls(ctx3);
                                return ctrls;
                            });
                            cmp.jbGroupChildrenEm = watch ? itemsEm : itemsEm.take(1);
                        },
                        observable: function () { } // to create jbEmitter
                    };
                }
            });
            jb_1.jb.component('itemlist-default-heading', {
                type: 'control',
                impl: { $: 'label', title: '%title%' }
            });
            // ************* itemlist.group-by ****************
            jb_1.jb.component('itemlist-heading.group-by', {
                type: 'itemlist.group-by',
                params: {
                    itemToGroupID: { dynamic: true, defaultValue: { $: 'prefix', separator: '.' } },
                    promoteGroups: { type: 'data[]', as: 'array' },
                },
                impl: function (ctx, itemToGroupID, promoteGroups) {
                    var items = ctx.data.map(function (item) { return ({ item: item, groupId: itemToGroupID(ctx.setData(item)) }); });
                    var groups = {};
                    items.forEach(function (item) {
                        groups[item.groupId] = groups[item.groupId] || [];
                        groups[item.groupId].push(item.item);
                    });
                    var groups_ar = jb_1.jb.entries(groups).map(function (x) { return x[0]; });
                    groups_ar.sort(); // lexical sort before to ensure constant order
                    groups_ar.sort(function (x1, x2) { return promoteGroups.indexOf(x1) - promoteGroups.indexOf(x2); });
                    var result = [].concat.apply([], groups_ar.map(function (group) {
                        return [{ title: group, heading: true }].concat(groups[group]);
                    }));
                    return result;
                }
            });
        }
    }
});
