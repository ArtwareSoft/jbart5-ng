import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.data-resources', {
  type: 'control', 
  impl :{$: 'group', 
    controls: [
      {$: 'itemlist', 
        items: '%$samples%', 
        controls: [
          {$: 'button', 
            title: '%%', 
            style :{$: 'button.md-flat' }
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'button', 
        title: 'add resource', 
        style :{$: 'button.md-icon', icon: 'add', size: 20 }
      }, 
      {$: 'group', 
        style :{$: 'group.section' }, 
        controls: [
          {$: 'itemlist', 
            items :{$: 'list', items: ['1', '2', '3'] }, 
            style :{$: 'itemlist.ul-li' }, 
            watchItems: true, 
            itemVariable: 'item'
          }
        ], 
        features :{$: 'var', name: 'selected_in_itemlist' }
      }
    ], 
    features :{$: 'group.wait', 
      for :{$: 'level-up.entries', 
        db :{$: 'level-up.file-db', rootDirectory: '/projects/data-tests/samples' }
      }, 
      resource: 'samples', 
      mapToResource: '%%'
    }
  }
})

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

