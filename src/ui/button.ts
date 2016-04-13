import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.type('button.style')

jb.component('button', {
  type: "control",
  params: {
    title: { as: 'string', dynamic: true, essential: true, defaultValue: 'Hello' },
//    icon: { type: 'icon', dynamic: true },
    action: { type: 'action', essential: true, dynamic: true },
//   disabled: { type: 'boolean', dynamic: true },
//   description: { as: 'string' },
    style: { type: 'button.style', defaultValue: { $: 'button.md-flat' }, dynamic: true },
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

