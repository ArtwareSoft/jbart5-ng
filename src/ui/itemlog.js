jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.type('itemlog.style');

jb.component('itemlog',{
	type: 'control',
	params: {
		title: { as: 'string' },
		items: { as: 'observable' , dynamic: true, essential: true },
    controls: { type: 'control[]', essential: true, dynamic: true},
		style: { type: 'itemlog.style', dynamic: true , defaultValue: { $: 'itemlog.div' } },
    itemVariable: { as: 'string', defaultValue: 'item' },
    counter: {as : 'ref'},
		features: { type: 'feature[]', dynamic: true },
	},
	impl: function(context) {
    return jb_ui.ctrl(context).jbExtend({
        beforeInit(cmp) {
          cmp.items = [];
          cmp.itemToComp = item => 
            context.params.controls(item.setVars(jb.obj(context.params.itemVariable,item.data))) [0];

          context.params.items(context).subscribe(itemCtx=>  {
              cmp.items.unshift(itemCtx);
              if (context.params.counter)
                jb.writeValue(context.params.counter,cmp.items.length)
          })
      }
    });
	}
})

jb.component('itemlog.div', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div class="jb-group jb-itemlog"><div jb-item *ngFor="let item of items">
        <jb_comp [comp]="itemToComp(item)" flatten="true"></jb_comp>
      </div></div>`
  }
})

})