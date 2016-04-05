System.register(['js/jb', 'ui/jb-ui', 'ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_ui, jb_rx;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_1.jb.component('tab-control', {
                type: 'control',
                spritePosition: '1,1',
                params: {
                    tabs: { type: 'control[]', essential: true, flattenArray: true, dynamic: true, as: 'observable' },
                    style: { type: 'tab-control.style', dynamic: true, defaultValue: { $: 'tab-control.md' } },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: jb_ui.ctrl
            });
            jb_1.jb.type('tab-control.style');
            jb_1.jb.component('tab-control.md', {
                type: 'tab-control.style',
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            cmp.tabs = [];
                            cmp.selectedIndex = 0;
                            jb_rx.concat(context.vars.$model.tabs()).subscribe(function (comp) {
                                cmp.tabs.push({ title: comp.jb_title(context), comp: comp });
                            });
                        },
                        jbTemplate: "\n\t\t\t\t<md-content class=\"md-padding\">\n\t\t\t\t  <md-tabs [selected]=\"selectedIndex\" md-border-bottom md-autoselect>\n\t\t\t\t    <template md-tab *ngFor=\"var tab of tabs\" [label]=\"tab.title\">\n \t\t\t\t      <jb_comp [comp]=\"tab.comp\"></jb_comp>\n\t\t\t\t    </template>\n\t\t\t\t  </md-tabs>\n\t\t\t\t</md-content>\n\t\t",
                        directives: [jb_ui.jbComp]
                    };
                }
            });
        }
    }
});
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
//# sourceMappingURL=tab.js.map