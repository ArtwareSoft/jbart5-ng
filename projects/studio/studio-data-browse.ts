import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.open-resource', {
	type: 'action',
	params: [
	    { id: 'resource', type: 'data' },
	    { id: 'id', as: 'string' }
	], 
	impl :{$: 'openDialog',
		title: '%$id%',
		style :{$: 'dialog.studio-floating', id: 'resource %$id%', width: 500 },
		content :{$: 'tree',
		    nodeModel :{$: 'tree.json-read-only', 
		      object: '%$resource%', rootPath: '%$id%' 
		    },
		    features: [
	   	        { $: 'css.class', class: 'jb-control-tree'},
		        { $: 'tree.selection' },
		        { $: 'tree.keyboard-selection'} 
		    ] 
		 },
	}
})

