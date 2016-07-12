import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

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
    this.tail = rev((rev(this.exp).match(/([^%.\/]*)(\/|\.|%)/)||['',''])[1]);
    this.tailSymbol = this.text_with_open_close.slice(-1-this.tail.length).slice(0,1); // % or /
    if (this.tailSymbol == '%' && this.exp.slice(0,2) == '%$')
      this.tailSymbol = '%$';
    this.base = this.exp.slice(0,-1-this.tail.length) + '%';
    // for debug
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

  extendWithOptions(probeCtx) {
    this.options = [];
    if (!probeCtx)
      return this;
    var vars = jb.entries(probeCtx.vars).map(x=>({text: '$' + x[0], value: x[1]}))
        .concat(jb.entries(probeCtx.resources).map(x=>({text: '$' + x[0], value: x[1]})))

    if (this.tailSymbol == '%') 
      this.options = [].concat.apply([],jb.toarray(probeCtx.exp('%%'))
        .map(x=>
          jb.entries(x).map(x=>
            ({text: x[0], value: x[1]}))))
        .concat(vars)
    else if (this.tailSymbol == '%$') 
      this.options = vars
    else if (this.tailSymbol == '/' || this.tailSymbol == '.')
      this.options = [].concat.apply([],
        jb.toarray(probeCtx.exp(this.base))
          .map(x=>jb.entries(x).map(x=>({text: x[0], value: x[1]}))) )

    this.options = this.options
        .filter( jb_onlyUniqueFunc(x=>x.text) )
        .filter(x=> x.text != this.tail)
        .filter(x=> x.text.indexOf('$$') != 0)
        .filter(x=>['$ngZone','$window'].indexOf(x.text) == -1)
        .filter(x=>
          this.tail == '' || typeof x.text != 'string' || x.text.indexOf(this.tail) == 0); 
    return this;
  }

  paste(selection) {
    var input = this.input;
    var pos = this.pos + 1;
    input.value = input.value.substr(0,this.pos-this.tail.length) + selection + input.value.substr(pos);
    jb.delay(100).then (() => {
      input.selectionStart = pos + selection.length;
      input.selectionEnd = input.selectionStart;
    })
  }

}

jb.component('editable-text.studio-jb-detect-suggestions', {
  type: 'feature', 
  params: {
    path: { as: 'string' },
    action: { type: 'action', dynamic:true },
    mdInput: {type: 'boolean', as : 'boolean'}
  }, 
  impl: ctx => 
    ({
      init: cmp=> {
        var input = $(cmp.elementRef.nativeElement).findIncludeSelf('input')[0];
        if (!input)
          return;
        cmp.keyEm = jb_rx.Observable.fromEvent(input, 'keydown');
        cmp.keyEm.filter(e=> e.keyCode == 38 || e.keyCode == 40)
            .subscribe(e=>
                e.preventDefault())
        cmp.keyEm || new Subject();

        var suggestionEm = cmp.keyEm.filter(e=> // has % sign - look for suggestion
            (e.srcElement.value + (e.key.length == 1 ? e.key : '')).indexOf('%') != -1 )
          .flatMap(e=>
            getProbe().then(probeResult=>
              ({ keyEv: e, ctx: probeResult[0] && probeResult[0].in})))
          .delay(1) // we use keydown - let the input fill itself
          .map(e=> 
            new suggestions(e.keyEv.srcElement,'').extendWithOptions(e.ctx))
          .filter(e => 
            e.text)
          .distinctUntilChanged(null,e=>e.options.join(','))

        suggestionEm.subscribe(e=> {
//            console.log(e);
            if (!$(e.input).hasClass('dialog-open')) { // opening the popup if not already opened
              var suggestionContext = { 
                suggestionEm: suggestionEm
                  .startWith(e)
                  .do(e=>
                      suggestionContext.suggestionObj = e),
                suggestionObj: e, 
                keyEm: cmp.keyEm 
              };
              jb_ui.wrapWithLauchingElement(ctx.params.action,ctx.setVars({suggestionContext: suggestionContext}), e.input)()
            }
          })

        function getProbe() {
          cmp.probeResult = cmp.probeResult || ctx.run({$: 'studio.probe', path: ctx.params.path });
          return cmp.probeResult;
        }
      }
  })
  // if (ctx.params.mdInput) {
  //   result.innerhost['md-input'] = result.innerhost.input;
  //   delete result.innerhost.input;
  // }
  // return result;
  // }
})

jb.component('studio.jb-open-suggestions', {
  type: 'action', 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-suggestions-popup' }, 
    content :{$: 'group',
        features :{$: 'studio.suggestions-emitter' },
        controls:{$: 'itemlist', 
          items : '%$suggestionContext/suggestionObj/options%', 
          controls: {$: 'label', title: '%text%' },
          features: [
            {$: 'itemlist.studio-suggestions-selection',
              onEnter: [
                {$: 'studio.jb-paste-suggestion', toPaste: '%%'},
                {$: 'closeContainingPopup'}
              ]
            },
            {$: 'itemlist.selection', 
                onDoubleClick: [
                {$: 'studio.jb-paste-suggestion', toPaste: '%%'},
                {$: 'closeContainingPopup'}
              ]
            },
          ]
        }
      }
  }
})

jb.component('studio.suggestions-emitter', {
  type: 'feature',
  params: {
    into: { as: 'ref' }
  }, 
  impl: (ctx,into) => 
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
  params: {
    onEnter: { type: 'action', dynamic: true },
  },
  impl: ctx => 
    ({
      init: function(cmp) {
        var itemlist = cmp.itemlist;
        itemlist.selected = cmp.items[0];
        var keyEm = ctx.vars.suggestionContext.keyEm
          .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))

        keyEm.filter(e=>e.keyCode == 13) // ENTER
          .subscribe(x=>
                ctx.params.onEnter(ctx.setData(itemlist.selected)))
        keyEm.filter(e=>e.keyCode == 27) // ESC
          .subscribe(x=>
                ctx.run({$:'closeContainingPopup'}));

        keyEm.filter(e=>
                e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              // event.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              return cmp.items[cmp.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
            })
            .subscribe(x=>
                itemlist.selectionEmitter.next(x))

        // change selection if options are changed
        ctx.vars.suggestionContext.suggestionEm
            .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))
            .distinctUntilChanged(null,e=>e.options.join(','))
            .subscribe(e => {
              itemlist.selected = e.options[0]
          })
      }
  })
})

jb.component('studio.jb-paste-suggestion', {
  params: {
    toPaste: { },
  },
  type: 'action',
  impl: (ctx,toPaste) => {
    var suffix = typeof toPaste.value == 'object' ? '/' : '%';
    ctx.vars.suggestionContext.suggestionObj.paste(toPaste.text + suffix);
  }
})
