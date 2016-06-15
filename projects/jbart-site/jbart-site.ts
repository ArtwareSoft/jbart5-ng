import {jb} from 'jb-core';

jb.component('jbart-site.main', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'main', 
    style :{$: 'layout.vertical', spacing: '' }, 
    controls: [
      {$: 'group', 
        title: 'site header', 
        style :{$: 'layout.flex' }, 
        controls: [
          {$: 'image', 
            url: '/projects/studio/css/logo90-green.png', 
            imageHeight: '74', 
            units: 'px', 
            style :{$: 'image.default' }
          }, 
          {$: 'divider', 
            style :{$: 'divider.flex-auto-grow' }, 
            title: 'divider'
          }, 
          {$: 'button', 
            title: 'preview in github', 
            action :{$: 'openUrl', url: 'https://github.com/ArtwareSoft/jbart5-ng' }, 
            style :{$: 'button.md-raised' }, 
            features: [
              {$: 'flex-layout-item.align-self', align: 'center' }, 
              {$: 'css', css: '{ margin-right: 15px }' }
            ]
          }, 
          {$: 'button', 
            title: 'install from npm', 
            action :{$: 'openUrl', url: 'https://www.npmjs.com/package/jbart5-ng2' }, 
            style :{$: 'button.md-raised' }, 
            features: [
              {$: 'flex-layout-item.align-self', align: 'center' }, 
              {$: 'css', css: '{ margin-right: 15px }' }
            ]
          }
        ], 
        features :{$: 'css', css: '{ background-color: #009688}' }
      }, 
      {$: 'group', 
        title: 'jbart header', 
        style :{$: 'layout.horizontal' }, 
        controls: [
          {$: 'image', 
            url: 'https://storage.googleapis.com/jbartcommunity/jbart5-material.png', 
            imageWidth: '400', 
            imageHeight: '', 
            units: 'px', 
            style :{$: 'customStyle', 
              template: `<div [style.width]="width" [style.height]="height">
                <img [style.width]="imageWidth" [style.height]="imageHeight" src="{{url}}"/>
                </div>`, 
              css: '{ padding: 20px }'
            }
          }, 
          {$: 'group', 
            title: 'header text', 
            style :{$: 'layout.vertical', spacing: '19' }, 
            controls: [
              {$: 'label', 
                title: 'Visual Development with angular2', 
                style :{$: 'label.span' }, 
                features :{$: 'css', 
                  css: `{ font-family: "Roboto","Helvetica","Arial",sans-serif ;
                    font-size: 30px;
                    font-weight: 400;
                    }`
                }
              }, 
              {$: 'text', 
                text: 'Visual development was broken in the world of web development, mostly because pre-defined visual components could not be re-used anymore. The industry accepts the fact that complex web apps can be developed only textually. ', 
                style :{$: 'text.paragraph' }, 
                title: 'text'
              }, 
              {$: 'text', 
                text: 'jBart suggests a revolutionary approach for visual development of complex apps that actually works. ', 
                style :{$: 'text.paragraph' }, 
                title: 'text'
              }
            ], 
            features :{$: 'css', 
              css: '{ max-width: 500px; padding: 30px 10px; color: white }'
            }
          }
        ], 
        features :{$: 'css', css: '{ background: #008577}' }
      }, 
      {$: 'group', 
        title: 'content', 
        style :{$: 'group.section' }, 
        controls: [
          {$: 'rich-text', 
            text: `<ul>
              <li>pick &amp; edit (like in Chrome debugger)</li>
              <li>work by example data</li>
              <li>smart data/code guidance in context</li>
              <li>preserve the full power of angular2 &amp; javascript</li>
              </ul>
              `, 
            title: 'Visual Development Concepts', 
            style :{$: 'customStyle', 
              template: `<section>
                <div class="title">%$title%</div>
                %$text%
                </section>`, 
              css: `.title {  color: #37474F;                font-size: 28px;                font-weight: 500;
                line-height: 32px;                margin-top: 10px;                margin: 0 0 16px 0;                opacity: .87;}
                {                font-size: 16px;                line-height: 30px;                opacity: .87;                }`
            }
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