import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import 'rxjs/observable/FromObservable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/race';


import {jb} from 'jb-core/jb';
//import * as jb_ui from 'jb-ui/jb-ui';

export {Subject} from 'rxjs/Subject';
export {Observable} from 'rxjs/Observable';

// for debug console
window.Observable = Observable;
window.Subject = Subject;

jb_initJstypes();
jbart.jstypes.observable = (obj,ctx) => 
	observableFromCtx(ctx.setData(obj));

export function tap(label) { return ctx => { console.log('tap'+label||'',ctx.data); return ctx.data } }

export function concat(obs_array) {
	return Observable.prototype.concat.apply(Observable.of(),obs_array)
		.map(x=> (x instanceof jb.Ctx) ? x.data : x)
}

export function refObservable(ref,cmp) {
	if (!cmp.jbEmitter) {
		console.log('no emitter in cmp');
		return Observable.of();
	}
	return cmp.jbEmitter
              .filter(x => x == 'check')
              .map(()=> 
                jb.val(ref)) 
              .distinctUntilChanged(jb_compareArrays)
}

export function observableFromCtx(ctx) : Observable {
	var res, obj=ctx.data;
	if (!obj)
		return Observable.of(ctx.setData('starter'))
	else if (obj.$pipe)
		return obj.$pipe(Observable.of(ctx.setData('starter')))
	else if (obj.subscribe)
		return mapToCtx(obj);
	else if (obj.then)
		return mapToCtx(Observable.fromPromise(obj));
	else if (Array.isArray(obj))
		return mapToCtx(Observable.fromArray(obj));
	else
		return Observable.of(ctx);
	
	function mapToCtx(obs) {
		return obs.map(x=> (x instanceof jb.Ctx) ? x : ctx.setData(x));
	}
}

jb.type('rx.elem');

jb.component('rxLog',{
	type: 'rx.elem',
	params: [
		{ id: 'pipe', as: 'observable' }
	],
	impl: (ctx,pipe) => 
		pipe.subscribe(x=>console.log(x.data))
})

jb.component('rxPipe', {
	type: 'rx.elem',
	params: [
		{ id: 'items', type: 'data,rx.elem[]', ignore: true, essential: true }
	],
	impl: function(context) { return { 
		$pipe: function(obs) {
			var profiles = jb_toarray(context.profile.items || context.profile['$rxPipe'] || context.profile['$pipeline']);
			return pipe(profiles,obs,context);
		}
	}
  }
})

jb.component('rxFilter',{
	type: 'rx.elem',
	params: [
		{ id: 'filter', type: 'boolean', dynamic: true }
	],
	impl: function(context,filter) { return { 
		$pipe: function(obs) {
			return obs.filter(ctx=>filter(ctx))
		}
	}
  }
})

function pipe(profiles,observable,context) {
	return profiles.reduce(function(aggregated,prof,_index) {
		if (jb.isProfOfType(prof,'rx.elem'))
			return context.runInner(prof,null,_index).$pipe(aggregated)
		return aggregated.concatMap(ctx=>{
			//var ctx = context.setData(ctx.data);
			var res = jb.toarray(ctx.runInner(prof,null,_index)).map(data=>
				ctxWithVar(ctx.setData(data),prof));
			return Observable.prototype.concat.apply(Observable.of(),res.map(ctx2=>
				observableFromCtx(ctx2).catch(e=>{debugger})))
		})
	},observable)

	function ctxWithVar(ctx,prof) {
		if (prof.$var)
			return ctx.setVars(jb.obj(prof.$var,ctx.data))
		return ctx;
	}
}

jb.component('rxParallel', {
	type: 'rx.elem',
	params: [
		{ id: 'item', dynamic: true },
	],
	impl: (context,item,keepOrder) => { return { $pipe : obs => 
		obs.flatMap(ctx=>
			Observable.prototype.merge.apply(Observable.of(),
				jb.toarray(item(ctx)).map(data=>observableFromCtx(ctx.setData(data)))
			)) 
	}}
})

jb.component('rxParallelKeepOrder', {
	type: 'rx.elem',
	params: [
		{ id: 'item', dynamic: true },
	],
	impl: (context,item,keepOrder) => { return { $pipe : obs => {
		var parallel_results = [],emitted=0;
		var out = new Subject();
		obs.flatMap((ctx,i)=> {
			return Observable.prototype.concat.apply(Observable.of(),
				jb.toarray(item(ctx)).map(data=>{
					var res = observableFromCtx(ctx.setData(data));
					res.subscribe(x=>{ 
						parallel_results[i]=parallel_results[i]||[]; 
						parallel_results[i].push(x)
					})
					return res;
				}
			))
		}).catch(e=>{debugger})
		.delay(1) // to let subscribers register to out
		.subscribe(()=>{
			while (parallel_results[emitted])
				parallel_results[emitted++].forEach(x=>out.next(x))
			},
			x=>jb.logError('rxParallelKeepOrder'),
			()=>
				out.complete()
		)
		
		return out;
	}}}
})



