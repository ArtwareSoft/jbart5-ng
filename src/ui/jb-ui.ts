import {jb} from 'jb-core';
import {enableProdMode, Directive, Component, View, DynamicComponentLoader, ElementRef, Injector, Input, provide, NgZone} from 'angular2/core';
import {NgForm,FORM_DIRECTIVES,NgClass} from 'angular2/common';
// import {ExceptionHandler} from 'angular2/src/facade/exception_handler';
//import {MdInput} from '/node_modules/@angular2-material/core/input.js';
import {MdButton, MdAnchor} from '@angular2-material/button/button.js';
import {MdInput} from '@angular2-material/input/input.js';
import {MdCard} from '@angular2-material/card/card.js';

import * as jb_rx from 'jb-ui/jb-rx';
import * as jb_dialog from 'jb-ui/dialog';

var MATERIAL_DIRECTIVES = [MdButton, MdAnchor,MdInput,MdCard];

enableProdMode();
jbart.zones = jbart.zones || {}

export function apply(ctx) {
//	console.log('apply');
	jb.delay(1);
	ctx.vars.ngZone && ctx.vars.ngZone.run(()=>{})
}

export function ctrl(context) {
	var ctx = (ctx || context).setVars({ $model: context.params });
	var comp = defaultStyle(ctx);
	if (!comp) {
		console.log('style returned null',ctx)
		return Comp({},ctx)
	}
	if (typeof comp == 'object')
		comp = Comp(comp,ctx);
	return enrichComp(comp,ctx).jbCtrl(ctx);

	function defaultStyle(ctx) {
		var profile = context.profile;
		var defaultVar = (profile.$ || '')+'.default-style-profile';
		if (!profile.style && context.vars[defaultVar])
			return ctx.run({$:context.vars[defaultVar]})
		return context.params.style(ctx);
	}
}

export function Comp(options,context) {
    function Cmp(dcl, elementRef) { this.dcl = dcl; this.elementRef = elementRef }
	Cmp = Reflect.decorate([
		Component({
			selector: 'div',
			template: options.template || '',
			directives: [MATERIAL_DIRECTIVES,FORM_DIRECTIVES, NgClass] 
		}),
		Reflect.metadata('design:paramtypes', [DynamicComponentLoader, ElementRef])
	], Cmp);
	return enrichComp(Cmp,context).jbExtend(options,context);
}

