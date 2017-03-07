jb.type('button.style')

jb.component('button', {
  type: 'control', category: 'basic:100',
  params: [
    { id: 'title', as: 'string', dynamic: true, essential: true, defaultTValue: 'click me' },
    { id: 'action', type: 'action', essential: true, dynamic: true },
    { id: 'style', type: 'button.style', defaultValue: { $: 'button.md-raised' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
    { id: '$click', type: 'boolean' }, // used by tests to simulate click
  ],
  impl: function(context) {
    if (context.params.$click) try { context.params.action() } catch (e) { jb.logException(e) } // for test debug
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
  params: [
    { id: 'size', as: 'number', defaultValue: '21'}
  ],
  impl :{$: 'customStyle', 
      template: '<div><button (click)="clicked()" [title]="title" style=":hover { opacity: .5 }">&#215;</button></div>',
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

