import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import {model} from './studio-tgp-model';
import {profileFromPath} from './studio-path';

import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NgModule, Component, ElementRef, NgZone } from '@angular/core';
import {modifyOperationsEm} from './studio-utils';

var previewRefreshCounter = 0;

function studioAutoRefreshWidget(widget) {
  widget.ngZone.runOutsideAngular(() => {
    var counterOrPageChange = jbart.studioNgZone.onStable
      .do(x=>{
        if (jbart.previewjbart) 
          jbart.previewjbart.lastStudioActivity = new Date().getTime() })
      .map(x=>{
        widget.compId = jbart.studioGlobals.project + '.' + (jbart.studioGlobals.page || 'main');
        return widget.compId + ';' + previewRefreshCounter
      }).distinctUntilChanged();
        
    modifyOperationsEm.merge(counterOrPageChange).subscribe(()=>
          widget.draw())
  })
}

function renderWidget(ctx) {
  @Component({
    selector: 'preview_iframe',
    template: `<iframe sandbox="allow-same-origin allow-forms allow-scripts" style="box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px"
        seamless="" id="jb-preview" frameborder="0" [src]="project_url"></iframe>`,
  })
  class previewIframe { 
      url: SafeResourceUrl;
      constructor(private sanitizer: DomSanitizer, private elementRef: ElementRef, private ngZone: NgZone) {}
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
          jbart.studioNgZone = cmp.ngZone;
          w.jbart.studioAutoRefreshWidget = studioAutoRefreshWidget;

          jbart.previewWindow = w;
          jbart.previewjbart = w.jbart;
          jbart.preview_jbart_widgets = w.jbart_widgets;
          document.title = cmp.project + ' with jBart';
         
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
    jb_waitFor(()=> 
      jbart.previewjbart)
})

jb.component('studio.refresh-preview', {
  type: 'action',
  impl: _ =>
    previewRefreshCounter++
})
