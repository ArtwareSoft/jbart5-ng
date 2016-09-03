import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {model} from './studio-tgp-model';
import {getComp} from './studio-utils';

function rev(str) {
  return str.split('').reverse().join('');
}

export class suggestions {
  constructor(public input) {
    this.pos = input.selectionStart;
    this.text = input.value.substr(0,this.pos).trim();
    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, (match,contents) =>
      '{' + contents + '}');
    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['',''])[1]);
    this.exp = this.exp || rev((rev(this.text_with_open_close).match(/([^\}=]*=)/) || ['',''])[1]);
    this.tail = rev((rev(this.exp).match(/([^%.\/=]*)(\/|\.|%|=)/)||['',''])[1]);
    this.tailSymbol = this.text_with_open_close.slice(-1-this.tail.length).slice(0,1); // % or /
    if (this.tailSymbol == '%' && this.exp.slice(0,2) == '%$')
      this.tailSymbol = '%$';
    this.base = this.exp.slice(0,-1-this.tail.length) + '%';
    this.inputVal = input.value;
    this.inputPos = input.selectionStart;
  }

  adjustPopupPlace(cmp,options) {
    var temp = $('<span></span>').css('font',$(this.input).css('font')).css('width','100%')
      .css('z-index','-1000').text($(this.input).val().substr(0,this.pos)).appendTo('body');
    var offset = temp.width();
    temp.remove();
    var dialogEl = $(cmp.elementRef.nativeElement).parents('.jb-dialog');
    dialogEl.css('margin-left', `${offset}px`)
      .css('display', options.length ? 'block' : 'none');
  }

  extendWithOptions(probeCtx,path) {
    this.options = [];
    probeCtx = probeCtx || (jbart.previewjbart || jbart).initialCtx;
    var vars = jb.entries(jb.extend({},(probeCtx.componentContext||{}).params,probeCtx.vars,probeCtx.resources))
          .map(x=>({toPaste: '$' + x[0], value: x[1]}))

    if (this.inputVal.indexOf('=') == 0)
      this.options = model.PTsOfPath(path).map(compName=> {
            var name = compName.substring(compName.indexOf('.')+1);
            var ns = compName.substring(0,compName.indexOf('.'));
            return { 
              text: ns ? `${name} (${ns})` : name, 
              value: compName,
              description: getComp(compName).description || '',
              toPaste: compName,
          }
        })
    else if (this.tailSymbol == '%') 
      this.options = [].concat.apply([],jb.toarray(probeCtx.exp('%%'))
        .map(x=>
          jb.entries(x).map(x=>
            ({toPaste: x[0], value: x[1]}))))
        .concat(vars)
    else if (this.tailSymbol == '%$') 
      this.options = vars
    else if (this.tailSymbol == '/' || this.tailSymbol == '.')
      this.options = [].concat.apply([],
        jb.toarray(probeCtx.exp(this.base))
          .map(x=>jb.entries(x).map(x=>({toPaste: x[0], value: x[1]}))) )

    this.options = this.options
        .filter( jb_unique(x=>x.toPaste) )
        .filter(x=> x.toPaste != this.tail)
        .filter(x=> x.toPaste.indexOf('$$') != 0)
        .filter(x=>['$ngZone','$window'].indexOf(x.toPaste) == -1)
        .filter(x=>
          this.tail == '' || typeof x.toPaste != 'string' || (x.description + x.toPaste).toLowerCase().indexOf(this.tail) != -1)
        .map(x=>
          jb.extend(x,{ text: x.text || x.toPaste + this.valAsText(x.value) }))
    if (this.tail)
      this.options.sort((x,y)=> (x.toPaste.toLowerCase().indexOf(this.tail) == 0 ? 1 : 0) - (y.toPaste.toLowerCase().indexOf(this.tail) == 0 ? 1 : 0));

    return this;
  }

  valAsText(val) {
    if (typeof val == 'string' && val.length > 20)
      return ` (${val.substring(0,20)}...)`;
    else if (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
      return ` (${val})`;
    return ``;
  }

  paste(selection) {
    var toPaste = selection.toPaste + (typeof selection.value == 'object' ? '/' : '%');
    var input = this.input;
    var pos = this.pos + 1;
    input.value = input.value.substr(0,this.pos-this.tail.length) + toPaste + input.value.substr(pos);
    jb.delay(100).then (() => {
      input.selectionStart = pos + toPaste.length;
      input.selectionEnd = input.selectionStart;
    })
  }

}

