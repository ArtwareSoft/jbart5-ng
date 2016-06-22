import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

import {MdSlideToggle} from '@angular2-material/slide-toggle/slide-toggle.js';

jb_ui.registerDirectives({MdSlideToggle: MdSlideToggle});

jb.component('editable-boolean.md-slide-toggle', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<span><md-slide-toggle %$field.modelExp% >{{text()}}</md-slide-toggle></span>`,
      directives: 'MdSlideToggle'
  }
})

jb.component('editable-boolean.md-slide-toggle-fixed', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<span><md-slide-toggle color="primary" class="fix-slide-toggle" %$field.modelExp% >{{text()}}</md-slide-toggle></span>`,
      css: `
  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-thumb {
    background-color: #1f1f1f !important}
  .fix-slide-toggle.md-primary.md-checked .md-slide-toggle-bar {
    background-color: #858585 !important; opacity: 0.5 }
  .fix-slide-toggle.md-primary.md-slide-toggle-focused .md-ink-ripple {
    opacity: 1; background-color: #858585 !important; 
    background-color-old: rgba(0, 150, 136, 0.26); }
      `,
      noViewEncapsulation: true,
      directives: 'MdSlideToggle'
  }
})

// $mdThemingProvider.definePalette('jbStudio', {
//   '50': '#858585',
//   '100': '#5e5e5e',
//   '200': '#424242',
//   '300': '#1f1f1f',
//   '400': '#0f0f0f',
//   '500': '#000000',
//   '600': '#000000',
//   '700': '#000000',
//   '800': '#000000',
//   '900': '#000000',
//   'A100': '#858585',
//   'A200': '#5e5e5e',
//   'A400': '#0f0f0f',
//   'A700': '#000000',
//   'contrastDefaultColor': 'light',
//   'contrastDarkColors': '50 A100'
// });

