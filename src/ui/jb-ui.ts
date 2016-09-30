import {jb} from 'jb-core';
import { enableProdMode, Directive, Component, View, ViewContainerRef, ViewChild, Compiler, ElementRef, Injector, Input, provide, NgZone, ViewEncapsulation, ChangeDetectionStrategy} from '@angular/core';
import { NG_VALUE_ACCESSOR,ControlValueAccessor, DefaultValueAccessor, disableDeprecatedForms, provideForms } from '@angular/forms';
import {HTTP_PROVIDERS} from '@angular/http';

import {NgClass,NgStyle} from '@angular/common';
import {PORTAL_DIRECTIVES} from '@angular2-material/core/portal/portal-directives'; // bug fix for @angular2-material
import {MD_RIPPLE_DIRECTIVES} from '@angular2-material/core/ripple/ripple'; // bug fix for @angular2-material


import * as jb_rx from 'jb-ui/jb-rx';
import * as jb_dialog from 'jb-ui/dialog';

enableProdMode();
jbart.zones = jbart.zones || {}

export function apply(ctx) {
//	console.log('apply');
	return jb.delay(1).then(() =>
			ctx.vars.ngZone && ctx.vars.ngZone.run(()=>{}))
}

export function delayOutsideAngular(ctx,func) {
	return ctx.vars.ngZone.runOutsideAngular(() =>
		jb.delay(1).then(()=>
			Promise.resolve(func()))
	)
}

