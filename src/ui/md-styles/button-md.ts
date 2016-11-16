import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdButtonModule,MdIconModule,MdIconRegistry} from '@angular/material';

//jb_ui.registerDirectives({MdButton: MdButton,MdIcon: MdIcon});
//jb_ui.registerProviders({MdIconRegistry: MdIconRegistry});

jb.component('button.md-flat', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
      imports: MdButtonModule
  }
})

jb.component('button.md-raised', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<div><button md-raised-button (click)="clicked()">{{title}}</button></div>',
      imports: MdButtonModule
  }
})

jb.component('button.md-icon', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
    { id: 'size', as: 'number', defaultValue: 20 },
    { id: 'aria', as: 'string' },
  ],
  impl :{$: 'customStyle', 
      template: `<div><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons" style="font-size:%$size%px;">%$icon%</i>
              </button></div>`,
      css: `button {min-width: 2px; padding: 4px; padding-bottom: 7px; height: 100%; margin-left: 4px; border-radius: 10%;}`,
      imports: MdButtonModule,
      providers: MdIconRegistry,
  }
})

jb.component('button.md-icon2', {
  type: 'button.style2',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
    { id: 'size', as: 'number', defaultValue: 20 },
    { id: 'padding', as: 'number', defaultValue: 4 },
    { id: 'aria', as: 'string' },
  ],
  impl :{$: 'customStyle',
      // $vars: {
      //   fontSize: ctx => 
      //     ctx.componentContext.params.size - ctx.componentContext.params.padding
      // }, 
      template: `<div><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons">%$icon%</i>
              </button></div>`,
      css: `.md-button-ripple11 { width: %$size%px; height: %$size%px;  }
      button { width: %$size%px; height: %$size%px; padding: %$padding%px }
      i { font-size:%$size%px; }`,
      imports: MdButtonModule,
      providers: MdIconRegistry,
  }
})

jb.component('button.md-icon-12', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
    { id: 'aria', as: 'string' },
  ],
  impl :{$: 'customStyle', 
      template: `<div><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons">%$icon%</i>
              </button></div>`,
      css: `button { width: 24px; height: 24px; padding: 0; margin-left: 2px; margin-top: -2px;}
      .material-icons { font-size:12px; margin-top: -12px }
      `,
      imports: MdButtonModule,
      providers: MdIconRegistry,
  }
})


jb.component('button.md-icon-fab', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
    { id: 'size', as: 'number', defaultValue: '24' },
    { id: 'aria', as: 'string' },
  ],
  impl :{$: 'customStyle', 
      template: `<div><button md-fab aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons md-24">%$icon%</i>
              </button></div>`,
      imports: MdButtonModule,
      providers: MdIconRegistry,
  }
})

jb.component('button.md-mini-fab', {
  type: 'button.style',
  params: [
    { id: 'icon', as: 'string', default: 'code' },
    { id: 'size', as: 'number', defaultValue: '24' },
    { id: 'aria', as: 'string' },
  ],
  impl :{$: 'customStyle', 
      template: `<div><button md-mini-fab aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons md-24">%$icon%</i>
              </button></div>`,
      imports: MdButtonModule,
      providers: MdIconRegistry,
  }
})
