import {jb} from 'jb-core';

jb.component('editable-text.studio-primitive-text',{
  type: 'editable-text.style',
  impl :{$: 'customStyle', 
      features :{$: 'editable-text.bindField' },
      template: `<div><input %$field.modelExp%></div>`,
	  css: `
input { display: block; width: 145px; height: 16px; padding-left: 2px;
	font-size: 12px; color: #555555; background-color: #fff; 
	border: 1px solid #ccc; border-radius: 4px;
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); 
	transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; 
}
input:focus { border-color: #66afe9; outline: 0; 
	box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }
input::placeholder { color: #999; opacity: 1; }
input[disabled], input[readonly] { background-color: #eeeeee; opacity: 1; }
	  	input.focused {width: 300px; transition: width: 1s}`
	}
})


jb.component('property-sheet.studio-properties', {
  type: 'group.style',
  impl :{$: 'customStyle',
    features :{$: 'group.initGroup' },
    methods: {
        afterViewInit: ctx => cmp =>
          jb.delay(1).then(() =>
            $(cmp.elementRef.nativeElement).find('input,select')
              .focus(e=> {
              	$(e.target).parents().filter('.property').siblings().find('input').removeClass('focused');
              	$(e.target).addClass('focused');
              })
          )
    },

  	template: `<div>
      <div *ngFor="let ctrl of ctrls" class="property">
        <label class="property-title">{{ctrl.comp.jb_title()}}</label>
        <div class="input-and-toolbar">
          <jb_comp [comp]="ctrl.comp"></jb_comp>
          <jb_comp [comp]="ctrl.comp.jb_toolbar" class="toolbar"></jb_comp>
        </div>
      </div>
      </div>
    `,
    css: `.property { margin-bottom: 5px; display: flex }
      .property:last-child { margin-bottom:0px }
      .input-and-toolbar { display: flex; margin-right:0;  }
      .property>.property-title {
        min-width: 90px;
        width: 90px;
        overflow:hidden;
        text-overflow:ellipsis;
        vertical-align:top;
        margin-top:2px;
        font-size:14px;
        margin-right: 10px;
      },
      .property>*:last-child { margin-right:0 }`
  }
})

// jb.component('button.studio-properties-toolbar', {
//   type: 'button.style',
//   params: {
//     icon: { as: 'string', default: 'code' },
//   },
//   impl :{$: 'customStyle', 
//       template: `<span><button md-icon-button md-button aria-label="%$aria%" (click)="clicked()" title="{{title}}" tabIndex="-1">
//                 <i class="material-icons">%$icon%</i>
//               </button></span>`,
//       css: `button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}
//      	.material-icons { font-size:12px;  }
//       `
//   }
// })

jb.component('editable-boolean.studio-expand-collapse-in-toolbar', {
  type: 'editable-boolean.style',
  impl :{$: 'customStyle',
      template: `<span><button md-icon-button md-button (click)="toggle()" title="{{yesNo ? 'collapse' : 'expand'}}">
      	<i class="material-icons">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>
      	</button></span>`,
      css: `button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}
     	.material-icons { font-size:12px;  }
      `,
      methods: {
        afterViewInit: ctx => cmp => cmp.bindViaSettings()
      }
   }
})

// jb.component('button.studio-edit-js', {
//   type: 'button.style',
//   impl :{$: 'customStyle',  
//   	template: '<span><button (click)="clicked()" [title]="title">{}</button></span>',
//   	css: `{ margin-top: -2px; margin-left: -3px; margin-right: -5px;}
//   		 button { cursor: pointer; 
//             font: 12px sans-serif; 
//             border: none; 
//             background: transparent; 
//             color: #91B193; 
//             text-shadow: 0 1px 0 #fff; 
//             font-weight: 700; 
//             opacity: .8;
//         }
//         button:hover { opacity: 1 }`
//   }
// })

// jb.component('button.studio-delete', {
//   type: 'button.style',
//   impl :{$: 'customStyle',  
//       template: '<span><button (click)="clicked()" [title]="title">&#215;</button></span>',
//       css: `{ margin-left: -4px; margin-top: -1px }
//       button {
//             cursor: pointer; 
//             font: 16px sans-serif; 
//             border: none; 
//             background: transparent; 
//             color: #000; 
//             text-shadow: 0 1px 0 #fff; 
//             font-weight: 700; 
//             opacity: .2;
//         }
//         button:hover { opacity: .5 }`
//   }
// })
