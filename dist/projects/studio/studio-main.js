System.register(['jb-core', 'jb-ui', './studio-model', '@angular/platform-browser', '@angular/core'], function(exports_1, context_1) {
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
    var jb_core_1, jb_ui, studio, platform_browser_1, core_1;
    function waitForIframeLoad(iframe) {
        if (!iframe)
            debugger;
        return new Promise(function (resolve, fail) {
            var counter = 300;
            var intervalID = setInterval(function () {
                if (jb_core_1.jb.path(iframe, ['contentWindow', 'jbart', 'widgetLoaded'])) {
                    window.clearInterval(intervalID);
                    resolve();
                }
                if (--counter <= 0) {
                    window.clearInterval(intervalID);
                    fail();
                }
            }, 100);
        });
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (studio_1) {
                studio = studio_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jbart.studio = jbart.studio || {};
            // jb.resource('studio','UrlPathEm',{$: 'rx.urlPath', base: 'studio', zoneId: 'studio.all', 
            // 	params: [ 'project', 'page', 'profile_path' ] , databind: '{%$globals%}' } )
            jb_core_1.jb.component('studio.all', {
                type: 'control',
                impl: { $: 'group',
                    style: { $: 'layout.vertical', spacing: '0' },
                    controls: [
                        { $: 'group',
                            title: 'top bar',
                            style: { $: 'layout.horizontal', spacing: '3' },
                            controls: [
                                { $: 'image',
                                    url: '/projects/studio/css/logo90.png',
                                    imageHeight: '90',
                                    units: 'px',
                                    style: { $: 'image.default' }
                                },
                                { $: 'group',
                                    url: '/projects/studio/css/logo470x200.png',
                                    title: 'title and menu ',
                                    style: { $: 'layout.vertical', spacing: '14' },
                                    controls: [
                                        { $: 'label',
                                            title: 'message ',
                                            style: { $: 'customStyle',
                                                template: '<span class="studio-message">{{title}}</span> ',
                                                css: "{ position: absolute;\n                    color: white;  padding: 20px;  background: #327DC8;\n                    width: 1000px;\n                    margin-top: -100px;\n                    }\n                    ",
                                                features: { $: 'oneWayBind', value: '%$$model/title%', to: '{{title}}' }
                                            }
                                        },
                                        { $: 'label',
                                            title: [
                                                '{%$globals/project%}',
                                                { $: 'replace', find: '_', replace: ' ' }
                                            ],
                                            style: { $: 'label.span' },
                                            features: { $: 'css',
                                                css: '{ font: 20px Arial; margin-left: 6px; margin-top: 20px}'
                                            }
                                        },
                                        { $: 'group',
                                            style: { $: 'layout.horizontal', spacing: 3 },
                                            controls: [
                                                { $: 'studio.main-menu' },
                                                { $: 'studio.toolbar' }
                                            ]
                                        }
                                    ],
                                    features: { $: 'css', css: '{ padding-left: 18px; width: 100% }' }
                                }
                            ],
                            features: { $: 'css', css: '{ height: 90px; border-bottom: 1px #d9d9d9 solid}' }
                        },
                        { $: 'group',
                            cssClass: 'studio-widget-placeholder',
                            title: 'preview',
                            controls: { $: 'studio.renderWidget' },
                        },
                        { $: 'group',
                            cssClass: 'studio-footer',
                            title: 'pages',
                            style: { $: 'layout.horizontal' },
                            controls: [
                                { $: 'button',
                                    title: 'new page',
                                    action: { $: 'studio.openNewPage' },
                                    style: { $: 'button.md-icon-12', icon: 'add' },
                                    features: { $: 'css', css: 'button {margin-top: 2px}' }
                                },
                                { $: 'itemlist',
                                    items: { $: 'studio.projectPages' },
                                    controls: { $: 'label',
                                        cssClass: 'studio-page',
                                        title: { $: 'extractSuffix', separator: '.' }
                                    },
                                    features: [
                                        { $: 'itemlist.selection',
                                            databind: '%$globals/page%',
                                            onSelection: { $: 'onNextTimer',
                                                action: { $: 'writeValue',
                                                    to: '%$globals/profile_path%',
                                                    value: '{%$globals/project%}.{%$globals/page%}'
                                                }
                                            },
                                            onDoubleClick: { $: 'onNextTimer',
                                                action: [
                                                    { $: 'writeValue', to: '%$globals/profile_path%', value: '{%$globals/project%}.{%$globals/page%}' },
                                                    { $: 'studio.open-properties' },
                                                    { $: 'studio.open-control-tree' },
                                                ]
                                            },
                                            autoSelectFirst: true
                                        },
                                        { $: 'css',
                                            css: "{ list-style: none; padding: 0; margin: 0; margin-left: 20px; font-family: \"Arial\"}\n                  li { list-style: none; display: inline-block; padding: 6px 10px; font-size: 12px; border: 1px solid transparent; cursor: pointer;}\n                  li label { cursor: inherit; }\n                  li.selected { background: #fff;  border: 1px solid #ccc;  border-top: 1px solid transparent; color: inherit;  }"
                                        }
                                    ]
                                }
                            ],
                            features: [
                                { $: 'group.wait',
                                    for: { $: 'studio.waitForPreviewIframe' },
                                    loadingControl: { $label: '...' }
                                },
                                { $: 'feature.afterLoad',
                                    action: {
                                        $runActions: [
                                            { $: 'studio.waitForPreviewIframe' },
                                            { $: 'studio.fixProfilePath' },
                                            { $: 'studio.setPreviewSize', width: 1280, height: 520 }
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    features: [
                        { $: 'group.watch', data: '%$globals/project%' },
                        { $: 'feature.init',
                            action: { $: 'rx.urlPath',
                                params: ['project', 'page', 'profile_path'],
                                databind: '%$globals%',
                                base: 'studio',
                                zoneId: 'studio.all'
                            }
                        }
                    ]
                }
            });
            jb_core_1.jb.component('studio.jbart-logo', {
                type: 'control',
                impl: { $: 'custom-control',
                    template: '<div style="padding: 60px 30px 30px 30px;background-color: #327DC8;zoom: 20%;"> <span style="position: absolute;margin-top:20px;margin-left:50px; color: white; font-size: 127px; font-family: Times New Roman, Times, serif">jB</span>  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="215px" height="228px" viewBox="0 0 215 228" preserveAspectRatio="xMidYMid meet" zoomAndPan="disable" xmlns:svg="http://www.w3.org/2000/svg"> <polygon points="106 0 0   38 17  178 106 228" fill="#DE3641"></polygon> <polygon points="106 0 215 38 198 178 106 228" fill="#B13138"></polygon> </svg> </div>'
                }
            });
            jb_core_1.jb.component('studio.projectPages', {
                type: 'data',
                impl: function (context) {
                    var projectName = context.exp('{%$globals/project%}');
                    if (!jbart.previewjbart)
                        return [];
                    var out = [];
                    for (var i in jbart.previewjbart.comps)
                        if (i.indexOf(projectName + '.') == 0 && jbart.previewjbart.comps[i].type == 'control')
                            out.push(i.split(projectName + '.')[1]);
                    return out;
                }
            });
            jb_core_1.jb.component('studio.renderWidget', {
                type: 'control',
                impl: function (ctx) {
                    var previewIframe = (function () {
                        function previewIframe(sanitizer, elementRef) {
                            this.sanitizer = sanitizer;
                            this.elementRef = elementRef;
                        }
                        previewIframe.prototype.ngOnInit = function () {
                            var cmp = this;
                            cmp.project = ctx.exp('%$globals/project%');
                            cmp.project_url = cmp.sanitizer.bypassSecurityTrustResourceUrl('/project/' + cmp.project);
                            if (!cmp.project)
                                debugger;
                            var iframe = cmp.elementRef.nativeElement.firstElementChild;
                            window.jb_studio_window = true; // let studio widgets run in a special mode
                            waitForIframeLoad(iframe).then(function () {
                                var w = iframe.contentWindow;
                                w.jbart.studioGlobals = ctx.exp('{%$globals%}');
                                w.jbart.modifyOperationsEm = studio.modifyOperationsEm;
                                w.jbart.studioActivityEm = studio.studioActivityEm;
                                w.jbart.modifiedCtrlsEm = jbart.modifiedCtrlsEm = studio.modifiedCtrlsEm;
                                jbart.previewWindow = w;
                                jbart.previewjbart = w.jbart;
                                jbart.preview_jbart_widgets = w.jbart_widgets;
                                document.title = cmp.project + ' with jBart';
                                jbart.previewjbart.comps[cmp.project + '.tests'] = jbart.previewjbart.comps['ui-tests.show-project-tests'];
                                // forward the studio zone to the preview widget so it will be updated
                                jb_ui.getZone('studio.all').then(function (zone) {
                                    zone.onStable.subscribe(function () {
                                        w.jbart.studioGlobals = ctx.exp('{%$globals%}');
                                        studio.studioActivityEm.next();
                                        //console.log('studio.all stable');
                                        // refresh preview
                                        jb_core_1.jb.entries(w.jbart.zones).forEach(function (x) { return x[1].run(function () { }); });
                                        //w.setTimeout(()=>{},1); 
                                    });
                                });
                                jb_core_1.jb.trigger(jbart, 'preview_loaded');
                            });
                        };
                        previewIframe = __decorate([
                            core_1.Component({
                                selector: 'previewIframe',
                                template: "<iframe sandbox=\"allow-same-origin allow-forms allow-scripts\" style=\"box-shadow:  2px 2px 6px 1px gray; margin-left: 2px; margin-top: 2px\"\n\t\t\t\t\tseamless=\"\" id=\"jb-preview\" frameborder=\"0\" [src]=\"project_url\"></iframe>",
                            }), 
                            __metadata('design:paramtypes', [platform_browser_1.DomSanitizationService, core_1.ElementRef])
                        ], previewIframe);
                        return previewIframe;
                    }());
                    previewIframe.jb_title =
                        function () { return 'previewIframe'; };
                    return previewIframe;
                }
            });
            jb_core_1.jb.component('studio.setPreviewSize', {
                type: 'action',
                params: {
                    width: { as: 'number' },
                    height: { as: 'number' },
                },
                impl: function (ctx, width, height) {
                    if (width)
                        $('#jb-preview').width(width);
                    if (height)
                        $('#jb-preview').height(height);
                }
            });
            jb_core_1.jb.component('studio.waitForPreviewIframe', {
                type: 'action',
                impl: function (context) {
                    if (jbart.previewjbart)
                        return;
                    return new Promise(function (resolve) {
                        return jb_core_1.jb.bind(jbart, 'preview_loaded', resolve);
                    });
                }
            });
            jb_core_1.jb.component('studio.fixProfilePath', {
                impl: function (ctx) {
                    var path = ctx.exp('%$globals/profile_path%');
                    if (!path)
                        return;
                    while (path.indexOf('~') != -1)
                        path = studio.parentPath(path);
                    if (path != ctx.exp('%$globals/profile_path%')) {
                        jb_core_1.jb.writeValue(ctx.exp('%$globals/profile_path%', 'ref'), path);
                        jb_ui.apply(ctx);
                    }
                }
            });
            jb_core_1.jb.component('studio.currentProfilePath', {
                impl: { $firstSucceeding: ['%$simulateProfilePath%', '%$globals/profile_path%', '%$globals/project%.%$globals/page%'] }
            });
            jb_core_1.jb.component('studio.short-title', {
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio.model.shortTitle(path); }
            });
            jb_core_1.jb.component('studio.ref', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.profileRefFromPathWithNotification(path, context);
                }
            });
            jb_core_1.jb.component('studio.val', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.val(path);
                }
            });
            jb_core_1.jb.component('studio.is-primitive-value', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return typeof studio.model.val(path) == 'string';
                }
            });
            jb_core_1.jb.component('studio.is-of-type', {
                params: {
                    path: { as: 'string', essential: true },
                    type: { as: 'string', essential: true },
                },
                impl: function (context, path, _type) {
                    return studio.model.isOfType(path, _type);
                }
            });
            jb_core_1.jb.component('studio.PTs-of-type', {
                params: {
                    type: { as: 'string', essential: true },
                },
                impl: function (context, _type) {
                    return studio.model.PTsOfType(_type);
                }
            });
            jb_core_1.jb.component('studio.short-title', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.shortTitle(path);
                }
            });
            jb_core_1.jb.component('studio.has-param', {
                params: {
                    path: { as: 'string' },
                    param: { as: 'string' },
                },
                impl: function (context, path, param) {
                    return studio.model.paramDef(path + '~' + param);
                }
            });
            jb_core_1.jb.component('studio.non-control-children', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.children(path, 'non-controls');
                }
            });
            jb_core_1.jb.component('studio.array-children', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.children(path, 'array');
                }
            });
            jb_core_1.jb.component('studio.compName', {
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio.model.compName(path) || ''; }
            });
            jb_core_1.jb.component('studio.paramDef', {
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio.model.paramDef(path); }
            });
            jb_core_1.jb.component('studio.enum-options', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return ((studio.model.paramDef(path) || {}).options || '').split(',').map(function (x) { return { code: x, text: x }; });
                }
            });
            jb_core_1.jb.component('studio.prop-name', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.propName(path);
                }
            });
            jb_core_1.jb.component('studio.more-params', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.jbEditorMoreParams(path);
                }
            });
            jb_core_1.jb.component('studio.compName-ref', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return studio.model.compName(path);
                            else
                                studio.model.modify(studio.model.setComp, path, { comp: value }, context);
                        }
                    };
                }
            });
            jb_core_1.jb.component('studio.insertComp', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    comp: { as: 'string' },
                },
                impl: function (context, path, comp) {
                    return studio.model.modify(studio.model.insertComp, path, { comp: comp }, context);
                }
            });
            jb_core_1.jb.component('studio.wrap', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    compName: { as: 'string' }
                },
                impl: function (context, path, compName) {
                    return studio.model.modify(studio.model.wrap, path, { compName: compName }, context);
                }
            });
            jb_core_1.jb.component('studio.wrapWithGroup', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.modify(studio.model.wrapWithGroup, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.addProperty', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.modify(studio.model.addProperty, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.wrapWithPipeline', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.modify(studio.model.wrapWithPipeline, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.duplicate', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                },
                impl: function (context, path) {
                    return studio.model.modify(studio.model.duplicate, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.moveInArray', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                    moveUp: { type: 'boolean', as: 'boolean' }
                },
                impl: function (context, path, moveUp) {
                    return studio.model.modify(studio.model.moveInArray, path, { moveUp: moveUp }, context);
                }
            });
            jb_core_1.jb.component('studio.newArrayItem', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return studio.model.modify(studio.model.addArrayItem, path, {}, context);
                }
            });
            jb_core_1.jb.component('studio.delete', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio.model.modify(studio.model._delete, path, {}, context); }
            });
            jb_core_1.jb.component('studio.make-local', {
                type: 'action',
                params: { path: { as: 'string' } },
                impl: function (context, path) { return studio.model.modify(studio.model.makeLocal, path, { ctx: context }, context); }
            });
            jb_core_1.jb.component('studio.projectSource', {
                params: {
                    project: { as: 'string', defaultValue: '%$globals/project%' }
                },
                impl: function (context, project) {
                    if (!project)
                        return;
                    var comps = jb_core_1.jb.entries(studio.jbart_base().comps).map(function (x) { return x[0]; }).filter(function (x) { return x.indexOf(project) == 0; });
                    return comps.map(function (comp) { return studio.compAsStr(comp); }).join('\n\n');
                }
            });
            jb_core_1.jb.component('studio.compSource', {
                params: {
                    comp: { as: 'string', defaultValue: { $: 'studio.currentProfilePath' } }
                },
                impl: function (context, comp) {
                    return studio.compAsStr(comp.split('~')[0]);
                }
            });
            jb_core_1.jb.component('studio.isCustomStyle', {
                params: { path: { as: 'string' } },
                impl: function (context, path) {
                    return (studio.model.compName(path) || '').indexOf('custom') == 0;
                }
            });
            jb_core_1.jb.component('studio.message', {
                type: 'action',
                params: { message: { as: 'string' } },
                impl: function (ctx, message) {
                    return studio.message(message);
                }
            });
            jb_core_1.jb.component('studio.refreshPreview', {
                type: 'action',
                impl: function () {
                    if (jbart.previewjbart)
                        jbart.previewjbart.previewRefreshCounter = (jbart.previewjbart.previewRefreshCounter || 0) + 1;
                }
            });
            jb_core_1.jb.component('studio.redrawStudio', {
                type: 'action',
                impl: function () {
                    return jbart.redrawStudio && jbart.redrawStudio();
                }
            });
            jb_core_1.jb.component('studio.goto-path', {
                type: 'action',
                params: {
                    path: { as: 'string' },
                },
                impl: { $runActions: [
                        { $: 'writeValue', to: '%$globals/profile_path%', value: '%$path%' },
                        { $: 'studio.open-properties' },
                        { $: 'studio.open-control-tree' }
                    ] }
            });
        }
    }
});
