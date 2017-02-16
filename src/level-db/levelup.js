jb_component('level-up.file-db', {
	type: 'level-up.db',
	params: [
		{ id: 'rootDirectory' ,as : 'string' },
	],
	impl : (ctx,rootDirectory) => ({
		get: (key,cb) => {
			var json = key.match(/json$/);
			return fetch(`${rootDirectory}/${key}`, { 
					mode: 'cors' , 
//					headers : json ? ({ 'Content-type': 'application/json; charset=UTF-8' }) : null
			  	})
			  .then(r => 
			  		cb(null,json ? r.json() : r.text()) ) 
			  .catch(e =>
			  		cb(e))
//			  	jb_logException(e,'error in http get file from db'))
		},

		put: (key,value,cb) =>
			fetch('/?op=saveFile', {
				mode: 'cors',
			    method: 'post',  
			    headers: { 'Content-type': 'application/json; charset=UTF-8' },  
			    body: JSON.stringify({Path: `${ctx.vars.rootDirectory}/${key}`, Context: value}) 				
			})  
			.then(r => 
				cb())  
			.catch(e => 
				cb(e)),

		createReadStream: () => {
			var listener = {};
			listener.on = (type,observer) => {
				if (type == 'data')
					listener.dataObservers = (listener.dataObservers || []).concat([observer])
				else if (type == 'end')
					listener.endObservers = (listener.endObservers || []).concat([observer])
				return listener;
			};

			fetch(`/?op=ls&path=${rootDirectory}`, {mode: 'cors',})
			.then(res=>
				res.json())
			.then(json => {
				var entries = json.entries;
				if (entries)
					entries.forEach(e=>(listener.dataObservers||[]).forEach(obs=>obs.call('data',e)));
				(listener.endObservers||[]).forEach(obs=>obs.call('end'))
			}).catch(e =>
			  	jb_logException(e,'error in http ls'));

			return listener;
		  },
	})
})

jb_component('level-up.in-memory', {
	type: 'level-up.db',
	params: [
		{ id: 'obj' ,as : 'single' },
	],
	impl : (ctx,obj) => ({
		get: (key,cb) => 
			cb(null,obj[key]),

		put: (key,value,cb) => 
			cb(obj[key]=value),

		createReadStream: () => {
			var listener = {
				on: (type,observer) => {
					if (type == 'data')
						observer(Object.getOwnPropertyNames(obj))
					else
						observer();
					return listener;
				}
			}
			return listener;
		}
	})
})



jb_component('level-up.get', {
	type: 'data',
	params: [
		{ id: 'db', type: 'level-up.db'},
		{ id: 'key', as: 'string' },
	],
	impl: (ctx,db,key) =>
		jb_new_NativePromise((resolve,reject)=>
			db && db.get(key,(err,value) => 
				err ? reject(err) : resolve(value)))
})

jb_component('level-up.put', {
	type: 'action',
	params: [
		{ id: 'db', type: 'level-up.db'},
		{ id: 'key', as: 'string' },
		{ id: 'value', as: 'string' },
	],
	impl: (ctx,db,key,value) =>
		jb_new_NativePromise((resolve,reject)=>
			db && db.put(key,value, err => 
				err ? reject(err) : resolve()
			))
})

jb_component('level-up.entries', {
	type: 'data',
	params: [
		{ id: 'db', type: 'level-up.db'},
	],
	impl: (ctx,db,key,value) =>
		Observable.create(observer =>
			db && db.createReadStream()
			  .on('data', data => 
			  		Array.isArray(data) ? data.forEach(x => observer.next(x)) : observer.next(data))
			  .on('error', err => {throw err})
			  .on('close', () => observer.complete())
			  .on('end', () => observer.complete())
		).toArray().toPromise()
})
