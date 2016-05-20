import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as studio from './studio-model';

jbart.studio = jbart.studio || {}

// jb.resource('studio','UrlPathEm',{$: 'rx.urlPath', base: 'studio', zoneId: 'studio.all', 
// 	params: [ 'project', 'page', 'profile_path' ] , databind: '{%$globals%}' } )

jb.component('studio.all', {
  type: 'control', 
  impl :{$: 'group', 
    style :{$: 'layout.vertical', spacing: '0' }, 
    controls: [
      {$: 'group', 
        title: 'top bar', 
        style :{$: 'layout.horizontal', spacing: '3' }, 
        controls: [
          {$: 'image', 
            url: '/projects/studio/css/logo90.png', 
            imageHeight: '90', 
            units: 'px', 
            style :{$: 'image.default' }
          }, 
          {$: 'group', 
            url: '/projects/studio/css/logo470x200.png', 
            title: 'title and menu', 
            style :{$: 'layout.vertical', spacing: '12' }, 
            controls: [
              {$: 'label', 
                title: [
                  '{%$globals/project%}', 
                  {$: 'replace', find: '_', replace: ' ' }
                ], 
                style :{$: 'label.span' }, 
                features :{$: 'css', 
                  css: '{ font: 20px Arial; margin-left: 6px; margin-top: 20px}'
                }
              }, 
              {$: 'group', 
                style :{$: 'layout.horizontal', spacing: 3 }, 
                controls: [
                  {$: 'studio.main-menu' }, 
                  {$: 'studio.toolbar' }
                ]
              }
            ], 
            features :{$: 'css', css: '{ padding-left: 18px; width: 100% }' }
          }
        ], 
        features :{$: 'css', css: '{ height: 90px; border-bottom: 1px #d9d9d9 solid}' }
      }, 
      {$: 'group', 
        cssClass: 'studio-widget-placeholder', 
        title: 'preview', 
        controls :{$: 'studio.renderWidget' }
      }, 
      {$: 'group', 
        cssClass: 'studio-footer', 
        title: 'pages', 
        controls :{$: 'itemlist', 
          items :{$: 'studio.projectPages' }, 
          controls :{$: 'label', 
            cssClass: 'studio-page', 
            title :{$: 'extractSuffix', separator: '.' }
          }, 
          features: [
            {$: 'itemlist.selection', 
              databind: '%$globals/page%', 
              onSelection :{$: 'onNextTimer', 
                action :{$: 'writeValue', 
                  to: '%$globals/profile_path%', 
                  value: '{%$globals/project%}.{%$globals/page%}'
                }
              }, 
              autoSelectFirst: true
            }, 
            {$: 'css', 
              css: `{ list-style: none; padding: 0; margin: 0; margin-left: 20px; font-family: "Arial"}
                li { list-style: none; display: inline-block; padding: 6px 10px; font-size: 12px; border: 1px solid transparent; cursor: pointer;}
                li label { cursor: inherit; }
                li.selected { background: #fff;  border: 1px solid #ccc;  border-top: 1px solid transparent; color: inherit;  }`
            }
          ]
        }, 
        features: [
          {$: 'wait', 
            for :{$: 'studio.waitForPreviewIframe' }, 
            loadingControl :{ $label: '...' }
          }, 
          {$: 'feature.afterLoad', 
            action :{
              $runActions: [
                {$: 'studio.waitForPreviewIframe' }, 
                {$: 'studio.fixProfilePath' }
              ]
            }
          }
        ]
      }
    ], 
    features : [
    	{$: 'group.watch', data: '%$globals/project%' },
    	{$: 'feature.init', 
    		action :{$: 'rx.urlPath', 
	    		base: 'studio', 
	    		zoneId: 'studio.all',
	    		params: [ 'project', 'page', 'profile_path' ], 
	    		databind: '{%$globals%}' 
    		} 
    	}
    ]
  }
})
jb.component('studio.jbart-logo',{
	type: 'control',
	impl :{$: 'custom-control', 
        template: '<div style="padding: 60px 30px 30px 30px;background-color: #327DC8;zoom: 20%;"> <span style="position: absolute;margin-top:20px;margin-left:50px; color: white; font-size: 127px; font-family: Times New Roman, Times, serif">jB</span>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="215px" height="228px" viewBox="0 0 215 228" preserveAspectRatio="xMidYMid meet" zoomAndPan="disable" xmlns:svg="http://www.w3.org/2000/svg"> <polygon points="106 0 0   38 17  178 106 228" fill="#DE3641"></polygon> <polygon points="106 0 215 38 198 178 106 228" fill="#B13138"></polygon> </svg> </div>'
    }
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
					document.title = cmp.project + ' with jBart';
	
					// forward the studio zone to the preview widget so it will be updated
					jb_ui.getZone('studio.all').then(zone=> {
						zone.onStable.subscribe(function(){
							w.jbart.studioGlobals = ctx.run('{%$globals%}');
							// refresh preview
							jb.entries(w.jbart.zones).forEach(x=>x[1].run(()=>{}));
							//w.setTimeout(()=>{},1); 
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
		return new Promise(resolve => 
			jb.bind(jbart, 'preview_loaded', resolve))
	}
})

jb.component('studio.fixProfilePath', {
	impl: ctx => {
		var path = ctx.exp('%$globals/profile_path%');
		if (!path) return;
		while (path.indexOf('~') != -1)
			path = studio.parentPath(path);
		if (path != ctx.exp('%$globals/profile_path%')) {
			jb.writeValue(ctx.exp('%$globals/profile_path%','ref'),path);
			jb_ui.apply(ctx);
		}
	}
})


jb.component('studio.currentProfilePath', {
	impl: { $firstSucceeding: ['%$globals/profile_path%', '%$globals/project%.%$globals/page%'] }
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
	impl: (context,path) => 
		studio.model.shortTitle(path)
})

jb.component('studio.non-control-children',{
	params: { path: { as: 'string' } },
	impl: (context,path) => 
		studio.model.children(path,'non-controls')
})

jb.component('studio.array-children',{
	params: { path: { as: 'string' } },
	impl: (context,path) => 
		studio.model.children(path,'array')
})

jb.component('studio.compName',{
	params: { path: { as: 'string' } },
	impl: (context,path) => studio.model.compName(path) || ''
})

jb.component('studio.enum-options',{
	params: { path: { as: 'string' } },
	impl: (context,path) => 
		((studio.model.paramDef(path) || {}).options ||'').split(',').map(x=>{return {code:x,text:x}})
})

jb.component('studio.prop-name',{
	params: { path: { as: 'string' } },
	impl: (context,path) => 
		studio.model.propName(path)
})

jb.component('studio.compName-ref',{
	params: { path: { as: 'string' } },
	impl: (context,path) => { return {
			$jb_val: function(value) {
				if (typeof value == 'undefined') 
					return studio.model.compName(path);
				else
					studio.model.modify(studio.model.setComp, path, { comp: value },context)
			}
		}	
	}
})

jb.component('studio.insertComp',{
	params: { 
		path: { as: 'string' },
		comp: { as: 'string' },
	},
	impl: (context,path,comp) => 
		studio.model.modify(studio.model.insertComp, path, { comp: comp },context)
})

jb.component('studio.wrapWithGroup',{
	params: { 
		path: { as: 'string' },
	},
	impl: (context,path) => 
		studio.model.modify(studio.model.wrapWithGroup, path, {},context)
})

jb.component('studio.duplicate',{
	params: { 
		path: { as: 'string' },
	},
	impl: (context,path) => 
		studio.model.modify(studio.model.duplicate, path, {},context)
})

jb.component('studio.newArrayItem',{
	params: { path: { as: 'string' } },
	impl: (context,path) => 
		studio.model.modify(studio.model.addArrayItem, path, {},context)
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
		return comps.map(comp=>studio.compAsStr(comp)).join('\n\n')
	}
})

jb.component('studio.compSource',{
	params: { 
		comp: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } } 
	},
	impl: (context,comp) => 
		studio.compAsStr(comp.split('~')[0])
})

jb.component('studio.isCustomStyle',{
	params: { path: { as: 'string' } },
	impl: (context,path) => { 
		return (studio.model.compName(path) || '').indexOf('custom') == 0 
	}
})


