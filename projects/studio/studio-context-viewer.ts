import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.open-context-viewer', {
	type: 'action',
	impl :{$: 'openDialog',
		title: 'Context Viewer',
		style :{$: 'dialog.studio-floating', id: 'studio-context-viewer', width: 300 },
		content :{$: 'studio.context-viewer' },
	}
})


jb.component('studio.context-viewer', {
	type: 'control',
	impl :{$: 'studio.data-browse', data: '%$globals/last_pick_selection%', title: 'context' }, 

})

