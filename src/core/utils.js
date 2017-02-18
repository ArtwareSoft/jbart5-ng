function jb_initJbartObject() {
  jbart.classes = jbart.classes || {};
}

function jb_profile(profile) {  
  return profile;   // TODO: add support for alt-N
}

function jb_component(compName,component) {
  jbart.comps[compName] = jb_handledObject(component);
  if (jbart.currentFileName) 
    jb_path(jbart,['studio','componentFiles',compName],jbart.currentFileName);
  return function(options) { 
    if (typeof options == 'string') {
      var out = {};
      out['$'+compName] = options;
      return out;
    } else if (typeof options == 'object') {
      options.$ = compName;
      return options;
    } else
      return {$: compName}
  }
}

function jb_type(typeName,typeObj) {
  jb_path(jbart,['types',typeName],typeObj || {});
}

function jb_function(funcName, func) {
  jb_path(jbart,['functions',funcName],func);
}

function jb_resource(widgetName,name,resource) {
  jb_path(jbart_widgets,[widgetName,'resources',name],jb_handledObject(resource));

  if (jbart.currentFileName) 
    jb_path(jbart,['studio','componentFiles',widgetName + '-' + name],jbart.currentFileName);
}

function jb_tests(widgetName,tests) {
  jbart_widgets[widgetName] = jbart_widgets[widgetName] || {};
  jbart_widgets[widgetName].tests = jb_extend(jbart_widgets[widgetName].tests || {},tests);

  Object.getOwnPropertyNames(tests).forEach(function(id) { 
    jbart.comps['__'+id] = { impl: tests[id]}
  })
}

jbart.ctxCounter = jbart.ctxCounter || 0;
jbart.ctxDictionary = jbart.ctxDictionary || {};

function jbCtx(context,ctx2) {
  this.id = jbart.ctxCounter++;
  this._parent = context;
  if (typeof context == 'undefined') {
    this.vars = {};
    this.params = {};
    this.resources = {}
  }
  else {
    if (ctx2.profile && ctx2.path == null) {
      debugger;
      ctx2.path = '?';
    }
    this.profile = (typeof(ctx2.profile) != 'undefined') ?  ctx2.profile : context.profile;

    this.path = (context.path || '') + (ctx2.path ? '~' + ctx2.path : '');
    if (ctx2.comp)
      this.path = ctx2.comp;
    this.data= (typeof ctx2.data != 'undefined') ? ctx2.data : context.data;     // allow setting of data:null
    this.vars= ctx2.vars ? jb_extend({},context.vars,ctx2.vars) : context.vars;
    this.params= ctx2.params || context.params;
    this.resources= context.resources;
    this.componentContext= (typeof ctx2.componentContext != 'undefined') ? ctx2.componentContext : context.componentContext;
    this.probe= context.probe;
  }
}

jbCtx.prototype = {
  run: function(profile,parentParam,path) { 
    if (path != null)
      debugger;
    return jb_run(jb_ctx(this,{ profile: profile, comp: profile.$ , path: ''}), parentParam) },
  exp: function(expression,jstype) { return jb_expression(expression, this, {as: jstype}) },
  setVars: function(vars) { return new jbCtx(this,{vars: vars}) },
  setData: function(data) { return new jbCtx(this,{data: data}) },
  runInner: function(profile,parentParam, path) { return jb_run(new jbCtx(this,{profile: profile,path: path}), parentParam) },
//  str: function(profile) { return this.run(profile, { as: 'string'}) },
  bool: function(profile) { return this.run(profile, { as: 'boolean'}) },
  // keeps the context vm and not the caller vm - needed in studio probe
  ctx: function(ctx2) { return new jbCtx(this,ctx2) },
  win: function() { return window }, // used for multi windows apps. e.g., studio
  extendVars: function(ctx2,data2) { 
    if (ctx2 == null && data2 == null)
      return this;
    return new jbCtx(this,{ vars: ctx2.vars, data: (data2 == null) ? ctx2.data : data2 })
  },
  runItself: function(parentParam,settings) { return jb_run(this,parentParam,settings) },
}

function jb_ctx(context,ctx2) {
  return new jbCtx(context,ctx2);
}

// end: context creation functions

function jb_profileHasValue(context,paramName) {
  return typeof context.profile[paramName] != 'undefined';
}

function jb_logError(errorStr,errorObj,ctx) {
  jbart.logs = jbart.logs || {};
  jbart.logs.error = jbart.logs.error || [];
  jbart.logs.error.push(errorStr);
  jb_trigger(jbart.logs,'add',{ type: 'error', text: errorStr });
  console.error(errorStr,errorObj,ctx);
}

