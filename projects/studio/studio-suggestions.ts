import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {model} from './studio-tgp-model';
import {getComp} from './studio-utils';

jb.component('studio.property-primitive', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    title :{$: 'studio.prop-name', path: '%$path%' }, 
    controls: [
      {$: 'editable-text', 
        title: '%', 
        databind :{$: 'studio.ref', path: '%$path%' }, 
        style :{$: 'editable-text.studio-primitive-text' }, 
        features: [
          {$: 'studio.undo-support', path: '%$path%' }, 
          {$: 'studio.property-toobar-feature', path: '%$path%' }, 
          {$: 'feature.debounce', debounceTime: '500' }
        ]
      }, 
      {$: 'itemlist-with-groups', 
        items: '%$suggestionCtx/options%', 
        controls :{$: 'label', 
          title: '%text%', 
          features :{$: 'css.padding', top: '', left: '3', bottom: '' }
        }, 
        watchItems: true, 
        features: [
          {$: 'itemlist.studio-suggestions-options' }, 
          {$: 'itemlist.selection', autoSelectFirst: true }, 
          {$: 'hidden', showCondition: '%$suggestionCtx/show%' }, 
          {$: 'css.height', height: '500', overflow: 'auto', minMax: 'max' }, 
          {$: 'css.width', width: '300', overflow: 'auto' }, 
          {$: 'css', 
            css: '{ position: absolute; z-index:1000; background: white }'
          }, 
          {$: 'css.border', width: '1', color: '#cdcdcd' }, 
          {$: 'css.padding', top: '2', left: '3', selector: 'li' }
        ]
      }
    ], 
    features: [
      {$: 'group.studio-suggestions', path: '%$path%', expressionOnly: true }, 
      {$: 'studio.property-toobar-feature', path: '%$path%' }
    ]
  }
})

jb.component('studio.jb-floating-input', {
  type: 'control', 
  params: [{ id: 'path', as: 'string' }], 
  impl :{$: 'group', 
    controls: [
      {$: 'editable-text', 
        databind :{$: 'studio.profile-value-as-text', path: '%$path%' }, 
        updateOnBlur: true, 
        style :{$: 'editable-text.md-input', width: '400' }, 
        features: [
          {$: 'studio.undo-support', path: '%$path%' }, 
          {$: 'css.padding', left: '4', right: '4' }
        ]
      }, 
      {$: 'itemlist-with-groups', 
        items: '%$suggestionCtx/options%', 
        controls :{$: 'label', title: '%text%' }, 
        watchItems: true, 
        features: [
          {$: 'itemlist.studio-suggestions-options' }, 
          {$: 'itemlist.selection', 
            onDoubleClick: function (ctx) {
                                        return ctx.data.paste(ctx);
                                    }, 
            autoSelectFirst: true
          }, 
          {$: 'hidden', showCondition: '%$suggestionCtx/show%' }, 
          {$: 'css.height', height: '500', overflow: 'auto', minMax: 'max' }, 
          {$: 'css.padding', top: '3', left: '3', selector: 'li' }
        ]
      }
    ], 
    features :{$: 'group.studio-suggestions', 
      path: '%$path%', 
      closeFloatingInput: [
        {$: 'closeContainingPopup', OK: true }, 
        {$: 'tree.regain-focus' }
      ]
    }
  }
})

function rev(str) {
  return str.split('').reverse().join('');
}