export function enrichComp(comp,ctrl_ctx) {
	if  (!comp) debugger;
	if (comp.jbInitFuncs) return comp;
	comp.prototype.ctx = ctrl_ctx;
	jb.extend(comp,{jbInitFuncs: [], jbBeforeInitFuncs: [], jbAfterViewInitFuncs: [],jbCheckFuncs: [], jbObservableFuncs: []  });
	comp.prototype.ngOnInit = function() {
		try {
			if (comp.jbObservableFuncs.length) {
				this.jbEmitter = new jb_rx.Subject();
				comp.jbObservableFuncs.forEach(observable=> observable(this.jbEmitter,this));
			}
	    	if (this.extendCtx) // on prototype 
	    		this.ctx = this.extendCtx(comp.prototype.ctx,this);
			comp.jbBeforeInitFuncs.forEach(init=> init(this));
			comp.jbInitFuncs.forEach(init=> init(this));
	    } catch(e) { jb.logException(e,'') }
	}
	comp.prototype.ngAfterViewInit = function() {
		comp.jbAfterViewInitFuncs.forEach(init=> init(this));
		this.jbEmitter && this.jbEmitter.next('after-init');
	}
	comp.prototype.ngDoCheck = function() {
		comp.jbCheckFuncs.forEach(f=> f(this));
		this.jbEmitter && this.jbEmitter.next('check');
	}

	var annotations = Reflect.getMetadata('annotations', comp)[0];
	var overridable_props = ['selector', 'template'];
	var extendable_array_props = ['directives', 'styles'];

	var title = jb_tosingle(jb.val(ctrl_ctx.params.title)) || (() => ''); 
	comp.jb_title = (typeof title == 'function') ? title : () => ''+title;
	comp.jb$title = (typeof title == 'function') ? title() : title; // for debug

	//var extendable_obj_props = [];

    comp.jbExtend = function(options,context) {
    	context = context || ctrl_ctx;
    	if (!context)
    		console.log('no context provided for jbExtend');
    	if (!options) return comp;
    	jbTemplate(options);
		if (options.beforeInit) comp.jbBeforeInitFuncs.push(options.beforeInit);
		if (options.init) comp.jbInitFuncs.push(options.init);
		if (options.afterViewInit) comp.jbAfterViewInitFuncs.push(options.afterViewInit);
		if (options.doCheck) comp.jbCheckFuncs.push(options.doCheck);
		if (options.observable) comp.jbObservableFuncs.push(options.observable);
		if (options.ctrlsEmFunc) comp.prototype.ctrlsEmFunc=options.ctrlsEmFunc;
		if (options.extendCtx) comp.prototype.extendCtx=options.extendCtx;

		if (options.input)
			Reflect.decorate([Input(), Reflect.metadata('design:type', Object)], comp.prototype, options.input, void 0);

		options.template = options.template && context.exp(options.template);

	   	if (options.css)
    		options.styles = (options.styles || []).concat(options.css.split(/}\s*/m).map(x=>x.trim()).filter(x=>x).map(x=>x+'}'));

		options.styles = options.styles && (options.styles || []).map(st=> context.exp(st));
    	(options.styles || [])
    		.filter(x=>x.match(/^{([^]*)}$/m))
    		.forEach(x=>jb.path(options,['atts','style'],x.match(/^{([^]*)}$/m)[1]))

		overridable_props.forEach(prop => annotations[prop] = options[prop] || annotations[prop]);
		extendable_array_props.forEach(prop => annotations[prop] = (annotations[prop] || []).concat(jb.toarray(options[prop])) );

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

		if (annotations.template && typeof annotations.template != 'string') debugger
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
		annotations.template = annotations.template.replace(/(\(|\[|\*)ng-?[a-z]/g, st => st[0] + 'ng' + (st[3] == '-' ? st[4] : st[3]).toUpperCase());

		(options.features || []).forEach(f => 
			comp.jbExtend(context.run(f), context));
		
		(options.featuresOptions || []).forEach(f => 
				comp.jbExtend(f, context))
		return comp;
    }

    comp.jbCtrl = function(context) {
    	var options = mergeOptions(
    		optionsOfProfile(context.params.style && context.params.style.profile),
    		optionsOfProfile(context.profile));

    	jb.path(options, ['atts','jb-path'], profilePath(context.profile)||''); // for the studio

		context.params.features && context.params.features(context).forEach(f => comp.jbExtend(f,context))
    	if (context.params.style && context.params.style.profile && context.params.style.profile.features) {
    		jb.toarray(context.params.style.profile.features)
    			.forEach(f=>comp.jbExtend(context.run(f),context))
    	}

		return comp.jbExtend(options,context);
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


    return comp;
}

@Component({
    selector: 'jb_comp',
    template: '<div #jb_comp></div>',
})
export class jbComp {
  @Input() comp;
  @Input() flatten;
  constructor(public dcl: DynamicComponentLoader, public elementRef: ElementRef) {}
  ngOnInit() {
  	  var cmp = this;
  	  var parentCmp = cmp.elementRef._appElement.parentView.context;
      var r = loadIntoLocation(this.comp, this, 'jb_comp');
      if (!r) debugger;
      r.then( ref=>{
      	if (!cmp.flatten) return;
      	// very ugly: flatten the structure and pushing the dispose function to the group parent.
      	var to_keep = $(ref.location.nativeElement);
      	if (cmp._parent)
      		debugger;
      	cmp._parent = to_keep.parent();
      	// copy class and ng id attributes - for css
      	to_keep.addClass(to_keep.parent().attr('class')||'');
      	Array.from(to_keep.parent()[0].attributes)
      		.map(x=>x.name).filter(x=>x.match(/_ng/))
      		.forEach(att=>to_keep.attr(att,''))
    	to_keep.parent().replaceWith(to_keep);
      	parentCmp.jb_disposable = parentCmp.jb_disposable || [];
      	parentCmp.jb_disposable.push(() => { // put it back as it was, and dispose
      		try {
    			to_keep.replaceWith(cmp._parent);
    			cmp._parent.append(to_keep);
    		} catch(e) {}
    		cmp._parent = null;
    		ref.dispose();
    	})
      })
  }
}

export function controlsToGroupEmitter(controlsFunc, cmp) { 
	var controlsFuncAsObservable = ctx=> jb_rx.Observable.of(controlsFunc(ctx));
	return cmp.ctrlsEmFunc ? ctx => cmp.ctrlsEmFunc(controlsFuncAsObservable,ctx,cmp) : controlsFuncAsObservable;
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
	if (ref.$jb_parent) {
	  var fieldName = ref.$jb_property;
	  var parentName = ref.$jb_parent.$jb_property || 'model';
	  var modelPath = parentName + '.' + fieldName;
	  var bindToCmp = cmp => 
	  	cmp[parentName] = ref.$jb_parent;
	  var modelExp = `[(ngModel)] = "${modelPath}"`;
	} else if (ref.$jb_val) {
	  var modelPath = '$jbModel';
	  var bindToCmp = cmp => {
	  	  cmp.writeValue = val => 
	  	  	jb.writeValue(ref,val);
	  	  cmp.$jbModel = jb.val(ref);
		  jb_rx.refObservable(ref,cmp.ctx).subscribe(()=>
		  	cmp.$jbModel = jb.val(ref)
		  )
		}
	  // keyup for input change for select
	  var modelExp = `[(ngModel)] = "${modelPath}" (keyup)="writeValue($event.target.value)" (change)="writeValue($event.target.value)"`;
	}

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

export function loadIntoLocation(comp, parentCmp, id,context) {
	try {
    	return parentCmp.dcl.loadIntoLocation(comp, parentCmp.elementRef, id);
    } catch(e) { debugger; jb.logException(e,'') }
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
	template:  `<div *ngFor="#comp of comps"><jb_comp [comp]="comp"></jb_comp></div>
				<div *ngFor="#dialog of dialogs">
					<jb_comp [comp]="dialog.comp"></jb_comp>
				</div>`,
	directives: [jbComp]
})
export class jBartWidget {
	constructor(private dcl: DynamicComponentLoader, private elementRef: ElementRef, public ngZone: NgZone) { }
	ngOnInit() { 
		this.compId = this.elementRef.nativeElement.getAttribute('compID');
		this.dialogs = jb_dialog.jb_dialogs.dialogs;
		if (this.compId)
			jbart.zones[this.compId] = this.ngZone;
		this.draw();
		this.initRedrawEm();
	}
	ngAfterViewInit() {
		jbart.widgetLoaded = true; // for studio
	}
	ngDoCheck() {
		if (this.compId == 'studio.all' && !jbart.redrawStudio) // put the redrawStudio function ob jbart
			jbart.redrawStudio = () => 
				this.redrawEm.next(this.compId);

		if (jbart.studioGlobals) { // in studio
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
		this.redrawEm // source change - wait 1 sec
		  .debounceTime(300)
		  .map(id=>
		  	relevantSource(id))
		  .distinctUntilChanged()
		  .subscribe(x => 
		  	cmp.draw())

		this.redrawEm // widget to show changed - no need to wait
		  .distinctUntilChanged()
		  .subscribe(
		  	x => 
		  	cmp.draw())

		function relevantSource(compID) {
			var ns = compID.split('.')[0];
			return Object.getOwnPropertyNames(jb.comps).filter(id => id.indexOf(ns + '.') == 0).map(id => jb.prettyPrint(jb.comps[id].impl)).join('');
		}
	}

    private getOrCreateInitialCtx() {
    	if (this.$jbInitialCtx) return this.$jbInitialCtx;
    	var ns = this.compId.split('.')[0];
		var resources = (jb.widgets[ns] && jb.widgets[ns].resources) || {};
		var ctx = jb.ctx({ ngMode: true, resources: resources, vars: {ngZone: this.ngZone} }, {});
		jb.extend(resources, { window: window, globals: {} });
		Object.getOwnPropertyNames(resources).forEach(id=>{
			var r = resources[id];
			if (r && r.$) resources[id] = ctx.run(r);
		})
		this.$jbInitialCtx = ctx;
		return ctx;
    }
}

// export var jBart = jBartWidget; //(window.parent != window && window.parent.jb_studio_window) ? jBartInStudio : jBartPlain;

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

//export var injector = Injector.resolveAndCreate([Location]);
//export var ngZone = injector.get(NgZone);

