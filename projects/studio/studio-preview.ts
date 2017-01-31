import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model} from './studio-tgp-model';
import {profileFromPath} from './studio-path';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NgModule, Component, ElementRef } from '@angular/core';
import {modifyOperationsEm,studioActivityEm} from './studio-utils';

export var previewRefreshCounter = 0;

var modifiedCtrlsEm = modifyOperationsEm.flatMap(x=>{
    var path_parts = x.path.split('~');
    var sub_paths = path_parts.map((e,i)=>
      path_parts.slice(0,i+1).join('~')).reverse();
    var firstCtrl = sub_paths
      .filter(p=>
        model.isCompNameOfType(jb.compName(profileFromPath(p)),'control'))
      [0];
     return firstCtrl ? [{ path: firstCtrl, ngPath: x.ngPath}] : [];
})


function studioAutoRefreshComp(jbComp) {
    modifiedCtrlsEm
//      .takeUntil(jbComp.destroyNotifier)
      .flatMap(e=> {
        var comp = jbComp._comp;
        if (comp && [comp.callerPath, comp.ctx && comp.ctx.path].indexOf(e.path) != -1) {
            jb_native_delay(100).then(() => {// highlight on delay
               var elemToHighlight = $(jbComp.elementRef.nativeElement).children().first();
               elemToHighlight.addClass('jb-highlight-comp-changed')
            });

            if (profileFromPath) {
              var prof = profileFromPath(e.path);
              var ctxToRun = comp.ctx.ctx({profile: prof, comp: e.path,path:''});
              var comp = ctxToRun.runItself();
              return [comp];
            }
          }
          return [];
      })
      .catch(e =>
            jb_logException(e))
      .subscribe(comp=> {
          if (comp != jbComp._comp) 
            jbComp.draw(comp);
           //applyPreview(comp.ctx);
      })
}

function studioAutoRefreshWidget(widget) {
    var counterChange = studioActivityEm.map(x=>previewRefreshCounter).distinctUntilChanged();

    var compIdEm = studioActivityEm
      .merge(counterChange)
      .startWith(1)
      .map(()=>
          widget.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page)
      .distinctUntilChanged()
      .catch(e =>
            jb_logException(e))
      .subscribe(()=>
          widget.draw())
}

function renderWidget(ctx) {
  @Component({
    selector: 'preview_iframe',
    template: `<iframe sandbox="allow-same-origin allow-forms allow-scripts" style="box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px"
        seamless="" id="jb-preview" frameborder="0" [src]="project_url"></iframe>`,
  })
  class previewIframe { 
      url: SafeResourceUrl;
      constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef) {}
      ngOnInit() {
        var cmp = this;
        cmp.project = ctx.exp('%$globals/project%');
        cmp.project_url = cmp.sanitizer.bypassSecurityTrustResourceUrl('/project/'+cmp.project+ '?cacheKiller='+(''+Math.random()).slice(10));
        if (!cmp.project) debugger;
        var iframe = cmp.elementRef.nativeElement.firstElementChild;
        window.jb_studio_window = true; // let studio widgets run in a special mode
        jb_waitFor(()=>jb.path(iframe,['contentWindow','jbart','widgetLoaded'])).then(_ => {
          var w = iframe.contentWindow;
          jbart.studioGlobals = w.jbart.studioGlobals = ctx.exp('%$globals%');
          w.jbart.studioWindow = window;
          w.jbart.studioAutoRefreshComp = studioAutoRefreshComp;
          w.jbart.studioAutoRefreshWidget = studioAutoRefreshWidget;

          jbart.previewWindow = w;
          jbart.previewjbart = w.jbart;
          jbart.preview_jbart_widgets = w.jbart_widgets;
          document.title = cmp.project + ' with jBart';
          
          // forward the studio zone to the preview widget so it will be updated
          // jb_ui.getZone('studio.all').then(zone=> {
          //   zone.onStable.subscribe(()=>{
          //     w.jbart.studioGlobals = ctx.exp('{%$globals%}');
          //     studioActivityEm.next();
          //     //console.log('studio.all stable');
          //     // refresh preview
          //     jb.entries(w.jbart.zones).forEach(x=>x[1].run(()=>{}));
          //     //w.setTimeout(()=>{},1); 
          //   });
          // })
        })
      }
  }

  @NgModule({
    imports: [],
    declarations: [ previewIframe],
    exports: [ previewIframe],
  })
  class previewIframeModule { }

  return ctx.run({$: 'control', 
    style :{$: 'customStyle',
      template: '<preview_iframe></preview_iframe>',
      imports: previewIframeModule,
      noTemplateParsing: true
    }
  })
}


jb.component('studio.renderWidget', {
  type: 'control',
  impl : ctx => renderWidget(ctx)
})

jb.component('studio.setPreviewSize', {
	type: 'action',
	params: [
		{ id: 'width', as: 'number'},
		{ id: 'height', as: 'number'},
	],
	impl: (ctx,width,height) => {
		if (width)
			$('#jb-preview').width(width);
		if (height)
			$('#jb-preview').height(height);
	}
})

jb.component('studio.waitForPreviewIframe',{
	type:'action',
	impl: ctx =>
    jb_waitFor(()=> jbart.previewjbart)
})

jb.component('studio.refresh-preview', {
  type: 'action',
  impl: () =>
    studioActivityEm.next(previewRefreshCounter++)
})
