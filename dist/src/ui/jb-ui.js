System.register(['jb-core', '@angular/core', '@angular/platform-browser', '@angular/common', '@angular/http', '@angular/forms', 'jb-ui/jb-rx'], function(exports_1, context_1) {
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
    var jb_core_1, core_1, platform_browser_1, common_1, http_1, forms_1, jb_rx;
    var factory_hash, cssFixes_hash, jbComponent, jbComp, jBartWidget, jbCompModule, jBartWidgetModule;
    //jbart.zones = jbart.zones || {}
    function apply(ctx) {
        return jb_core_1.jb.delay(1).then(function () {
            return ctx.vars.ngZone && ctx.vars.ngZone.run(function () { });
        });
    }
    exports_1("apply", apply);
    function delayOutsideAngular(ctx, func) {
        jb_core_1.jb.delay(1, ctx).then(func);
    }
    exports_1("delayOutsideAngular", delayOutsideAngular);
    function applyPreview(ctx) {
        var _win = jbart.previewWindow || window;
        _win.setTimeout(function () { }, 1);
        //    jb.delay(1).then(()=>
        // 	jb.entries(_win.jbart.zones).forEach(x=>x[1].run(()=>{}))
        // )
    }
    exports_1("applyPreview", applyPreview);
    function ctrl(context) {
        var ctx = context.setVars({ $model: context.params });
        var styleOptions = defaultStyle(ctx);
        return new jbComponent(ctx).jbExtend(styleOptions).jbCtrl(ctx);
        function defaultStyle(ctx) {
            var profile = context.profile;
            var defaultVar = '$theme.' + (profile.$ || '');
            if (!profile.style && context.vars[defaultVar])
                return ctx.run({ $: context.vars[defaultVar] });
            return context.params.style(ctx);
        }
    }
    exports_1("ctrl", ctrl);
    function Comp(options, ctx) {
        return new jbComponent(ctx).jbExtend(options);
    }
    exports_1("Comp", Comp);
    function injectLifeCycleMethods(Cmp) {
        Cmp.prototype.ngOnInit = function () {
            var _this = this;
            try {
                if (this.methodHandler.jbObservableFuncs.length) {
                    this.jbEmitter = this.jbEmitter || new jb_rx.Subject();
                    this.methodHandler.jbObservableFuncs.forEach(function (observable) { return observable(_this.jbEmitter, _this); });
                }
                this.refreshCtx = function (ctx2) {
                    _this.methodHandler.extendCtxFuncs.forEach(function (extendCtx) {
                        _this.ctx = extendCtx(ctx2, _this);
                    });
                    return _this.ctx;
                };
                this.refreshCtx(this.ctx);
                this.methodHandler.jbBeforeInitFuncs.forEach(function (init) { return init(_this); });
                this.methodHandler.jbInitFuncs.forEach(function (init) { return init(_this); });
            }
            catch (e) {
                jb_core_1.jb.logException(e, '');
            }
        };
        Cmp.prototype.ngAfterViewInit = function () {
            var _this = this;
            this.methodHandler.jbAfterViewInitFuncs.forEach(function (init) { return init(_this); });
            if (this.jbEmitter) {
                this.jbEmitter.next('after-init');
                jb_native_delay(1).then(function () {
                    if (_this.jbEmitter && !_this.jbEmitter.hasCompleted) {
                        _this.jbEmitter.next('after-init-children');
                        if (_this.readyCounter == null)
                            _this.jbEmitter.next('ready');
                    }
                });
            }
        };
        Cmp.prototype.ngDoCheck = function () {
            var _this = this;
            this.methodHandler.jbCheckFuncs.forEach(function (f) {
                return f(_this);
            });
            this.refreshModel && this.refreshModel();
            this.jbEmitter && this.jbEmitter.next('check');
        };
        Cmp.prototype.ngOnDestroy = function () {
            var _this = this;
            this.methodHandler.jbDestroyFuncs.forEach(function (f) {
                return f(_this);
            });
            this.jbEmitter && this.jbEmitter.next('destroy');
            this.jbEmitter && this.jbEmitter.complete();
        };
        // Cmp.prototype.jbWait = function () {
        // 	this.readyCounter = (this.readyCounter || 0)+1;
        // 	var parentCmp = this.parentCmp && this.parentCmp.parent();
        // 	if (parentCmp && parentCmp.jbWait)
        // 		this.parentWaiting = parentCmp.jbWait();
        // 	return {
        // 		ready: () => {
        // 			this.readyCounter--;
        // 			if (!this.readyCounter) {
        // 				this.jbEmitter && this.jbEmitter.next('ready');
        // 				if (this.parentWaiting)
        // 					this.parentWaiting.ready();
        // 			}
        // 		}
        // 	}
        // }
    }
    exports_1("injectLifeCycleMethods", injectLifeCycleMethods);
    function wrapWithLauchingElement(f, context, elem) {
        return function () {
            var native = elem.nodeType ? elem : elem.nativeElement;
            // .children().first()
            f(context.setVars({ $launchingElement: { $el: $(native) } }));
        };
    }
    exports_1("wrapWithLauchingElement", wrapWithLauchingElement);
    // export function getZone(zoneId) {
    // 	return new Promise((resolve,fail)=> {
    // 		var counter = 30;
    // 		var intervalID = setInterval(function() {
    // 			if (jbart.zones[zoneId]) {
    // 				window.clearInterval(intervalID);
    // 				resolve(jbart.zones[zoneId]);
    // 			}
    // 			if (--counter <= 0) {
    // 				window.clearInterval(intervalID);
    // 				fail();
    // 			}
    // 		}, 100);	
    // 	})
    // }
    function garbageCollectCtxDictionary() {
        var now = new Date().getTime();
        jbart.ctxDictionaryLastCleanUp = jbart.ctxDictionaryLastCleanUp || now;
        var timeSinceLastCleanUp = now - jbart.ctxDictionaryLastCleanUp;
        if (timeSinceLastCleanUp < 10000)
            return;
        jbart.ctxDictionaryLastCleanUp = now;
        var used = Array.from(document.querySelectorAll('[jb-ctx]')).map(function (e) { return Number(e.getAttribute('jb-ctx')); }).sort(function (x, y) { return x - y; });
        var dict = Object.getOwnPropertyNames(jbart.ctxDictionary).map(function (x) { return Number(x); }).sort(function (x, y) { return x - y; });
        var lastUsedIndex = 0;
        for (var i = 0; i < dict.length; i++) {
            while (used[lastUsedIndex] < dict[i])
                lastUsedIndex++;
            if (used[lastUsedIndex] > dict[i])
                delete jbart.ctxDictionary['' + dict[i]];
        }
    }
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            factory_hash = {}, cssFixes_hash = {}; // compiledFactories()
            jbComponent = (function () {
                function jbComponent(ctx) {
                    this.ctx = ctx;
                    this.annotations = {};
                    this.methodHandler = { jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [], jbCheckFuncs: [], jbDestroyFuncs: [], jbObservableFuncs: [], extendCtxFuncs: [] };
                    this.cssFixes = [];
                    this.jb_profile = ctx.profile;
                    var title = jb_tosingle(jb_core_1.jb.val(this.ctx.params.title)) || (function () { return ''; });
                    this.jb_title = (typeof title == 'function') ? title : function () { return '' + title; };
                    this.jb$title = (typeof title == 'function') ? title() : title; // for debug
                }
                jbComponent.prototype.initFromComp = function (comp) {
                    this.annotations = Reflect.getMetadata('annotations', comp)[0];
                    this.methodHandler = comp.methodHandler;
                    this.comp = comp;
                };
                jbComponent.prototype.compile = function (compiler) {
                    if (this.factory)
                        return this.factory;
                    var key = this.hashkey();
                    if (factory_hash[key])
                        return factory_hash[key];
                    this.doCompile(compiler, this.createComp());
                    factory_hash[key] = this.factory;
                    return this.factory;
                };
                jbComponent.prototype.doCompile = function (compiler, comp, inError) {
                    this.comp = comp;
                    var dynamicModule = this.wrapCompWithModule(comp);
                    try {
                        var ret = compiler.compileModuleAndAllComponentsSync(dynamicModule);
                        this.factory = ret.componentFactories.find(function (x) { return x.componentType === comp; });
                    }
                    catch (e) {
                        if (!inError)
                            this.doCompile(compiler, this.nullComp(), true);
                        jb_core_1.jb.logError('ng compilation error', this, e);
                    }
                };
                jbComponent.prototype.wrapCompWithModule = function (comp) {
                    var DynamicModule = function () { };
                    var DynamicModule = Reflect.decorate([
                        core_1.NgModule({
                            imports: [jbCompModule, common_1.CommonModule, platform_browser_1.BrowserModule, forms_1.FormsModule]
                                .concat(this.annotations.imports || []).filter(function (x) { return x; }),
                            providers: this.annotations.providers,
                            declarations: [comp],
                            exports: [comp]
                        }),
                    ], DynamicModule);
                    return DynamicModule;
                };
                jbComponent.prototype.registerMethods = function (cmp_ref) {
                    var cmp = cmp_ref._hostElement.component; // hostView._view._Cmp_0_4;
                    //		cmp.parentCmp = parent;
                    var ctx = this.ctx;
                    cmp.ctx = ctx;
                    cmp.methodHandler = this.methodHandler;
                    var elem = cmp_ref._hostElement.nativeElement;
                    while (ctx.profile.__innerImplementation)
                        ctx = ctx.componentContext._parent;
                    elem.setAttribute('jb-ctx', ctx.id);
                    garbageCollectCtxDictionary();
                    jbart.ctxDictionary[ctx.id] = ctx;
                    if (this.cssFixes.length > 0) {
                        var ngAtt = Array.from(elem.attributes).map(function (x) { return x.name; })
                            .filter(function (x) { return x.match(/_ng/); })[0];
                        var css = this.cssFixes
                            .map(function (x) { return x.trim(); })
                            .map(function (x) { return x.replace(/^!/, ' '); }) // replace the ! with space to allow internal selector
                            .map(function (x) { return ("[" + ngAtt + "]" + x); })
                            .join('\n');
                        if (!cssFixes_hash[css]) {
                            cssFixes_hash[css] = true;
                            $("<style type=\"text/css\">" + css + "</style>").appendTo($('head'));
                        }
                    }
                };
                jbComponent.prototype.hashkey = function () {
                    return JSON.stringify(jb_core_1.jb.extend({}, this.annotations, {
                        imports: '', providers: '',
                        host: jb_core_1.jb.extend({}, this.annotations.host || {}),
                    }));
                };
                jbComponent.prototype.nullComp = function () {
                    var Cmp = function () { };
                    Cmp = Reflect.decorate([
                        core_1.Component({ selector: 'jb-comp', template: '<div></div>' }),
                    ], Cmp);
                    return Cmp;
                };
                jbComponent.prototype.createComp = function () {
                    if (!this.annotations.selector)
                        this.annotations.selector = 'jb-comp';
                    var Cmp = function (elementRef, changeDetection, renderer) { this.elementRef = elementRef; this.changeDt = changeDetection; this.renderer = renderer; };
                    Cmp = Reflect.decorate([
                        core_1.Component(this.annotations),
                        Reflect.metadata('design:paramtypes', [core_1.ElementRef, core_1.ChangeDetectorRef, core_1.Renderer])
                    ], Cmp);
                    injectLifeCycleMethods(Cmp);
                    return Cmp;
                };
                jbComponent.prototype.jbCtrl = function (context) {
                    var _this = this;
                    var features = (context.params.features && context.params.features(context) || []);
                    features.forEach(function (f) { return _this.jbExtend(f, context); });
                    if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
                        jb_core_1.jb.toarray(context.params.style.profile.features)
                            .forEach(function (f, i) {
                            return _this.jbExtend(context.runInner(f, { type: 'feature' }, context.path + '~features~' + i), context);
                        });
                    }
                    return this;
                };
                jbComponent.prototype.jbExtend = function (options, context) {
                    var _this = this;
                    context = context || this.ctx;
                    if (!context)
                        console.log('no context provided for jbExtend');
                    if (!options)
                        return this;
                    if (typeof options != 'object')
                        debugger;
                    //    	jbTemplate(options);
                    if (options.beforeInit)
                        this.methodHandler.jbBeforeInitFuncs.push(options.beforeInit);
                    if (options.init)
                        this.methodHandler.jbInitFuncs.push(options.init);
                    if (options.afterViewInit)
                        this.methodHandler.jbAfterViewInitFuncs.push(options.afterViewInit);
                    if (options.doCheck)
                        this.methodHandler.jbCheckFuncs.push(options.doCheck);
                    if (options.destroy)
                        this.methodHandler.jbDestroyFuncs.push(options.destroy);
                    if (options.observable)
                        this.methodHandler.jbObservableFuncs.push(options.observable);
                    //		if (options.ctrlsEmFunc) this.methodHandler.ctrlsEmFunc=options.ctrlsEmFunc;
                    if (options.extendCtx)
                        this.methodHandler.extendCtxFuncs.push(options.extendCtx);
                    if (options.extendComp)
                        jb_core_1.jb.extend(this, options.extendComp);
                    if (options.invisible)
                        this.invisible = true;
                    if (options.css)
                        options.styles = (options.styles || [])
                            .concat(options.css.split(/}\s*/m)
                            .map(function (x) { return x.trim(); })
                            .filter(function (x) { return x; })
                            .map(function (x) { return x + '}'; }));
                    options.styles = options.styles && (options.styles || []).map(function (st) { return context.exp(st); }).map(function (x) { return x.trim(); });
                    // fix ng limit - root style as style attribute at the template
                    (options.styles || [])
                        .filter(function (x) { return x.match(/^{([^]*)}$/m); })
                        .forEach(function (x) {
                        if (_this.cssFixes.indexOf(x) == -1)
                            _this.cssFixes.push('>*' + x);
                    });
                    // .forEach(x=>
                    // 	jb.path(options,['atts','style'],x.match(/^{([^]*)}$/m)[1]));
                    (options.styles || [])
                        .filter(function (x) { return x.match(/^:/m); }) // for example :hover
                        .forEach(function (x) {
                        if (_this.cssFixes.indexOf(x) == -1)
                            _this.cssFixes.push(x);
                    });
                    (options.styles || [])
                        .filter(function (x) { return x.match(/^\!/m); }) // ! affect internal selectors
                        .forEach(function (x) {
                        if (_this.cssFixes.indexOf(x) == -1)
                            _this.cssFixes.push(x);
                    });
                    var annotations = this.annotations;
                    var overridable_props = ['selector', 'template', 'encapsulation'];
                    var extendable_array_props = ['styles', 'imports', 'providers'];
                    overridable_props.forEach(function (prop) {
                        if (options[prop] !== undefined || annotations[prop] != undefined)
                            annotations[prop] = options[prop] || annotations[prop];
                    });
                    extendable_array_props.forEach(function (prop) {
                        if (options[prop] !== undefined || annotations[prop] != undefined)
                            annotations[prop] = (annotations[prop] || []).concat(jb_core_1.jb.toarray(options[prop]));
                    });
                    if (options.disableChangeDetection)
                        annotations.changeDetection = core_1.ChangeDetectionStrategy.OnPush;
                    if (options.cssClass)
                        options.cssClass.split(' ').forEach(function (clz) {
                            return jb_core_1.jb.path(options, ['host', '[class.' + clz + ']'], 'true');
                        });
                    if (options.host)
                        annotations.host = jb_core_1.jb.extend(annotations.host || {}, options.host);
                    if (annotations.template) {
                        if (typeof annotations.template != 'string')
                            debugger;
                        annotations.template = annotations.template.trim();
                        jb_core_1.jb.entries(options.templateModifier)
                            .forEach(function (mod) {
                            return annotations.template = annotations.template.replace('#' + mod[0], '#' + mod[0] + ' ' + mod[1]);
                        });
                    }
                    (options.featuresOptions || []).forEach(function (f) {
                        return _this.jbExtend(f, context);
                    });
                    return this;
                };
                return jbComponent;
            }());
            jbComp = (function () {
                function jbComp(compiler, ngZone, view, elementRef, renderer) {
                    this.compiler = compiler;
                    this.ngZone = ngZone;
                    this.view = view;
                    this.elementRef = elementRef;
                    this.renderer = renderer;
                    this.destroyNotifier = new jb_rx.Subject();
                }
                Object.defineProperty(jbComp.prototype, "jbComp", {
                    set: function (comp) {
                        comp && this.draw(comp);
                    },
                    enumerable: true,
                    configurable: true
                });
                jbComp.prototype.ngOnInit = function () {
                    jbart.studioAutoRefreshComp && jbart.studioAutoRefreshComp(this);
                };
                // ngDoCheck() {
                // 	if (this.jbComp != this.oldComp) {
                // 		this.oldComp = this.jbComp;
                // 		this.draw(this.jbComp);
                // 	}
                // }
                jbComp.prototype.draw = function (comp) {
                    var _this = this;
                    if (!comp)
                        return;
                    this._comp = comp.comp || comp;
                    this.view.clear();
                    [this._comp]
                        .filter(function (comp) { return comp.compile; })
                        .forEach(function (comp) {
                        var componentFactory = comp.compile(_this.compiler);
                        var cmp_ref = _this.view.createComponent(componentFactory);
                        comp.registerMethods && comp.registerMethods(cmp_ref);
                        _this.ngZone.run(function () { });
                    });
                };
                jbComp.prototype.ngOnDestroy = function () {
                    this.destroyNotifier.next('destroy');
                    this.destroyNotifier.complete();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object), 
                    __metadata('design:paramtypes', [Object])
                ], jbComp.prototype, "jbComp", null);
                jbComp = __decorate([
                    core_1.Directive({
                        selector: '[jbComp]',
                    }), 
                    __metadata('design:paramtypes', [core_1.Compiler, core_1.NgZone, core_1.ViewContainerRef, core_1.ElementRef, core_1.Renderer])
                ], jbComp);
                return jbComp;
            }());
            exports_1("jbComp", jbComp);
            jBartWidget = (function () {
                function jBartWidget(elementRef, ngZone, injector) {
                    this.elementRef = elementRef;
                    this.ngZone = ngZone;
                    this.injector = injector;
                }
                jBartWidget.prototype.ngOnInit = function () {
                    var _this = this;
                    jbart.widgetLoaded = true; // indication for studio 
                    this.compId = this.elementRef.nativeElement.getAttribute('compID');
                    this.dialogs = jbart.jb_dialogs.dialogs;
                    // if (this.compId)
                    // 	jbart.zones[this.compId] = this.ngZone;
                    if (this.compId == 'studio.all') {
                        jbart.redrawStudio = function () {
                            return _this.draw();
                        };
                    }
                    this.isPreview = window && window.parent != window && window.parent.document.title == 'jBart Studio';
                    if (!this.isPreview)
                        this.draw();
                };
                jBartWidget.prototype.ngAfterViewInit = function () {
                    var _this = this;
                    if (this.isPreview)
                        jb_waitFor(function () { return jbart.studioAutoRefreshWidget; }).then(function () {
                            jbart.studioAutoRefreshWidget(_this);
                        });
                };
                jBartWidget.prototype.draw = function () {
                    try {
                        if (this.compId) {
                            this.comp = jb_run(jb_core_1.jb.ctx(this.getOrCreateInitialCtx(), { profile: { $: this.compId }, comp: this.compId, path: '' }));
                            if (this.isPreview) {
                                this.ngZone.run(function () { });
                                setTimeout(function (_) { }, 1);
                            }
                        }
                    }
                    catch (e) {
                        jb_core_1.jb.logException(e, '');
                    }
                };
                jBartWidget.prototype.getOrCreateInitialCtx = function () {
                    if (!jbart.initialCtx) {
                        var ns = this.compId.split('.')[0];
                        var resources = (jb_core_1.jb.widgets[ns] && jb_core_1.jb.widgets[ns].resources) || {};
                        jb_core_1.jb.extend(resources, { window: window, globals: {} });
                        jbart.initialCtx = jb_core_1.jb.ctx({ resources: resources, vars: { ngZone: this.ngZone,
                                injector: this.injector } }, {});
                    }
                    if (jbart.studioGlobals)
                        return jbart.initialCtx.setVars({ studio: { project: jbart.studioGlobals.project, page: jbart.studioGlobals.page } });
                    return jbart.initialCtx;
                };
                jBartWidget = __decorate([
                    core_1.Component({
                        selector: 'jbart',
                        template: "<div *jbComp=\"comp\"></div>\n\t\t        <div *ngFor=\"let dialog of dialogs\"><div *jbComp=\"dialog\"></div></div>",
                        directives: [jbComp]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone, core_1.Injector])
                ], jBartWidget);
                return jBartWidget;
            }());
            exports_1("jBartWidget", jBartWidget);
            jbCompModule = (function () {
                function jbCompModule() {
                }
                jbCompModule = __decorate([
                    core_1.NgModule({
                        imports: [],
                        declarations: [jbComp],
                        exports: [jbComp],
                    }), 
                    __metadata('design:paramtypes', [])
                ], jbCompModule);
                return jbCompModule;
            }());
            jBartWidgetModule = (function () {
                function jBartWidgetModule() {
                }
                jBartWidgetModule = __decorate([
                    core_1.NgModule({
                        imports: [jbCompModule, common_1.CommonModule, forms_1.FormsModule, http_1.HttpModule, platform_browser_1.BrowserModule],
                        declarations: [jBartWidget],
                        bootstrap: [jBartWidget]
                    }), 
                    __metadata('design:paramtypes', [])
                ], jBartWidgetModule);
                return jBartWidgetModule;
            }());
            exports_1("jBartWidgetModule", jBartWidgetModule);
        }
    }
});
