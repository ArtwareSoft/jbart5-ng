import {jb} from 'jb-core/jb';;
import * as jb_rx from 'jb-ui/jb-rx';
import * as jb_ui from 'jb-ui';

jb.component('itemlist', {
  type: 'control',
  params: {
    title: { as: 'string' },
    items: { as: 'array' , dynamic: true, essential: true },
    controls: { type: 'control[]', essential: true, dynamic: true },
    style: { type: 'itemlist.style', dynamic: true , defaultValue: { $: 'itemlist.ul-li' } },
    watchItems: { type: 'boolean', as: 'boolean', defaultValue: false },
    itemVariable: { as: 'string', defaultValue: 'item' },
    heading: { type: 'control', dynamic: true , defaultValue: {$: 'itemlist-heading', title: '%title%' } },
    features: { type: 'feature[]', dynamic: true, flattenArray: true },
  },
  impl :{$: 'group', 
    title: '%$title%',
    style :{$call: 'style'},
    controls :{$: 'dynamic-controls', 
      controlItems : '%$items_array%',
      genericControl :{$if: '%heading%', 
        then: {$call: 'heading'},
        else: {$call: 'controls'}, 
      },
      itemVariable: '%$itemVariable%'
    },
    features :[
      {$call: 'features'},
      {$: 'itemlist.watch-items', items: {$call: 'items'}, watch: '%$watchItems%', itemVariable: 'items_array' }, 
    ]
  }
})

jb.component('itemlist.watch-items', {
  type: 'feature',
  params: {
    items: { essential: true, dynamic: true },
    itemVariable: { as: 'string' },
    watch: { type: 'boolean', as: 'boolean', defaultValue: true }
  },
  impl: function(context, items, itemVariable,watch) {
    return {
      beforeInit: function(cmp) {
          var itemsEm = cmp.jbEmitter
              .filter(x => x == 'check')
              .map(()=> 
                cmp.calc_heading ? cmp.calc_heading(items()) : items()
               )
              .filter(items=>
                ! jb_compareArrays(items,(cmp.ctrls || []).map(ctrl => ctrl.comp.ctx.data)))
              .map(items=> {
                  cmp.items = items;
                  var ctx2 = (cmp.refreshCtx ? cmp.refreshCtx(cmp.ctx) : cmp.ctx).setData(items);
                  var ctx3 = itemVariable ? ctx2.setVars(jb.obj(itemVariable,items)) : ctx2;
                  var ctrls = context.vars.$model.controls(ctx3);
                  return ctrls;
              })

          cmp.jbGroupChildrenEm = watch ? itemsEm : itemsEm.take(1);
      },
      observable: () => {} // to create jbEmitter
  }}
})

jb.component('itemlist.ul-li', {
  type: 'group.style',
  impl :{$: 'customStyle',
    features :{$: 'group.initGroup'},
    template: `<div><ul class="jb-itemlist">
      <li *ngFor="let ctrl of ctrls" class="jb-item" [class.not-heading]="!ctrl.comp.ctx.data.heading">
        <jb_comp [comp]="ctrl.comp" [flatten]="true"></jb_comp>
      </li>
      </ul></div>`,
    css: 'ul, li { list-style: none; padding: 0; margin: 0;}'
  }
})

jb.component('itemlist.divider', {
  type: 'feature',
  params: {
    space: { as: 'number', defaultValue: 5}
  },
  impl : (ctx,space) =>
    ({css: `.jb-item:not(:first-of-type) { border-top: 1px solid rgba(0,0,0,0.12); padding-top: ${space}px }`})
})

// ****************** Selection ******************

jb.component('itemlist.selection', {
  type: 'feature',
  params: {
    databind: { as: 'ref' },
    onSelection: { type: 'action', dynamic: true },
    onDoubleClick: { type: 'action', dynamic: true },
    autoSelectFirst: { type: 'boolean'}
  },
  impl: ctx => ({
    init: cmp => {
        cmp.clickSrc = new jb_rx.Subject();
        cmp.click = cmp.clickSrc
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
          .do(()=>{
            if (cmp.selected && cmp.selected.heading)
              cmp.selected = null;
            })
          .filter(()=>
            cmp.selected);

        var doubleClick = cmp.click.buffer(cmp.click.debounceTime(250))
          .filter(buff => buff.length === 2)

        var databindEm = cmp.jbEmitter.filter(x => x == 'check')
            .map(()=> 
              jb.val(ctx.params.databind))
            .filter(x=>
              x != cmp.selected)
            .distinctUntilChanged();

        var selectionEm = cmp.jbEmitter.filter(x => x == 'check')
            .map(()=> cmp.selected) 
            .distinctUntilChanged();

        doubleClick.subscribe(()=>
          ctx.params.onDoubleClick(ctx.setData(cmp.selected)));

        selectionEm.subscribe( selected => {
          if (jb.val(ctx.params.databind) != selected)
            jb.writeValue(ctx.params.databind,selected);
          ctx.params.onSelection(ctx.setData(cmp.selected))
        });

        databindEm.subscribe(x=>
            cmp.selected = x);
    },
    afterViewInit: cmp => {
        var items = cmp.items.filter(item=>!item.heading);
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
    css: `.jb-item.selected { background: #bbb; color: #fff }
    .jb-item.not-heading.active { background: #337AB7; color: #fff }
    `,
    observable: () => {} // create jbEmitter
  })
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
        cmp.keydownSrc = new jb_rx.Subject();
        cmp.keydown = cmp.keydownSrc
          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

        if (context.params.autoFocus)
            setTimeout(()=> 
              cmp.elementRef.nativeElement.focus(),1);

        cmp.keydown.filter(e=>
              e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              event.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              var items = cmp.items.filter(item=>!item.heading);
              return items[(items.indexOf(cmp.selected) + diff + items.length) % items.length] || cmp.selected;
        }).subscribe(x=>
          cmp.selected = x)
      },
      host: {
        '(keydown)': 'keydownSrc.next($event)',
        'tabIndex' : '0'
      }
    }
  }
})

jb.component('itemlist.drag-and-drop', {
  type: 'feature',
  params: {
  },
  impl: ctx => ({
      init: function(cmp) {
        var drake = dragula($(cmp.elementRef.nativeElement).findIncludeSelf('.jb-itemlist').get(), {
          moves: el => $(el).hasClass('jb-item') && !$(el).hasClass('jb-heading')
        });

        drake.on('drag', function(el, source) { 
          el.dragged = { 
            obj: cmp.active,
            remove: obj => cmp.items.splice(cmp.items.indexOf(obj), 1)
          }
        });
        drake.on('drop', (dropElm, target, source,sibling) => {
            dropElm.dragged && dropElm.dragged.remove(dropElm.dragged.obj);
            if (!sibling)
              cmp.items.push(dropElm.dragged.obj)
            else
              cmp.items.splice($(sibling).index()-1,0,dropElm.dragged.obj)
            dropElm.dragged = null;
        });
      }
    })
})

