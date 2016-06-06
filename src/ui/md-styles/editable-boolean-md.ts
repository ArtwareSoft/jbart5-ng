import {jb} from 'jb-core';
import {MdSlideToggle} from '@angular2-material/slide-toggle/slide-toggle.js';

jb.component('editable-boolean.md-slide-toggle', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<span><md-slide-toggle %$field.modelExp% >{{text()}}</md-slide-toggle></span>`,
      directives: [MdSlideToggle]
  }
})
