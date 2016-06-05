System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('editable-text.studio-primitive-text', {
                type: 'editable-text.style',
                impl: { $: 'customStyle',
                    features: { $: 'editable-text.bindField' },
                    template: "<div><input %$field.modelExp%></div>",
                    css: "\ninput { display: block; width: 145px; height: 16px; padding-left: 2px;\n\tfont-size: 12px; color: #555555; background-color: #fff; \n\tborder: 1px solid #ccc; border-radius: 4px;\n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); \n\ttransition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; \n}\ninput:focus { border-color: #66afe9; outline: 0; \n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\ninput::placeholder { color: #999; opacity: 1; }\ninput[disabled], input[readonly] { background-color: #eeeeee; opacity: 1; }\n\t  \tinput.focused {width: 300px; transition: width: 1s}"
                }
            });
            jb_core_1.jb.component('property-sheet.studio-properties', {
                type: 'group.style',
                impl: { $: 'customStyle',
                    features: { $: 'group.initGroup' },
                    methods: {
                        afterViewInit: function (ctx) { return function (cmp) {
                            return jb_core_1.jb.delay(1).then(function () {
                                return $(cmp.elementRef.nativeElement).find('input,select')
                                    .focus(function (e) {
                                    $(e.target).parents().filter('.property').siblings().find('input').removeClass('focused');
                                    $(e.target).addClass('focused');
                                });
                            });
                        }; }
                    },
                    template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\">{{ctrl.comp.jb_title()}}</label>\n        <div class=\"input-and-toolbar\">\n          <jb_comp [comp]=\"ctrl.comp\"></jb_comp>\n          <jb_comp [comp]=\"ctrl.comp.jb_toolbar\" class=\"toolbar\"></jb_comp>\n        </div>\n      </div>\n      </div>\n    ",
                    css: ".property { margin-bottom: 5px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .input-and-toolbar { display: flex; margin-right:0;  }\n      .property>.property-title {\n        min-width: 90px;\n        width: 90px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: 10px;\n      },\n      .property>*:last-child { margin-right:0 }"
                }
            });
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
            jb_core_1.jb.component('editable-boolean.studio-expand-collapse-in-toolbar', {
                type: 'editable-boolean.style',
                impl: { $: 'customStyle',
                    template: "<span><button md-icon-button md-button (click)=\"toggle()\" title=\"{{yesNo ? 'collapse' : 'expand'}}\">\n      \t<i class=\"material-icons\">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      \t</button></span>",
                    css: "button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}\n     \t.material-icons { font-size:12px;  }\n      ",
                    methods: {
                        afterViewInit: function (ctx) { return function (cmp) { return cmp.bindViaSettings(); }; }
                    }
                }
            });
        }
    }
});
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
