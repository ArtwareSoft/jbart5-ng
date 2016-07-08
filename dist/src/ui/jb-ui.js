System.register(['jb-core', '@angular/core', '@angular/common', 'jb-ui/jb-rx', 'jb-ui/dialog'], function(exports_1, context_1) {
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
    var jb_core_1, core_1, common_1, jb_rx, jb_dialog;
    var factory_hash, cssFixes_hash, jbComponent, jbComp, jBartWidget, directivesObj;
    function apply(ctx) {
        //	console.log('apply');
        jb_core_1.jb.delay(1);
        ctx.vars.ngZone && ctx.vars.ngZone.run(function () { });
    }
    exports_1("apply", apply);
    function ctrl(context) {
        var ctx = context.setVars({ $model: context.params });
        var styleOptions = defaultStyle(ctx);
        return new jbComponent(ctx).jbExtend(styleOptions).jbCtrl(ctx);
        function defaultStyle(ctx) {
            var profile = context.profile;
            var defaultVar = (profile.$ || '') + '.default-style-profile';
            if (!profile.style && context.vars[defaultVar])
                return ctx.run({ $: context.vars[defaultVar] });
            return context.params.style(ctx);
        }
    }
    exports_1("ctrl", ctrl);
    function Comp(options, ctx) {
        return new jbComponent(ctx).jbExtend(options); //.createComp();
    }
    exports_1("Comp", Comp);
    function optionsOfProfile(profile) {
        if (!profile)
            return {};
        var res = {};
        ['cssClass', 'css'] // 'atts','styles',
            .forEach(function (p) { if (profile[p])
            res[p] = profile[p]; });
        return res;
    }
    function mergeOptions(op1, op2) {
        var res = {};
        res.cssClass = ((op1.cssClass || '') + ' ' + (op2.cssClass || '')).trim();
        //		res.cssStyle = ((op1.cssStyle || '') + ';' + (op2.cssStyle || '')).replace(/^;*/,'').replace(/;*$/,'');
        if (op1.styles || op2.styles)
            res.styles = (op1.styles || []).concat(op2.styles || []);
        return jb_extend({}, op1, op2, res);
    }
    function setTemplateAtt(element, att, value) {
        if (!element.getAttribute)
            debugger;
        if (('' + value).indexOf('[object') != -1)
            return; // avoid bugs - no object host
        var currentVal = element.getAttribute(att);
        if (att == 'ngIf')
            element.setAttribute('template', 'ngIf ' + value);
        else if (att == 'class')
            element.setAttribute(att, currentVal ? currentVal + ' ' + value : value);
        else
            addAttribute(element, att, value);
    }
    function jbTemplate(options) {
        options.jbTemplate = (options.jbTemplate || '').trim();
        if (!options.jbTemplate)
            return;
        var template = parseHTML(options.jbTemplate);
        var host = jb_extend({}, options.host);
        Array.from(template.attributes || [])
            .filter(function (att) {
            var ngAtt = att.name.indexOf('*ng') != -1;
            if (ngAtt)
                jb_core_1.jb.logError('ng atts are not allowed in root element of template: ' + att.name, { ctx: ctrl_ctx, att: att });
            return !ngAtt;
        })
            .forEach(function (att) { return host[att.name] = att.value; });
        jb_core_1.jb.extend(options, {
            template: template.innerHTML.trim(),
            selector: template.tagName,
            host: host
        });
    }
    function profilePath(profile) {
        // caching last component
        var lastFound = window.jb_lastFoundAt;
        if (lastFound && getPath(jb_core_1.jb.comps[lastFound].impl, profile, 0))
            return lastFound + '~' + getPath(jb_core_1.jb.comps[lastFound].impl, profile, 0).replace(/~*$/g, '');
        for (var comp in jb_core_1.jb.comps) {
            var impl = jb_core_1.jb.comps[comp].impl;
            if (typeof impl == 'function')
                continue;
            var res = getPath(impl, profile, 0, impl);
            if (res) {
                window.jb_lastFoundAt = comp; // a kind of cache
                return (comp + '~' + res).replace(/~*$/g, '');
            }
        }
        function getPath(parent, dest, depth, comp) {
            if (depth > 50)
                debugger;
            if (!parent)
                return '';
            if (parent === dest)
                return '~'; // will be removed
            return Object.getOwnPropertyNames(parent).filter(function (p) { return typeof parent[p] === 'object' && p.indexOf('$jb') != 0; }).map(function (p) {
                var path = getPath(parent[p], dest, (depth || 0) + 1, comp);
                return path ? (p + '~' + path) : '';
            }).join(''); // only one will succeed
        }
    }
    function controlsToGroupEmitter(controlsFunc, cmp) {
        var controlsFuncAsObservable = function (ctx) { return jb_rx.Observable.of(controlsFunc(ctx)); };
        return cmp.methodHandler.ctrlsEmFunc ? function (ctx) { return cmp.methodHandler.ctrlsEmFunc(controlsFuncAsObservable, ctx, cmp); } : controlsFuncAsObservable;
    }
    exports_1("controlsToGroupEmitter", controlsToGroupEmitter);
    function ngRef(ref, cmp) {
        if (typeof ref == 'string' && ref.match(/{{.*}}/))
            return { $jb_parent: cmp, $jb_property: ref.match(/{{(.*)}}/)[1] };
        return ref;
    }
    exports_1("ngRef", ngRef);
    function twoWayBind(ref) {
        if (!ref)
            return {
                bindToCmp: function () { },
                valueExp: '',
                modelExp: '',
                observable: function (ctx) { return new jb_rx.Subject(); },
                getValue: function () { return null; },
                writeValue: function (val) { }
            };
        var modelPath = 'jbModel';
        var bindToCmp = function (cmp) {
            cmp.jbOnChange = function (ev) {
                if (ev.checked !== undefined)
                    var val = ev.checked;
                else if (ev.target)
                    var val = ev.target.type != 'checkbox' ? ev.target.value : ev.target.checked;
                jb_core_1.jb.writeValue(ref, val);
            };
            cmp.refreshModel = function () {
                return cmp[modelPath] = jb_core_1.jb.val(ref);
            };
        };
        // keyup for input change for select & checkbox
        var modelExp = "[(ngModel)] = \"" + modelPath + "\" (change)=\"jbOnChange($event)\" (keyup)=\"jbOnChange($event)\"";
        return {
            bindToCmp: bindToCmp,
            valueExp: modelPath,
            modelExp: modelExp,
            observable: function (ctx) {
                return jb_rx.refObservable(ref, ctx);
            },
            getValue: function () {
                return jb_core_1.jb.val(ref);
            },
            writeValue: function (val) {
                return jb_core_1.jb.writeValue(ref, val);
            }
        };
    }
    exports_1("twoWayBind", twoWayBind);
    function insertComponent(comp, resolver, parentView) {
        return comp.compile(resolver).then(function (componentFactory) {
            return comp.registerMethods(parentView.createComponent(componentFactory), comp);
        });
    }
    exports_1("insertComponent", insertComponent);
    function parseHTML(text) {
        var res = document.createElement('div');
        res.innerHTML = text;
        return res.firstChild;
    }
    exports_1("parseHTML", parseHTML);
    function addAttribute(element, attrName, attrValue) {
        var tmpElm = document.createElement('p');
        tmpElm.innerHTML = "<p " + attrName + "='" + attrValue + "'></p>";
        var newAttr = tmpElm.children[0].attributes[0].cloneNode(true);
        element.setAttributeNode(newAttr);
    }
    exports_1("addAttribute", addAttribute);
    function wrapWithLauchingElement(f, context, elem) {
        var native = elem.nodeType ? elem : elem.nativeElement;
        return function () {
            f(context.setVars({ $launchingElement: { elem: elem, $el: $(native) } }));
        };
    }
    exports_1("wrapWithLauchingElement", wrapWithLauchingElement);
    function getZone(zoneId) {
        return new Promise(function (resolve, fail) {
            var counter = 30;
            var intervalID = setInterval(function () {
                if (jbart.zones[zoneId]) {
                    window.clearInterval(intervalID);
                    resolve(jbart.zones[zoneId]);
                }
                if (--counter <= 0) {
                    window.clearInterval(intervalID);
                    fail();
                }
            }, 100);
        });
    }
    exports_1("getZone", getZone);
    function registerDirectives(obj) {
        jb_core_1.jb.extend(directivesObj, obj);
    }
    exports_1("registerDirectives", registerDirectives);
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (jb_dialog_1) {
                jb_dialog = jb_dialog_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            jbart.zones = jbart.zones || {};
            factory_hash = {}, cssFixes_hash = {};
            jbComponent = (function () {
                function jbComponent(ctx) {
                    this.ctx = ctx;
                    this.annotations = {};
                    this.methodHandler = { jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [], jbCheckFuncs: [], jbObservableFuncs: [], extendCtxFuncs: [] };
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
                    if (factory_hash[this.hashkey()])
                        this.factory = factory_hash[this.hashkey()];
                    else
                        this.factory = factory_hash[this.hashkey()] = compiler.resolveComponent(this.comp || this.createComp());
                    return this.factory;
                };
                jbComponent.prototype.registerMethods = function (cmp_ref, parent) {
                    var cmp = cmp_ref.hostView._view._Cmp_0_4;
                    cmp.parentCmp = parent;
                    cmp.ctx = this.ctx;
                    cmp.methodHandler = this.methodHandler;
                    if (this.cssFixes.length > 0) {
                        var elem = cmp_ref._hostElement.nativeElement;
                        var ngAtt = Array.from(elem.attributes).map(function (x) { return x.name; })
                            .filter(function (x) { return x.match(/_ng/); })[0];
                        var css = this.cssFixes
                            .map(function (x) { return ("[" + ngAtt + "]" + x); })
                            .join('\n');
                        if (!cssFixes_hash[css]) {
                            cssFixes_hash[css] = true;
                            $("<style type=\"text/css\">" + css + "</style>").appendTo($('head'));
                        }
                    }
                };
                jbComponent.prototype.hashkey = function () {
                    return JSON.stringify(this.annotations);
                };
                jbComponent.prototype.createComp = function () {
                    this.jbExtend({ directives: [common_1.NgClass, jbComp] });
                    if (!this.annotations.selector)
                        this.annotations.selector = 'div';
                    var Cmp = function (dcl, elementRef, ctx) { this.dcl = dcl; this.elementRef = elementRef; };
                    Cmp = Reflect.decorate([
                        core_1.Component(this.annotations),
                        Reflect.metadata('design:paramtypes', [core_1.ComponentResolver, core_1.ElementRef])
                    ], Cmp);
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
                        this.jbEmitter && this.jbEmitter.next('after-init');
                        jb_core_1.jb.delay(1).then(function () {
                            if (_this.jbEmitter) {
                                _this.jbEmitter.next('after-init-children');
                                if (_this.readyCounter == null)
                                    _this.jbEmitter.next('ready');
                            }
                        });
                    };
                    Cmp.prototype.ngDoCheck = function () {
                        var _this = this;
                        this.methodHandler.jbCheckFuncs.forEach(function (f) {
                            return f(_this);
                        });
                        this.refreshModel && this.refreshModel();
                        this.jbEmitter && this.jbEmitter.next('check');
                    };
                    Cmp.prototype.wait = function () {
                        var _this = this;
                        this.readyCounter = (this.readyCounter || 0) + 1;
                        if (this.parentCmp && this.parentCmp.wait)
                            this.parentWaiting = this.parentCmp.wait();
                        return {
                            ready: function () {
                                _this.readyCounter--;
                                if (!_this.readyCounter) {
                                    _this.jbEmitter && _this.jbEmitter.next('ready');
                                    if (_this.parentWaiting)
                                        _this.parentWaiting.ready();
                                }
                            }
                        };
                    };
                    return Cmp;
                };
                jbComponent.prototype.jbCtrl = function (context) {
                    var _this = this;
                    var options = mergeOptions(optionsOfProfile(context.params.style && context.params.style.profile), optionsOfProfile(context.profile));
                    jb_core_1.jb.path(options, ['atts', 'jb-path'], profilePath(context.profile) || ''); // for the studio
                    context.params.features && context.params.features(context).forEach(function (f) { return _this.jbExtend(f, context); });
                    if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
                        jb_core_1.jb.toarray(context.params.style.profile.features)
                            .forEach(function (f) { return _this.jbExtend(context.run(f), context); });
                    }
                    return this.jbExtend(options, context);
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
                    jbTemplate(options);
                    if (options.beforeInit)
                        this.methodHandler.jbBeforeInitFuncs.push(options.beforeInit);
                    if (options.init)
                        this.methodHandler.jbInitFuncs.push(options.init);
                    if (options.afterViewInit)
                        this.methodHandler.jbAfterViewInitFuncs.push(options.afterViewInit);
                    if (options.doCheck)
                        this.methodHandler.jbCheckFuncs.push(options.doCheck);
                    if (options.observable)
                        this.methodHandler.jbObservableFuncs.push(options.observable);
                    if (options.ctrlsEmFunc)
                        this.methodHandler.ctrlsEmFunc = options.ctrlsEmFunc;
                    if (options.extendCtx)
                        this.methodHandler.extendCtxFuncs.push(options.extendCtx);
                    if (options.extendComp)
                        jb_core_1.jb.extend(this, options.extendComp);
                    if (options.invisible)
                        this.invisible = true;
                    if (options.css)
                        options.styles = (options.styles || []).concat(options.css.split(/}\s*/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }));
                    //		options.styles = options.styles && (options.styles || []).map(st=> context.exp(st));
                    // fix ng limit - root style as style attribute at the template
                    (options.styles || [])
                        .filter(function (x) { return x.match(/^{([^]*)}$/m); })
                        .forEach(function (x) {
                        return jb_core_1.jb.path(options, ['atts', 'style'], x.match(/^{([^]*)}$/m)[1]);
                    });
                    (options.styles || [])
                        .filter(function (x) { return x.match(/^:/m); })
                        .forEach(function (x) { return _this.cssFixes.push(x); });
                    var annotations = this.annotations;
                    var overridable_props = ['selector', 'template', 'encapsulation'];
                    var extendable_array_props = ['styles'];
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
                    if (options.directives !== undefined)
                        annotations.directives = (annotations.directives || []).concat(jb_core_1.jb.toarray(options.directives).map(function (x) {
                            return typeof x == 'string' ? directivesObj[x] : x;
                        }));
                    options.atts = jb_core_1.jb.extend({}, options.atts, options.host); // atts is equvivalent to host
                    if (options.cssClass)
                        jb_core_1.jb.path(options, ['atts', 'class'], options.cssClass);
                    //		if (options.cssStyle) jb.path(options, ['atts', 'style'], options.cssStyle);
                    Object.getOwnPropertyNames(options.atts || {})
                        .forEach(function (att) {
                        var val = context.exp(options.atts[att]);
                        if (att == 'ngIf')
                            return jb_core_1.jb.path(annotations, ['host', 'template'], 'ngIf ' + val);
                        if (att == 'class' && jb_core_1.jb.path(annotations, ['host', 'class']))
                            val = jb_core_1.jb.path(annotations, ['host', 'class']) + ' ' + val;
                        if (att == 'style' && jb_core_1.jb.path(annotations, ['host', 'style']))
                            val = jb_core_1.jb.path(annotations, ['host', 'style']) + '; ' + val;
                        jb_core_1.jb.path(annotations, ['host', att], val);
                    });
                    if (annotations.template && typeof annotations.template != 'string')
                        debugger;
                    annotations.template = annotations.template && annotations.template.trim();
                    if (options.innerhost)
                        try {
                            var template = parseHTML("<div>" + (annotations.template || '') + "</div>");
                            Object.getOwnPropertyNames(options.innerhost || {}).forEach(function (selector) {
                                var elems = selector == '*' ? [template] : Array.from(template.querySelectorAll(selector));
                                elems.forEach(function (element) {
                                    Object.getOwnPropertyNames(options.innerhost[selector]).forEach(function (att) {
                                        var value = context.exp(options.innerhost[selector][att]);
                                        setTemplateAtt(element, att, value);
                                    });
                                });
                            });
                            annotations.template = template.innerHTML;
                        }
                        catch (e) {
                            jb_core_1.jb.logException(e, '');
                        }
                    // ng-model or ngmodel => ngModel
                    annotations.template = (annotations.template || '').replace(/(\(|\[|\*)ng-?[a-z]/g, function (st) { return st[0] + 'ng' + (st[3] == '-' ? st[4] : st[3]).toUpperCase(); });
                    (options.features || []).forEach(function (f) {
                        return _this.jbExtend(context.run(f), context);
                    });
                    (options.featuresOptions || []).forEach(function (f) {
                        return _this.jbExtend(f, context);
                    });
                    return this;
                };
                return jbComponent;
            }());
            jbComp = (function () {
                function jbComp(componentResolver) {
                    this.componentResolver = componentResolver;
                }
                jbComp.prototype.ngOnChanges = function (changes) {
                    var _this = this;
                    if (!this.comp)
                        return;
                    if (this.prev && !this.flatten) {
                        this.prev.destroy();
                        console.log('jb_comp: dynamically changing the component');
                    }
                    if (this.comp && this.comp.compile)
                        var compiled = this.comp.compile(this.componentResolver);
                    else
                        var compiled = this.componentResolver.resolveComponent(this.comp);
                    compiled.then(function (componentFactory) {
                        var cmp_ref = _this.childView.createComponent(componentFactory);
                        _this.comp.registerMethods && _this.comp.registerMethods(cmp_ref, _this);
                        _this.flattenjBComp(cmp_ref);
                    });
                };
                // very ugly: flatten the structure and pushing the dispose function to the group parent.
                jbComp.prototype.flattenjBComp = function (cmp_ref) {
                    var cmp = this;
                    cmp.prev = cmp_ref;
                    if (!cmp.flatten)
                        return;
                    // assigning the disposable functions on the parent cmp. Probably these lines will need a change on next ng versions
                    var parentCmp = cmp_ref.hostView._view.parentInjector._view.parentInjector._view._Cmp_0_4;
                    if (cmp._deleted_parent)
                        return jb_core_1.jb.logError('flattenjBComp: can not get parent component');
                    if (cmp._deleted_parent || !parentCmp)
                        return jb_core_1.jb.logError('flattenjBComp: deleted parent exists');
                    var to_keep = cmp_ref._hostElement.nativeElement;
                    var to_delete = to_keep.parentNode;
                    cmp._deleted_parent = to_delete;
                    // copy class and ng id attributes - for css
                    to_keep.className = ((to_keep.className || '') + ' ' + (to_delete.className || '')).trim();
                    Array.from(to_delete.attributes).map(function (x) { return x.name; })
                        .filter(function (x) { return x.match(/_ng/); })
                        .forEach(function (att) {
                        return to_keep.setAttribute(att, to_delete.getAttribute(att));
                    });
                    $(to_delete).replaceWith(to_keep);
                    parentCmp.jb_disposable = parentCmp.jb_disposable || [];
                    parentCmp.jb_disposable.push(function () {
                        try {
                            $(to_keep).replaceWith(cmp._deleted_parent);
                            cmp._deleted_parent.appendChild(to_keep);
                        }
                        catch (e) { }
                        cmp._deleted_parent = null;
                        cmp_ref.destroy();
                    });
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], jbComp.prototype, "comp", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], jbComp.prototype, "flatten", void 0);
                __decorate([
                    core_1.ViewChild('jb_comp', { read: core_1.ViewContainerRef }), 
                    __metadata('design:type', Object)
                ], jbComp.prototype, "childView", void 0);
                jbComp = __decorate([
                    core_1.Component({
                        selector: 'jb_comp',
                        template: '<div #jb_comp></div>',
                    }), 
                    __metadata('design:paramtypes', [core_1.ComponentResolver])
                ], jbComp);
                return jbComp;
            }());
            exports_1("jbComp", jbComp);
            jBartWidget = (function () {
                function jBartWidget(elementRef, ngZone) {
                    this.elementRef = elementRef;
                    this.ngZone = ngZone;
                }
                jBartWidget.prototype.ngOnInit = function () {
                    this.compId = this.elementRef.nativeElement.getAttribute('compID');
                    this.dialogs = jb_dialog.jb_dialogs.dialogs;
                    if (this.compId)
                        jbart.zones[this.compId] = this.ngZone;
                    this.draw();
                    this.initRedrawEm();
                };
                jBartWidget.prototype.ngAfterViewInit = function () {
                    jbart.widgetLoaded = true; // indication for waitForIframeLoad
                };
                jBartWidget.prototype.ngDoCheck = function () {
                    var _this = this;
                    if (this.compId == 'studio.all' && !jbart.redrawStudio)
                        jbart.redrawStudio = function () {
                            _this.draw(); // this.redrawEm.next(this.compId);
                        };
                    if (jbart.studioGlobals) {
                        this.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page;
                        this.redrawEm.next(this.compId);
                    }
                };
                jBartWidget.prototype.draw = function () {
                    this.comps = [];
                    try {
                        if (this.compId)
                            this.comps = [this.getOrCreateInitialCtx().run({ $: this.compId })];
                    }
                    catch (e) {
                        jb_core_1.jb.logException(e, '');
                    }
                };
                jBartWidget.prototype.initRedrawEm = function () {
                    var _this = this;
                    var cmp = this;
                    this.redrawEm = new jb_rx.Subject();
                    this.ngZone.runOutsideAngular(function () {
                        setInterval(function () {
                            return _this.redrawEm.next(_this.compId);
                        }, 555);
                    });
                    this.redrawEm
                        .map(function (id) {
                        return relevantSource(id);
                    })
                        .distinctUntilChanged()
                        .debounceTime(300) // unify fast changes wait before draw
                        .skip(1)
                        .subscribe(function (x) {
                        return cmp.draw();
                    });
                    this.ngZone.onUnstable
                        .map(function () { return _this.compId; }) // widget to show changed - no need to wait
                        .distinctUntilChanged()
                        .skip(1)
                        .subscribe(function (x) {
                        return cmp.draw();
                    });
                    function relevantSource(compID) {
                        if (compID == 'studio.all')
                            return '';
                        var ns = compID.split('.')[0];
                        return '' + jbart.previewRefreshCounter + Object.getOwnPropertyNames(jb_core_1.jb.comps).filter(function (id) { return id.indexOf(ns + '.') == 0; }).map(function (id) { return jb_core_1.jb.prettyPrint(jb_core_1.jb.comps[id].impl); }).join('');
                    }
                };
                jBartWidget.prototype.getOrCreateInitialCtx = function () {
                    if (!this.$jbInitialCtx) {
                        var ns = this.compId.split('.')[0];
                        var resources = (jb_core_1.jb.widgets[ns] && jb_core_1.jb.widgets[ns].resources) || {};
                        jb_core_1.jb.extend(resources, { window: window, globals: {} });
                        this.$jbInitialCtx = jb_core_1.jb.ctx({ ngMode: true, resources: resources, vars: { ngZone: this.ngZone } }, {});
                    }
                    if (jbart.studioGlobals)
                        return this.$jbInitialCtx.setVars({ studio: { project: jbart.studioGlobals.project, page: jbart.studioGlobals.page } });
                    return this.$jbInitialCtx;
                };
                jBartWidget = __decorate([
                    core_1.Component({
                        selector: 'jbart',
                        template: "<div *ngFor=\"let comp of comps\"><jb_comp [comp]=\"comp\"></jb_comp></div>\n\t\t\t\t<div *ngFor=\"let dialog of dialogs\">\n\t\t\t\t\t<jb_comp [comp]=\"dialog.comp\"></jb_comp>\n\t\t\t\t</div>",
                        directives: [jbComp]
                    }), 
                    __metadata('design:paramtypes', [core_1.ElementRef, core_1.NgZone])
                ], jBartWidget);
                return jBartWidget;
            }());
            exports_1("jBartWidget", jBartWidget);
            directivesObj = {};
        }
    }
});
