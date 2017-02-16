jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.component('mdl-style.init-dynamic', {
  type: 'feature',
  params: [
  	{id: 'query', as: 'string'}
  ],
  impl: (ctx,query) => 
    ({
      init: cmp =>
        ctx.vars.ngZone.runOutsideAngular(() => {
      	 cmp.elementRef.nativeElement.querySelectorAll(query).forEach(el=>
      	 	componentHandler.upgradeElement(el)) }),
      destroy: cmp => 
      	 cmp.elementRef.nativeElement.querySelectorAll(query).forEach(el=>
      	 	componentHandler.downgradeElements(el))
    })
})

// ****** button styles

jb.component('button.mdl-flat', {
  type: 'button.style',
  params: [
  	{id: 'rippleEffect', as: 'boolean'}
  ],
  impl :{$: 'customStyle', 
      template: '<button class="mdl-button mdl-js-button" (click)="clicked()">{{title}}</button>',
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
      host: { '[class.mdl-js-ripple-effect]': 'true' },
  }
})

jb.component('button.mdl-flat-ripple', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" (click)="clicked()">{{title}}</button>',
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
  }
})

jb.component('button.mdl-icon', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
  ],
  impl :{$: 'customStyle', 
      template: `<button class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" (click)="clicked()" title="{{title}}" tabIndex="-1">
  <i class="material-icons" >%$icon%</i>
</button>`,
      css: `button, i { border-radius: 2px}`,
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
  }
})

jb.component('button.mdl-icon-12', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
  ],
  impl :{$: 'customStyle', 
      template: `<button class="mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" (click)="clicked()" title="{{title}}" tabIndex="-1">
  <i class="material-icons" >%$icon%</i>
</button>`,
      css: `.material-icons { font-size:12px;  }`,
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
  }
})


// ****** label styles

jb.component('label.mdl-ripple-effect', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<div class="mdl-button mdl-js-button mdl-js-ripple-effect">{{title}}</div>',
        features :[
          {$: 'label.bind-title' },
          {$: 'mdl-style.init-dynamic', query: '.mdl-js-ripple-effect'}
        ],
    }
});


})