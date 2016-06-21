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

function jbCtx(context,ctx2) {
  if (typeof context == 'undefined')
    this.vars = this.params = this.resources = {}
  else {
    this.profile= (typeof(ctx2.profile) != 'undefined') ?  ctx2.profile : context.profile,
    this.data= (typeof ctx2.data != 'undefined') ? ctx2.data : context.data,     // allowing setting data:null
    this.vars= ctx2.vars ? jb_extend({},context.vars,ctx2.vars) : context.vars,
    this.params= ctx2.params || context.params,
    this.resources= context.resources,
    this.componentContext= (typeof ctx2.componentContext != 'undefined') ? ctx2.componentContext : context.componentContext,
    this.ngMode= context.ngMode
  }
}
jbCtx.prototype = {
  exp: function(expression,jstype) { return jb_expression(expression, this, jstype) },
  setVars: function(vars) { return new jbCtx(this,{vars: vars}) },
  setData: function(data) { return new jbCtx(this,{data: data}) },
  run: function(profile,parentParam) { return jb_run(new jbCtx(this,{profile: profile}), parentParam) },
  str: function(profile) { return this.run(profile, { as: 'string'}) },
  bool: function(profile) { return this.run(profile, { as: 'boolean'}) },
}

function jb_ctx(context,ctx2) {
  return new jbCtx(context,ctx2);
}

function jb_ctxOld(context,ctx2) {
  if (!context)
    return { vars: {}, params: {}, resources: {} };  // jb_ctx() means create new context

  return {
    profile: (typeof(ctx2.profile) != 'undefined') ?  ctx2.profile : context.profile,
    data: (typeof ctx2.data != 'undefined') ? ctx2.data : context.data,     // allowing setting data:null
    vars: ctx2.vars ? jb_extend({},context.vars,ctx2.vars) : context.vars,
    params: ctx2.params || context.params,
    resources: context.resources,
    componentContext: (typeof ctx2.componentContext != 'undefined') ? ctx2.componentContext : context.componentContext,
    ngMode: context.ngMode
  }
}

// end: context creation functions

function jb_paramsWithValues(profile) {
    var paramsWithValues = []
    var comp_name = jb_compName(profile);
    var comp = jbart.comps[comp_name];
    var first = true;
    var firstProp = jb_firstProp(comp.params);
    for (var p in comp.params) {
      var param = comp.params[p];
      var val = profile[p];
      if (!val && first && p != '$') // $comp sugar
        val = profile[firstProp]; 
      val = (typeof(val) != "undefined") ? val : (typeof(param.defaultValue) != 'undefined') ? param.defaultValue : null;
      paramsWithValues.push({id: p, param: param, val: val})
      first = false;
    }
    return paramsWithValues;
}

function jb_propVal(context,paramName) {
  return jb_paramsWithValues(context.profile).filter(p=> p.id == paramName)[0];
}

function jb_run_action_prop(context,prop) {
  return jb_toarray(context.profile[prop]).reduce(function(deferred,action) {
    return deferred.then(function() { return $.when(jb_run(jb_ctx(context, { profile: action }))) })
  },$.Deferred().resolve());
}

function jb_profileHasValue(context,paramName) {
  return typeof context.profile[paramName] != 'undefined';
}

function jb_logError(errorStr,errorObj) {
  jbart.logs = jbart.logs || {};
  jbart.logs.error = jbart.logs.error || [];
  jbart.logs.error.push(errorStr);
  jb_trigger(jbart.logs,'add',{ type: 'error', text: errorStr });
  console.error(errorStr,errorObj);
}

function jb_logPerformance(type,text) {
  jb_path(jbart,['logPerf',type],(jb_path(jbart,['logPerf',type]) || 0) +1);
//  console.log(type,text||'',jb_path(jbart,['logPerf',type]))
}

function jb_logException(e,errorStr) {
  jb_logError('exception: ' + errorStr + "\n" + (e.stack||''));
}

// js type handling functions
function jb_isArray(obj) {
  if (typeof Array.isArray === 'undefined') {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }
  }
  return Array.isArray(obj);
}

// functions

