import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model} from './studio-tgp-model';
import { Http, Response } from '@angular/http';

jb.component('studio.open-project', {
  type: 'action', 
  impl :{$: 'openDialog', 
    title: 'Open project', 
    style :{$: 'dialog.md-dialog-ok-cancel', okLabel: 'OK', cancelLabel: 'Cancel' }, 
    content :{$: 'studio.choose-project' }
  }
})


jb.component('studio.choose-project', {
  type: 'control', 
  impl :{$: 'group', 
    features: [
      {$: 'group.wait', 
        for :{$: 'http.get', url: '/?op=projects' }, 
        resource: 'projects', 
        mapToResource: '%projects%'
      }, 
      {$: 'css.padding', top: '15', left: '15' }
    ], 
    title: 'itemlist-with-find', 
    controls: [
      {$: 'editable-text', 
        databind: '%$globals/project_pattern%', 
        title: 'search', 
        style :{$: 'editable-text.md-input', width: '260' }
      }, 
      {$: 'itemlist', 
        items: [
          '%$projects%', 
          {$: 'search-filter', pattern: '%$globals/project_pattern%' }
        ], 
        itemVariable: 'project', 
        style :{$: 'itemlist.ul-li' }, 
        controls :{$: 'button', 
          title: '%$project%', 
          style :{$: 'button.md-flat' }, 
          action: [
            {$: 'closeContainingPopup' }, 
            {$: 'writeValue', value: '%$project%', to: '%$globals/project%' }, 
            {$: 'writeValue', value: 'main', to: '%$globals/page%' }, 
            {$: 'writeValue', value: '', to: '%$globals/profile_path%' }
          ], 
          features :{$: 'css', css: '!button { text-align: left; width: 250px }' }
        }
      }
    ]
  }
})

          // style :{$: 'customStyle', 
          //   template: '<span><button md-button (click)="clicked()">{{title}}</button></span>', 
          //   directives: 'MdButton', 
          //   css: 'button { width: 260px; text-align: left }'
          // }, 
