import {jb} from 'jb-core';

jb.component('editable-boolean.checkbox', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      features :{$: 'field.databind' },
      template: `<div><input type="checkbox" [ngModel]="jbModel()" (change)="jbModel($event.checked)" (keyup)="jbModel($event.target.checked,'keyup')"></div>`,
	}
})

jb.component('editable-boolean.checkbox-with-title', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      features :{$: 'field.databind' },
      template: `<div><input type="checkbox" [ngModel]="jbModel()" (change)="jbModel($event.checked)" (keyup)="jbModel($event.target.checked,'keyup')">{{text()}}</div>`,
	}
})

jb.component('editable-boolean.expand-collapse', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle',
      features :{$: 'field.databind' },
      template: `<div><input type="checkbox" [ngModel]="jbModel()" (change)="jbModel($event.checked)" (keyup)="jbModel($event.target.checked,'keyup')">
      	<i class="material-icons noselect" (click)="toggle()">{{jbModel() ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>
      </div>`,
      css: `i { font-size:16px; cursor: pointer; }
      		input { display: none }`
   }
})