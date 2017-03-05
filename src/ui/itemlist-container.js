jb.component('group.itemlist-writable-container', {
  description: 'itemlist writable container to support addition, deletion and selection',
  type: 'feature', category: 'itemlist:20,group:0',
  params: [
    { id: 'id', as: 'string' },
    { id: 'defaultItem', as: 'single' },
  ],
  impl: context => ({
  	    extendCtx: (ctx,cmp) =>
        	ctx.setVars({ itemlistCntr: {
        		id: context.params.id,
        		selected: null,
        		cmp: cmp,
        		init: items =>
        			this.items = items,
        		add: function(item) {
        			this.selected = item || JSON.parse(JSON.stringify(context.params.defaultItem || {}));
    				this.items && this.items.push(this.selected);
        		},
        		delete: function(item) {
        			if (this.items && this.items.indexOf(item) != -1) {
        				this.changeSelectionBeforeDelete();
        				this.items.splice(this.items.indexOf(item),1)	
        			}
        		},
        		changeSelectionBeforeDelete: function() {
        			if (this.items && this.selected) {
        				var curIndex = this.items.indexOf(this.selected);
        				if (curIndex == -1)
        					this.selected = null;
        				else if (curIndex == 0 && this.items.length > 0)
        					this.selected = this.items[1];
        				else if (this.items.length > 0)
        					this.selected = this.items[curIndex -1];
        				else
        					this.selected = null;
        			}
        		}
        	}})
    })
})

jb.component('group.itemlist-selected', {
  type: 'feature',   category: 'itemlist:20,group:0',
  impl: { $list : [ 	
  			{$: 'group.data', data : {$: 'itemlist-container.selected'}},
  			{$: 'hidden', showCondition: {$notEmpty: {$: 'itemlist-container.selected' } } }
  		]}
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

jb.component('itemlist.obj-as-items', {
  type: 'data',
  params: [
    { id: 'obj', as: 'single', defaultValue: '%%' },
  ],
  impl: ctx => {
  	if (!ctx.vars.itemlistCntr) return [];
  	var cmp = ctx.vars.itemlistCntr.cmp;
  	if (!cmp.obj) {
  		cmp.obj = ctx.params.obj;
  		cmp.items = jb.entries(cmp.obj).map(e=>({key:e[0],val: e[1]})).concat({key:'',val:''});
  		cmp.jbEmitter
  			.filter(x=>x=='check')
  			.subscribe(_=>{
  				Object.getOwnPropertyNames(cmp.obj).forEach(p=> {delete cmp.obj[p]})
	  			cmp.items.forEach(item=>{
	  				if (item.key) cmp.obj[item.key]=item.val
	  			})
	  			if (!cmp.items.filter(e=>!e.key)[0])
	  				cmp.items.push({key:'',val:''})
  		})
  	}
  	return cmp.items;
  }
})


