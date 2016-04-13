import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('button.md-flat', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<button md-button (click)="clicked()">{{title}}</button>',
  }
})

jb.component('button.md-raised', {
  type: 'button.style',
  impl :{$: 'customStyle', 
      template: '<button md-raised-button (click)="clicked()">{{title}}</button>',
  }
})

jb.component('button.md-icon', {
  type: 'button.style',
  params: {
    icon: { as: 'string' },
    size: { as: 'number', defaultValue: 20 },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<span><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}">
                <i class="material-icons" style="font-size:%$size%px;">%$icon%</i>
              </button></span>`,
      css: 'button {min-width: 2px; height: 30px; padding: 4px}'
  }
})

jb.component('button.md-icon-fab', {
  type: 'button.style',
  params: {
    icon: { as: 'string' },
    size: { as: 'number', defaultValue: '24' },
    aria: { as: 'string' },
  },
  impl :{$: 'customStyle', 
      template: `<button class="md-fab" aria-label="%$aria%" (click)="" title="{{title}}">
                <i class="material-icons md-%$size%">%$icon%</i>
              </button>`
  }
})
