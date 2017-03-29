jb.component('mdl-style.init-dynamic', {
  type: 'feature',
  params: [
  	{id: 'query', as: 'string'}
  ],
  impl: (ctx,query) => 
    ({
      afterViewInit: cmp => 
        ctx.vars.ngZone.runOutsideAngular(_ => {
        jb.delay(1).then(_ =>
      	 cmp.elementRef.nativeElement.querySelectorAll(query).forEach(el=>
      	 	componentHandler.upgradeElement(el)))
      }),
      destroy: cmp => 
      	 cmp.elementRef.nativeElement.querySelectorAll(query).forEach(el=>
      	 	componentHandler.downgradeElements(el))
    })
})

jb.component('mdl.ripple-effect', { 
  type: 'feature',
  description: 'add ripple effect to buttons',
  impl: ctx => ({ 
        templateModifier: 
          template => 
            template.replace(/<\/([^>]*)>$/,'<span class="mdl-ripple"></span></$1>'),
        css: '{ position: relative; overflow:hidden }',
        init: cmp => 
          ctx.vars.ngZone.runOutsideAngular(() => {
            cmp.elementRef.nativeElement.classList.add('mdl-js-ripple-effect');
            componentHandler.upgradeElement(cmp.elementRef.nativeElement);
          }),
        destroy: cmp => 
          componentHandler.downgradeElements(cmp.elementRef.nativeElement)
   }),
})


// ****** button styles

jb.component('button.mdl-raised', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<button class="mdl-button mdl-button--raised mdl-js-button mdl-js-ripple-effect" (click)="clicked()">{{title}}</button>',
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
  }
})

jb.component('button.mdl-flat-ripple', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" (click)="clicked()">{{title}}</button>',
      features:{$: 'mdl-style.init-dynamic', query: '.mdl-js-button'},
      css: 'button { text-transform: none }'
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

jb.component('button.mdl-allow-html', {
  type: 'button.style',
  description: 'used for search pattern highlight',
  impl :{$: 'customStyle',
      template: '<button class="mdl-button mdl-js-button mdl-js-ripple-effect" (click)="clicked()" [innerHtml]="title"></button>',
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

jb.component('label.mdl-button', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<div class="mdl-button mdl-js-button">{{title}}</div>',
        features :[
          {$: 'label.bind-title' },
          {$: 'mdl-style.init-dynamic', query: '.mdl-js-button'}
        ],
    }
});

// *************** inputs 

jb.component('editable-text.mdl-search', {
  type: 'editable-text.style',
  impl :{$: 'customStyle', 
      template: `
  <div class="mdl-textfield mdl-js-textfield">
    <input [ngModel]="jbModel()" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')" 
      class="mdl-textfield__input" type="text" id="search_{{fieldId}}">
    <label class="mdl-textfield__label" for="search_{{fieldId}}">{{title}}</label>
  </div>`,
      features :[
          {$: 'field.databind' },
          {$: 'mdl-style.init-dynamic', query: '.mdl-js-textfield'}
      ],
  }
})

jb.component('editable-text.mdl-input', {
  type: 'editable-text.style',
  params: [
    { id: 'width', as: 'number' },
  ],
  impl :{$: 'customStyle', 
   template: `<div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
    <input [ngModel]="jbModel()" type="text" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')" 
      class="mdl-textfield__input" type="text" id="input_{{fieldId}}">
    <label class="mdl-textfield__label" for="input_{{fieldId}}">{{title}}</label>
  </div>`,
      css: '{ {?width: %$width%px?} }',
      features :[
          {$: 'field.databind' },
          {$: 'mdl-style.init-dynamic', query: '.mdl-js-textfield'}
      ],
  }
})


jb.component('editable-boolean.mdl-slide-toggle', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" for="switch_{{fieldId}}">
  <input type="checkbox" id="switch_{{fieldId}}" class="mdl-switch__input" [ngModel]="jbModel()" (change)="jbModel($event.target.checked)">
  <span class="mdl-switch__label">{{text()}}</span>
</label>`,
      features :[
          {$: 'field.databind' },
          {$: 'mdl-style.init-dynamic', query: '.mdl-js-switch'}
      ],
  }
})
