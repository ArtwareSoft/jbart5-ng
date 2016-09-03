import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdInput} from '@angular2-material/input/input.js';
jb_ui.registerDirectives({MdInput: MdInput});

jb.component('editable-text.md-input',{
  type: 'editable-text.style',
  params: [
    { id: 'width', as: 'number' }
  ],
  impl :{$: 'customStyle', 
   features :{$: 'editable-text.bindField' },
   template: `<div><md-input %$field.modelExp% placeholder="{{title}}"></md-input></div>`,
   methods: {
      	init: ctx => cmp =>
      		cmp.title = ctx.vars.$model.title()
      },
      css: 'md-input { {?width: %$width%px?} }',
//      directives: 'MdInput'
	}
})

