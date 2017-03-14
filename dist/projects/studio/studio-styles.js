jb.component('editable-text.studio-primitive-text', {
    type: 'editable-text.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<input [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\" (keyup)=\"jbModel($event.target.value,'keyup')\">",
        // [ngModel]="jbModel()" (change)="jbModel($event.target.value)" (keyup)="jbModel($event.target.value,'keyup')"
        css: "\ninput { display: block; width: 146px; height: 19px; padding-left: 2px;\n\tfont-size: 12px; color: #555555; background-color: #fff; \n\tborder: 1px solid #ccc; border-radius: 4px;\n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); \n\ttransition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; \n}\ninput:focus { border-color: #66afe9; outline: 0; \n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\ninput::placeholder { color: #999; opacity: 1; }\ninput[disabled], input[readonly] { background-color: #eeeeee; opacity: 1; }\ninput.focused {width: 300px; transition: width: 1s}"
    }
});
jb.component('button.studio-script', {
    type: 'editable-text.style',
    impl: { $: 'customStyle',
        template: '<div [title]="title" (click)="clicked()"><div class="inner-text">{{title}}</div></div>',
        css: ".inner-text {\n  white-space: nowrap; overflow-x: hidden;\n  display: inline; height: 16px; \n  padding-left: 4px; padding-top: 2px;\n  font: 12px \"arial\"; color: #555555; \n}\n\n{\n  width: 149px;\n  border: 1px solid #ccc; border-radius: 4px;\n  cursor: pointer;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); \n  background: #eee;\n  white-space: nowrap; overflow-x: hidden;\n  text-overflow: ellipsis;\n}",
    }
});
jb.component('picklist.studio-enum', {
    type: 'picklist.style',
    impl: { $: 'customStyle',
        features: { $: 'field.databind' },
        template: "<div><select [ngModel]=\"jbModel()\" (change)=\"jbModel($event.target.value)\">\n                    <option *ngFor=\"let option of options\" [value]=\"option.code\">{{option.text}}</option>\n                 </select></div>",
        css: "\nselect { display: block; padding: 0; width: 150px; font-size: 12px; height: 23px;\n\tcolor: #555555; background-color: #fff; \n\tborder: 1px solid #ccc; border-radius: 4px;\n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); \n\ttransition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; \n}\nselect:focus { border-color: #66afe9; outline: 0; \n\tbox-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\nselect::placeholder { color: #999; opacity: 1; }\nselect[disabled], select[readonly] { background-color: #eeeeee; opacity: 1; }\n    "
    }
});
jb.component('property-sheet.studio-properties', {
    type: 'group.style',
    impl: { $: 'customStyle',
        features: { $: 'group.init-group' },
        methods: {
            afterViewInit: function (ctx) {
                return function (cmp) {
                    return jb.delay(1).then(function () {
                        return $(cmp.elementRef.nativeElement).find('input,select')
                            .focus(function (e) {
                            $(e.target).parents().filter('.property').siblings().find('input').removeClass('focused');
                            $(e.target).addClass('focused');
                        });
                    });
                };
            }
        },
        template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\" \n          (mouseenter)=\"ctrl.hover=true\" (mouseleave)=\"ctrl.hover=false\">\n        <label class=\"property-title\" title=\"{{ctrl.comp.jb_title()}}\">{{ctrl.comp.jb_title()}}</label>\n        <div class=\"input-and-toolbar\">\n          <div *jbComp=\"ctrl.comp\"></div>\n          <div [hidden]=\"!ctrl.hover\" class=\"toolbar\">\n            <div *jbComp=\"ctrl.comp.jb_toolbar\"></div>\n          </div>\n        </div>\n      </div>\n      </div>\n    ",
        css: ".property { margin-bottom: 5px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .input-and-toolbar { display: flex; }\n      .toolbar { height: 16px; margin-left: 10px; margin-top: -5px; }\n      .property>.property-title {\n        min-width: 90px;\n        width: 90px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: 10px;\n        margin-left: 7px;\n      },\n      .property>*:last-child { margin-right:0 }"
    }
});
jb.component('property-sheet.studio-plain', {
    type: 'group.style',
    impl: { $: 'customStyle',
        features: { $: 'group.init-group' },
        template: "<div>\n      <div *ngFor=\"let ctrl of ctrls\" class=\"property\">\n        <label class=\"property-title\" title=\"{{ctrl.comp.jb_title()}}\">{{ctrl.comp.jb_title()}}</label>\n        <div class=\"input-and-toolbar\">\n          <div *jbComp=\"ctrl.comp\"></div>\n          <div class=\"toolbar\">\n            <div *jbComp=\"ctrl.comp.jb_toolbar\"></div>\n          </div>\n        </div>\n      </div>\n      </div>\n    ",
        css: ".property { margin-bottom: 5px; display: flex }\n      .property:last-child { margin-bottom:0px }\n      .input-and-toolbar { display: flex; }\n      .toolbar { height: 16px; margin-left: 10px }\n      .property>.property-title {\n        min-width: 90px;\n        width: 90px;\n        overflow:hidden;\n        text-overflow:ellipsis;\n        vertical-align:top;\n        margin-top:2px;\n        font-size:14px;\n        margin-right: 10px;\n        margin-left: 7px;\n      },\n      .property>*:last-child { margin-right:0 }"
    }
});
jb.component('editable-boolean.studio-expand-collapse-in-toolbar', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        template: "<div><button md-icon-button md-button (click)=\"toggle()\" title=\"{{yesNo ? 'collapse' : 'expand'}}\">\n      \t<i class=\"material-icons\">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      \t</button></div>",
        css: "button { width: 24px; height: 24px; padding: 0; margin-top: -3px;}\n     \t.material-icons { font-size:12px;  }\n      "
    }
});
jb.component('editable-boolean.studio-expand-collapse-in-array', {
    type: 'editable-boolean.style',
    impl: { $: 'customStyle',
        template: "<div><button md-icon-button md-button (click)=\"toggle()\" title=\"{{yesNo ? 'collapse' : 'expand'}}\">\n      \t<i class=\"material-icons\">{{yesNo ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}}</i>\n      \t</button></div>",
        css: "button { width: 24px; height: 24px; padding: 0; }\n     \t.material-icons { font-size:12px;  }\n      "
    }
});
// jb.component('button.studio-edit-js', {
//   type: 'button.style',
//   impl :{$: 'customStyle',  
//   	template: '<div><button (click)="clicked()" [title]="title">{}</button></div>',
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
//       template: '<div><button (click)="clicked()" [title]="title">&#215;</button></div>',
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
jb.component('dialog.studio-multiline-edit', {
    type: 'dialog.style',
    impl: { $: 'customStyle',
        template: "<div class=\"jb-dialog jb-popup\">\n\t\t\t\t\t\t\t<button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n              <div *jbComp=\"contentComp\"></div>\n\t\t\t\t\t\t</div>",
        css: "{ background: #fff; position: absolute; min-width: 280px; min-height: 200px;\n\t\t\t\t\tbox-shadow: 2px 2px 3px #d5d5d5; padding: 3px; border: 1px solid rgb(213, 213, 213)\n\t\t\t\t  }\n\t\t\t\t.dialog-close {\n\t\t\t\t\t\tposition: absolute; \n\t\t\t\t\t\tcursor: pointer; \n\t\t\t\t\t\tright: -7px; top: -22px; \n\t\t\t\t\t\tfont: 21px sans-serif; \n\t\t\t\t\t\tborder: none; \n\t\t\t\t\t\tbackground: transparent; \n\t\t\t\t\t\tcolor: #000; \n\t\t\t\t\t\ttext-shadow: 0 1px 0 #fff; \n\t\t\t\t\t\tfont-weight: 700; \n\t\t\t\t\t\topacity: .2;\n\t\t\t\t}\n\t\t\t\t.dialog-close:hover { opacity: .5 }\n\t\t\t\t",
        features: [
            { $: 'dialog-feature.maxZIndexOnClick' },
            { $: 'dialog-feature.closeWhenClickingOutside' },
            { $: 'dialog-feature.cssClassOnLaunchingControl' },
            { $: 'dialog-feature.studio-position-under-property' }
        ]
    }
});
jb.component('dialog-feature.studio-position-under-property', {
    type: 'dialog-feature',
    impl: function (context, offsetLeft, offsetTop) {
        return {
            afterViewInit: function (cmp) {
                if (!context.vars.$launchingElement)
                    return console.log('no launcher for dialog');
                var $control = context.vars.$launchingElement.$el.parents('.input-and-toolbar');
                var pos = $control.offset();
                var $jbDialog = $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-dialog');
                $jbDialog.css('left', pos.left + "px")
                    .css('top', pos.top + "px")
                    .css('display', 'block');
            }
        };
    }
});
jb.component('group.studio-properties-accordion', {
    type: 'group.style',
    impl: { $: 'customStyle',
        template: "<section class=\"jb-group\">\n      <div *ngFor=\"let ctrl of ctrls\" class=\"accordion-section\">\n        <div class=\"header\" (click)=\"toggle(ctrl)\">\n          <div class=\"title\">{{ctrl.title}}</div>\n          <div class=\"expand\" title=\"{{expand_title(ctrl)}}\">\n                <i *ngIf=\"ctrl.show\" class=\"material-icons\">keyboard_arrow_down</i>\n                <i *ngIf=\"!ctrl.show\" class=\"material-icons\">keyboard_arrow_right</i>\n          </div>\n        </div>\n        <div class=\"content\" *ngIf=\"ctrl.show\"><div *jbComp=\"ctrl.comp\"></div></div>\n      </div>\n  </section>",
        css: ".header { display: flex; flex-direction: row; }\nbutton:hover { background: none }\nbutton { margin-left: auto }\ni { color: #; cursor: pointer }\n.title { margin: 5px } \n.content { padding-top: 2px }\n.header { background: #eee; margin-bottom: 2px; display: flex; justify-content: space-between } \n",
        features: [
            { $: 'group.init-group' },
            { $: 'group.init-accordion' },
        ]
    }
});
jb.component('label.studio-message', {
    type: 'label.style',
    impl: { $: 'customStyle',
        template: '<span class="studio-message">{{title}}</span>',
        css: "span { position: absolute;\n      color: white;  padding: 20px;  background: #327DC8;\n      width: 1000px;\n      margin-top: -100px;\n      }",
        features: { $: 'label.bind-title' }
    }
});
