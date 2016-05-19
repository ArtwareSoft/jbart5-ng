import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {Directive,Component, ElementRef, Input } from '@angular/core';

jb.component('tab-control',{
	type: 'control',
	spritePosition: '1,1',
	params: {
		tabs: { type: 'control[]', essential: true, flattenArray: true, dynamic: true, as: 'observable' },
		style: { type: 'tab-control.style', dynamic: true, defaultValue: { $: 'tab-control.md' } },
		features: { type: 'feature[]', dynamic: true },
	},
	impl: jb_ui.ctrl
})

jb.type('tab-control.style');

jb.component('tab-control.md', {
	type: 'tab-control.style',
	impl: function(context) { return {
		init: function(cmp) {
			cmp.tabs = [];
			cmp.selectedIndex = 0;
			jb_rx.concat(context.vars.$model.tabs()).subscribe(comp=> {
					cmp.tabs.push(	{ title: comp.jb_title(context), comp: comp	})
			})
		},
		jbTemplate: `
				<md-content class="md-padding">
				  <md-tabs [selected]="selectedIndex" md-border-bottom md-autoselect>
				    <template md-tab *ngFor="let tab of tabs" [label]="tab.title">
 				      <jb_comp [comp]="tab.comp"></jb_comp>
				    </template>
				  </md-tabs>
				</md-content>
		`,
		directives: [jb_ui.jbComp]
	} }
})

// jb.component('tab-control.accordion',{
// 	type: 'tab-control.style',
// 	impl :{$: 'group', 
// 		cssClass: 'jb-accordion',
// 		controls: ctx => jb_rx.concat(ctx.vars.$model.tabs()),
// 		style :{$: 'group-expandable-subgroups' } 
// 	}
// }) 


// jb.component('tab-control.simple',{
// 	type: 'tab-control.style',
// 	impl: { $: 'group', cssClass: 'simple-tab',
// 		controls: [ 
// 			{ $: 'group', cssClass: 'tab', 
// 				controls: [
// 					'%$$model.controls%', 
// 					{$: 'button', 
// 						title: ctx => ctx.vars.controlsGenerator.jb_title(), 
// 						click: ctx => comp => {
// 							ctx.vars.tab.selectionEmitter.next(comp);
// 							ctx.vars.$model.controls.next('empty');
// 						},
// 						features :{$: '' }
// 					}
// 				]
// 			},
// 			{ $: 'group', controls: '%$tab.selectionEmitter%', cssClass: 'tab-content' }
// 		]
// 	}
// })

