import {Observable,Subject} from 'rxjs/Rx';
import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui/jb-ui';
//import {Location} from '/jbart/node_modules/angular2/router';
export {Observable,Subject} from 'rxjs/Rx';

jb_initJstypes();
jbart.jstypes.observable = (obj,ctx) => observableFromCtx(ctx.setData(obj));

export function tap(label) { return ctx => { console.log('tap'+label||'',ctx.data); return ctx.data } }

export function concat(obs_array) {
	return Observable.concat.apply(Observable.of(),obs_array)
		.map(x=> (x instanceof jb.Ctx) ? x.data : x)
}

export function refObservable(ref,ctx) {
	if (!ctx.vars.ngZone) {
		console.log('no ngZone in context');
		return Observable.of();
	}
    return ctx.vars.ngZone.onUnstable
    	.map(()=>jb.val(ref))
    	.distinctUntilChanged()
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
	params: {
		pipe: { as: 'observable' }
	},
	impl: (ctx,pipe) => pipe.subscribe(x=>console.log(x.data))
})

jb.component('rxPipe',{
	type: 'rx.elem',
	params: {
		items: { type: 'data,rx.elem[]', ignore: true, essential: true }
	},
	impl: function(context) { return { 
		$pipe: function(obs) {
			var profiles = jb_toarray(context.profile.items || context.profile['$rxPipe'] || context.profile['$pipeline']);
			return pipe(profiles,obs,context,true);
		}
	}
  }
})

jb.component('rxFilter',{
	type: 'rx.elem',
	params: {
		filter: { type: 'boolean', dynamic: true }
	},
	impl: function(context,filter) { return { 
		$pipe: function(obs) {
			return obs.filter(ctx=>filter(ctx))
		}
	}
  }
})