jb.component('editable-text.suggestions-input-feature', {
  type: 'feature', 
  params: [
    { id: 'path', as: 'string' },
    { id: 'action', type: 'action', dynamic:true },
    { id: 'onEnter', type: 'action', dynamic:true },
    { id: 'floatingInput',type: 'boolean', as : 'boolean', description: 'used to close the floating input popup'}
  ], 
  impl: ctx => 
    ({
      observable: () => {}, // register jbEmitter
      init: cmp=> {
        var input = $(cmp.elementRef.nativeElement).findIncludeSelf('input')[0];
        if (!input)
          return;
        var inputClosed = cmp.jbEmitter.filter(x=>x =='destroy');

        cmp.keyEm = jb_rx.Observable.fromEvent(input, 'keydown')
          .takeUntil(inputClosed) 

        cmp.keyEm.filter(e=> e.keyCode == 38 || e.keyCode == 40)
            .subscribe(e=>
                e.preventDefault())

        cmp.keyEm.filter(e=> e.keyCode == 13)
            .subscribe(e=> {
              if (!$(input).hasClass('dialog-open'))
                ctx.params.onEnter()
              })

        cmp.keyEm.filter(e=> e.keyCode == 27)
            .subscribe(e=> {
              if (!$(input).hasClass('dialog-open'))
                closeFloatingInput(ctx)
              })

        var suggestionEm = jb_rx.Observable.fromEvent(input, 'keydown')
          .debounceTime(30) // solves timing of closing the floating input
          .takeUntil(inputClosed) 
          .filter(e=> e.keyCode != 38 && e.keyCode != 40)
          .filter(e=> {// has % or = sign - look for suggestion
            var inpValue  = e.srcElement.value + (e.key.length == 1 ? e.key : '');
            return inpValue.indexOf('%') != -1 || inpValue.indexOf('=') == 0;
          })
          .flatMap(e=>
            getProbe().then(probeResult=>
              ({ keyEv: e, ctx: probeResult && probeResult[0] && probeResult[0].in})))
          .delay(1) // we use keydown - let the input fill itself
          .map(e=> 
            new suggestions(e.keyEv.srcElement,'').extendWithOptions(e.ctx,ctx.params.path))
          .filter(e => 
            e.text)
          .distinctUntilChanged(null,e=>e.options.join(','))

        suggestionEm.subscribe(e=> {
            if (!$(e.input).hasClass('dialog-open') && e.options.length > 0) { // opening the popup if not already opened
              var suggestionContext = { 
                suggestionEm: suggestionEm
                  .startWith(e)
                  .do(e=>
                      suggestionContext.suggestionObj = e),
                suggestionObj: e, 
                keyEm: cmp.keyEm,
                cmp: cmp,
                closeFloatingInput: () => 
                  closeFloatingInput(ctx)
              };
              jb_ui.wrapWithLauchingElement(ctx.params.action,ctx.setVars({suggestionContext: suggestionContext}), e.input)()
            }
          })

        function getProbe() {
          cmp.probeResult = cmp.probeResult || ctx.run({$: 'studio.probe', path: ctx.params.path });
          return cmp.probeResult;
        }
        function closeFloatingInput(ctx) {
            if (ctx.params.floatingInput)
              ctx.run({$:'closeContainingPopup'});
            ctx.vars.regainFocus && ctx.vars.regainFocus();
        }
      }
  })
})

