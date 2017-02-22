System.register(['jb-core', './studio-tgp-model', './studio-path', '@angular/platform-browser', '@angular/core', './studio-utils'], function(exports_1, context_1) {
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
    var jb_core_1, studio_tgp_model_1, studio_path_1, platform_browser_1, core_1, studio_utils_1;
    var previewRefreshCounter, modifiedCtrlsEm;
    function studioAutoRefreshComp(jbComp) {
        jbComp.ngZone.runOutsideAngular(function () {
            modifiedCtrlsEm
                .flatMap(function (e) {
                var comp = jbComp._comp;
                if (comp && [comp.callerPath, comp.ctx && comp.ctx.path].indexOf(e.path) != -1) {
                    //            jb_native_delay(100).then(() => {// highlight on delay
                    var elemToHighlight = $(jbComp.elementRef.nativeElement.parentElement);
                    elemToHighlight.addClass('jb-highlight-comp-changed');
                    //            });
                    if (studio_path_1.profileFromPath) {
                        var prof = studio_path_1.profileFromPath(e.path);
                        var ctxToRun = comp.ctx.ctx({ profile: prof, comp: e.path, path: '' });
                        var comp = ctxToRun.runItself();
                        return [comp];
                    }
                }
                return [];
            })
                .catch(function (e) {
                return jb_logException(e);
            })
                .takeUntil(jbComp.destroyNotifier.toPromise())
                .subscribe(function (comp) {
                if (comp != jbComp._comp) {
                    jbComp.draw(comp);
                    studio_utils_1.studioActivityEm.next((exports_1("previewRefreshCounter", ++previewRefreshCounter) - 1)); // refresh preview
                }
            });
        });
    }
    function studioAutoRefreshWidget(widget) {
        widget.ngZone.runOutsideAngular(function () {
            var counterChange = studio_utils_1.studioActivityEm.map(function (x) { return previewRefreshCounter; }).distinctUntilChanged();
            var compIdEm = studio_utils_1.studioActivityEm
                .startWith(1)
                .map(function () {
                return widget.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page;
            })
                .distinctUntilChanged()
                .merge(counterChange)
                .catch(function (e) {
                return jb_logException(e);
            })
                .subscribe(function () {
                return widget.draw();
            });
        });
    }
    function renderWidget(ctx) {
        var previewIframe = (function () {
            function previewIframe(sanitizer, elementRef) {
                this.sanitizer = sanitizer;
                this.elementRef = elementRef;
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
                });
            };
            previewIframe = __decorate([
                core_1.Component({
                    selector: 'preview_iframe',
                    template: "<iframe sandbox=\"allow-same-origin allow-forms allow-scripts\" style=\"box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px\"\n        seamless=\"\" id=\"jb-preview\" frameborder=\"0\" [src]=\"project_url\"></iframe>",
                }), 
                __metadata('design:paramtypes', [platform_browser_1.DomSanitizer, core_1.ElementRef])
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
            function (studio_tgp_model_1_1) {
                studio_tgp_model_1 = studio_tgp_model_1_1;
            },
            function (studio_path_1_1) {
                studio_path_1 = studio_path_1_1;
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
            exports_1("previewRefreshCounter", previewRefreshCounter = 0);
            modifiedCtrlsEm = studio_utils_1.modifyOperationsEm.flatMap(function (x) {
                var path_parts = x.path.split('~');
                var sub_paths = path_parts.map(function (e, i) {
                    return path_parts.slice(0, i + 1).join('~');
                }).reverse();
                var firstCtrl = sub_paths
                    .filter(function (p) {
                    return studio_tgp_model_1.model.isCompNameOfType(jb_core_1.jb.compName(studio_path_1.profileFromPath(p)), 'control');
                })[0];
                return firstCtrl ? [{ path: firstCtrl, ngPath: x.ngPath }] : [];
            });
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
                    return jb_waitFor(function () { return jbart.previewjbart; });
                }
            });
            jb_core_1.jb.component('studio.refresh-preview', {
                type: 'action',
                impl: function () {
                    return studio_utils_1.studioActivityEm.next((exports_1("previewRefreshCounter", ++previewRefreshCounter) - 1));
                }
            });
        }
    }
});
