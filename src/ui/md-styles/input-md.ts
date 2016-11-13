import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdInputModule} from '@angular/material';
//jb_ui.registerDirectives({MdInput: MdInput});

jb.component('editable-text.md-input',{
  type: 'editable-text.style',
  params: [
    { id: 'width', as: 'number' },
  ],
  impl :{$: 'customStyle', 
   features :{$: 'field.databind' },
   template: `<div><md-input [ngModel]="jbModel()" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')" placeholder="{{title}}"></md-input></div>`,
   methods: {
      	init: ctx => cmp =>
      		cmp.title = ctx.vars.$model.title()
      },
      css: 'md-input { {?width: %$width%px?} }',
    imports: MdInputModule
	}
})

