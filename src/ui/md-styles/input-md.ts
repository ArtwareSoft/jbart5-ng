import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdInput} from '@angular2-material/input/input.js';

jb_ui.registerDirectives({MdInput: MdInput});


jb.component('editable-text.md-input',{
  type: 'editable-text.style',
  params: {
    width: { as: 'number' }
  }
  impl :{$: 'customStyle', 
    $vars: {
       widthCss: ctx =>
          ctx.componentContext.params.width ? `md-input { width: ${ctx.componentContext.params.width}px}` : ''
    },
   features :{$: 'editable-text.bindField' },
      template: `<span><md-input %$field.modelExp% placeholder="{{title}}"></md-input></span>`,
      methods: {
      	init: ctx => cmp => {
      		cmp.title = ctx.vars.$model.title();
      	}
      },
      css: '%$widthCss%',
      directives: 'MdInput'
	}
})