function jb_extend(obj,obj1,obj2,obj3) {
  if (!obj) return;
  // similar to jQuery.extend but much faster for simple cases
  for(var i in obj1) obj[i] = obj1[i];
  if (obj2) for(var i in obj2) obj[i] = obj2[i];
  if (obj3) for(var i in obj3) obj[i] = obj3[i];

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
    if (jb_isArray(item))
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
  if (!jb_isArray(item)) return arr.push(item);
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

function jb_delay(ms) {
  return new Promise(function(resolve, reject) { setTimeout(resolve, ms) });
}

function jb_compareArrays(arr1, arr2) {
  if (!Array.isArray(arr1) && !Array.isArray(arr2)) return arr1 == arr2;
  if (!arr2 || arr1.length != arr2.length) return false;
  for (var i = 0; i < arr1.length; i++)
    if (arr1[i] !== arr2[i]) return false;
  return true;
}

function jb_prettyPrintComp(compId,comp) {
  if (comp)
    return "jb.component('" + compId + "', "
      + jb_prettyPrintWithPositions(comp).result + ')'
}

function jb_prettyPrint(profile,colWidth,tabSize,initialPath) {
  return jb_prettyPrintWithPositions(profile,colWidth,tabSize,initialPath).result;
}

function jb_prettyPrintWithPositions(profile,colWidth,tabSize,initialPath) {
  colWidth = colWidth || 80;
  tabSize = tabSize || 2;

  var remainedInLine = colWidth;
  var result = '';
  var depth = 0;
  var lineNum = 0;
  var positions = {};

  printValue(profile,initialPath || '');
  return { result : result, positions : positions }

  function sortedPropertyNames(obj) {
    var props = jb_entries(obj).map(x=>x[0]).filter(p=>p.indexOf('$jb') != 0); // keep the order
    var comp_name = jb_compName(profile);
    if (comp_name) { // tgp obj
      var params = jb_entries((jbart.comps[comp_name] || {}).params || {}).map(x=>x[0]);
      props.sort((p1,p2)=>params.indexOf(p1) - params.indexOf(p2));
    }
    if (props.indexOf('$') > 0) { // make the $ first
      props.splice(props.indexOf('$'),1);
      props.unshift('$');
    }
    return props;
  }

  function printValue(val,path) {
    positions[path] = lineNum;
    if (!val) return;
    if (val.$jb_arrayShortcut)
      val = val.items;
    if (Array.isArray(val)) return printArray(val,path);
    if (typeof val === 'object') return printObj(val,path);
    if (typeof val === 'function')
      result += val.toString();
    else if (typeof val === 'string' && val.indexOf('\n') == -1) 
      result += "'" + val + "'";
    else if (typeof val === 'string' && val.indexOf('\n') != -1) {
      depth++;
      result += "`";
      var lines = val.split('\n');
      lines.forEach((line,index)=>{
          result += line.trim(); 
          if(index<lines.length-1) 
            newLine();
      })
      depth--;
      result += "`";
    }  else
      result += JSON.stringify(val);
  }

  function printObj(obj,path) {
      var obj_str = flat_obj(obj);
      if (!printInLine(obj_str)) { // object does not fit in parent line
        depth++;
        result += '{';
        if (!printInLine(obj_str)) { // object does not fit in its own line
          sortedPropertyNames(obj).forEach(function(prop,index,array) {
              if (prop != '$')
                newLine();
              if (obj[prop] != null)
                printProp(obj,prop,path);
              if (index < array.length -1) {
                result += ', ';//newLine();
            }
          });
        }
        depth--;
        newLine();
        result += '}';
      }
  }
  function quotePropName(p) {
    if (p.match(/^[$a-zA-Z_][$a-zA-Z0-9_]*$/))
      return p;
    else
      return `"${p}"`
  }
  function printProp(obj,prop,path) {
    if (obj[prop] && obj[prop].$jb_arrayShortcut)
      obj = jb_obj(prop,obj[prop].items);

    if (printInLine(flat_property(obj,prop))) return;

    if (prop == '$')
      result += '$: '
    else
      result += quotePropName(prop) + (jb_compName(obj[prop]) ? ' :' : ': ');
    //depth++;
    printValue(obj[prop],path+'~'+prop);
    //depth--;
  }
  function printArray(array,path) {
    if (printInLine(flat_array(array))) return;
    result += '[';
    depth++;
    newLine();
    array.forEach(function(val,index) {
      printValue(val,path+'~'+index);
      if (index < array.length -1) {
        result += ', ';
        newLine();
      }
    })
    depth--;newLine();
    result += ']';
  }
  function printInLine(text) {
    if (remainedInLine < text.length || text.match(/:\s?{/) || text.match(/, {\$/)) return false;
    result += text;
    remainedInLine -= text.length;
    return true;
  }
  function newLine() {
    result += '\n';
    lineNum++;
    for (var i = 0; i < depth; i++) result += '               '.substr(0,tabSize);
    remainedInLine = colWidth - tabSize * depth;
  }
  function flat_obj(obj) {
    var props = sortedPropertyNames(obj).filter(x=>x!='$').map(prop => 
      quotePropName(prop) + ': ' + flat_val(obj[prop]));
    if (obj && obj.$) {
      props.unshift("$: '" + obj.$+ "'");
      return '{' + props.join(', ') + ' }'
    }
    return '{ ' + props.join(', ') + ' }'
  }
  function flat_property(obj,prop) {
    if (jb_compName(obj[prop]))
      return quotePropName(prop) + ' :' + flat_val(obj[prop]);
    else
      return quotePropName(prop) + ': ' + flat_val(obj[prop]);
  }
  function flat_val(val) {
    if (Array.isArray(val)) return flat_array(val);
    if (typeof val === 'object') return flat_obj(val);
    if (typeof val === 'function') return val.toString();
    if (typeof val === 'string') 
      return "'" + val + "'";
    else
      return JSON.stringify(val); // primitives
  }
  function flat_array(array) {
    return '[' + array.map(item=>flat_val(item)).join(', ') + ']';
  }
}

 function jb_range(start, count) {
    return Array.apply(0, Array(count)).map((element, index) => index + start);
}

function jb_entries(obj) {
  if (!obj) return [];
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
