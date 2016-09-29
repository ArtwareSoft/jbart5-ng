import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {MdButton} from '@angular2-material/button/button.js';
import {MdIcon} from '@angular2-material/icon/icon.js';
import {MdIconRegistry} from '@angular2-material/icon/icon-registry';

import {PORTAL_DIRECTIVES} from '@angular2-material/core/portal/portal-directives'; // bug fix for @angular2-material
import {MD_RIPPLE_DIRECTIVES} from '@angular2-material/core/ripple/ripple'; // bug fix for @angular2-material

jb_ui.registerDirectives({MdButton: MdButton,MdIcon: MdIcon, PORTAL_DIRECTIVES:PORTAL_DIRECTIVES,MD_RIPPLE_DIRECTIVES:MD_RIPPLE_DIRECTIVES});
jb_ui.registerProviders({MdIconRegistry: MdIconRegistry});

jb.component('button.md-flat', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<div><button md-button (click)="clicked()">{{title}}</button></div>',
      directives: 'MdButton'
  }
})

jb.component('button.md-raised', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<div><button md-raised-button (click)="clicked()">{{title}}</button></div>',
      directives: 'MdButton'
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
      css: 'button {min-width: 2px; margin-top: -3px; padding: 4px}',
      directives: 'MdButton'
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
      directives: 'MdButton'
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
      .material-icons { font-size:12px;  }
      `,
      directives: 'MdButton'
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
      directives: 'MdButton'
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
      directives: 'MdButton'
  }
})
