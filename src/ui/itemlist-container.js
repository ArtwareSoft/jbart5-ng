jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.component('group.itemlist-container', {
  type: 'feature',
  params: [
    { id: 'id', as: 'string' },
    { id: 'defaultItem', as: 'single' },
  ],
  impl: ctx => ({
  	    extendCtx: ctx =>
        	ctx.setVars({ itemlistCntr: {
        		id: ctx.id,
        		selected: null,
        		init: items =>
        			this.items = items,
        		add: function(item) {
        			var toAdd = item || JSON.parse(JSON.stringify(ctx.params.defaultItem || {}));
        			this.items && this.items.push(toAdd)
        		},
        		delete: function(item) {
        			if (this.items && this.items.indexOf(item) != -1)
        				this.items.splice(this.items.indexOf(item))	
        		}
        	}})
    })
})

jb.component('group.itemlist-selected', {
  type: 'feature',
  impl: {$: 'group.data', data : {$: 'itemlist-container.selected'}}
})

jb.component('itemlist-container.add', {
  type: 'action',
  impl: ctx => 
  		ctx.vars.itemlistCntr && ctx.vars.itemlistCntr.add()
})

jb.component('itemlist-container.delete', {
  type: 'action',
  params: [
    { id: 'item', as: 'single', defaultValue: '%$itemlistCntr/selected%' },
  ],
  impl: ctx => 
  		ctx.vars.itemlistCntr && ctx.vars.itemlistCntr.delete(ctx.params.item)
})

jb.component('itemlist-container.select', {
  type: 'action',
  params: [
    { id: 'item', as: 'single', defaultValue: '%%' },
  ],
  impl: ctx => {
  		if (ctx.vars.itemlistCntr)
  			ctx.vars.itemlistCntr.selected = ctx.params.item
  }
})

jb.component('itemlist-container.selected', {
  type: 'data',
  impl: ctx => ({
		$jb_val: function(value) {
			if (!ctx.vars.itemlistCntr) return;
			if (typeof value == 'undefined') 
				return ctx.vars.itemlistCntr.selected;
			else
				ctx.vars.itemlistCntr.selected = value;
		}
	})
})

// templates

// md left-right


})