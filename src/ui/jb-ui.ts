import {jb} from 'jb-core';
import { enableProdMode, Compiler, Renderer, NgModule, Component, Directive, View, ViewContainerRef, ViewChild, ViewChildElementRef, ElementRef, TemplateRef, Injector, Input, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import * as jb_rx from 'jb-ui/jb-rx';

enableProdMode();
//jbart.zones = jbart.zones || {}

export function apply(ctx) {
    jb.logPerformance('apply',ctx.profile.$);
	return jb.delay(1).then(() =>
			ctx.vars.ngZone && ctx.vars.ngZone.run(()=>{}))
}

export function delayOutsideAngular(ctx,func) {
	jb.delay(1,ctx).then(func);
}

export function applyPreview(ctx) {
    var _win = jbart.previewWindow || window;
    _win.setTimeout(()=>{},1);
 //    jb.delay(1).then(()=>
	// 	jb.entries(_win.jbart.zones).forEach(x=>x[1].run(()=>{}))
	// )
}

var factory_hash = {}, cssFixes_hash = {}; // compiledFactories()

class jbComponent {
	constructor(private ctx) {
		this.annotations = {};
		this.methodHandler = {jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [],jbCheckFuncs: [],jbDestroyFuncs: [], jbObservableFuncs: [], extendCtxFuncs: [] };
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
		var key = this.hashkey();
		if (factory_hash[key])
			return factory_hash[key];
		this.doCompile(compiler,this.createComp());
		factory_hash[key] = this.factory;
		return this.factory;
	}
	doCompile(compiler,comp,inError) {
		this.comp = comp;
		var dynamicModule = this.wrapCompWithModule(comp);
		try { 
			var ret = compiler.compileModuleAndAllComponentsSync(dynamicModule);
			this.factory = ret.componentFactories.find(x => x.componentType === comp);
		} catch (e) {
			if (!inError)
				this.doCompile(compiler,this.nullComp(),true)
			jb.logError('ng compilation error',this, e);
		}
	}
	wrapCompWithModule(comp) {
	    var DynamicModule = function() { }
		var DynamicModule = Reflect.decorate([
			NgModule({
				imports: [jbCompModule, CommonModule, BrowserModule, FormsModule] 
						.concat(this.annotations.imports || []).filter(x=>x),
				providers : this.annotations.providers,
  				declarations: [comp],
  				exports: [comp]
  			}),
		], DynamicModule);

		return DynamicModule;
	}
	registerMethods(cmp_ref) { // should be called by the instantiator
		var cmp = cmp_ref._hostElement.component; // hostView._view._Cmp_0_4;
//		cmp.parentCmp = parent;
		var ctx = this.ctx;
		cmp.ctx = ctx;
		cmp.methodHandler = this.methodHandler;
	  	var elem = cmp_ref._hostElement.nativeElement;
	  	while (ctx.profile.__innerImplementation)
	  		ctx = ctx.componentContext._parent;
	  	var attachedCtx = this.forceCtx || ctx;
	  	elem.setAttribute('jb-ctx',attachedCtx.id);
		garbageCollectCtxDictionary();
		jbart.ctxDictionary[attachedCtx.id] = attachedCtx;

		if (this.cssFixes.length > 0) {
		  	var ngAtt = Array.from(elem.attributes).map(x=>x.name)
		  		.filter(x=>x.match(/_ng/))[0];

			var css = this.cssFixes
				.map(x=>x.trim())
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
		return JSON.stringify(jb.extend({},this.annotations,{
			imports: '', providers: '',
			host: jb.extend({},this.annotations.host || {}),
		}));
	}
	nullComp() {
	    var Cmp = function() {}
		Cmp = Reflect.decorate([
			Component({selector: 'jb-comp', template: '<div></div>'}),
		], Cmp);
		return Cmp;
	}
	createComp() {
	    if (!this.annotations.selector)	this.annotations.selector = 'jb-comp';

	    var Cmp = function(elementRef, ngZone, changeDetection, renderer) { this.elementRef = elementRef; this.ngZone = ngZone; this.changeDt =  changeDetection; this.renderer = renderer }
		Cmp = Reflect.decorate([
			Component(this.annotations),
			Reflect.metadata('design:paramtypes', [ElementRef, NgZone, ChangeDetectorRef, Renderer])
		], Cmp);
		injectLifeCycleMethods(Cmp);
		return Cmp;
	}


	jbCtrl(context) {
		var features = (context.params.features && context.params.features(context) || []);
		features.forEach(f => this.jbExtend(f,context));
		if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
			jb.toarray(context.params.style.profile.features)
				.forEach((f,i)=>
					this.jbExtend(context.runInner(f,{type:'feature'},context.path+'~features~'+i),context))
		}
		return this;
	}
	jbExtend(options,context) {
    	context = context || this.ctx;
    	if (!context)
    		console.log('no context provided for jbExtend');
    	if (!options) return this;
    	if (typeof options != 'object')
    		debugger;
//    	jbTemplate(options);
		if (options.beforeInit) this.methodHandler.jbBeforeInitFuncs.push(options.beforeInit);
		if (options.init) this.methodHandler.jbInitFuncs.push(options.init);
		if (options.afterViewInit) this.methodHandler.jbAfterViewInitFuncs.push(options.afterViewInit);
		if (options.doCheck) this.methodHandler.jbCheckFuncs.push(options.doCheck);
		if (options.destroy) this.methodHandler.jbDestroyFuncs.push(options.destroy);
		if (options.observable) this.methodHandler.jbObservableFuncs.push(options.observable);
//		if (options.ctrlsEmFunc) this.methodHandler.ctrlsEmFunc=options.ctrlsEmFunc;
		if (options.extendCtx) 
			this.methodHandler.extendCtxFuncs.push(options.extendCtx);
		if (options.extendComp) jb.extend(this,options.extendComp);

	   	if (options.css)
    		options.styles = (options.styles || [])
    				.concat(options.css.split(/}\s*/m)
    				.map(x=>x.trim())
    				.filter(x=>x)
    				.map(x=>x+'}'));

		options.styles = options.styles && (options.styles || []).map(st=> context.exp(st)).map(x=>x.trim());
		// fix ng limit - root style as style attribute at the template
    	(options.styles || [])
    		.filter(x=>x.match(/^{([^]*)}$/m))
    		.forEach(x=> {
    			if (this.cssFixes.indexOf(x) == -1)
    				this.cssFixes.push('>*'+x);
    		});
    		// .forEach(x=>
    		// 	jb.path(options,['atts','style'],x.match(/^{([^]*)}$/m)[1]));

    	(options.styles || [])
    		.filter(x=>x.match(/^:/m)) // for example :hover
    		.forEach(x=> {
    			if (this.cssFixes.indexOf(x) == -1)
    				this.cssFixes.push(x);
    		});

    	(options.styles || [])
    		.filter(x=>x.match(/^\!/m)) // ! affect internal selectors
    		.forEach(x=> {
    			if (this.cssFixes.indexOf(x) == -1)
    				this.cssFixes.push(x);
    		});

    	var annotations = this.annotations;
		var overridable_props = ['selector', 'template','encapsulation'];
		var extendable_array_props = ['styles','imports','providers'];

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

		if (options.cssClass)
			options.cssClass.split(' ').forEach(clz =>
				jb.path(options, ['host', '[class.'+clz+']'],'true'))
		if (options.host)
			annotations.host = jb.extend(annotations.host||{},options.host);

		if (annotations.template) {
			if (typeof annotations.template != 'string') debugger;
			annotations.template = annotations.template.trim();
			if (typeof options.templateModifier == 'function')
				annotations.template = options.templateModifier(annotations.template)
			else if (typeof options.templateModifier == 'object')
				jb.entries(options.templateModifier).forEach(mod=>
					annotations.template = annotations.template.replace('#'+mod[0],'#'+mod[0]+ ' ' +mod[1]));
		}

		if (options.wrapWithngIf) 
			annotations.template = `<template [ngIf]="jbIf()">${annotations.template}</template>`;

		(options.featuresOptions || []).forEach(f => 
			this.jbExtend(f, context))
		return this;
	}
}

