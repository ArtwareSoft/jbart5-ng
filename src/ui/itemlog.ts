import {jb} from 'js/jb';
import * as jb_ui from 'ui/jb-ui';
import * as jb_rx from 'ui/jb-rx';

jb.type('itemlog.style');

jb.component('itemlog',{
	type: 'control',
	params: {
		title: { as: 'string' },
		items: { as: 'observable' , dynamic: true, essential: true },
    controls: { type: 'control[]', essential: true, dynamic: true},
		style: { type: 'itemlog.style', dynamic: true , defaultValue: { $: 'itemlog.div' } },
    itemVariable: { as: 'string', defaultValue: 'item' },
		features: { type: 'feature[]', dynamic: true },
	},
	impl: function(context) {
    return jb_ui.ctrl(context).jbExtend({
        beforeInit(cmp) {
          cmp.items = [];
          cmp.comps = [];
          cmp.itemToComp = item => 
            cmp.comps[cmp.items.indexOf(item)];
          context.params.items(context).subscribe(itemCtx=>{
            cmp.items.unshift(itemCtx);
            var comp = context.params.controls(itemCtx.setVars(jb.obj(context.params.itemVariable,itemCtx.data)) ) [0];
            cmp.comps.unshift(comp);

              // context.params.controls(itemCtx.setVars(jb.obj(context.params.itemVariable,itemCtx.data)))
              //   .forEach(comp=>{ 
              //       cmp.ctrls.unshift({ title: comp.jb_title ? comp.jb_title() : '' , comp: comp } );
              //       cmp.items.unshift(itemCtx);
              //   })
//              jb_ui.apply(context);
          })
        },
        directives: [jb_ui.jbComp]
    });
	}
})

jb.component('itemlog.div', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div class="jb-group jb-itemlog"><div jb-item *ngFor="var item of items">
        <jb_comp [comp]="itemToComp(item)" flatten="true"></jb_comp>
      </div></div>`
//    <jb_comp jb-item *ngFor="var ctrl of ctrls" [comp]="ctrl.comp" [flatten]="false"></jb_comp></div>',
  }
})

jb.component('itemlog.selection', {
  type: 'feature',
  params: {
    databind: { as: 'ref' },
    onSelection: { type: 'action', dynamic: true },
  },
  impl: function(context) {
    return {
      init: function(cmp) {
        cmp.itemlist = cmp.itemlist || {
          selectionEmitter: new jb_rx.Subject(),
          elemToItem: elem => 
            cmp.items[$(elem).closest('[jb-item]').index()]
        }
        var itemlist = cmp.itemlist;
        cmp.click = new jb_rx.Subject();
        itemlist.selectionEmitter.distinctUntilChanged().subscribe(selected=>{
          itemlist.selected = selected;
          if (context.params.databind)
            jb.writeValue(context.params.databind,selected);
        });
        // first auto selection selection
        if (jb.val(context.params.databind))
         itemlist.selectionEmitter.next(jb.val(context.params.databind));

        cmp.click.map(event => itemlist.elemToItem(event.target))
          .do(function(selected) {
            context.params.onSelection(context.setData(selected))
          }).subscribe(x=>
            itemlist.selectionEmitter.next(x)
          )
      },
      host: {
        '(click)': 'click.next($event)',
      },
      css: '.selected { background: #337AB7; color: #fff}',
      innerhost: { 
        '[jb-item]' : { '[ng-class]': '{selected: itemlist.selected == item}' }, 
      },
    }
  }
})
