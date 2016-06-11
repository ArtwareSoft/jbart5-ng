import {jb} from 'jb-core';

jb.component('jbart-site.main', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'main', 
    controls: [
      {$: 'group', 
        title: 'site header', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'image', 
            url: '/projects/studio/css/logo90.png', 
            imageHeight: '74', 
            units: 'px', 
            style :{$: 'image.default' }
          }, 
          {$: 'button', 
            title: 'preview in github', 
            style :{$: 'button.md-raised' }
          }
        ]
      }, 
      {$: 'group', 
        title: 'jbart header', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'image', 
            url: 'https://storage.googleapis.com/jbartcommunity/jbart5-material.png', 
            imageWidth: '500', 
            imageHeight: '', 
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