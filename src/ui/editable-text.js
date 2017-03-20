jb.type('editable-text.style');

jb.component('editable-text', {
  type: 'control', category: 'input:100,common:80',
  params: [
    { id: 'title', as: 'string' , dynamic: true },
    { id: 'databind', as: 'ref'},
    { id: 'updateOnBlur', as: 'boolean', type: 'boolean' },
    { id: 'style', type: 'editable-text.style', defaultValue: { $: 'editable-text.input' }, dynamic: true },
    { id: 'features', type: 'feature[]', dynamic: true },
  ],
  impl: ctx => 
    jb_ui.ctrl(ctx)
});

jb.component('editable-text.input', {
  type: 'editable-text.style',
  impl :{$: 'customStyle', 
      features :{$: 'field.databind' },
      template: `<input [ngModel]="jbModel()" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')">`,
    css: 'input {height: 16px}'
  }
})

jb.component('editable-text.textarea', {
	type: 'editable-text.style',
	impl :{$: 'customStyle', 
      features :{$: 'field.databind' },
      template: `<div><textarea [ngModel]="jbModel()" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')"></textarea></div>`,
	}
})

jb.component('editable-text.x-button', {
  type: 'feature',
  impl : ctx =>({
    templateModifier: template => 
      `<div>${template}<button class="delete" (click)="jbModel('')" style=":hover { opacity: .5 }">&#215;</button></div>`,
    css: `.delete {
          margin-left: -16px;
          float: right;
          cursor: pointer; font: 20px sans-serif; 
          border: none; background: transparent; color: #000; 
          text-shadow: 0 1px 0 #fff; opacity: .1;
      }
      { display : flex }
      .delete:hover { opacity: .5 }`
  })
})
