import {jb} from 'js/jb';
import * as jb_ui from 'ui/jb-ui';
import * as studio from './studio-model';

jbart.dialogsParent = function() {
	return $('#jb-inspector-top')[0] || $('<div id="jb-inspector-top" />').appendTo('body')[0];
}

jbart.studio = jbart.studio || {}

jb.resource('studio','DragScriptEm',{ $: 'rx.subject' })
jb.resource('studio','ModifyScriptEm',{ $: 'rx.subject' , unique: false })
jb.resource('studio','UrlPathEm',{ $: 'rx.urlPath', base: 'studio', zoneId: 'studio.all', 
	params: [ 'project', 'page', 'profile_path' ] , databind: '{%$globals%}' } )
//jb.resource('studio','PageEm',{ $: 'studio.pageEm' })

jb.component('studio.all', {
	type: 'control',
	impl: {
		$: 'group', cssClass: 'studio-top-bar',
	    features :{$: 'group.watch', data: '%$globals/project%' }, 
	    controls: [
			{ $: 'group', cssClass: 'studio-top-menu',  controls: [
				  { $: 'label', cssClass: 'studio-widget-name',
					title: ['{%$globals/project%}', { $: 'replace', find: '_', replace: ' ' }],
				  },
				  { $: 'studio.mainMenu' }
		      ],
			},
			{ $: 'studio.toolbar' },
			{ $: 'group', cssClass: 'studio-jbart-logo',
			  	controls :{$: 'image', url: '/jbart/projects/studio/css/favicon.png' }
			},
			{ $: 'group', cssClass: 'studio-widget-placeholder', 
				controls :{$: 'studio.renderWidget' , cssClass: 'studio-widget-placeholder'},
			},
			{ $: 'group', title: 'pages', cssClass: 'studio-footer', 
				controls :{$: 'itemlist', 
					items :{$: 'studio.projectPages' }, 
					cssClass: 'studio-pages',
					features :{$: 'itemlist.selection', 
							autoSelectFirst: true, 
							databind: '%$globals/page%',
							onSelection :{$: 'onNextTimer',
								action :{$: 'writeValue', to: '%$globals/profile_path%', value: '{%$globals/project%}.{%$globals/page%}' }
							}
					},
					controls :{$: 'label', 
						title :{$: 'extractSuffix', separator: '.' },
						cssClass: 'studio-page', 
					}
				},
				features :{$: 'wait', 
					for :{$: 'studio.waitForPreviewIframe' }, 
					loadingControl :{$label: '...' } 
				}
			}
		]
	}
})

// 	cssClass1: 'studio-top-bar',
// 	    features :{$databind: '{%$globals/project%}' }, 
// 	    controls: [
// 			{ $: 'group', cssClass: 'studio-top-menu',  controls: [
// 				  { $: 'label', cssClass: 'studio-widget-name',
// 					title: ['{%$globals/project%}', { $: 'replace', find: '_', replace: ' ' }],
// 				  },
// 				  { $: 'studio.mainMenu' }
// 		      ]
// 			},
// 			{ $: 'studio.toolbar' },
// 			{ $: 'group', cssClass: 'studio-jbart-logo',
// 			  	controls :{$: 'image', url: '/jbart/projects/studio/css/favicon.png' }
// 			},
// 		]
// 	}
// })

jb.component('studio.logo',{
	params: {
		zoom: { as: 'number', defaultValue: 20}
	},
	impl: (ctx,zoom) =>	jb_ui.Comp( { templte: `<div style="position:relative;width1:600px;padding: 30px 40px 30px 100px;background-color: #327DC8;zoom: ${zoom}%;">
		<span style="position: absolute;margin-top:20px;margin-left:50px; color: white; font-size: 127px; font-family: Times New Roman, Times, serif">jB</span>
		<span style="position: absolute;margin-top:32px;margin-left:240px; color: white; font-size: 110px; font-family: Arial, Helvetica, sans-serif" >art</span>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="215px" height="228px" viewBox="0 0 215 228" preserveAspectRatio="xMidYMid meet" zoomAndPan="disable" xmlns:svg="http://www.w3.org/2000/svg">
		<polygon points="106 0 0   38 17  178 106 228" fill="#DE3641" ></polygon>
		<polygon points="106 0 215 38 198 178 106 228" fill="#B13138" ></polygon>
		</svg>
		</div>`
		},ctx)
})

jb.component('studio.projectPages',{
	type: 'data',
	impl: function(context) {
		var projectName = context.str('{%$globals/project%}');
		if (!jbart.previewjbart) return [];
		var out = [];
		for(var i in jbart.previewjbart.comps)
			if (i.indexOf(projectName+'.') == 0 && jbart.previewjbart.comps[i].type == 'control')
				out.push(i.split(projectName+'.')[1]);

		return out;
	}
})

