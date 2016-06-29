import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jb.component('studio.open-resource', {
	type: 'action',
	params: {
	    resource: { type: 'data' },
	    id: { as: 'string' }
	}, 
	impl :{$: 'openDialog',
		title: '%$id%',
		style :{$: 'dialog.studio-floating', id: 'resource %$id%', width: 500 },
		content :{$: 'tree', cssClass: 'jb-control-tree', 
		    nodeModel :{$: 'tree.json', 
		      object: '%$resource%', rootPath: '%$id%' 
		    },
		    features: [
		        { $: 'tree.selection' },
		        { $: 'tree.keyboard-selection'} 
		    ] 
		 },
	}
})