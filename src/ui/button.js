jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.type('button.style')

jb.component('button', {
  type: "control",
  params: {
    title: { as: 'string', dynamic: true, essential: true, defaultValue: 'Hello' },
    action: { type: 'action', essential: true, dynamic: true },
    style: { type: 'button.style', defaultValue: { $: 'button.md-flat' }, dynamic: true },
    features: { type: 'feature[]', dynamic: true },
    $click: { type: 'boolean' }, // used by tests to simulate click
  },
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
  params: {
    size: { as: 'number', defaultValue: '21'}
  },
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

jb.component('button.popup-menu', {
  type: 'button.style',
  impl :{$: 'customStyle',  
      template: '<div><button (click)="clicked()" [title]="title"></button></div>',
      css: `
    button { border: none; cursor: pointer;  width: 0px;  height: 0px;  
      margin: 8px 0 0 6px;  border-top: 5px solid #91B193;  border-bottom: 3px solid transparent;  border-right: 4px solid transparent;  border-left: 4px solid transparent;
      display: inline-block;  vertical-align: top; padding: 0; background: transparent;}
    button:hover { border-top: 5px solid #6A886C; }
    button:focus { outline: none; }
    `
  }
})



})