jb.component('rx.distinctUntilChanged', {
	type: 'rx.elem',
	params: [
	    { id: 'keySelector', type: 'rx.keySelector' },
	    { id: 'comparer', type: 'rx.comparer' },
	],
	impl: context => ({ $pipe : obs => 
		obs.concatMap(ctx=>
			obs.map(ctx=>ctx.data)
			.distinctUntilChanged(keySelector,comparer)
			.flatMap(x=>ctx) )  
	})
})

jb.component('rx.concat', {
	type: 'rx.elem',
	params: [
		{ id: 'items', type: 'data,rx.elem[]', ignore: true, essential: true }
	],
	impl: (context,items) => ({
		$pipe: obs => {
			var profiles = jb_toarray(context.profile.items);
			var inner_pipe = pipe(profiles,Observable.of(context),context);
			return obs.concat(inner_pipe);
		}
	})
})

// ************* Subject

export function extendSubject(observable,subject,pipe,context) {
	if (pipe) {
		ret = toRxElem(pipe,context)(observable);
		if (Observable.isObservable(ret))
			observable = ret;
	}
	observable.subscribe(x=>subject.next(x));
}

export function fullRxBind(subject1,subject2,pipe1to2,pipe2to1,context) {
	extendSubject(subject1,subject2,pipe1to2,context);
	extendSubject(subject2,subject1,pipe2to1,context);
}

export function toRxElem(obj,context) {
	return function(obs) {
		if (obj.profile)
			return obs.flatMap(event => obj(context.setData(event)))
		return obj(obs);
	}
}

jb.component('rx.subject',{
	type: 'rx.subject,rx.observable,rx.observer',
	params: [
		{ id: 'pipe', type: 'rx.elem', dynamic : true, defaultValue: {$: 'rx.distinctUntilChanged'} },
	],
	impl: function(context,pipe) {
		var subject = new Subject();
		return Subject.create(x=>subject.next(x),pipe().$pipe(subject))
	}
})

jb.component('rx.emit',{
	type: 'action',
	params: [
		{ id: 'from', as: 'observable'},
		{ id: 'to', type: 'rx.observer' },
	],
	impl: function(context,from,_to) {
		from.subscribe(item =>_to.next(item));
	}
})

jb.component('rx.url-path',{
	type: 'application-feature',
	params: [
		{ id: 'params', type: 'data[]', as: 'array'},
		{ id: 'databind', as: 'single' , essential: true },
		{ id: 'base', as: 'string'},
		{ id: 'onUrlChange', type: 'action', dynamic: true }
	],
	impl: function(context,params,databind,base) {
		if (jbart.location) return;

	    if (!databind || typeof databind != 'object')
	    	return console.log('no databind for rx.url-path')

	    var browserUrlEm = new Subject();
		jbart.location = History.createHistory();
		jbart.location.path = () => location.pathname;
		jbart.location.listen(x=>
			browserUrlEm.next(x.pathname))

	    function urlToObj(path) {
	    	var vals = path.substring(path.indexOf(base) + base.length).split('/')
	    			.map(x=>decodeURIComponent(x))
	    	var res = {};
	    	params.forEach((p,i) =>
    			res[p] = (vals[i+1] || ''));
	    	return res;
	    }
	    function objToUrl(obj) {
	    	var split_base = jbart.location.path().split(`/${base}`);
	    	var url = split_base[0] + `/${base}/` + 
	    		params.map(p=>obj[p]||'')
	    		.join('/');
	    	return url.replace(/\/*$/,'');
		}

		var databindEm = context.vars.ngZone.onStable // .onUnstable
			.map(()=>databind)
	    	.filter(obj=>
	    		obj.project)
	    	.map(obj=>
	    		objToUrl(obj));

	    browserUrlEm.merge(databindEm)
	    	.startWith(jbart.location.path())
	    	.distinctUntilChanged()
	    	.subscribe(url => {
		    	jbart.location.push(url);
		    	jb.extend(databind,urlToObj(url));
		    	context.params.onUrlChange(context.setData(url));
	    	})
	}
})

// ************** tests ******************

jb.component('rx-test', {
	type: 'test',
	params: [
		{ id: 'result', as: 'observable', dynamic: true },
		{ id: 'expectedResult', type: 'boolean', dynamic: true },
		{ id: 'timeout', as: 'number', defaultValue: 5000 }
	],
	impl: function(context, result, expectedResult,timeout) {
		var res = result();
		return expectedResult(context.setData(res))
			.map(ctx=>
				({id: context.vars.testID, success: ctx.data }))
	}
})

jb.component('containsSeq',{
	type: 'boolean',
	params: [
		{ id: 'seq', type: 'data[]', as: 'array' },
		{ id: 'observable', defaultValue: '%%', as: 'observable'}
	],
	impl: function(context,seq,observable) {
		return observable.take(seq.length)
			.map(x=>x.data).toArray()
			.map(arr=>jb.compareArrays(arr,seq))
			.map(x=>context.setData(x))
	}
})

