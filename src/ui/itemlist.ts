import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as ui_utils from 'jb-ui/jb-ui-utils';
import {Directive,Component, DynamicComponentLoader, ElementRef, Input } from 'angular2/core';

jb.type('itemlist.style');

jb.component('itemlist',{
	type: 'control',
	params: {
		title: { as: 'string' },
		items: { as: 'array' , dynamic: true, essential: true },
    controls: { type: 'control[]', essential: true, dynamic: true},
		style: { type: 'itemlist.style', dynamic: true , defaultValue: { $: 'itemlist.ul-li' } },
    itemVariable: { as: 'string' },
		features: { type: 'feature[]', dynamic: true },
	},
	impl: function(context) {
    return jb_ui.ctrl(context).jbExtend({
      doCheck: cmp => {
        cmp.items = context.params.items();
      },
      beforeInit: function(cmp) {
        cmp.items = context.params.items();
        cmp.itemlist = {
            items: cmp.items,
            elems: () => Array.from($(cmp._nativeElement).find('[jb-item]')),
            el: cmp.elementRef.nativeElement,
            elemToItem: (elem) => 
              cmp.items[$(elem).closest('[jb-item]').index()],
            itemToElem: function(item) { 
              return this.elems()[cmp.items.indexOf(item)] 
            },
            selectionEmitter: new jb_rx.Subject(),
        }
       },
      directives: [jb_itemlist_comp(context.params, context)]
    })
	}
})

function jb_itemlist_comp(model,context) {
    @Component({
        selector: 'jb_item',
        template: '<div #jb_item_repl></div>',
    })
    class ItemListChild {
      @Input() item;
      constructor(public dcl: DynamicComponentLoader, public elementRef: ElementRef) {}
      ngOnInit() {
        var cmp = this;
        var vars = {item: cmp.item};
        if (model.itemVariable && model.itemVariable != 'item')
          vars[model.itemVariable] = cmp.item;
        var ctx = jb.ctx(context,{data: cmp.item, vars: vars});
        model.controls(ctx).forEach(
          ctrl => jb_ui.loadIntoLocation(ctrl, cmp, 'jb_item_repl',context)
        )
      }
    }
    return ItemListChild;
}

jb.component('itemlist.ul-li', {
  type: 'itemlist.style',
  impl :{$: 'customStyle',
    template: '<ul class="jb-itemlist"><li *ngFor="#item of items" jb-item><jb_item [item]="item"></jb_item></li></ul>',
    css: `[jb-item].selected { background: #337AB7; color: #fff ;}
    li { list-style: none; padding: 0; margin: 0;}
    { list-style: none; padding: 0; margin: 0;}
    `
  }
})

jb.component('itemlist.div', {
  type: 'itemlist.style',
  impl: function(context) {
    return { template: '<div *ngFor="#item of items" jb-item><jb_item [item]="item"></jb_item></div>' }
  }
})

jb.component('itemlist.divider', {
  type: 'feature',
  impl : ctx =>
    ({css: `[jb-item]:not(:first-of-type) { border-top: 1px solid rgba(0,0,0,0.12); padding-top: 10px }`})
})

// ****************** Selection ******************

jb.component('itemlist.selection', {
  type: 'feature',
  params: {
    databind: { as: 'ref' },
    onSelection: { type: 'action', dynamic: true },
    autoSelectFirst: { type: 'boolean'}
  },
  impl: function(context) {
    var itemlist = context.vars.$itemlist;
    return {
      init: function(cmp) {
        cmp.click = new jb_rx.Subject();
        var itemlist = cmp.itemlist;
        itemlist.selectionEmitter.distinctUntilChanged().subscribe(selected=>{
          itemlist.selected = selected;
          if (context.params.databind)
            jb.writeValue(context.params.databind,selected);
        });
        // first auto selection selection
        if (jb.val(context.params.databind))
         itemlist.selectionEmitter.next(jb.val(context.params.databind));
        else if (context.params.autoSelectFirst && itemlist.items[0])
          itemlist.selectionEmitter.next(itemlist.items[0]);

        cmp.click.map(event => itemlist.elemToItem(event.target))
          .do(function(selected) {
            context.params.onSelection(context.setData(selected))
          })
          .subscribe(x=>itemlist.selectionEmitter.next(x))
      },
      host: {
        '(click)': 'click.next($event)',
      },
      innerhost: { 
        '[jb-item]' : { '[ng-class]': '{selected: itemlist.selected == item}' }, 
      },
    }
  }
})

jb.component('itemlist.keyboard-selection', {
  type: 'feature',
  params: {
    onKeyboardSelection: { type: 'action', dynamic: true },
    autoFocus: { type: 'boolean' }
  },
  impl: function(context) {
    return {
      init: function(cmp) {
        var itemlist = cmp.itemlist
        cmp.keydown = new jb_rx.Subject();
        if (context.params.autoFocus)
            setTimeout(()=> cmp.elementRef.nativeElement.focus(),1);

        cmp.keydown.filter(e=>e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              event.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
        }).subscribe(x=>itemlist.selectionEmitter.next(x))
      },
      host: {
        '(keydown)': 'keydown.next($event)',
        'tabIndex' : '0'
      }
    }
  }
})

jb.component('itemlist.drag-and-drop', {
  type: 'feature',
  params: {
  },
  impl: function(context) {
    return {
      init: function(cmp) {
        var itemlist = cmp.itemlist;
        var drake = itemlist.drake = dragula($(itemlist.el).findIncludeSelf('.jb-itemlist').get(), {
          moves: el => $(el).attr('jb-item') != null
        });

        drake.on('drag', function(el, source) { 
          el.dragged = { 
            obj: itemlist.elemToItem(el),
            remove: obj => itemlist.items.splice(itemlist.items.indexOf(obj), 1)
          }
        });
        drake.on('drop', (dropElm, target, source,sibling) => {
            dropElm.dragged && dropElm.dragged.remove(dropElm.dragged.obj);
            if (!sibling)
              itemlist.items.push(dropElm.dragged.obj)
            else
              itemlist.items.splice($(sibling).index()-1,0,dropElm.dragged.obj)
            dropElm.dragged = null;
        });
      }
    }
  }
})