function jb_logPerformance(type,text) {
  jb_path(jbart,['logPerf',type],(jb_path(jbart,['logPerf',type]) || 0) +1);
//  console.log(type,text||'',jb_path(jbart,['logPerf',type]))
}

function jb_logException(e,errorStr) {
  jb_logError('exception: ' + errorStr + "\n" + (e.stack||''));
}

// functions
function jb_extend(obj,obj1,obj2,obj3) {
  if (!obj) return;
  Object.getOwnPropertyNames(obj1||{})
    .forEach(function(p) { obj[p] = obj1[p] })
  Object.getOwnPropertyNames(obj2||{})
    .forEach(function(p) { obj[p] = obj2[p] })
  Object.getOwnPropertyNames(obj3||{})
    .forEach(function(p) { obj[p] = obj3[p] })

  return obj;
}
function jb_each(array,func) {
  for(var i=0;i<array.length;i++)
    func(array[i],i);
}
function jb_map(array,func) {
  var res = [];
  for(var i in array) {
    if (i.indexOf('$jb') == 0) continue;
    var item = func(array[i],i);
    if (Array.isArray(item))
      res = res.concat(item); // to check is faster than: for(var i=0;i<item.length;i++) res.push(item[i]);
    else if (item != null)
      res.push(item);
  }
  return res;
}
function jb_path(object,path,value) {
  var cur = object;

  if (typeof value == 'undefined') {  // get
    for(var i=0;i<path.length;i++) {
      cur = cur[path[i]];
      if (cur == null || typeof cur == 'undefined') return null;
    }
    return cur;
  } else { // set
    for(var i=0;i<path.length;i++)
      if (i == path.length-1)
        cur[path[i]] = value;
      else
        cur = cur[path[i]] = cur[path[i]] || {};
    return value;
  }
}

function jb_firstProp(obj) {
  for(var i in obj)
    if (obj.hasOwnProperty(i)) 
      return i;
  return '';
}

function jb_obj(k,v,base) {
  var ret = base || {};
  ret[k] = v;
  return ret;
}
function jb_cleanSystemProps(obj) {
  var ret = {};
  for(var i in obj) 
    if (! i.indexOf('$jb_') == 0)
      ret[i] = obj[i];

  return ret;
}
// Object.getOwnPropertyNames does not keep the order
function jb_ownPropertyNames(obj) {
  var res = [];
  for (var i in (obj || {}))
    if (obj.hasOwnProperty(i))
      res.push(i);
  return res;
}

function jb_pushItemOrArray(arr,item) {
  // adds item to arr. if item is null, it is not added. if item is an array, all of its items are added. if it's a single object, it's just added
  if (typeof item == 'undefined' || item === null) return;
  if (!Array.isArray(item)) return arr.push(item);
  for(var i=0;i<item.length;i++)
    arr.push(item[i]);
}


function jb_bind(object,eventType,handler,identifier,elementForAutoUnbind,addAsFirstListener) {
  if (!object) return;
  object.$jbListeners = object.$jbListeners || {};
  object.$jbListeners.counter = object.$jbListeners.counter || 0;
  var listenerID = ++object.$jbListeners.counter;

  var listeners = object.$jbListeners[eventType] = object.$jbListeners[eventType] || [];

  for(var i=0;i<listeners.length;i++) {
    if (identifier && listeners[i].eventType == eventType && listeners[i].identifier == identifier) {
      listeners[i].handler = handler;
      return;
    }
  }
  var item = {eventType: eventType, handler: handler, identifier: identifier, listenerID: listenerID };
  if (addAsFirstListener)
    listeners.unshift(item);
  else
    listeners.push(item); 

  if (elementForAutoUnbind) {
    jb_onElementDetach(elementForAutoUnbind,function() { 
      jb_unbind(object,listenerID);
    });
  }

  return listenerID;
}

function jb_unbind(object,listenerID) {
  if (!object || !object.$jbListeners) return;

  for(var i in object.$jbListeners) {
    var listeners = object.$jbListeners[i];
    if (!listeners.length) continue;

    for(var j=0;j<listeners.length;j++) {
      if (listeners[j].listenerID == listenerID) {
        listeners.splice(j,1);
        return;
      }
    } 
  }
}

function jb_trigger(object,eventType,eventObject) {
  if (!object || !object.$jbListeners || !object.$jbListeners[eventType]) return;
  eventObject = eventObject || {};
  eventObject.eventType = eventType;
  var params = [eventObject].concat(Array.prototype.slice.call(arguments,3));
  
  var listeners = object.$jbListeners[eventType];
  for(var i=0;i<listeners.length;i++) {
    try {
      listeners[i].handler.apply(object,params);
    } catch(e) {
      jb_logException(e,'error trigerring event ' + eventType);
    }
  } 
}

