import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {MD_CARD_DIRECTIVES} from '@angular2-material/card/card.js';

jb_ui.registerDirectives({MD_CARD_DIRECTIVES: MD_CARD_DIRECTIVES });

jb.component('group.md-card', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card></div>`,
    features :{$: 'group.initGroup'},
    directives: 'MD_CARD_DIRECTIVES'
  }
})

jb.component('group.md-card-actions', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-actions>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-actions></div>`,
    features :{$: 'group.initGroup'},
    directives: 'MD_CARD_DIRECTIVES'
  }
})

jb.component('group.md-card-content', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-content>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-content></div>`,
    features :{$: 'group.initGroup'},
    directives: 'MD_CARD_DIRECTIVES'
  }
})

jb.component('group.md-card-header', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-header>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-header></div>`,
    features :{$: 'group.initGroup'},
    directives: 'MD_CARD_DIRECTIVES'
  }
})

jb.component('label.md-card-title', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<div><md-card-title>{{title}}</md-card-title></div>',
        features :{$: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' },
        directives: 'MD_CARD_DIRECTIVES'
    }
})

jb.component('label.md-card-subtitle', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<div><md-card-subtitle>{{title}}</md-card-subtitle></div>',
        features :{$: 'oneWayBind', to: '{{title}}', value: '%$$model/title%' },
        directives: 'MD_CARD_DIRECTIVES'
    }
})
