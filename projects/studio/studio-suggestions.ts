import {jb} from 'jb-core';

function rev(str) {
  return str.split('').reverse().join('');
}

export class suggestionObj {
  constructor(public input) {
    this.pos = input.selectionStart;
    this.text = input.value.substr(0,this.pos).trim();
    this.text_with_open_close = this.text.replace(/%([^%;{}\s><"']*)%/g, (match,contents) =>
      '{' + contents + '}');
    this.exp = rev((rev(this.text_with_open_close).match(/([^\}%]*%)/) || ['',''])[1]);
    this.tail = rev((rev(this.exp).match(/([^.\/]*)(\/|\.)/)||['',''])[1]);
    this.lastChar = this.text_with_open_close.slice(-1);
  }

  adjustPopupPlace(cmp) {
    var temp = $('<span></span>').css('font',$(this.input).css('font')).css('width','100%')
      .css('z-index','-1000').text($(this.input).val().substr(0,this.pos)).appendTo('body');
    var offset = temp.width();
    temp.remove();
    $(cmp.elementRef.nativeElement).parents('.jb-dialog')
      .css('margin-left', `${offset}px`);
  }

  extendWithSuggestions(ctx) {
    var base = this.exp.slice(0,-1-this.tail.length);
    if (this.lastChar == '%')
      this.suggestions = jb.toarray(probeCtx.exp('%%'))
        .concat(jb.entries(probeCtx.vars).map(x=>'$' + x[0]))
        .concat(jb.entries(probeCtx.resources).map(x=>'$' + x[0]))
    else
      this.suggestions = [].concat.apply([],
        jb.toarray(probeCtx.exp(base + '%'))
          .map(x=>
            jb.entries(x).map(x=>x[0])))
        .filter( jb_onlyUnique )
        .filter(p=>
          this.tail == '' || p.indexOf(e.tail) == 0);
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
    action: { type: 'action', dynamic:true }
  }, 
  impl: ctx => ({ 
      innerhost: {
        'md-input' : {'(keyup)': 'keyEm.next($event)' }
      },
      init: cmp=> {
        cmp.keyEm = cmp.keyEm || new Subject();
        var suggestionsEm = cmp.keyEm
            .map(e=> new suggestionObj(e.srcElement))
            .distinctUntilChanged(null,e=>e.input.value)
            .filter(e => 
              e.exp);

        suggestionsEm.subscribe(e=> {
              if (!$(e.input).hasClass('dialog-open'))
                jb_ui.wrapWithLauchingElement(ctx.params.action, 
                  cmp.ctx.setVars({ keyEmitter: cmp.keyEm, 
                    suggestionsEm: suggestionsEm.startWith(e) }), e.input)()
            })
      }
  })
})

jb.component('studio.jb-open-suggestions', {
  type: 'action', 
  params: {
    path: { as: 'string' }
  }, 
  impl :{$: 'openDialog', 
    $vars: { dialogData: {$object: {}} },
    style :{$: 'dialog.studio-suggestions-popup' }, 
    content: {$: 'wait',
      for :{$: 'studio.probe', path: '%$path%' },
      dataVariable: 'probeResult',
      control :{$: 'group',
        features :{$: 'studio.refresh-suggestions' },
        controls:{$: 'itemlist', 
          items : '%$dialogData/suggestionObj/suggestions%', 
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
  }
})

jb.component('studio.refresh-suggestions', {
  type: 'feature',
  params: {
    into: { as: 'ref' }
  }, 
  impl: (ctx,into) => 
    ({
      init: function(cmp) {
        ctx.exp('%$suggestionsEm%')
          .do(e=>e.adjustPopupPlace(cmp))
          .map(e=>extendWithSuggestions(ctx.exp('%$probeResult%')[0].in))
          .subscribe(e =>
            ctx.vars.dialogData.suggestionObj = e
          )
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
        itemlist.selected = itemlist.items[0];
        var keyEm = ctx.exp('%$keyEmitter%')
          .takeUntil(ctx.vars.$dialog.em.filter(e => 
            e.type == 'close'))

        keyEm.filter(e=>e.keyCode == 13)
          .subscribe(x=>
                ctx.params.onEnter(ctx.setData(itemlist.selected)))

        keyEm.filter(e=>
                e.keyCode == 38 || e.keyCode == 40)
            .map(event => {
              // event.stopPropagation();
              var diff = event.keyCode == 40 ? 1 : -1;
              return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
            })
            .subscribe(x=>
                itemlist.selectionEmitter.next(x))
      }
  })
})

jb.component('studio.jb-paste-suggestion', {
  params: {
    toPaste: { as: 'string' },
  },
  type: 'action',
  impl: (ctx,toPaste) =>
    ctx.vars.dialogData.suggestionObj.paste(toPaste)
})
