System.register(['jb-core', 'jb-ui'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            }],
        execute: function() {
            jb_core_1.jb.component('tab-control', {
                type: 'control',
                params: {
                    tabs: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
                    style: { type: 'tab-control.style', dynamic: true, defaultValue: { $: 'tab-control.simple' } },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context) {
                    return jb_ui.ctrl(context).jbExtend({
                        beforeInit: function (cmp) {
                            cmp.empty = jb_ui.Comp({ template: '<div></div>' }, context);
                            cmp.selectedTab = 0;
                            cmp.selectedTabContent = function () {
                                return [cmp.comps[cmp.selectedTab] || cmp.empty];
                            };
                            cmp.initTabs = function () {
                                var cmpEmitterFunc = jb_ui.controlsToGroupEmitter(context.params.tabs, cmp);
                                cmpEmitterFunc(cmp.ctx).subscribe(function (comps) {
                                    cmp.comps = comps;
                                    cmp.titles = comps.map(function (comp) {
                                        return comp.jb_title ? comp.jb_title() : '';
                                    });
                                });
                            };
                        },
                        directives: [jb_ui.jbComp]
                    });
                }
            });
            jb_core_1.jb.component('tab.initTabs', {
                type: 'feature',
                impl: function (ctx) {
                    return ({ init: function (cmp) { return cmp.initTabs(); } });
                }
            });
            jb_core_1.jb.type('tab-control.style');
            jb_core_1.jb.component('tab-control.simple', {
                type: 'tab-control.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-tab\">\n\t    \t<div class=\"tab-titles\">\n\t    \t\t<button *ngFor=\"let title of titles; let i = index\" md-button (click)=\"selectedTab = i\" [ngClass]=\"{'selected': i==selectedTab}\">{{title}}</button>\n\t        </div>\n\t        <jb_comp *ngFor=\"let comp of selectedTabContent()\" [comp]=\"comp\" [flatten]=\"true\"></jb_comp>\n\t      </div>",
                    css: ".selected { border-bottom: 1px solid black }",
                    features: { $: 'tab.initTabs' },
                }
            });
        }
    }
});
// jb.component('tab-control.md', {
// 	type: 'tab-control.style',
// 	impl: function(context) { return {
// 		init: function(cmp) {
// 			cmp.tabs = [];
// 			cmp.selectedIndex = 0;
// 			jb_rx.concat(context.vars.$model.tabs()).subscribe(comp=> {
// 					cmp.tabs.push(	{ title: comp.jb_title(context), comp: comp	})
// 			})
// 		},
// 		jbTemplate: `
// 				<md-content class="md-padding">
// 				  <md-tabs [selected]="selectedIndex" md-border-bottom md-autoselect>
// 				    <template md-tab *ngFor="let tab of tabs" [label]="tab.title">
//  				      <jb_comp [comp]="tab.comp"></jb_comp>
// 				    </template>
// 				  </md-tabs>
// 				</md-content>
// 		`,
// 		directives: [jb_ui.jbComp]
// 	} }
// })
// jb.component('tab-control.accordion',{
// 	type: 'tab-control.style',
// 	impl :{$: 'group', 
// 		cssClass: 'jb-accordion',
// 		controls: ctx => jb_rx.concat(ctx.vars.$model.tabs()),
// 		style :{$: 'group-expandable-subgroups' } 
// 	}
// }) 
