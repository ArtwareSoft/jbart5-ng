import {jb} from 'jb-core';

jb.component('jbart-site.main', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'main', 
    controls: [
      {$: 'group', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'image', 
            url: '/projects/studio/css/logo90.png', 
            imageHeight: '74', 
            units: 'px', 
            style :{$: 'image.default' }
          }
        ]
      }
    ]
  }
})


jb.component('jbart-site.bb', {
  type: 'control', 
  impl :{$: 'group', title: 'bb' }
})