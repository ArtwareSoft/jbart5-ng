import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {MdButton} from '@angular2-material/button/button.js';

jb_ui.registerDirectives({MdButton: MdButton});


jb.component('button.md-flat', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<span><button md-button (click)="clicked()">{{title}}</button></span>',
      directives: 'MdButton'
  }
})

jb.component('button.md-raised', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<span><button md-raised-button (click)="clicked()">{{title}}</button></span>',
      directives: 'MdButton'
  }
})

jb.component('button.md-icon', {
  type: 'button.style',
  params: {
    icon: { as: 'string', default: 'code' },
    size: { as: 'number', defaultValue: 20 },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons" style="font-size:%$size%px;">%$icon%</i>
              </button></span>`,
      css: 'button {min-width: 2px; margin-top: -3px; padding: 4px}',
      directives: 'MdButton'
  }
})

jb.component('button.md-icon-12', {
  type: 'button.style',
  params: {
    icon: { as: 'string', default: 'code' },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons">%$icon%</i>
              </button></span>`,
      css: `button { width: 24px; height: 24px; padding: 0; margin-left: 2px; margin-top: -2px;}
      .material-icons { font-size:12px;  }
      `,
      directives: 'MdButton'
  }
})


jb.component('button.md-icon-fab', {
  type: 'button.style',
  params: {
    icon: { as: 'string', default: 'code' },
    size: { as: 'number', defaultValue: '24' },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-fab aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons md-24">%$icon%</i>
              </button></span>`,
      directives: 'MdButton'
  }
})

jb.component('button.md-mini-fab', {
  type: 'button.style',
  params: {
    icon: { as: 'string', default: 'code' },
    size: { as: 'number', defaultValue: '24' },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-mini-fab aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
                <i class="material-icons md-24">%$icon%</i>
              </button></span>`,
      directives: 'MdButton'
  }
})