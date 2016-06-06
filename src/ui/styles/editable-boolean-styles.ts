import {jb} from 'jb-core';

jb.component('editable-boolean.checkbox', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<span><input type="checkbox" %$field.modelExp%></span>`,
	}
})

jb.component('editable-boolean.checkbox-with-title', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle', 
      template: `<span><input type="checkbox" %$field.modelExp%>{{text()}}</span>`,
	}
})

jb.component('editable-boolean.expand-collapse', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle',
      template: `<span><input type="checkbox" %$field.modelExp%>
      	<i class="material-icons" (click)="toggle()">{{jbModel ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>
      </span>`,
      css: `i { font-size:16px; cursor: pointer; user-select: none }
      		input { display: none }`
   }
})