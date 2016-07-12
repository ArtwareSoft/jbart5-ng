import {jb} from 'jb-core';
import {enableProdMode, Directive, Component, View, ViewContainerRef, ViewChild, ComponentResolver, ElementRef, Injector, Input, provide, NgZone, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import {NgForm,FORM_DIRECTIVES,NgClass,NgStyle} from '@angular/common';

// import {ExceptionHandler} from 'angular2/src/facade/exception_handler';

import * as jb_rx from 'jb-ui/jb-rx';
import * as jb_dialog from 'jb-ui/dialog';

enableProdMode();
jbart.zones = jbart.zones || {}

export function apply(ctx) {
//	console.log('apply');
	jb.delay(1);
	ctx.vars.ngZone && ctx.vars.ngZone.run(()=>{})
}

var factory_hash = {}, cssFixes_hash = {};
class jbComponent {
	constructor(private ctx) {
		this.annotations = {};
		this.methodHandler = {jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [],jbCheckFuncs: [], jbObservableFuncs: [], extendCtxFuncs: [] };
		this.cssFixes = [];

		this.jb_profile = ctx.profile;
		var title = jb_tosingle(jb.val(this.ctx.params.title)) || (() => ''); 
		this.jb_title = (typeof title == 'function') ? title : () => ''+title;
		this.jb$title = (typeof title == 'function') ? title() : title; // for debug
	}
	initFromComp(comp) {
		this.annotations = Reflect.getMetadata('annotations', comp)[0];
		this.methodHandler = comp.methodHandler;
		this.comp = comp;
	}
	compile(compiler) {
		if (this.factory)
			return this.factory;
		if (factory_hash[this.hashkey()])
			this.factory = factory_hash[this.hashkey()];
		else
			this.factory = factory_hash[this.hashkey()] = compiler.resolveComponent(this.comp || this.createComp());

		return this.factory;
	}
	registerMethods(cmp_ref,parent) { // should be called by the instantiator
		var cmp = cmp_ref.hostView._view._Cmp_0_4;
		cmp.parentCmp = parent;
		cmp.ctx = this.ctx;
		cmp.methodHandler = this.methodHandler;
		if (this.cssFixes.length > 0) {
		  	var elem = cmp_ref._hostElement.nativeElement;
		  	var ngAtt = Array.from(elem.attributes).map(x=>x.name)
		  		.filter(x=>x.match(/_ng/))[0];

			var css = this.cssFixes
				.map(x=>`[${ngAtt}]${x}`)
				.join('\n');
			if (!cssFixes_hash[css]) {
				cssFixes_hash[css] = true;
				$(`<style type="text/css">${css}</style>`).appendTo($('head'));
			}
		}
	}
	hashkey() {
		return JSON.stringify(this.annotations)
	}
	createComp() {
	    this.jbExtend({directives: [NgClass, NgStyle, jbComp]});
	    if (!this.annotations.selector)	this.annotations.selector = 'div';

	    var Cmp = function(dcl, elementRef, ctx) { this.dcl = dcl; this.elementRef = elementRef }
		Cmp = Reflect.decorate([
			Component(this.annotations),
			Reflect.metadata('design:paramtypes', [ComponentResolver, ElementRef])
		], Cmp);
		Cmp.prototype.ngOnInit = function() {
			// if (this.ngOnInitAlreadyCalled)
			// 	debugger;
			// this.ngOnInitAlreadyCalled = true;
			try {
				if (this.methodHandler.jbObservableFuncs.length) {
					this.jbEmitter = this.jbEmitter || new jb_rx.Subject();
					this.methodHandler.jbObservableFuncs.forEach(observable=> observable(this.jbEmitter,this));
				}
	    		this.refreshCtx = (ctx2) => {
					this.methodHandler.extendCtxFuncs.forEach(extendCtx => {
		    			this.ctx = extendCtx(ctx2,this);
		    		})
		    		return this.ctx;
		    	}
		    	this.refreshCtx(this.ctx);
				this.methodHandler.jbBeforeInitFuncs.forEach(init=> init(this));
				this.methodHandler.jbInitFuncs.forEach(init=> init(this));
		    } catch(e) { jb.logException(e,'') }
		}
		Cmp.prototype.ngAfterViewInit = function() {
			this.methodHandler.jbAfterViewInitFuncs.forEach(init=> init(this));
			this.jbEmitter && this.jbEmitter.next('after-init');
			jb.delay(1).then(()=>{ // ugly huck to get event after children are initialized
				if (this.jbEmitter) {
					this.jbEmitter.next('after-init-children');
					if (this.readyCounter == null)
						this.jbEmitter.next('ready');
				}
			})
		}

		Cmp.prototype.ngDoCheck = function() {
			this.methodHandler.jbCheckFuncs.forEach(f=> 
				f(this));
			this.refreshModel && this.refreshModel();
			this.jbEmitter && this.jbEmitter.next('check');
		}
		Cmp.prototype.wait = function () {
			this.readyCounter = (this.readyCounter || 0)+1;
			if (this.parentCmp && this.parentCmp.wait)
				this.parentWaiting = this.parentCmp.wait();
			return {
				ready: () => {
					this.readyCounter--;
					if (!this.readyCounter) {
						this.jbEmitter && this.jbEmitter.next('ready');
						if (this.parentWaiting)
							this.parentWaiting.ready();
					}
				}
			}
		}
		return Cmp;
	}
	jbCtrl(context) {
		var options = mergeOptions(
			optionsOfProfile(context.params.style && context.params.style.profile),
			optionsOfProfile(context.profile));

		jb.path(options, ['atts','jb-path'], profilePath(context.profile)||''); // for the studio

		context.params.features && context.params.features(context).forEach(f => this.jbExtend(f,context))
		if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
			jb.toarray(context.params.style.profile.features)
				.forEach(f=>this.jbExtend(context.run(f),context))
		}
		return this.jbExtend(options,context);
	}
	jbExtend(options,context) {
    	context = context || this.ctx;
    	if (!context)
    		console.log('no context provided for jbExtend');
    	if (!options) return this;
    	if (typeof options != 'object')
    		debugger;
    	jbTemplate(options);
		if (options.beforeInit) this.methodHandler.jbBeforeInitFuncs.push(options.beforeInit);
		if (options.init) this.methodHandler.jbInitFuncs.push(options.init);
		if (options.afterViewInit) this.methodHandler.jbAfterViewInitFuncs.push(options.afterViewInit);
		if (options.doCheck) this.methodHandler.jbCheckFuncs.push(options.doCheck);
		if (options.observable) this.methodHandler.jbObservableFuncs.push(options.observable);
		if (options.ctrlsEmFunc) this.methodHandler.ctrlsEmFunc=options.ctrlsEmFunc;
		if (options.extendCtx) this.methodHandler.extendCtxFuncs.push(options.extendCtx);
		if (options.extendComp) jb.extend(this,options.extendComp);

		if (options.invisible) 
			this.invisible = true;

	   	if (options.css)
    		options.styles = (options.styles || []).concat(options.css.split(/}\s*/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'));

//		options.styles = options.styles && (options.styles || []).map(st=> context.exp(st));
		// fix ng limit - root style as style attribute at the template
    	(options.styles || [])
    		.filter(x=>x.match(/^{([^]*)}$/m))
    		.forEach(x=>
    			jb.path(options,['atts','style'],x.match(/^{([^]*)}$/m)[1]));

    	(options.styles || [])
    		.filter(x=>x.match(/^:/m))
    		.forEach(x=> this.cssFixes.push(x))

    	var annotations = this.annotations;
		var overridable_props = ['selector', 'template','encapsulation'];
		var extendable_array_props = ['styles'];

		overridable_props.forEach(prop => {
			if (options[prop] !== undefined || annotations[prop] != undefined)
				annotations[prop] = options[prop] || annotations[prop]
		});
		extendable_array_props.forEach(prop => {
			if (options[prop] !== undefined || annotations[prop] != undefined)
				annotations[prop] = (annotations[prop] || []).concat(jb.toarray(options[prop]))
		});

		if (options.disableChangeDetection)
			annotations.changeDetection = ChangeDetectionStrategy.OnPush;

		if (options.directives !== undefined)
				annotations.directives = (annotations.directives || []).concat(
					jb.toarray(options.directives).map(x=>
						typeof x == 'string' ? directivesObj[x] : x)
					)

		options.atts = jb.extend({},options.atts,options.host); // atts is equvivalent to host
		if (options.cssClass) jb.path(options, ['atts', 'class'], options.cssClass);
//		if (options.cssStyle) jb.path(options, ['atts', 'style'], options.cssStyle);
		Object.getOwnPropertyNames(options.atts || {})
			.forEach(att=>{
				var val = context.exp(options.atts[att]);
				if (att == 'ngIf')
				 	return jb.path(annotations, ['host', 'template'], 'ngIf ' + val);
				if (att == 'class' && jb.path(annotations, ['host', 'class']))
					val = jb.path(annotations, ['host', 'class']) + ' ' + val;
				if (att == 'style' && jb.path(annotations, ['host', 'style']))
					val = jb.path(annotations, ['host', 'style']) + '; ' + val;
				jb.path(annotations, ['host', att],val)
			})

		if (annotations.template && typeof annotations.template != 'string') debugger;
		annotations.template = annotations.template && annotations.template.trim();
		if (options.innerhost) 
		 try {
			var template = parseHTML(`<div>${annotations.template || ''}</div>`);
			Object.getOwnPropertyNames(options.innerhost || {}).forEach(function(selector) {
				var elems = selector == '*' ? [template] : Array.from(template.querySelectorAll(selector));
				elems.forEach(function(element) {
					Object.getOwnPropertyNames(options.innerhost[selector]).forEach(function(att) {
						var value = context.exp(options.innerhost[selector][att]);
						setTemplateAtt(element, att, value);
					})
				})
			});
			annotations.template = template.innerHTML;
	    } catch(e) { jb.logException(e,'') }
		// ng-model or ngmodel => ngModel
		annotations.template = (annotations.template || '').replace(/(\(|\[|\*)ng-?[a-z]/g, st => st[0] + 'ng' + (st[3] == '-' ? st[4] : st[3]).toUpperCase());

		(options.features || []).forEach(f => 
			this.jbExtend(context.run(f), context));
		
		(options.featuresOptions || []).forEach(f => 
			this.jbExtend(f, context))
		return this;
	}
}

export function ctrl(context) {
	var ctx = context.setVars({ $model: context.params });
	var styleOptions = defaultStyle(ctx);
	return new jbComponent(ctx).jbExtend(styleOptions).jbCtrl(ctx);

	function defaultStyle(ctx) {
		var profile = context.profile;
		var defaultVar = '$' + (profile.$ || '')+'.default-style-profile';
		if (!profile.style && context.vars[defaultVar])
			return ctx.run({$:context.vars[defaultVar]})
		return context.params.style(ctx);
	}
}


export function Comp(options,ctx) {
	return new jbComponent(ctx).jbExtend(options); //.createComp();
}

function optionsOfProfile(profile) {
	if (!profile) return {}
	var res = {};
	['cssClass','css'] // 'atts','styles',
		.forEach(p=> {if(profile[p]) res[p]=profile[p]});
	return res;
}

function mergeOptions(op1,op2) {
	var res = {};
	res.cssClass = ((op1.cssClass || '') + ' ' + (op2.cssClass || '')).trim();
//		res.cssStyle = ((op1.cssStyle || '') + ';' + (op2.cssStyle || '')).replace(/^;*/,'').replace(/;*$/,'');
	if (op1.styles || op2.styles)
		res.styles = (op1.styles || []).concat(op2.styles || [])
	return jb_extend({},op1,op2,res);
}

function setTemplateAtt(element,att,value) {
	if (!element.getAttribute) debugger;
	if (('' + value).indexOf('[object') != -1) return; // avoid bugs - no object host
	var currentVal = element.getAttribute(att);
	if (att == 'ngIf')
	 	element.setAttribute('template', 'ngIf ' + value);
	else if (att == 'class')
		element.setAttribute(att, currentVal ? currentVal + ' ' + value : value);
	else
		addAttribute(element, att, value);
}

function jbTemplate(options) {
	options.jbTemplate = (options.jbTemplate||'').trim();
	if (!options.jbTemplate) return
	var template = parseHTML(options.jbTemplate);
	var host = jb_extend({},options.host);
	Array.from(template.attributes||[])
		.filter(att=> {
			var ngAtt = att.name.indexOf('*ng') != -1;
			if (ngAtt)
				jb.logError('ng atts are not allowed in root element of template: ' + att.name, {ctx:ctrl_ctx,att:att})
			return !ngAtt;
		})
		.forEach(att=>host[att.name]=att.value);
	
	jb.extend(options, {
		template: template.innerHTML.trim(),
		selector: template.tagName,
		host: host
	})
}

function profilePath(profile) {
	// caching last component
	var lastFound = window.jb_lastFoundAt;
	if (lastFound && getPath(jb.comps[lastFound].impl, profile,0))
		return lastFound + '~' + getPath(jb.comps[lastFound].impl, profile,0).replace(/~*$/g,'')

	for(var comp in jb.comps) {
		var impl = jb.comps[comp].impl;
		if (typeof impl == 'function') continue;
		var res = getPath(impl, profile,0,impl);
		if (res) {
			window.jb_lastFoundAt = comp; // a kind of cache
			return (comp +'~'+res).replace(/~*$/g,'');
		}
	}
	function getPath(parent, dest, depth,comp) {
		if (depth > 50) debugger;
		if (!parent) return '';
		if (parent === dest) return '~'; // will be removed
		return Object.getOwnPropertyNames(parent).filter(p => typeof parent[p] === 'object' && p.indexOf('$jb') != 0).map(function(p) {
			var path = getPath(parent[p], dest, (depth || 0) + 1,comp);
			return path ? (p + '~' + path) : '';
		}).join(''); // only one will succeed
	}
}



@Component({
    selector: 'jb_comp',
    template: '<div #jb_comp></div>',
})
export class jbComp {
  @Input() comp;
  @Input() flatten;
  @ViewChild('jb_comp', {read: ViewContainerRef}) childView;
  constructor(private componentResolver:ComponentResolver) {}

  ngOnChanges(changes) {
  	if (!this.comp) return;

  	if (this.prev && !this.flatten) { // dynamically changing the component via user interaction
  		this.prev.destroy();
  		console.log('jb_comp: dynamically changing the component');
  	}
  	if (this.comp && this.comp.compile)
  		var compiled = this.comp.compile(this.componentResolver)
  	else
  		var compiled = this.componentResolver.resolveComponent(this.comp);

    compiled.then(componentFactory => {
    	var cmp_ref = this.childView.createComponent(componentFactory);
    	_this.comp.registerMethods && this.comp.registerMethods(cmp_ref,this);
        this.flattenjBComp(cmp_ref)
    });
  }

// very ugly: flatten the structure and pushing the dispose function to the group parent.
  flattenjBComp(cmp_ref) {
  	var cmp = this;
  	cmp.prev = cmp_ref;
  	if (!cmp.flatten) 
  		return;
  	// assigning the disposable functions on the parent cmp. Probably these lines will need a change on next ng versions
	var parentCmp = cmp_ref.hostView._view.parentInjector._view.parentInjector._view._Cmp_0_4;
  	if (cmp._deleted_parent)
  		return jb.logError('flattenjBComp: can not get parent component');
  	if (cmp._deleted_parent || !parentCmp)
  		return jb.logError('flattenjBComp: deleted parent exists');

  	var to_keep = cmp_ref._hostElement.nativeElement;
  	var to_delete = to_keep.parentNode
  	cmp._deleted_parent = to_delete;
  	// copy class and ng id attributes - for css
  	to_keep.className = ((to_keep.className||'') + ' ' + (to_delete.className||'')).trim();
  	Array.from(to_delete.attributes).map(x=>x.name)
  		.filter(x=>x.match(/_ng/))
  		.forEach(att=>
  			to_keep.setAttribute(att,to_delete.getAttribute(att))
  		)
	$(to_delete).replaceWith(to_keep);
  	parentCmp.jb_disposable = parentCmp.jb_disposable || [];
  	parentCmp.jb_disposable.push(() => { // put it back as it was, then dispose
  		try {
			$(to_keep).replaceWith(cmp._deleted_parent);
			cmp._deleted_parent.appendChild(to_keep);
		} catch(e) {}
		cmp._deleted_parent = null;
		cmp_ref.destroy();
	})
  }
}

export function controlsToGroupEmitter(controlsFunc, cmp) { 
	var controlsFuncAsObservable = ctx=> jb_rx.Observable.of(controlsFunc(ctx));
	return cmp.methodHandler.ctrlsEmFunc ? ctx => cmp.methodHandler.ctrlsEmFunc(controlsFuncAsObservable,ctx,cmp) : controlsFuncAsObservable;
}

export function ngRef(ref,cmp) {
	if (typeof ref == 'string' && ref.match(/{{.*}}/))
		return {$jb_parent: cmp, $jb_property: ref.match(/{{(.*)}}/)[1] }
	return ref;
}

export function twoWayBind(ref) {
	if (!ref) return {
		bindToCmp: () => {},
		valueExp: '',
		modelExp: '',
		observable: ctx => new jb_rx.Subject(), 
		getValue: () => null,
		writeValue: val => {}
	}

	var modelPath = 'jbModel';
	var bindToCmp = cmp => {
	  	  cmp.jbOnChange = ev => {
	  	  	if (ev.checked !== undefined)
	  	  		var val = ev.checked;
	  	  	else if (ev.target)
	  	  		var val = ev.target.type != 'checkbox' ? ev.target.value : ev.target.checked;
	  	   	jb.writeValue(ref,val);
	  	  }
		  cmp.refreshModel = () =>
		  		cmp[modelPath] = jb.val(ref);
	}
	// keyup for input change for select & checkbox
	var modelExp = `[(ngModel)] = "${modelPath}" (change)="jbOnChange($event)" (keyup)="jbOnChange($event)"`;

	return {
		bindToCmp: bindToCmp,
		valueExp: modelPath,
		modelExp: modelExp,

		observable: ctx => 
			jb_rx.refObservable(ref,ctx), 
		getValue: () => 
			jb.val(ref),
		writeValue: val => 
			jb.writeValue(ref,val)
	}
}

export function insertComponent(comp, resolver, parentView) {
  	return comp.compile(resolver).then(componentFactory => 
  		comp.registerMethods(parentView.createComponent(componentFactory),comp)
    )
}

export function parseHTML(text) {
	var res = document.createElement('div');
	res.innerHTML = text;
	return res.firstChild;
}
export function addAttribute(element, attrName, attrValue) {
	var tmpElm = document.createElement('p');
	tmpElm.innerHTML = "<p " + attrName + "='" + attrValue + "'></p>";
	var newAttr = tmpElm.children[0].attributes[0].cloneNode(true);
	element.setAttributeNode(newAttr);
}

@Component({
    selector: 'jbart',
	template:  `<div *ngFor="let comp of comps"><jb_comp [comp]="comp"></jb_comp></div>
				<div *ngFor="let dialog of dialogs">
					<jb_comp [comp]="dialog.comp"></jb_comp>
				</div>`,
	directives: [jbComp]
})
export class jBartWidget {
	constructor(private elementRef: ElementRef, public ngZone: NgZone) { }
	ngOnInit() { 
		this.compId = this.elementRef.nativeElement.getAttribute('compID');
		this.dialogs = jb_dialog.jb_dialogs.dialogs;
		if (this.compId)
			jbart.zones[this.compId] = this.ngZone;
		this.draw();
		this.initRedrawEm();
	}
	ngAfterViewInit() {
		jbart.widgetLoaded = true; // indication for waitForIframeLoad
	}
	ngDoCheck() {
		if (this.compId == 'studio.all' && !jbart.redrawStudio) // assign redrawStudio function
			jbart.redrawStudio = () => {
				this.draw(); // this.redrawEm.next(this.compId);
			}

		if (jbart.studioGlobals) { // preview
			this.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page;
			this.redrawEm.next(this.compId);
		}
	}

	private draw() {
		this.comps = [];
		try {
			if (this.compId)
				this.comps = [this.getOrCreateInitialCtx().run({ $: this.compId })];
		} catch(e) { 
			jb.logException(e,'') 
		}
	}

	private initRedrawEm() {
		var cmp = this;
		this.redrawEm = new jb_rx.Subject();

		this.ngZone.runOutsideAngular(() => {
			setInterval(()=>
				this.redrawEm.next(this.compId),600)
		})
			
		this.redrawEm 
//			  .debounceTime(600) // fast user reaction - must be run outside angular - see solution above
			  .map(id=>
			  	relevantSource(id))
			  .distinctUntilChanged()
			  .debounceTime(300) // unify fast changes wait before draw
			  .skip(1)
			  .subscribe(x => 
			  	cmp.draw())

			this.ngZone.onUnstable
			  	.map(()=>this.compId) // widget to show changed - no need to wait
			  	.distinctUntilChanged()
				.skip(1)
				.subscribe(
				  	x => 
				  	cmp.draw())

		function relevantSource(compID) {
			if (compID == 'studio.all') 
				return '';
			var ns = compID.split('.')[0];
			return '' + jbart.previewRefreshCounter + Object.getOwnPropertyNames(jb.comps).filter(id => id.indexOf(ns + '.') == 0).map(id => jb.prettyPrint(jb.comps[id].impl)).join('');
		}
	}

    private getOrCreateInitialCtx() {
    	if (!jbart.initialCtx) {
	    	var ns = this.compId.split('.')[0];
			var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
			jb.extend(resources, { window: window, globals: { } });
			jbart.initialCtx = jb.ctx({ ngMode: true, resources: resources, vars: {ngZone: this.ngZone} }, {});
		}
		if (jbart.studioGlobals)
			return jbart.initialCtx.setVars({studio: {project: jbart.studioGlobals.project, page: jbart.studioGlobals.page}})
		return jbart.initialCtx;
    }
}

export function wrapWithLauchingElement(f,context,elem) {
	var native = elem.nodeType ? elem : elem.nativeElement;
	return function() {
		f(context.setVars({ $launchingElement: { elem: elem, $el : $(native) }}));
	}
}

export function getZone(zoneId) {
	return new Promise((resolve,fail)=> {
		var counter = 30;
		var intervalID = setInterval(function() {
			if (jbart.zones[zoneId]) {
				window.clearInterval(intervalID);
				resolve(jbart.zones[zoneId]);
			}
			if (--counter <= 0) {
				window.clearInterval(intervalID);
				fail();
			}
		}, 100);	
	})
}

var directivesObj = {};
export function registerDirectives(obj) {
	jb.extend(directivesObj,obj)
}
