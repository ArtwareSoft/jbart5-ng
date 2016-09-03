jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.component('tabs', {
	type: 'control',
	params: [
		{ id: 'tabs', type: 'control[]', essential: true, flattenArray: true, dynamic: true },
		{ id: 'style', type: 'tabs.style', dynamic: true, defaultValue: { $: 'tabs.simple' } },
		{ id: 'features', type: 'feature[]', dynamic: true },
	],
  impl: function(context) { 
    return jb_ui.ctrl(context).jbExtend({
      beforeInit(cmp) {
      	cmp.empty = jb_ui.Comp({ template: '<div></div>'},context);
      	cmp.selectedTab = 0;

      	cmp.selectedTabContent = () => 
      		[cmp.comps[cmp.selectedTab] || cmp.empty];

        cmp.initTabs = function() {
          (cmp.jbGroupChildrenEm || jb_rx.Observable.of(context.params.tabs(cmp.ctx)))
              .merge(cmp.jbWatchGroupChildrenEm || jb_rx.Observable.of())
              .subscribe(comps=> {
              	cmp.comps = comps;
                cmp.jb_disposable && cmp.jb_disposable.forEach(d=>d());
                cmp.titles = comps.map(comp=>
                	comp.jb_title ? comp.jb_title() : '')
              })
        }
      }
    })
  }
})

jb.component('tabs.initTabs', {
  type: 'feature',
  impl: ctx => 
    ({init: cmp => cmp.initTabs()})
})

jb.type('tabs.style');


jb.component('tabs.simple', {
	type: 'tabs.style',
  	impl :{$: 'customStyle',
	    template: `<div class="jb-tab">
	    	<div class="tab-titles">
	    		<button *ngFor="let title of titles; let i = index" md-button (click)="selectedTab = i" [ngClass]="{'selected': i==selectedTab}">{{title}}</button>
	        </div>
	        <jb_comp *ngFor="let comp of selectedTabContent()" [comp]="comp"></jb_comp>
	      </div>`,
	     css: `.selected { border-bottom: 1px solid black }`,
	    features :{$: 'tabs.initTabs'},
  	}
})

// jb.component('tabs.accordion',{
// 	type: 'tabs.style',
// 	impl :{$: 'group', 
// 		cssClass: 'jb-accordion',
// 		controls: ctx => jb_rx.concat(ctx.vars.$model.tabs()),
// 		style :{$: 'group-expandable-subgroups' } 
// 	}
// }) 

})