jb.component('studio.renderWidget',{
	type: 'control',
	impl: ctx => jb_ui.Comp({
			template: `<iframe id="jb-preview" frameborder="0" src="/project/{{project}}"></iframe>`,
			init: function(cmp) {
				cmp.project = ctx.str('%$globals/project%');
				if (!cmp.project) debugger;
				var iframe = cmp.elementRef.nativeElement.firstElementChild;
				window.jb_studio_window = true; // let studio widgets run in a special mode
				waitForIframeLoad(iframe).then(function() {
					var w = iframe.contentWindow;
					w.jbart.studioGlobals = ctx.run('{%$globals%}');
					jbart.previewWindow = w;
					jbart.previewjbart = w.jbart;
					jbart.preview_jbart_widgets = w.jbart_widgets;
	
					// forward the studio zone to the preview widget so it will be updated
					jb_ui.getZone('studio.all').then(zone=> {
						zone.onStable.subscribe(function(){
							w.jbart.studioGlobals = ctx.run('{%$globals%}');
							w.setTimeout(()=>{},1); // refresh inner jBart
							//w.ngZone.run(()=> {})
						});
					})
					jb.trigger(jbart, 'preview_loaded');
				})
			}
		},ctx)
})

function waitForIframeLoad(iframe) {
	if (!iframe)
		debugger;
	return new Promise((resolve,fail)=> {
		var counter = 300;
		var intervalID = setInterval(function() {
			if (jb.path(iframe,['contentWindow','jbart','widgetLoaded'])) {
				window.clearInterval(intervalID);
				resolve();
			}
			if (--counter <= 0) {
				window.clearInterval(intervalID);
				fail();
			}
		}, 100);	
	})
}

jb.component('studio.waitForPreviewIframe',{
	type:'action',
	impl: function(context) {
		if (jbart.previewjbart) return;
		return new Promise(resolve => jb.bind(jbart, 'preview_loaded', resolve, 'waitForPreviewIframe'))
	}
})

jb.component('studio.currentProfileRef', {
	impl :{$: 'studio.ref',
		path :{$firstSucceeding: ['{%$globals/profile_path%}','{%$globals/page%}'] } 
	}
})


jb.component('studio.short-title',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.shortTitle(path)
})

jb.component('studio.ref',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.profileRefFromPath(path)
});

jb.component('studio.val',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.val(path)
})

jb.component('studio.short-title',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.shortTitle(path)
})

jb.component('studio.non-control-children',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.children(path,'non-control')
})

jb.component('studio.compName',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.compName(path) || ''
})

jb.component('studio.enum-options',{
	params: { path: { as: 'string' } },
	impl: (context,path) => ((studio.model.paramDef(path) || {}).options ||'').split(',').map(x=>{return {code:x,text:x}})
})

jb.component('studio.prop-name',{
	params: { path: { as: 'string' } },
	impl: (context,path) => path.split('~').pop()
})

jb.component('studio.compName-ref',{
	params: { path: { as: 'string' } },
	impl: (context,path) => { return {
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return studio.model.compName(path);
				else
					studio.model.modify(studio.model.writeValue, path, { value: { $: value } },context)
			}
		}	
	}
})

jb.component('studio.insertComp',{
	params: { 
		path: { as: 'string' },
		comp: { as: 'string' },
	},
	impl: (context,path,comp) => studio.model.modify(studio.model.push, path, {val: { $: comp }} , context)
})

jb.component('studio.delete',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.modify(studio.model._delete,path,{},context)
})

jb.component('studio.makeLocal',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.modify(studio.model.makeLocal,path,{},context)
})

jb.component('studio.projectSource',{
	params: { 
		project: { as: 'string', defaultValue: '%$globals/project%' } 
	},
	impl: (context,project) => {
		if (!project) return;
		var comps = jb.entries(studio.jbart_base().comps).map(x=>x[0]).filter(x=>x.indexOf(project) == 0);
		return comps.map(comp=>studio.comp_asStr(comp)).join('\n\n')
	}
})

jb.component('studio.compSource',{
	params: { 
		comp: { as: 'string', defaultValue: '%$globals/profile_path%' } 
	},
	impl: (context,comp) => 
		studio.comp_asStr(comp.split('~')[0])
})

jb.component('studio.isCustomStyle',{
	params: { path: { as: 'string' } },
	impl: (context,path) => { 
		return (studio.model.compName(path) || '').indexOf('custom') == 0 
	}
})


