import {jb} from 'jb-core';
import {MdInput} from '@angular2-material/input/input.js';

import {MdSlideToggle} from '@angular2-material/input/input.js';

jb.component('editable-text.md-input',{
  type: 'editable-text.style',
  impl :{$: 'customStyle', 
      features :{$: 'editable-text.bindField' },
      template: `<span><md-input %$field.modelExp% placeholder="{{title}}"></md-input></span>`,
      methods: {
      	init: ctx => cmp => {
      		cmp.title = ctx.vars.$model.title();
      	}
      },
      directives: [MdInput]
	}
})