function jb_cloneData(data) {
  if (!data) return null;
  if (data.nodeType) return $(data).clone(true)[0];
  if (typeof data != 'object') return data;

  if (Array.isArray(data))
    return data.map(function(item) { return jb_cloneData(item); })
  
  var out = {};
  for(var propName in data)
    if (propName.indexOf('$jb_') != 0) 
      out[propName] = jb_cloneData(data[propName]);
  return out;
}

jbart.run = function(context,data) {
  if (!context.profile) {
    context = jb_ctx(jb_ctx(), {profile: jb_profile(context), data: data });
  }
  return jb_run(context);
}

function jb_ref(obj,top) {
  if (typeof obj === 'string') {
    console.log('can find a ref for string: ' + obj);
    return null;
  }
  for(var i in top) {  
    if (i.indexOf('$jb') === 0 || (!top.hasOwnProperty(i))) continue;
    if (top[i] === obj) 
      return { parent: top, prop: i};
    if (typeof top[i] === 'object') {
      var res = jb_ref(obj,top[i]);
      if (res) 
        return res;
    }
  }
}

function jb_new_NativePromise(cb) {
  if (window && window.__zone_symbol__Promise) {
    var res = new __zone_symbol__Promise(cb);
    res.then = res.__zone_symbol__then;
    return res;
  }

  return new Promise(cb);
}

function jb_waitFor(check) {
  if (check())
    return jb_NativePromise_resolve(1);
  var set_timeout = window && window.__zone_symbol__setTimeout || setTimeout;

  return jb_new_NativePromise((resolve,fail)=>{
    function wait_and_check(counter) {
      if (counter < 1)
        fail();
      set_timeout(() => {
        if (check())
          resolve();
        else
          wait_and_check(counter-1)
      }, 50);  
    }
    return wait_and_check(300);
  })
}

function jb_NativePromise_resolve(obj) {
  return jb_new_NativePromise(resolve=>resolve(obj))
}

function jb_native_delay(ms) {
  var set_timeout = window && window.__zone_symbol__setTimeout || setTimeout;
  return jb_new_NativePromise(resolve => set_timeout(resolve, ms));
}

function jb_synchArray(ar) {
  var isSynch = ar.filter(v=> v &&  (typeof v.then == 'function' || typeof v.subscribe == 'function')).length == 0;
  if (isSynch) return ar;

  var _ar = ar.filter(x=>x).map(v=>
    (typeof v.then == 'function' || typeof v.subscribe == 'function') ? v : [v])


  return Observable.from(_ar)
          .concatMap(x=>
            x)
          .flatMap(v => 
            Array.isArray(v) ? v : [v])
          .toArray()
          .toPromise()
}

function jb_delay(ms,ctx) {
  if (ctx && ctx.vars.ngZone)
    return ctx.vars.ngZone.runOutsideAngular(() =>
        new Promise(resolve => setTimeout(resolve, ms)))

  return new Promise(resolve => setTimeout(resolve, ms));
}

function jb_compareArrays(arr1, arr2) {
  if (arr1 == arr2)
    return true;
  if (!Array.isArray(arr1) && !Array.isArray(arr2)) return arr1 == arr2;
  if (!arr1 || !arr2 || arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i].key && arr2[i].key && arr1[i].key == arr2[i].key && arr1[i].val == arr2[i].val)
      continue;
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

 function jb_range(start, count) {
    return Array.apply(0, Array(count)).map((element, index) => index + start);
}

function jb_entries(obj) {
  if (!obj || typeof obj != 'object') return [];
  var ret = [];
  for(var i in obj) // keeps definition order
      if (obj.hasOwnProperty(i)) 
        ret.push([i,obj[i]])
  return ret;
}

function jb_entriesToObject(entries) {
  var ret = {};
  entries.map(e=>ret[e[0]]=e[1]);
  return ret;
}

function jb_flattenArray(items) {
  var out = [];
  items.filter(i=>i).forEach(function(item) { 
    if (Array.isArray(item)) 
      out = out.concat(item);
    else 
      out.push(item);
  })
  return out;
}

function jb_isProfOfType(prof,type) {
  var types = ((jbart.comps[jb_compName(prof)] || {}).type || '').split('[]')[0].split(',');
  return types.indexOf(type) != -1;
}

// usage: .filter( jb_unique(x=>x.id) )
function jb_unique(mapFunc) { 
  function onlyUnique(value, index, self) { 
      return self.map(mapFunc).indexOf(mapFunc(value)) === index;
  }
  return onlyUnique;
}