export class suggestions {
  constructor(public input,public expressionOnly) {
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

  suggestionsRelevant() {
    return (this.inputVal.indexOf('=') == 0 && !this.expressionOnly)
      || ['%','%$','/','.'].indexOf(this.tailSymbol) != -1  
  }

  adjustPopupPlace(cmp,options) {
    // var temp = $('<span></span>').css('font',$(this.input).css('font')).css('width','100%')
    //   .css('z-index','-1000').text($(this.input).val().substr(0,this.pos)).appendTo('body');
    // var offset = temp.width();
    // temp.remove();
    // var dialogEl = $(cmp.elementRef.nativeElement).parents('.jb-dialog');
    // dialogEl.css('margin-left', `${offset}px`)
    //   .css('display', options.length ? 'block' : 'none');
  }

  extendWithOptions(probeCtx,path) {
    this.options = [];
    probeCtx = probeCtx || (jbart.previewjbart || jbart).initialCtx;
    var vars = jb.entries(jb.extend({},(probeCtx.componentContext||{}).params,probeCtx.vars,probeCtx.resources))
        .map(x=>new ValueOption('$'+x[0],x[1],this.pos,this.tail))
        .filter(x=> x.toPaste.indexOf('$$') != 0)
        .filter(x=>['$ngZone','$window'].indexOf(x.toPaste) == -1)

    if (this.inputVal.indexOf('=') == 0 && !this.expressionOnly)
      this.options = model.PTsOfPath(path).map(compName=> {
            var name = compName.substring(compName.indexOf('.')+1);
            var ns = compName.substring(0,compName.indexOf('.'));
            return new CompOption(compName, compName, ns ? `${name} (${ns})` : name, getComp(compName).description || '')
        })
    else if (this.tailSymbol == '%') 
      this.options = [].concat.apply([],jb.toarray(probeCtx.exp('%%'))
        .map(x=>
          jb.entries(x).map(x=> new ValueOption(x[0],x[1],this.pos,this.tail))))
        .concat(vars)
    else if (this.tailSymbol == '%$') 
      this.options = vars
    else if (this.tailSymbol == '/' || this.tailSymbol == '.')
      this.options = [].concat.apply([],
        jb.toarray(probeCtx.exp(this.base))
          .map(x=>jb.entries(x).map(x=>new ValueOption(x[0],x[1],this.pos,this.tail))) )

    this.options = this.options
        .filter( jb_unique(x=>x.toPaste) )
        .filter(x=> x.toPaste != this.tail)
        .filter(x=>
          this.tail == '' || typeof x.toPaste != 'string' || (x.description + x.toPaste).toLowerCase().indexOf(this.tail) != -1)
    if (this.tail)
      this.options.sort((x,y)=> (y.toPaste.toLowerCase().indexOf(this.tail) == 0 ? 1 : 0) - (x.toPaste.toLowerCase().indexOf(this.tail) == 0 ? 1 : 0));

    this.key = this.options.map(o=>o.toPaste).join(',');
    return this;
  }
}

class ValueOption {
    constructor(public toPaste, public value,public pos,public tail) {
      this.text = this.toPaste + this.valAsText()
    }
    valAsText() {
      var val = this.value;
      if (typeof val == 'string' && val.length > 20)
        return ` (${val.substring(0,20)}...)`;
      else if (typeof val == 'string' || typeof val == 'number' || typeof val == 'boolean')
        return ` (${val})`;
      return ``;
    }
    paste(ctx) {
      var toPaste = this.toPaste + (typeof this.value == 'object' ? '/' : '%');
      var input = ctx.vars.suggestionCtx.input;
      var pos = this.pos + 1;
      input.value = input.value.substr(0,this.pos-this.tail.length) + toPaste + input.value.substr(pos);
      jb.delay(1,ctx).then (() => {
        input.selectionStart = pos + toPaste.length;
        input.selectionEnd = input.selectionStart;
      })
    }
    writeValue(ctx) {
      var input = ctx.vars.suggestionCtx.input;
      var script_ref = ctx.run({$: 'studio.ref', path: '%$suggestionCtx.path%' });
      jb.writeValue(script_ref,input.value);
    }
}

class CompOption {
    constructor(public toPaste, public value,public text,public description) {}
    paste(ctx) {
      ctx.vars.suggestionCtx.input.value = '=' + this.toPaste;
      ctx.vars.suggestionCtx.closeAndWriteValue();
    }
    writeValue(ctx) {
      ctx.run({$:'writeValue', to: {$: 'studio.comp-name-ref', path: '%$suggestionCtx.path%' }, value: this.toPaste });
      ctx.run({$:'studio.expand-and-select-first-child-in-jb-editor' });
    }
}


jb.component('group.studio-suggestions', {
  type: 'feature', 
  params: [
    { id: 'path', as: 'string' },
    { id: 'closeFloatingInput', type: 'action', dynamic:true },
    { id: 'expressionOnly', type: 'boolean', as: 'boolean' }
  ], 
  impl: ctx => {
    var suggestionCtx = { path: ctx.params.path, options: [], show: false };
    return {
      observable: () => {}, // register jbEmitter
      extendCtx: ctx2 =>
        ctx2.setVars({suggestionCtx: suggestionCtx }),

      afterViewInit: cmp=> {
        var input = $(cmp.elementRef.nativeElement).findIncludeSelf('input')[0];
        if (!input)
          return;
        suggestionCtx.input = input;
        var inputClosed = cmp.jbEmitter.filter(x=>x =='destroy');

        cmp.keyEm = jb_rx.Observable.fromEvent(input, 'keydown')
          .takeUntil(inputClosed);
        suggestionCtx.keyEm = cmp.keyEm;
        suggestionCtx.closeAndWriteValue = () =>{
          ctx.params.closeFloatingInput();
          var option = input.value.indexOf('=') == 0 ? new CompOption(input.value.substr(1)) : new ValueOption();
          option.writeValue(cmp.ctx);
        }

        cmp.keyEm.filter(e=> e.keyCode == 13)
            .subscribe(e=>{
              if (!suggestionCtx.show || suggestionCtx.options.length == 0)
                suggestionCtx.closeAndWriteValue()
            })

        cmp.keyEm.filter(e=> e.keyCode == 27)
            .subscribe(e=>{
              ctx.params.closeFloatingInput();
            })

        suggestionCtx.suggestionEm = cmp.keyEm
          .filter(e=> e.keyCode != 38 && e.keyCode != 40)
          .delay(1) // we use keydown - let the input fill itself
          .debounceTime(20) // solves timing of closing the floating input
          .filter(e=>
            suggestionCtx.show = new suggestions(input,ctx.params.expressionOnly).suggestionsRelevant() )
          .map(e=>
            input.value)
//          .do(x=>console.log(0,x))
          .distinctUntilChanged()
//          .do(x=>console.log(1,x))
          .flatMap(e=>
            getProbe().then(res=>
              res && res.finalResult && res.finalResult[0] && res.finalResult[0].in))
          .map(probeCtx=> 
            new suggestions(input,ctx.params.expressionOnly).extendWithOptions(probeCtx,ctx.params.path))
          .distinctUntilChanged((e1,e2)=>
            e1.key == e2.key)

        function getProbe() {
          return cmp.probeResult || ctx.run({$: 'studio.probe', path: ctx.params.path });
        }
      }
  }}
})

jb.component('itemlist.studio-suggestions-options', {
  type: 'feature',
  params: [
  ],
  impl: ctx => 
    ({
      afterViewInit: function(cmp) {
        var suggestionCtx = ctx.vars.suggestionCtx;
//        cmp.changeDt.detach();

        jb.delay(1,ctx).then(()=>{// ctx.vars.ngZone.runOutsideAngular(() => {
          var keyEm = suggestionCtx.keyEm;

          keyEm.filter(e=>
              e.keyCode == 13) // ENTER
            .subscribe(()=>{
                suggestionCtx.show = false;
                if (cmp.selected && cmp.selected.paste) {
                  cmp.selected.paste(ctx);
                  cmp.selected = null;
                }
                jb_ui.apply(ctx);
            })
          keyEm.filter(e=>e.keyCode == 27) // ESC
            .subscribe(x=>
                suggestionCtx.show = false)

          keyEm.filter(e=>
                  e.keyCode == 38 || e.keyCode == 40)
              .subscribe(e=>{
                  var diff = e.keyCode == 40 ? 1 : -1;
                  var items = cmp.items; //.filter(item=>!item.heading);
                  cmp.selected = items[(items.indexOf(cmp.selected) + diff + items.length) % items.length] || cmp.selected;
                  // cmp.changeDt.markForCheck();
                  // cmp.changeDt.detectChanges();
                  e.preventDefault();
              })

          suggestionCtx.suggestionEm.subscribe(e=> {
              suggestionCtx.show = e.options.length > 0;
              suggestionCtx.options = e.options;
              cmp.selected = e.options[0];
              cmp.changeDt.markForCheck();
              cmp.changeDt.detectChanges();
            })
        })
      },
  })
})

