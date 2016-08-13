System.register(['jb-core/jb', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('itemlist.heading', 'inject headings to itemlist');
            jb_1.jb.type('itemlist-heading.style');
            jb_1.jb.component('itemlist-heading', {
                type: "control",
                params: {
                    title: { essential: true, dynamic: true, defaultValue: '%title%' },
                    style: { type: 'itemlist-heading.style', defaultValue: { $: 'itemlist-heading.h1' }, dynamic: true },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (ctx) {
                    return jb_ui.ctrl(ctx).jbExtend({
                        beforeInit: function (cmp) {
                            return cmp.title = ctx.params.title();
                        }
                    });
                }
            });
            jb_1.jb.component('itemlist-heading.h1', {
                type: 'itemlist-heading.style',
                impl: { $: 'customStyle',
                    template: '<h1>{{title}}</h1>',
                }
            });
            jb_1.jb.component('itemlist.heading', {
                type: 'feature',
                params: {
                    heading: { type: 'itemlist-heading', essential: true, dynamic: true },
                },
                impl: function (ctx, heading) { return ({
                    beforeInit: function (cmp) {
                        cmp.calc_heading = function (items) {
                            return heading(ctx.setData(items));
                        };
                    },
                }); }
            });
            jb_1.jb.component('itemlist-headings.group-by', {
                type: 'itemlist-headings',
                params: {
                    itemToGroupID: { dynamic: true, defaultValue: { $: 'prefix', separator: '.', text: '%id%' } },
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
