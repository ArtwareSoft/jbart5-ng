import {jb} from 'jb-core';
import {MdButton} from '@angular2-material/button/button.js';

jb.component('dialog.md-dialog-ok-cancel', {
	type: 'dialog.style',
	params: [
		{ id: 'okLabel', as: 'string', defaultValue: 'OK' },
		{ id: 'cancelLabel', as: 'string', defaultValue: 'Cancel' },
	],
	impl :{$: 'customStyle',
		template: `
				<div class="jb-dialog jb-default-dialog">
				      <div class="dialog-title">{{title}}</div>
				      <button class="dialog-close" (click)="dialogClose()">&#215;</button>
				      <jb_comp [comp]="contentComp"></jb_comp>
					  <div class="dialog-buttons">
							<button md-button="" type="button" (click)="dialogClose({OK:false})">
							  	<span class="md-button-wrapper">
								      <span>%$cancelLabel%</span>
    							</span>
    						</button>
							<button class="md-primary" md-button="" (click)="dialogClose({OK:true})" type="button">
									<span class="md-button-wrapper">
							      		<span>%$okLabel%</span>
							    	</span>
							</button>
						</div>
				</div>		
		`,
	  css: `.dialog-buttons { display: flex; justify-content: flex-end; margin: 5px }`,
      directives: 'MdButton'
	}
})