export function ctrl(context) {
	var ctx = context.setVars({ $model: context.params });
	var styleOptions = defaultStyle(ctx);
	if (styleOptions && styleOptions.methodHandler)  {// style by control
		styleOptions.forceCtx = ctx;
		return styleOptions.jbCtrl(ctx);
	}
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
	return new jbComponent(ctx).jbExtend(options);
}

export function injectLifeCycleMethods(Cmp) {
	Cmp.prototype.ngOnInit = function() {
	  	this.ngZone.runOutsideAngular(() => {
			try {
				if (this.methodHandler.jbObservableFuncs.length) {
					this.jbEmitter = this.jbEmitter || new jb_rx.Subject();
					this.methodHandler.jbObservableFuncs.forEach(observable=> observable(this.jbEmitter,this));
				}
	    		this.refreshCtx = _ => {
					this.methodHandler.extendCtxFuncs.forEach(extendCtx => {
		    			this.ctx = extendCtx(this.ctx,this);
		    		})
		    		return this.ctx;
		    	}
		    	this.refreshCtx();
				this.methodHandler.jbBeforeInitFuncs.forEach(init=> init(this));
				this.methodHandler.jbInitFuncs.forEach(init=> init(this));
		    } catch(e) { jb.logException(e,'') }
		 })
	}
	Cmp.prototype.ngAfterViewInit = function() {
    	this.ngZone.runOutsideAngular(() => {
			this.methodHandler.jbAfterViewInitFuncs.forEach(init=> init(this));
			if (this.jbEmitter) {
				this.jbEmitter.next('after-init');
				jb_native_delay(1).then(()=>{ 
					if (this.jbEmitter && !this.jbEmitter.hasCompleted) {
						this.jbEmitter.next('after-init-children');
						if (this.readyCounter == null)
							this.jbEmitter.next('ready');
					}
				})
			}
		})
	}

	Cmp.prototype.ngDoCheck = function() {
    	this.ngZone.runOutsideAngular(() => {
			this.methodHandler.jbCheckFuncs.forEach(f=> 
				f(this));
			this.refreshModel && this.refreshModel();
			this.jbEmitter && this.jbEmitter.next('check');
		})
	}
	Cmp.prototype.ngOnDestroy = function() {
    	this.ngZone.runOutsideAngular(() => {
			this.methodHandler.jbDestroyFuncs.forEach(f=> 
				f(this));
			this.jbEmitter && this.jbEmitter.next('destroy');
			this.jbEmitter && this.jbEmitter.complete();
		})
	}

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

@Directive({
    selector: '[jbComp]',
})
export class jbComp {
  @Input() set jbComp(comp) {
  	comp && this.draw(comp);
  }

  constructor(private compiler :Compiler, private ngZone: NgZone, private view: ViewContainerRef, private elementRef: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
//  	jbart.studioAutoRefreshComp && jbart.studioAutoRefreshComp(this);
  }

  // ngDoCheck() {
  // 	if (this.jbComp != this.oldComp) {
  // 		this.oldComp = this.jbComp;
  // 		this.draw(this.jbComp);
  // 	}
  // }

  draw(comp) {
  	if (!comp) return;
  	this._comp = comp.comp || comp;
  	this.view.clear();
  	this.ngZone.runOutsideAngular(() => {
	  	[this._comp]
	  		.filter(comp=>comp.compile)
	  		.forEach(comp=>{
	//  			jb.logError('draw');
		  		var componentFactory = comp.compile(this.compiler);
			   	var cmp_ref = this.view.createComponent(componentFactory);
			   	comp.registerMethods && comp.registerMethods(cmp_ref);
	//			this.ngZone.run(()=>{});
		 	})
  	})
  }

  destroyNotifier = new jb_rx.Subject();
  ngOnDestroy() {
  	this.destroyNotifier.next('destroy');
  	this.destroyNotifier.complete();
  }
}

@Component({
    selector: 'jbart',
	template:  `<div *jbComp="comp"></div>
		        <div *ngFor="let dialog of dialogs"><div *jbComp="dialog"></div></div>`,
	directives: [jbComp]
})
export class jBartWidget {
	constructor(private elementRef: ElementRef, public ngZone: NgZone, private injector: Injector) { }
	ngOnInit() { 
		jbart.widgetLoaded = true; // indication for studio 
		this.compId = this.elementRef.nativeElement.getAttribute('compID');
		this.dialogs = jbart.jb_dialogs.dialogs;
		// if (this.compId)
		// 	jbart.zones[this.compId] = this.ngZone;

		if (this.compId == 'studio.all') { // assign redrawStudio function
			jbart.redrawStudio = () =>
				this.draw();
		}
		this.isPreview = window && window.parent != window && window.parent.document.title == 'jBart Studio';
		if (!this.isPreview)
			this.draw();
	}

	ngAfterViewInit() {
		if (this.isPreview)
		    jb_waitFor(()=>jbart.studioAutoRefreshWidget).then(()=>{
		    	jbart.studioAutoRefreshWidget(this)
		    })
	}

	ngDoCheck() {
        jb_logPerformance('check','checking widget ' + this.compId);
	}

	draw() {
		try {
			if (this.compId) {
				this.comp = jb_run(jb.ctx(this.getOrCreateInitialCtx(),
					{ profile:{ $: this.compId }, comp: this.compId, path: '' }));
				if (this.isPreview) {
					this.ngZone.run(()=>{});
					setTimeout(_=>{},1);
				}
			}
		} catch(e) { 
			jb.logException(e,'') 
		}	
	}

    getOrCreateInitialCtx() {
    	if (!jbart.initialCtx) {
	    	var ns = this.compId.split('.')[0];
			var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
			jb.extend(resources, { window: window, globals: { } });
			jbart.initialCtx = jb.ctx({ resources: resources, vars: {ngZone: this.ngZone, 
				injector: this.injector} }, {});
		}
		if (jbart.studioGlobals)
			return jbart.initialCtx.setVars({studio: {project: jbart.studioGlobals.project, page: jbart.studioGlobals.page}})
		return jbart.initialCtx;
    }
}

export function wrapWithLauchingElement(f,context,elem) {
	return function() {
		if (elem.nativeElement && elem.nativeElement.tagName == 'JB-COMP')
			var $el = $(elem.nativeElement).children().first();
		else if (elem.nodeType)
			var $el = $(elem);
		// .children().first()
		f(context.setVars({ $launchingElement: { $el : $el }}));
	}
}

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

@NgModule({
  imports: [],
  declarations: [ jbComp ],
  exports: [ jbComp ],
})
class jbCompModule { }

@NgModule({
  imports:      [ jbCompModule, CommonModule, FormsModule, HttpModule, BrowserModule ],
  declarations: [ jBartWidget ],
  bootstrap:    [ jBartWidget ]
})
export class jBartWidgetModule { }