function pipe(profiles,observable,context,sort) {
	return profiles.reduce(function(aggregated,prof) {
		if (jb.isProfOfType(prof,'rx.elem'))
			return context.run(prof).$pipe(aggregated)
		return aggregated.concatMap(ctx=>{
			//var ctx = context.setData(ctx.data);
			var res = jb.toarray(ctx.run(prof)).map(data=>ctxWithVar(ctx.setData(data),prof));
			return Observable.concat.apply(Observable.of(),res.map(ctx2=>observableFromCtx(ctx2).catch(e=>{debugger})))
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
	params: {
		item: { dynamic: true },
	},
	impl: (context,item,keepOrder) => { return { $pipe : obs => 
		obs.flatMap(ctx=>
			Observable.merge.apply(Observable.of(),
				jb.toarray(item(ctx)).map(data=>observableFromCtx(ctx.setData(data)))
			)) 
	}}
})

jb.component('rxParallelKeepOrder', {
	type: 'rx.elem',
	params: {
		item: { dynamic: true },
	},
	impl: (context,item,keepOrder) => { return { $pipe : obs => {
		var parallel_results = [],emitted=0;
		var out = new Subject();
		obs.flatMap((ctx,i)=> {
			return Observable.concat.apply(Observable.of(),
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
		})
		return out;
	}}}
})



jb.component('rx.distinctUntilChanged', {
	type: 'rx.elem',
	params: {
	    keySelector: { type: 'rx.keySelector' },
	    comparer: { type: 'rx.comparer' },
	},
	impl: context => { return { $pipe : obs => obs.concatMap(ctx=>
			obs.map(ctx=>ctx.data)
			.distinctUntilChanged(keySelector,comparer)
			.flatMap(x=>ctx) )  
	}}
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
	params: {
		pipe: { type: 'rx.elem', dynamic : true, defaultValue: {$: 'rx.distinctUntilChanged'} },
	},
	impl: function(context,pipe) {
		var subject = new Subject();
		return Subject.create(x=>subject.next(x),pipe().$pipe(subject))
	}
})

jb.component('rx.emit',{
	type: 'action',
	params: {
		from: { as: 'observable'},
		to: { type: 'rx.observer' },
	},
	impl: function(context,from,_to) {
		from.subscribe(item =>_to.next(item));
	}
})

jb.component('rx.urlPath',{
	type: 'rx.subject',
	params: {
		params: { type: 'data[]', as: 'array'},
		databind: { as: 'ref' , essential: true },
		base: { as: 'string'},
		zoneId: { as: 'string'},
	},
	impl: function(context,params,databind,base,zoneId) {
	    if (!jb.val(databind)) 
	    	jb.writeValue(databind,{});
	    var dataParent = jb.val(databind);
	    if (!dataParent || typeof dataParent != 'object')
	    	return console.log('no databind for rx.urlPath')

	    var subject = new Subject();

		if (jb_ui.injector) {
			jbart.location = jbart.location || jb_ui.injector.get(Location);
		} else if (!jbart.location) {
			jbart.location = History.createHistory();
			jbart.location.path = () => location.pathname;
			jbart.location.listen(x=>subject.next(urlToObj(x.pathname)))
		}


	    function urlToObj() {
	    	var path = jbart.location.path();
	    	var vals = path.substring(path.indexOf(base) + base.length).split('/').map(x=>decodeURIComponent(x))
	    	var res = {};
	    	params.forEach(function(p,i){
    			dataParent[p] = res[p] = (vals[i+1] || '');
	    	});
	    	return res;
	    }

	    subject.subscribe(function(newVal) {
	    	if (JSON.stringify(newVal) == subject.__oldVal) return;
	    	subject.__oldVal = JSON.stringify(newVal);

	    	params.forEach(p=>dataParent[p] = newVal[p]);
	    	var split_base = jbart.location.path().split(`/${base}`);
	    	var vals = split_base[1].split('/').map(x=>decodeURIComponent(x));
	    	params.forEach((p,i) => vals[i+1] = p == '*' ? vals[i+1] : newVal[p]);
	    	var url = split_base[0] + `/${base}` + vals.join('/');
	    	jbart.location.push(url.replace(/\/*$/,''));
	    })
	    if (jbart.location.subscribe)
	    	jbart.location.subscribe(()=>subject.next(urlToObj()));
	    subject.next(urlToObj());

	    jb_ui.getZone(zoneId).then(zone=> zone.onStable.subscribe(()=>subject.next(jb.val(databind))) )
   	    return subject;
	}
})

jb.component('rx.fullBind', {
	params: {
		subject1: { type: 'rx.subject' },
		subject2: { type: 'rx.subject' },
		pipe1to2: { type: 'rx.elem', dynamic: true },
		pipe2to1: { type: 'rx.elem', dynamic: true },
	},
	impl: (ctx,subject1,subject2,pipe1to2,pipe2to1)=>fullRxBind(ctx,subject1,subject2,pipe1to2,pipe2to1,ctx)
})

// ************** tests ******************

jb.component('rx-test', {
	params: {
		result: { as: 'observable', dynamic: true },
		expectedResult: { type: 'boolean', dynamic: true },
		timeout: { as: 'number', defaultValue: 5000 }
	},
	impl: function(context, result, expectedResult,timeout) {
		var res = result();
		return expectedResult(context.setData(res))
			.map(ctx=>{ return {id: context.vars.testID, success: ctx.data }})
//			.map(x=>{console.log('tap',x); return x})
	}
})

jb.component('containsSeq',{
	type: 'boolean',
	params: {
		seq: { type: 'data[]', as: 'array' },
		observable: { defaultValue: '%%', as: 'observable'}
	},
	impl: function(context,seq,observable) {
		return observable.take(seq.length)
//			.map(x=>{console.log('tap1',x); return x})
			.map(x=>x.data).toArray()
//			.map(x=>{console.log('tap2',x); return x})
			.map(arr=>jb.compareArrays(arr,seq))
			.map(x=>context.setData(x))
	}
})