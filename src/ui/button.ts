import {jb} from 'js/jb';
import * as jb_ui from 'ui/jb-ui';

jb.component('button', {
  type: "control",
  params: {
    title: { as: 'string', dynamic: true, essential: true, defaultValue: 'Hello' },
//    icon: { type: 'icon', dynamic: true },
    action: { type: 'action', essential: true, dynamic: true },
//   disabled: { type: 'boolean', dynamic: true },
//   description: { as: 'string' },
    style: { type: 'button.style', defaultValue: { $: 'button.md' }, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
    $click: { type: 'boolean' },
  },
  impl: function(context) {
    if (context.params.$click) try { context.params.action() } catch (e) { debugger } // for test debug
    return jb_ui.ctrl(context).jbExtend({
      beforeInit: function(cmp) {
        cmp.title = context.params.title();
        cmp.clicked = jb_ui.wrapWithLauchingElement(context.params.action, context, cmp.elementRef);
      }
    })
  }
})

jb.type('button.style');


// jb.component('label.bounded-span', {
//     type: 'label.style',
//     impl :{$: 'customStyle', 
//         template: '<span>{{title}}</span>',
//         features :{$ 'oneWayBind', to: '{{title}}', value: '%$$model/title%' }
//     }
// })

jb.component('button.href', {
  type: 'button.style',
    impl :{$: 'customStyle', 
        template: '<a href="javascript:;" (click)="clicked()">{{title}}</a>',
    }
})

jb.component('button.x', {
  type: 'button.style',
  params: {
    size: { as: 'number', defaultValue: '21'}
  },
  impl :{$: 'customStyle', 
      template: '<span><button (click)="clicked()" [title]="title" style=":hover { opacity: .5 }">&#215;</button></span>',
      css: `button {
            cursor: pointer; 
            font: %$size%px sans-serif; 
            border: none; 
            background: transparent; 
            color: #000; 
            text-shadow: 0 1px 0 #fff; 
            font-weight: 700; 
            opacity: .2;
        }
        button:hover { opacity: .5 }`
  }
})

jb.component('button.md-icon', {
  type: 'button.style',
  params: {
    icon: { as: 'string' },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-button class="md-icon-button" aria-label="%$aria%" (click)="clicked()" title="{{title}}">
                <i md-icon>%$icon%</i>
              </button></span>`,
  }
})

jb.component('button.md',{
  type: 'button.style',
  params: {
    flat: { type: 'boolean' },
    primary: { type: 'boolean' },
    warning: { type: 'boolean' },
    noInk: { type: 'boolean' },
    cornered: { type: 'boolean' },
  },
  impl: function(context,flat,primary,warning,noInk,cornered,cssClass) {
    var button = context.vars.$model;
    var noInkAtt = noInk ? 'md-no-ink': '';
    
    var atts = [button.icon ? 'icon-button' : '' ,
    primary ? 'primary ' : '',flat ? '' : 'raised-button', 
    cornered ? 'cornered' : '', warning ? 'warn' : '',cssClass]
      .filter(x => x).map(x=>'md-'+x).join(' ');

    return { 
      jbTemplate: `<button ${atts} (click)="clicked()" ${noInkAtt}>{{title}}</button>` 
    }
  }
})

jb.component('button.md2', {
  type: 'button.style',
  params: {
    flat: { type: 'boolean' },
    primary: { type: 'boolean' },
    warning: { type: 'boolean' },
    noInk: { type: 'boolean' },
    cornered: { type: 'boolean' },
  },
  impl :{$: 'customStyle', 
      template: '<button (click)="clicked()">{{title}}</button>',
      atts: {
        'icon-button:notEmpty': '%$$model/icon%',
        'primary:boolean': '%$primary%',
        'raised-button:!boolean': '%$flat%',
        'corenered:boolean': '%$corenered%',
        'warn:boolean': '%$warning%',
        'md-no-ink:boolean': '%$noInk%'
      },
  }
})
                