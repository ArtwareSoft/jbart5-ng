import {jb} from 'jb-core';

jb.component('picklist.native', {
  type: 'picklist.style',
  impl :{$: 'customStyle', 
    template: `<div><select %$field.modelExp%>
                    <option *ngFor="let option of options" [value]="option.code">{{option.text}}</option>
                 </select></div>`,
    css: 'select {height: 23px}'
  }
})

jb.component('picklist.groups', {
  type: 'picklist.style',
  impl :{$: 'customStyle', 
    template: `<div><select %$field.modelExp%>
    <optgroup *ngFor="let group of groups" label="{{group.text}}">
	    <option *ngFor="let option of group.options" [value]="option.code">{{option.text}}</option>
    </optgroup>
    </select></div>`
  }
})
//      	<option *ngFor="let option of optionsOfGroup(group)" [value]="option.code">{{option.text}}</option>

    // template: `<div><select %$field.modelExp%>
    //   <optgorup *ngFor="let option of options">{{option.text}}
    //   </optgorup>
    //   </select></div>`,
