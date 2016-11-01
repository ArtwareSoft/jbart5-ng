import {jb} from 'jb-core';

jb.component('picklist.native', {
  type: 'picklist.style',
  impl :{$: 'customStyle', 
    features :{$: 'field.databind' },
    template: `<div><select [ngModel]="jbModel()" (change)="jbModel($event.target.value)">
                    <option *ngFor="let option of options" [value]="option.code">{{option.text}}</option>
                 </select></div>`,
    css: `
select { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857; color: #555555; background-color: #fff; background-image: none; border: 1px solid #ccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }
select:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }
select::-moz-placeholder { color: #999; opacity: 1; }
select:-ms-input-placeholder { color: #999; }
select::-webkit-input-placeholder { color: #999; }
select::-ms-expand { border: 0; background-color: transparent; }
select[disabled], select[readonly] { background-color: #eeeeee; opacity: 1; }
    `
  }
})

jb.component('picklist.groups', {
  type: 'picklist.style',
  impl :{$: 'customStyle', 
    features :{$: 'field.databind' },
    template: `<div><select [ngModel]="jbModel()" (change)="jbModel($event.target.value)">
    <optgroup *ngFor="let group of groups" label="{{group.text}}">
	    <option *ngFor="let option of group.options" [value]="option.code">{{option.text}}</option>
    </optgroup>
    </select></div>`,
    css: `
select { display: block; width: 100%; height: 34px; padding: 6px 12px; font-size: 14px; line-height: 1.42857; color: #555555; background-color: #fff; background-image: none; border: 1px solid #ccc; border-radius: 4px; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }
select:focus { border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }
select::-moz-placeholder { color: #999; opacity: 1; }
select:-ms-input-placeholder { color: #999; }
select::-webkit-input-placeholder { color: #999; }
select::-ms-expand { border: 0; background-color: transparent; }
select[disabled], select[readonly] { background-color: #eeeeee; opacity: 1; }
    `
  }
})


