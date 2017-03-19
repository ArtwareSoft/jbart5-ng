System.register(['jb-core', '@angular/platform-browser', '@angular/core', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var jb_core_1, platform_browser_1, core_1, studio_utils_1;
    var previewRefreshCounter;
    function studioAutoRefreshWidget(widget) {
        widget.ngZone.runOutsideAngular(function () {
            var counterOrPageChange = jbart.studioNgZone.onStable
                .do(function (x) {
                if (jbart.previewjbart)
                    jbart.previewjbart.lastStudioActivity = new Date().getTime();
            })
                .map(function (x) {
                widget.compId = jbart.studioGlobals.project + '.' + (jbart.studioGlobals.page || 'main');
                return widget.compId + ';' + previewRefreshCounter;
            }).distinctUntilChanged();
            studio_utils_1.modifyOperationsEm.merge(counterOrPageChange).subscribe(function () {
                return widget.draw();
            });
        });
    }
    function renderWidget(ctx) {
        var previewIframe = (function () {
            function previewIframe(sanitizer, elementRef, ngZone) {
                this.sanitizer = sanitizer;
                this.elementRef = elementRef;
                this.ngZone = ngZone;
            }
            previewIframe.prototype.ngOnInit = function () {
                var cmp = this;
                cmp.project = ctx.exp('%$globals/project%');
                cmp.project_url = cmp.sanitizer.bypassSecurityTrustResourceUrl('/project/' + cmp.project + '?cacheKiller=' + ('' + Math.random()).slice(10));
                if (!cmp.project)
                    debugger;
                var iframe = cmp.elementRef.nativeElement.firstElementChild;
                window.jb_studio_window = true; // let studio widgets run in a special mode
                jb_waitFor(function () { return jb_core_1.jb.path(iframe, ['contentWindow', 'jbart', 'widgetLoaded']); }).then(function (_) {
                    var w = iframe.contentWindow;
                    jbart.studioGlobals = w.jbart.studioGlobals = ctx.exp('%$globals%');
                    w.jbart.studioWindow = window;
                    jbart.studioNgZone = cmp.ngZone;
                    w.jbart.studioAutoRefreshWidget = studioAutoRefreshWidget;
                    jbart.previewWindow = w;
                    jbart.previewjbart = w.jbart;
                    jbart.preview_jbart_widgets = w.jbart_widgets;
                    document.title = cmp.project + ' with jBart';
                });
            };
            previewIframe = __decorate([
                core_1.Component({
                    selector: 'preview_iframe',
                    template: "<iframe sandbox=\"allow-same-origin allow-forms allow-scripts\" style=\"box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px\"\n        seamless=\"\" id=\"jb-preview\" frameborder=\"0\" [src]=\"project_url\"></iframe>",
                }), 
                __metadata('design:paramtypes', [platform_browser_1.DomSanitizer, core_1.ElementRef, core_1.NgZone])
            ], previewIframe);
            return previewIframe;
        }());
        var previewIframeModule = (function () {
            function previewIframeModule() {
            }
            previewIframeModule = __decorate([
                core_1.NgModule({
                    imports: [],
                    declarations: [previewIframe],
                    exports: [previewIframe],
                }), 
                __metadata('design:paramtypes', [])
            ], previewIframeModule);
            return previewIframeModule;
        }());
        return ctx.run({ $: 'control',
            style: { $: 'customStyle',
                template: '<preview_iframe></preview_iframe>',
                imports: previewIframeModule,
                noTemplateParsing: true
            }
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            previewRefreshCounter = 0;
            jb_core_1.jb.component('studio.renderWidget', {
                type: 'control',
                impl: function (ctx) { return renderWidget(ctx); }
            });
            jb_core_1.jb.component('studio.setPreviewSize', {
                type: 'action',
                params: [
                    { id: 'width', as: 'number' },
                    { id: 'height', as: 'number' },
                ],
                impl: function (ctx, width, height) {
                    if (width)
                        $('#jb-preview').width(width);
                    if (height)
                        $('#jb-preview').height(height);
                }
            });
            jb_core_1.jb.component('studio.waitForPreviewIframe', {
                type: 'action',
                impl: function (ctx) {
                    return jb_waitFor(function () {
                        return jbart.previewjbart;
                    });
                }
            });
            jb_core_1.jb.component('studio.refresh-preview', {
                type: 'action',
                impl: function (_) {
                    return previewRefreshCounter++;
                }
            });
        }
    }
});
