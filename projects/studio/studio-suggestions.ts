import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

function rev(str) {
  return str.split('').reverse().join('');
}

export class suggestionObj {
  constructor(public input,lastKey) {
    this.pos = input.selectionStart + (lastKey ? 1 : 0);
    this.text = (input.value+lastKey).substr(0,this.pos).trim();
    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, (match,contents) =>
      '{' + contents + '}');
    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['',''])[1]);
    this.tail = rev((rev(this.exp).match(/([^%.\/]*)(\/|\.|%)/)||['',''])[1]);
    this.tailSymbol = this.text_with_open_close.slice(-1-this.tail.length).slice(0,1); // % or /
    if (this.tailSymbol == '%' && this.exp.slice(0,2) == '%$')
      this.tailSymbol = '%$';
    this.base = this.exp.slice(0,-1-this.tail.length) + '%';
  }

  adjustPopupPlace(cmp) {
    var temp = $('<span></span>').css('font',$(this.input).css('font')).css('width','100%')
      .css('z-index','-1000').text($(this.input).val().substr(0,this.pos)).appendTo('body');
    var offset = temp.width();
    temp.remove();
    $(cmp.elementRef.nativeElement).parents('.jb-dialog')
      .css('margin-left', `${offset}px`);
  }

  extendWithSuggestions(probeCtx) {
    var vars = jb.entries(probeCtx.vars).map(x=>'$' + x[0])
        .concat(jb.entries(probeCtx.resources).map(x=>'$' + x[0]));

    if (this.tailSymbol == '%') 
      this.suggestions = jb.toarray(probeCtx.exp('%%'))
        .concat(vars)
    else if (this.tailSymbol == '%$') 
      this.suggestions = vars
    else
      this.suggestions = [].concat.apply([],
        jb.toarray(probeCtx.exp(this.base))
          .map(x=>
            jb.entries(x).map(x=>x[0])))

    this.suggestions = this.suggestions
        .filter( jb_onlyUnique )
        .filter(p=>
          this.tail == '' || typeof p != 'string' || p.indexOf(this.tail) == 0);
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
    action: { type: 'action', dynamic:true }
  }, 
  impl: ctx => ({ 
      innerhost: {
        'md-input' : {'(keydown)': 'keyEm.next($event)' }
      },
      init: cmp=> {
        cmp.keyEm = cmp.keyEm || new Subject();

        ctx.run({$: 'studio.probe', path: ctx.params.path }).then(probeResult => {
            var suggestionEm = cmp.keyEm
                .map(e=> 
                  new suggestionObj(e.srcElement,e.key.length == 1 ? e.key : ''))
                .distinctUntilChanged(null,e=>e.input.value)
                .filter(e => 
                  e.exp)
                .map(e=>
                    e.extendWithSuggestions(probeResult[0].in))

            suggestionEm.subscribe(e=> {
                if (!$(e.input).hasClass('dialog-open')) {
                  var ctx2 = ctx.setVars({suggestionContext: { suggestionEm: suggestionEm.startWith(e), keyEm: cmp.keyEm }});
                  jb_ui.wrapWithLauchingElement(ctx.params.action,ctx2, e.input)()
                }
              })
        })
      }
  })
})

jb.component('studio.jb-open-suggestions', {
  type: 'action', 
  impl :{$: 'openDialog', 
    style :{$: 'dialog.studio-suggestions-popup' }, 
    content :{$: 'group',
        features :{$: 'studio.suggestions-emitter' },
        controls:{$: 'itemlist', 
          items : '%$suggestionContext/suggestionObj/suggestions%', 
          controls: {$: 'label', title: '%%' },
          features: [
            {$: 'itemlist.studio-suggestions-selection',
              onEnter: [
                {$: 'studio.jb-paste-suggestion', toPaste: '%%'},
                {$: 'closeContainingPopup'}
              ]
            },
            {$: 'itemlist.selection' },
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
        ctx.vars.suggestionContext.suggestionEm
            .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))
            .subscribe(e => {
              e.adjustPopupPlace(cmp);
              ctx.vars.suggestionContext.suggestionObj = e
        })
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

        keyEm.filter(e=>e.keyCode == 13)
          .subscribe(x=>
                ctx.params.onEnter(ctx.setData(itemlist.selected)))

        keyEm.filter(e=>
                e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              // event.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              return cmp.items[cmp.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
            })
            .subscribe(x=>
                itemlist.selectionEmitter.next(x))

        ctx.vars.suggestionContext.suggestionEm
             .takeUntil(ctx.vars.$dialog.em.filter(e => e.type == 'close'))
            .distinctUntilChanged(null,e=>e.suggestions.join(','))
            .subscribe(e => {
              if (!e.suggestions[0])
                console.log(e);
              itemlist.selected = e.suggestions[0]
          })
      }
  })
})

jb.component('studio.jb-paste-suggestion', {
  params: {
    toPaste: { as: 'string' },
  },
  type: 'action',
  impl: (ctx,toPaste) =>
    ctx.vars.suggestionContext.suggestionObj.paste(toPaste)
})