jb.component('studio.jb-open-suggestions', {
  type: 'action', 
  params: [
    { id: 'path', as: 'string' }
  ], 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-suggestions-popup' }, 
    content :{$: 'group', 
      controls :{$: 'itemlist-with-groups', 
        items: '%$suggestionContext/suggestionObj/options%', 
        watchItems: true, 
        controls :{$: 'label', title: '%text%' }, 
        features: [
          {$: 'itemlist.studio-suggestions-selection', 
            onEnter: [
              {$: 'studio.jb-paste-suggestion', path: '%$path%' }, 
              {$: 'closeContainingPopup' }
            ]
          }, 
          {$: 'itemlist.selection', 
            onDoubleClick: [
              {$: 'studio.jb-paste-suggestion', path: '%$path%' }, 
              {$: 'closeContainingPopup' }
            ]
          }, 
          {$: 'css.height', height: '500', overflow: 'auto', minMax: 'max' }, 
          {$: 'css.width', width: '250', overflow: 'auto' }
        ]
      }, 
      features :{$: 'studio.suggestions-emitter' }
    }
  }
})

jb.component('studio.suggestions-emitter', {
  type: 'feature',
  impl: ctx => 
    ({
      init: function(cmp) {
        // gain focus back to input after clicking the popup
        jb.delay(1).then(()=>
          ctx.vars.$dialog.$el.find('.jb-itemlist').attr('tabIndex','0').focus(() => 
            $(ctx.vars.suggestionContext.suggestionObj.input).focus())
        )

        // adjust popup position
        ctx.vars.suggestionContext.suggestionEm
            .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))
            .subscribe(e =>
              e.adjustPopupPlace(cmp,e.options))
      }
    })
})
  
jb.component('itemlist.studio-suggestions-selection', {
  type: 'feature',
  params: [
    { id: 'onEnter', type: 'action', dynamic: true },
  ],
  impl: ctx => 
    ({
      init: function(cmp) {
        var keyEm = ctx.vars.suggestionContext.keyEm
          .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))

        keyEm.filter(e=>e.keyCode == 13) // ENTER
          .subscribe(x=>{
              if (cmp.selected)
                ctx.params.onEnter(ctx.setData(cmp.selected))
          })
        keyEm.filter(e=>e.keyCode == 27) // ESC
          .subscribe(x=>
                ctx.run({$:'closeContainingPopup'}));

        keyEm.filter(e=>
                e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              var diff = event.keyCode == 40 ? 1 : -1;
              var items = cmp.items; //.filter(item=>!item.heading);
              return items[(items.indexOf(cmp.selected) + diff + items.length) % items.length] || cmp.selected;
            })
            .subscribe(x=>
                cmp.selected = x)

        // change selection if options are changed
        ctx.vars.suggestionContext.suggestionEm
            .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))
            .distinctUntilChanged(null,e=>e.options.join(','))
            .subscribe(e => {
              cmp.selected = e.options[0]
          })
      },
      afterViewInit: cmp => {
          var items = cmp.items; //.filter(item=>!item.heading);
          if (items[0])
            cmp.selected = items[0];
      },

  })
})

jb.component('studio.jb-paste-suggestion', {
  params: [
    { id: 'path',as: 'string'}
  ],
  type: 'action',
  impl: (ctx,path) => {
    var suggestionsCtx = ctx.vars.suggestionContext;
    suggestionsCtx.suggestionObj.paste(ctx.data);
    //suggestionsCtx.cmp.probeResult = null; // recalc
    if (suggestionsCtx.suggestionObj.inputVal.indexOf('=') == 0) {
      ctx.vars.field.writeValue('='+ctx.data.toPaste); // need to write from here as we close the popup
      suggestionsCtx.closeFloatingInput();
      var tree = ctx.vars.$tree;
      tree.expanded[tree.selected] = true;
      jb.delay(100).then(()=>{
        var firstChild = tree.nodeModel.children(tree.selected)[0];
        if (firstChild) {
          ctx.run({$:'writeValue', to: '%$globals/jb_editor_selection%', value: firstChild });
          jb_ui.apply(ctx);
          jb.delay(100);
        }
        // if (firstChild) {
        //   tree.selected = firstChild;
        //   jb_ui.apply(ctx);
        // }
      })
    }
  }
})

