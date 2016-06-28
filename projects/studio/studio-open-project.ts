import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';
import { Http, Response } from '@angular/http';

jb.component('studio.open-project', {
	type: 'action',
	impl :{$: 'openDialog',
		title: 'Outline',
		style :{$: 'dialog.studio-floating', id: 'studio outline', width: 300 },
		content :{$: 'studio.choose-project' },
	}
})


jb.component('studio.choose-project', {
	type: 'control',
	impl :{$: 'itemlist', 
        items :{$: 'studio.projects' }, 
        controls :{$: 'group', 
          controls : [
            {$: 'label', title: '%project%' },
            {$: 'button', title: 'open', 
              action: [
                {$: 'closeContainingPopup' },
                {$: 'writeValue', value: '%proejct%', to:'%$globals/proejct%'} ,
              ]
            }
          ]
        }, 
        itemVariable: 'project', 
      }
})

