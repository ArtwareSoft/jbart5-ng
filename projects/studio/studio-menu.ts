import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.component('studio.mainMenu', {
	type: 'control',
	impl: {
		$: 'group', style :{$: 'group.section', cssClass: 'pulldown-main-menu' },
  	controls: [
  		{ $: 'pulldown.topMenuItem', title: 'File',
  		  controls: [
  		    { $: 'pulldown.menu-item', title: 'Open ...', action: { $: 'studio.openWidget'} },
  		    { $: 'pulldown.menu-item', title: 'Save', icon: 'save', action: { $: 'studio.saveWidget'}, shortcut: 'Ctrl+S' },
          { $: 'pulldown.menu-item', title: 'Source ...', action: { $: 'studio.openSourceDialog'} },
  		  ]
  		},
  		{ $: 'pulldown.topMenuItem', title: 'View',
  		  controls: [
  		    { $: 'pulldown.menu-item', title: 'Refresh', spritePosition: '10,0', action: { $: 'studio.refreshPreview'} },
  		    { $: 'pulldown.menu-item', title: 'Edit source', spritePosition: '3,0', action: { $: 'studio.editSource'} },
  		    { $: 'pulldown.menu-item', title: 'Control tree', spritePosition: '5,0', action: { $: 'studio.openControlTree'} },
  		    { $: 'pulldown.menu-item', title: 'jbEditor', spritePosition: '6,0', action: { $: 'studio.openjbEditor'} }
  		  ]
  		},
  		{ $: 'pulldown.topMenuItem', title: 'Data',
  		  controls: [
  		    { $: 'dynamic-fields', fieldItems: { $: 'studio.dataResources' },
  		    	 genericField: { $: 'pulldown.menu-item', title: '%$fieldItem.name%', action: { '$studio.showDataResource': '%$fieldItem%'} }
			    },
  		    { $: 'pulldown.menu-item-separator' },
  		    { $: 'pulldown.menu-item', title: 'Add Data Resource...', action: { $: 'studio.addDataResource'} }
  		  ]
  		}
  	]
	}
})


