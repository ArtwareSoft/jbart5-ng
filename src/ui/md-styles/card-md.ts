import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {MdCardModule} from '@angular/material';

jb.component('group.md-card', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card></div>`,
    features :{$: 'group.initGroup'},
    imports: MdCardModule
  }
})

jb.component('group.md-card-actions', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-actions>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-actions></div>`,
    features :{$: 'group.initGroup'},
    imports: MdCardModule
  }
})

jb.component('group.md-card-content', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-content>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-content></div>`,
    features :{$: 'group.initGroup'},
    imports: MdCardModule
  }
})

jb.component('group.md-card-header', {
  type: 'group.style',
  impl :{$: 'customStyle',
    template: `<div><md-card-header>
        <jb_comp *ngFor="let ctrl of ctrls" [comp]="ctrl.comp" [flatten]="true" class="group-item"></jb_comp>
      </md-card-header></div>`,
    features :{$: 'group.initGroup'},
    imports: MdCardModule
  }
})

jb.component('label.md-card-title', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<md-card-title>{{title}}</md-card-title>',
        features :{$: 'label.bind-title' },
        imports: MdCardModule
    }
})

jb.component('label.md-card-subtitle', {
    type: 'label.style',
    impl :{$: 'customStyle', 
        template: '<div><md-card-subtitle>{{title}}</md-card-subtitle></div>',
        ffeatures :{$: 'label.bind-title' },
        imports: MdCardModule
    }
})
