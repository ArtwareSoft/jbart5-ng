System.register(['jb-core', 'angular2/core', 'angular2/common', '@angular2-material/button/button.js', '@angular2-material/input/input.js', '@angular2-material/card/card.js', 'jb-ui/jb-rx', 'jb-ui/dialog'], function(exports_1, context_1) {
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
    var jb_core_1, core_1, common_1, button_js_1, input_js_1, card_js_1, jb_rx, jb_dialog;
    var MATERIAL_DIRECTIVES, jbComp, jBartWidget;
    function apply(ctx) {
        console.log('apply');
        jb_core_1.jb.delay(1);
        ctx.vars.ngZone && ctx.vars.ngZone.run(function () { });
    }
    exports_1("apply", apply);
    function ctrl(context) {
        var ctx = (ctx || context).setVars({ $model: context.params });
        var comp = defaultStyle(ctx);
        if (!comp) {
            console.log('style returned null', ctx);
            return Comp({}, ctx);
        }
        if (typeof comp == 'object')
            comp = Comp(comp, ctx);
        return enrichComp(comp, ctx).jbCtrl(ctx);
        function defaultStyle(ctx) {
            var profile = context.profile;
            var defaultVar = (profile.$ || '') + '.default-style-profile';
            if (!profile.style && context.vars[defaultVar])
                return ctx.run({ $: context.vars[defaultVar] });
            return context.params.style(ctx);
        }
    }
    exports_1("ctrl", ctrl);
    function Comp(options, context) {
        function Cmp(dcl, elementRef) { this.dcl = dcl; this.elementRef = elementRef; }
        Cmp = Reflect.decorate([
            core_1.Component({
                selector: 'div',
                template: options.template || '',
                directives: [MATERIAL_DIRECTIVES, common_1.FORM_DIRECTIVES, common_1.NgClass]
            }),
            Reflect.metadata('design:paramtypes', [core_1.DynamicComponentLoader, core_1.ElementRef])
        ], Cmp);
        return enrichComp(Cmp, context).jbExtend(options, context);
    }
    exports_1("Comp", Comp);
    function enrichComp(comp, ctrl_ctx) {
        if (!comp)
            debugger;
        if (comp.jbInitFuncs)
            return comp;
        comp.prototype.ctx = ctrl_ctx;
        jb_core_1.jb.extend(comp, { jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [], jbCheckFuncs: [], jbObservableFuncs: [] });
        comp.prototype.ngOnInit = function () {
            var _this = this;
            try {
                if (comp.jbObservableFuncs.length) {
                    this.jbEmitter = new jb_rx.Subject();
                    comp.jbObservableFuncs.forEach(function (observable) { return observable(_this.jbEmitter, _this); });
                }
                if (this.extendCtx)
                    this.ctx = this.extendCtx(comp.prototype.ctx, this);
                comp.jbBeforeInitFuncs.forEach(function (init) { return init(_this); });
                comp.jbInitFuncs.forEach(function (init) { return init(_this); });
            }
            catch (e) {
                jb_core_1.jb.logException(e, '');
            }
        };
        comp.prototype.ngAfterViewInit = function () {
            var _this = this;
            comp.jbAfterViewInitFuncs.forEach(function (init) { return init(_this); });
            this.jbEmitter && this.jbEmitter.next('after-init');
        };
        comp.prototype.ngDoCheck = function () {
            var _this = this;
            comp.jbCheckFuncs.forEach(function (f) { return f(_this); });
            this.jbEmitter && this.jbEmitter.next('check');
        };
        var annotations = Reflect.getMetadata('annotations', comp)[0];
        var overridable_props = ['selector', 'template'];
        var extendable_array_props = ['directives', 'styles'];
        var title = jb_tosingle(jb_core_1.jb.val(ctrl_ctx.params.title)) || (function () { return ''; });
        comp.jb_title = (typeof title == 'function') ? title : function () { return '' + title; };
        comp.jb$title = (typeof title == 'function') ? title() : title; // for debug
        //var extendable_obj_props = [];
        comp.jbExtend = function (options, context) {
            context = context || ctrl_ctx;
            if (!context)
                console.log('no context provided for jbExtend');
            if (!options)
                return comp;
            jbTemplate(options);
            if (options.beforeInit)
                comp.jbBeforeInitFuncs.push(options.beforeInit);
            if (options.init)
                comp.jbInitFuncs.push(options.init);
            if (options.afterViewInit)
                comp.jbAfterViewInitFuncs.push(options.afterViewInit);
            if (options.doCheck)
                comp.jbCheckFuncs.push(options.doCheck);
            if (options.observable)
                comp.jbObservableFuncs.push(options.observable);
            if (options.ctrlsEmFunc)
                comp.prototype.ctrlsEmFunc = options.ctrlsEmFunc;
            if (options.extendCtx)
                comp.prototype.extendCtx = options.extendCtx;
            if (options.input)
                Reflect.decorate([core_1.Input(), Reflect.metadata('design:type', Object)], comp.prototype, options.input, void 0);
            options.template = options.template && context.exp(options.template);
            if (options.css)
                options.styles = (options.styles || []).concat(options.css.split(/}$/m).map(function (x) { return x.trim(); }).filter(function (x) { return x; }).map(function (x) { return x + '}'; }));
            options.styles = options.styles && (options.styles || []).map(function (st) { return context.exp(st); });
            (options.styles || [])
                .filter(function (x) { return x.match(/^{([^]*)}$/m); })
                .forEach(function (x) { return jb_core_1.jb.path(options, ['atts', 'style'], x.match(/^{([^]*)}$/m)[1]); });
            overridable_props.forEach(function (prop) { return annotations[prop] = options[prop] || annotations[prop]; });
            extendable_array_props.forEach(function (prop) { return annotations[prop] = (annotations[prop] || []).concat(jb_core_1.jb.toarray(options[prop])); });
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
            annotations.template = annotations.template.replace(/(\(|\[|\*)ng-?[a-z]/g, function (st) { return st[0] + 'ng' + (st[3] == '-' ? st[4] : st[3]).toUpperCase(); });
            (options.features || []).forEach(function (f) {
                return comp.jbExtend(context.run(f), context);
            });
            (options.featuresOptions || []).forEach(function (f) {
                return comp.jbExtend(f, context);
            });
            return comp;
        };
        comp.jbCtrl = function (context) {
            var options = mergeOptions(optionsOfProfile(context.params.style && context.params.style.profile), optionsOfProfile(context.profile));
            jb_core_1.jb.path(options, ['atts', 'jb-path'], profilePath(context.profile) || ''); // for the studio
            context.params.features && context.params.features(context).forEach(function (f) { return comp.jbExtend(f, context); });
            if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
                jb_core_1.jb.toarray(context.params.style.profile.features)
                    .forEach(function (f) { return comp.jbExtend(context.run(f), context); });
            }
            return comp.jbExtend(options, context);
        };
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
        return comp;
    }
    exports_1("enrichComp", enrichComp);
    function controlsToGroupEmitter(controlsFunc, cmp) {
        var controlsFuncAsObservable = function (ctx) { return jb_rx.Observable.of(controlsFunc(ctx)); };
        return cmp.ctrlsEmFunc ? function (ctx) { return cmp.ctrlsEmFunc(controlsFuncAsObservable, ctx, cmp); } : controlsFuncAsObservable;
    }
    exports_1("controlsToGroupEmitter", controlsToGroupEmitter);
    function ngRef(ref, cmp) {
        if (typeof ref == 'string' && ref.match(/{{.*}}/))
            return { $jb_parent: cmp, $jb_property: ref.match(/{{(.*)}}/)[1] };
        return ref;
    }
    exports_1("ngRef", ngRef);
    function twoWayBind(ref) {
        if (ref.$jb_parent) {
            var fieldName = ref.$jb_property;
            var parentName = ref.$jb_parent.$jb_property || 'model';
            var modelPath = parentName + '.' + fieldName;
            var bindToCmp = function (cmp) {
                return cmp[parentName] = ref.$jb_parent;
            };
            var modelExp = "[(ngModel)] = \"" + modelPath + "\"";
        }
        else if (ref.$jb_val) {
            var modelPath = '$jbModel';
            var bindToCmp = function (cmp) {
                cmp.writeValue = function (val) {
                    return jb_core_1.jb.writeValue(ref, val);
                };
                cmp.$jbModel = jb_core_1.jb.val(ref);
                jb_rx.refObservable(ref, cmp.ctx).subscribe(function () {
                    return cmp.$jbModel = jb_core_1.jb.val(ref);
                });
            };
            // keyup for input change for select
            var modelExp = "[(ngModel)] = \"" + modelPath + "\" (keyup)=\"writeValue($event.target.value)\" (change)=\"writeValue($event.target.value)\"";
        }
        return {
            bindToCmp: bindToCmp,
            valueExp: modelPath,
            modelExp: modelExp,
            observable: function (ctx) { return jb_rx.refObservable(ref, ctx); },
            getValue: function () { return jb_core_1.jb.val(ref); },
            writeValue: function (val) { return jb_core_1.jb.writeValue(ref, val); }
        };
    }
    exports_1("twoWayBind", twoWayBind);
    function loadIntoLocation(comp, parentCmp, id, context) {
        try {
            return parentCmp.dcl.loadIntoLocation(comp, parentCmp.elementRef, id);
        }
        catch (e) {
            debugger;
            jb_core_1.jb.logException(e, '');
        }
    }
    exports_1("loadIntoLocation", loadIntoLocation);
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
    // export var jBart = jBartWidget; //(window.parent != window && window.parent.jb_studio_window) ? jBartInStudio : jBartPlain;
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
            function (button_js_1_1) {
                button_js_1 = button_js_1_1;
            },
            function (input_js_1_1) {
                input_js_1 = input_js_1_1;
            },
            function (card_js_1_1) {
                card_js_1 = card_js_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (jb_dialog_1) {
                jb_dialog = jb_dialog_1;
            }],
        execute: function() {
            MATERIAL_DIRECTIVES = [button_js_1.MdButton, button_js_1.MdAnchor, input_js_1.MdInput, card_js_1.MdCard];
            core_1.enableProdMode();
            jbart.zones = jbart.zones || {};
            jbComp = (function () {
                function jbComp(dcl, elementRef) {
                    this.dcl = dcl;
                    this.elementRef = elementRef;
                }
                jbComp.prototype.ngOnInit = function () {
                    var cmp = this;
                    var parentCmp = cmp.elementRef._appElement.parentView.context;
                    var r = loadIntoLocation(this.comp, this, 'jb_comp');
                    if (!r)
                        debugger;
                    r.then(function (ref) {
                        if (!cmp.flatten)
                            return;
                        // very ugly: flatten the structure and pushing the dispose function to the group parent.
                        var to_keep = $(ref.location.nativeElement);
                        if (cmp._parent)
                            debugger;
                        cmp._parent = to_keep.parent();
                        // copy class and ng id attributes - for css
                        to_keep.addClass(to_keep.parent().attr('class') || '');
                        Array.from(to_keep.parent()[0].attributes)
                            .map(function (x) { return x.name; }).filter(function (x) { return x.match(/_ng/); })
                            .forEach(function (att) { return to_keep.attr(att, ''); });
                        to_keep.parent().replaceWith(to_keep);
                        parentCmp.jb_disposable = parentCmp.jb_disposable || [];
                        parentCmp.jb_disposable.push(function () {
                            try {
                                to_keep.replaceWith(cmp._parent);
                                cmp._parent.append(to_keep);
                            }
                            catch (e) { }
                            cmp._parent = null;
                            ref.dispose();
                        });
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
                jbComp = __decorate([
                    core_1.Component({
                        selector: 'jb_comp',
                        template: '<div #jb_comp></div>',
                    }), 
                    __metadata('design:paramtypes', [core_1.DynamicComponentLoader, core_1.ElementRef])
                ], jbComp);
                return jbComp;
            }());
            exports_1("jbComp", jbComp);
            jBartWidget = (function () {
                function jBartWidget(dcl, elementRef, ngZone) {
                    this.dcl = dcl;
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
                    jbart.widgetLoaded = true; // for studio
                };
                jBartWidget.prototype.ngDoCheck = function () {
                    var _this = this;
                    if (this.compId == 'studio.all' && jbart.redrawStudio)
                        jbart.redrawStudio = function () {
                            return _this.redrawEm.next(_this.compId);
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
                    var cmp = this;
                    this.redrawEm = new jb_rx.Subject();
                    this.redrawEm // source change - wait 1 sec
                        .debounceTime(300)
                        .map(function (id) { return relevantSource(id); })
                        .distinctUntilChanged()
                        .subscribe(function (x) { return cmp.draw(); });
                    this.redrawEm // widget to show changed - no need to wait
                        .distinctUntilChanged()
                        .subscribe(function (x) { return cmp.draw(); });
                    function relevantSource(compID) {
                        var ns = compID.split('.')[0];
                        return Object.getOwnPropertyNames(jb_core_1.jb.comps).filter(function (id) { return id.indexOf(ns + '.') == 0; }).map(function (id) { return jb_core_1.jb.prettyPrint(jb_core_1.jb.comps[id].impl); }).join('');
                    }
                };
                jBartWidget.prototype.getOrCreateInitialCtx = function () {
                    if (this.$jbInitialCtx)
                        return this.$jbInitialCtx;
                    var ns = this.compId.split('.')[0];
                    var resources = (jb_core_1.jb.widgets[ns] && jb_core_1.jb.widgets[ns].resources) || {};
                    var ctx = jb_core_1.jb.ctx({ ngMode: true, resources: resources, vars: { ngZone: this.ngZone } }, {});
                    jb_core_1.jb.extend(resources, { window: window, globals: {} });
                    Object.getOwnPropertyNames(resources).forEach(function (id) {
                        var r = resources[id];
                        if (r && r.$)
                            resources[id] = ctx.run(r);
                    });
                    this.$jbInitialCtx = ctx;
                    return ctx;
                };
                jBartWidget = __decorate([
                    core_1.Component({
                        selector: 'jbart',
                        template: "<div *ngFor=\"#comp of comps\"><jb_comp [comp]=\"comp\"></jb_comp></div>\n\t\t\t\t<div *ngFor=\"#dialog of dialogs\">\n\t\t\t\t\t<jb_comp [comp]=\"dialog.comp\"></jb_comp>\n\t\t\t\t</div>",
                        directives: [jbComp]
                    }), 
                    __metadata('design:paramtypes', [core_1.DynamicComponentLoader, core_1.ElementRef, core_1.NgZone])
                ], jBartWidget);
                return jBartWidget;
            }());
            exports_1("jBartWidget", jBartWidget);
        }
    }
});
//export var injector = Injector.resolveAndCreate([Location]);
//export var ngZone = injector.get(NgZone);