export function applyPreview(ctx) {
    var _win = jbart.previewWindow || window;
    jb.delay(1).then(()=>
		jb.entries(_win.jbart.zones).forEach(x=>x[1].run(()=>{}))
	)
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
			try { 
			this.factory = factory_hash[this.hashkey()] = compiler.compileComponentSync(this.comp || this.createComp());
		} catch (e) {
			jb.logError('ng compilation error',this, e);
			throw e;
		}
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
				.map(x=>x.replace(/^!/,' ')) // replace the ! with space to allow internal selector
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
	    this.jbExtend({directives: [NgClass, NgStyle, jbComp, PORTAL_DIRECTIVES, MD_RIPPLE_DIRECTIVES] });
	    if (!this.annotations.selector)	this.annotations.selector = 'div';

	    var Cmp = function(dcl, elementRef, ctx) { this.dcl = dcl; this.elementRef = elementRef }
		Cmp = Reflect.decorate([
			Component(this.annotations),
			Reflect.metadata('design:paramtypes', [Compiler, ElementRef])
		], Cmp);
		Cmp.prototype.ngOnInit = function() {
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
			delayOutsideAngular(this.ctx,()=>{ 
				if (this.jbEmitter && !this.jbEmitter.hasCompleted) {
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
		Cmp.prototype.ngOnDestroy = function() {
			this.jbEmitter && this.jbEmitter.next('destroy');
			this.jbEmitter && this.jbEmitter.complete();
		}

		Cmp.prototype.jbWait = function () {
			this.readyCounter = (this.readyCounter || 0)+1;
			if (this.parentCmp && this.parentCmp.jbWait)
				this.parentWaiting = this.parentCmp.jbWait();
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

		cleanCtxDictionary();
//		this.callerPath = (context.path.indexOf('~') == -1 && context.componentContext) ? context.componentContext.callerPath:  context.path;
//		jb.path(options, ['atts','jb-path'], this.callerPath); // for pick & edit
		jb.path(options, ['atts','jb-ctx'], context.id); // for pick & edit
		jbart.ctxDictionary[context.id] = context;

		(context.params.features && context.params.features(context) || []).forEach(f => this.jbExtend(f,context))
		if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
			jb.toarray(context.params.style.profile.features)
				.forEach((f,i)=>
					this.jbExtend(context.runInner(f,{type:'feature'},context.path+'~features~'+i),context))
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
    		.filter(x=>x.match(/^:/m)) // for example :hover
    		.forEach(x=> {
    			if (this.cssFixes.indexOf(x) == -1)
    				this.cssFixes.push(x);
    		});

    	(options.styles || [])
    		.filter(x=>x.match(/^!/m)) // ! affect internal selectors
    		.forEach(x=> {
    			if (this.cssFixes.indexOf(x) == -1)
    				this.cssFixes.push(x);
    		});

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
						typeof x == 'string' ? jbart.ng.directives[x] : x)
					)

		options.atts = jb.extend({},options.atts,options.host); // atts is equvivalent to host
		if (options.cssClass) jb.path(options, ['atts', 'class'], options.cssClass);
		Object.getOwnPropertyNames(options.atts || {})
			.forEach(att=>{
				var val = context.exp(options.atts[att]).trim();
				if (att == 'ngIf')
				 	return jb.path(annotations, ['host', 'template'], 'ngIf ' + val);
				if (att == 'class' && jb.path(annotations, ['host', 'class']))
					val = jb.path(annotations, ['host', 'class']) + ' ' + val;
				if (att == 'style' && (jb.path(annotations, ['host', 'style'])||'').indexOf(val) == -1)
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
		var defaultVar = '$theme.' + (profile.$ || '');
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

// export function profilePath(profile) { // export for tests
// 	// caching last component
// 	var lastFound = window.jb_lastFoundAt;
// 	if (lastFound && getPath(jb.comps[lastFound].impl, profile,0))
// 		return lastFound + '~' + getPath(jb.comps[lastFound].impl, profile,0).replace(/~*$/g,'')

// 	for(var comp in jb.comps) {
// 		var impl = jb.comps[comp].impl;
// 		if (typeof impl == 'function') continue;
// 		var res = getPath(impl, profile,0,impl);
// 		if (res) {
// 			window.jb_lastFoundAt = comp; // a kind of cache
// 			return (comp +'~'+res).replace(/~*$/g,'');
// 		}
// 	}
// 	function getPath(parent, dest, depth,comp) {
// 		if (depth > 50) debugger;
// 		if (!parent) return '';
// 		if (parent === dest) return '~'; // will be removed
// 		return Object.getOwnPropertyNames(parent)
// 			.filter(p => typeof parent[p] === 'object' && p.indexOf('$jb') != 0)
// 			.map(function(p) {
// 				var path = getPath(parent[p], dest, (depth || 0) + 1,comp);
// 				return path ? (p + '~' + path) : '';
// 			}).join(''); // only one will succeed
// 	}
// }


@Component({
    selector: 'jb_comp',
    template: '<div #jb_comp></div>',
})
export class jbComp {
  @Input() comp;
  @Input() flatten;
  @ViewChild('jb_comp', {read: ViewContainerRef}) childView;
  constructor(private compiler :Compiler,private ngZone: NgZone) {}

  ngOnInit() {
  	// redraw if script changed at studio
		(jbart.modifiedCtrlsEm || jb_rx.Observable.of())
				.merge(jbart.studioModifiedCtrlsEm || jb_rx.Observable.of())
				.flatMap(e=> {
					if (this.comp && [this.comp.callerPath, this.comp.ctx && this.comp.ctx.path].indexOf(e.path) != -1) {
						jb.delay(100,this.comp.ctx).then(() => {// height in delay
							var elemToHighlight = this._nativeElement;
							if (e.ngPath)
								elemToHighlight = e.ngPath.split('~').reduce((elem,index)=>
									elem && Array.from(elem.children)[index]
									, elemToHighlight.firstChild)

				  			$(elemToHighlight).addClass('jb-highlight-comp-changed')
				  		});

						if (jbart.profileFromPath) {
							var prof = jbart.profileFromPath(e.path);
							var ctxToRun = this.comp.ctx.ctx({profile: prof, comp: e.path,path:''});
							var comp = ctxToRun.runItself();
							return [comp];
						}
					}
					return [];
				})
				.startWith(this.comp)
				.filter(x=>
					x)
				.subscribe(comp=> {
					this.draw(comp);
					if (comp != this.comp) // changed
						applyPreview(comp.ctx);
					this.comp = comp;
				})
  }

  draw(comp) {
  	if (!comp) return;

  	if (this.jbDispose) {
  		this.jbDispose();
  		console.log('jb_comp: replacing existing component');
  	}
  	this.ngZone.runOutsideAngular(() => {
	  	if (comp && comp.compile)
	  		var componentFactory = comp.compile(this.compiler)
	  	else
	  		var componentFactory = this.compiler.compileComponentSync(comp);

	   	var cmp_ref = this.childView.createComponent(componentFactory);
	   	comp.registerMethods && comp.registerMethods(cmp_ref,this);
	    this.flattenjBComp(cmp_ref);
	})
  }

 jbWait() {
	this.readyCounter = (this.readyCounter || 0)+1;
	if (this.parentCmp && this.parentCmp.jbWait)
		this.parentWaiting = this.parentCmp.jbWait();
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

// very ugly: flatten the structure and pushing the dispose function to the group parent.
  flattenjBComp(cmp_ref) {
  	var cmp = this;
  	cmp.jbDispose = () => 
  		cmp_ref.destroy();

  	this._nativeElement = cmp_ref._hostElement.nativeElement;
  	// assigning the disposable functions on the parent cmp. Probably these lines will need a change on next ng versions
	var parentInjector = cmp_ref.hostView._view.parentInjector._view.parentInjector._view;
	var parentCmp = parentInjector && (parentInjector._Cmp_0_4 || parentInjector.context);
  	if (!parentCmp)
  		return jb.logError('flattenjBComp: can not get parent component');
  	if (cmp._deleted_parent)
  		return jb.logError('flattenjBComp: deleted parent exists');
  	this.parentCmp = parentCmp;
  	if (!cmp.flatten) 
  		return;

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
  	
  	cmp.jbDispose = () => { // put it back as it was, then dispose
  		if (!cmp._deleted_parent) return; // already deleted
  		try {
			$(to_keep).replaceWith(cmp._deleted_parent);
			cmp._deleted_parent.appendChild(to_keep);
		} catch(e) {}
		cmp._deleted_parent = null;
		cmp_ref.destroy();
  	}
  	parentCmp.jb_disposable.push(cmp.jbDispose)
  }
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
	setNgPath(res.firstChild.firstChild,'');
	return res.firstChild;

	function setNgPath(elem,curPath) {
		if (!elem || elem.nodeType != 1) return;
		addAttribute(elem, 'ng-path', curPath);
		Array.from(elem.children).forEach((e,index)=>
			setNgPath(e,curPath === '' ? index : (curPath+'~'+index))
		)
	}
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
	constructor(private elementRef: ElementRef, public ngZone: NgZone, private injector: Injector) { }
	ngOnInit() { 
		jbart.widgetLoaded = true; // indication for waitForIframeLoad
		this.compId = this.elementRef.nativeElement.getAttribute('compID');
		this.dialogs = jbart.jb_dialogs.dialogs;
		if (this.compId)
			jbart.zones[this.compId] = this.ngZone;

		if (this.compId == 'studio.all') // assign redrawStudio function
			jbart.redrawStudio = () =>
				this.draw();
	}

	ngAfterViewInit() {
		jb.delay(100).then(()=>{
			if (jbart.modifyOperationsEm) { // studio source changes
				this.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page;
				var counterChange = jbart.studioActivityEm
					.map(x=>jbart.previewRefreshCounter)
					.distinctUntilChanged()

				var compIdEm = jbart.studioActivityEm
					.map(()=>
							this.compId = jbart.studioGlobals.project + '.' + jbart.studioGlobals.page)
					.distinctUntilChanged()
					.merge(counterChange)
					.startWith(this.compId);

				compIdEm.subscribe(()=>
							this.draw())
			} else { // no studio
				this.draw();
			}
		})
	}

	private draw() {
		this.comps = [];
		try {
			if (this.compId)
				this.comps = [jb_run(jb.ctx(this.getOrCreateInitialCtx(),
					{ profile:{ $: this.compId }, comp: this.compId, path: '' })) ];
		} catch(e) { 
			jb.logException(e,'') 
		}	
	}

    private getOrCreateInitialCtx() {
    	if (!jbart.initialCtx) {
	    	var ns = this.compId.split('.')[0];
			var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
			jb.extend(resources, { window: window, globals: { } });
			jbart.initialCtx = jb.ctx({ resources: resources, vars: {ngZone: this.ngZone, injector: this.injector} }, {});
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

jbart.ng = {
	providers: {
		provideForms: provideForms(), 
		disableDeprecatedForms: disableDeprecatedForms(),
		HTTP_PROVIDERS: HTTP_PROVIDERS
	},
	directives: {}
}

export function registerDirectives(obj) {
	jb.extend(jbart.ng.directives,obj)
}
export function registerProviders(obj) {
	jb.extend(jbart.ng.providers,obj)
}

function cleanCtxDictionary() {
	var now = new Date().getTime();
	jbart.ctxDictionaryLastCleanUp = jbart.ctxDictionaryLastCleanUp || now;
	var timeSinceLastCleanUp = now - jbart.ctxDictionaryLastCleanUp;
	if (timeSinceLastCleanUp < 10000) 
		return;
	jbart.ctxDictionaryLastCleanUp = now;

	var used = Array.from(document.querySelectorAll('[jb-ctx]')).map(e=>Number(e.getAttribute('jb-ctx'))).sort((x,y)=>x-y);
	var dict = Object.getOwnPropertyNames(jbart.ctxDictionary).map(x=>Number(x)).sort((x,y)=>x-y);
	var lastUsedIndex = 0;
	for(var i=0;i<dict.length;i++) {
		while (used[lastUsedIndex] < dict[i])
			lastUsedIndex++;
		if (used[lastUsedIndex] > dict[i])
			delete jbart.ctxDictionary[''+dict[i]];
	}
}