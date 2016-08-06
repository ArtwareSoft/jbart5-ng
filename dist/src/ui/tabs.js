System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_ui, jb_rx;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            jb_core_1.jb.component('tabs', {
                type: 'control',
                params: {
                    tabs: { type: 'control[]', essential: true, flattenArray: true, dynamic: true },
                    style: { type: 'tabs.style', dynamic: true, defaultValue: { $: 'tabs.simple' } },
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
                                (cmp.jbGroupChildrenEm || jb_rx.Observable.of(context.params.tabs(cmp.ctx)))
                                    .merge(cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
                                    .subscribe(function (comps) {
                                    cmp.comps = comps;
                                    cmp.jb_disposable && cmp.jb_disposable.forEach(function (d) { return d(); });
                                    cmp.titles = comps.map(function (comp) {
                                        return comp.jb_title ? comp.jb_title() : '';
                                    });
                                });
                            };
                        }
                    });
                }
            });
            jb_core_1.jb.component('tabs.initTabs', {
                type: 'feature',
                impl: function (ctx) {
                    return ({ init: function (cmp) { return cmp.initTabs(); } });
                }
            });
            jb_core_1.jb.type('tabs.style');
            jb_core_1.jb.component('tabs.simple', {
                type: 'tabs.style',
                impl: { $: 'customStyle',
                    template: "<div class=\"jb-tab\">\n\t    \t<div class=\"tab-titles\">\n\t    \t\t<button *ngFor=\"let title of titles; let i = index\" md-button (click)=\"selectedTab = i\" [ngClass]=\"{'selected': i==selectedTab}\">{{title}}</button>\n\t        </div>\n\t        <jb_comp *ngFor=\"let comp of selectedTabContent()\" [comp]=\"comp\"></jb_comp>\n\t      </div>",
                    css: ".selected { border-bottom: 1px solid black }",
                    features: { $: 'tabs.initTabs' },
                }
            });
        }
    }
});
// jb.component('tabs.accordion',{
// 	type: 'tabs.style',
// 	impl :{$: 'group', 
// 		cssClass: 'jb-accordion',
// 		controls: ctx => jb_rx.concat(ctx.vars.$model.tabs()),
// 		style :{$: 'group-expandable-subgroups' } 
// 	}
// }) 
