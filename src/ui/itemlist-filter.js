
jb.component('group.itemlist-filter-container', {
  description: 'itemlist container to support filtering',
  type: 'feature',
  impl: context => ({
        extendCtx: (ctx,cmp) =>
          ctx.setVars({ itemlistFilterCntr: {
            filter_data: {},
            filters: [],
            init: allItems =>
              this.allItems = allItems,
            items: function() {
              return this.filters.reduce((items,filter) => 
                  filter(items), this.allItems || [])
            },
        }})
    })
})

jb.component('itemlist-filter.filtered-items', {
  type: 'data',
  requires: ctx => ctx.vars.itemlistFilterCntr,
  impl: ctx => {
      if (ctx.vars.itemlistFilterCntr) 
        return ctx.vars.itemlistFilterCntr.items();
      return [];
   }
})


jb.component('itemlist-filter.search', {
  type: 'control',
  requires: ctx => ctx.vars.itemlistFilterCntr,
  params: [
    { id: 'title', as: 'string' , dynamic: true, defaultValue: 'Search' },
    { id: 'searchIn', as: 'string' , dynamic: true, defaultValue: {$: 'itemlist-filter.search-in-all-properties'} },
    { id: 'databind', as: 'ref', defaultValue: '%$itemlistFilterCntr/filter_data/search%'},
    { id: 'style', type: 'editable-text.style', defaultValue: { $: 'editable-text.search' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: (ctx,searchIn,databind) => 
    jb_ui.ctrl(ctx).jbExtend({
      init: cmp => {
        if (ctx.vars.itemlistFilterCntr) 
          ctx.vars.itemlistFilterCntr.filters.push(function(items) {
            var toSearch = jb.val(databind);
            return items.filter(item=>searchIn(ctx.setData(item)).indexOf(toSearch) != -1)
          })
      }
    })
});

jb.component('itemlist-filter.search-in-all-properties', {
  type: 'data',
  impl: ctx => {
    if (typeof ctx.data == 'string') return ctx.data;
    if (typeof ctx.data != 'object') return '';
    return jb.entries(ctx.data).map(e=>e[1]).filter(v=>typeof v == 'string').join('#');
   }
})

