function jb_run(context,parentParam,settings) {
  try {
    var profile = context.profile;
    if (context.probe && (!settings || !settings.noprobe)) {
      if (context.probe.pathToTrace.indexOf(context.path) == 0)
        return context.probe.record(context,parentParam)
    }
    if (profile === null)
      return jb_tojstype(profile,parentParam && parentParam.as,context);
    if (profile.$debugger == 0) debugger;
    if (profile.$asIs) return profile.$asIs;
    if (parentParam && (parentParam.type||'').indexOf('[]') > -1 && ! parentParam.as) // fix to array value. e.g. single feature not in array
        parentParam.as = 'array';

    if (typeof profile === 'object' && Object.getOwnPropertyNames(profile).length == 0)
      return;
    var run = jb_prepare(context,parentParam);
    var jstype = parentParam && parentParam.as;
    context.parentParam = parentParam;
    switch (run.type) {
      case 'booleanExp': return jb_bool_expression(profile, context);
      case 'expression': return jb_tojstype(jb_expression(profile, context,parentParam), jstype, context);
      case 'asIs': return profile;
      case 'object': return jb_entriesToObject(jb_entries(profile).map(e=>[e[0],context.runInner(e[1],null,e[0])]));
      case 'function': return jb_tojstype(profile(context),jstype, context);
      case 'null': return jb_tojstype(null,jstype, context);
      case 'ignore': return context.data;
      case 'list': { debugger; return profile.map(function(inner,i) { jb_run(jb_ctx(context,{profile: inner, path: i})) }) };
      case 'runActions': return jbart.comps.runActions.impl(jb_ctx(context,{profile: { actions : profile },path:''}));
      case 'if': {
          var cond = jb_run(run.ifContext, run.IfParentParam);
          if (cond.then) 
            return cond.then(res=>
              res ? jb_run(run.thenContext, run.thenParentParam) : jb_run(run.elseContext, run.elseParentParam))
          return cond ? jb_run(run.thenContext, run.thenParentParam) : jb_run(run.elseContext, run.elseParentParam);
      } 
      case 'profile':
        for(var varname in profile.$vars || {})
          run.ctx.vars[varname] = jb_run(jb_ctx(run.ctx,{ profile: profile.$vars[varname], path: '$vars~'+varname }));
        run.preparedParams.forEach(paramObj => {
          switch (paramObj.type) {
            case 'function': run.ctx.params[paramObj.name] = paramObj.func; break;
            case 'array': run.ctx.params[paramObj.name] = 
                paramObj.array.map((prof,i) => jb_run(jb_ctx(run.ctx,{profile: prof, path: paramObj.name+'~'+i}),paramObj.param) )
              ; break;  // maybe we should [].concat and handle nulls
            default: run.ctx.params[paramObj.name] = jb_run(paramObj.context, paramObj.param);
          }
        });
        var out;
        if (run.impl) {
          var args = prepareGCArgs(run.ctx,run.preparedParams);
          if (profile.$debugger) debugger;
          if (! args.then)
            out = run.impl.apply(null,args);
          else
            return args.then(args=>
              jb_tojstype(run.impl.apply(null,args),jstype, context))
        }
        else {
          run.ctx.callerPath = context.path;
          out = jb_run(jb_ctx(run.ctx, { componentContext: run.ctx }),parentParam);
        }

        if (profile.$log)
          jbart.comps.log.impl(context.setData(context.run(profile.$log)));

        if (profile.$trace) console.log('trace: ' + context.path, jb_compName(profile),context,out,run);
          
        return jb_tojstype(out,jstype, context);
    }
  } catch (e) {
    if (context.vars.$throw) throw e;
    jb_logException(e,'exception while running jb_run');
  }

  function prepareGCArgs(ctx,preparedParams) {
    var delayed = preparedParams.filter(param => {
      var v = ctx.params[param.name] || {};
      return (v.then || v.subscribe ) && param.param.as != 'observable'
    });
    if (delayed.length == 0 || typeof Observable == 'undefined')
      return [ctx].concat(preparedParams.map(param=>ctx.params[param.name]))

    return Observable.from(preparedParams)
        .concatMap(param=>
          ctx.params[param.name])
        .toArray()
        .map(x=>
          [ctx].concat(x))
        .toPromise()
  }
}

function jb_compParams(comp) {
  return Array.isArray(comp.params) ? comp.params : jb_entries(comp.params).map(x=>jb_extend(x[1],jb_obj('id',x[0])));
}

function jb_prepareParams(comp,profile,ctx) {
  return jb_compParams(comp)
    .filter(comp=> 
      !comp.ignore)
    .map((param,index) => {
      var p = param.id;
      var val = profile[p], path =p;
      if (!val && index == 0 && jb_sugarProp(profile)) {
        path = jb_sugarProp(profile)[0];
        val = jb_sugarProp(profile)[1]; 
      }
      var valOrDefault = (typeof(val) != "undefined") ? val : (typeof(param.defaultValue) != 'undefined') ? param.defaultValue : null;
      var valOrDefaultArray = valOrDefault ? valOrDefault : []; // can remain single, if null treated as empty array
      var arrayParam = param.type && param.type.indexOf('[]') > -1 && Array.isArray(valOrDefaultArray);

      if (param.dynamic) {
        if (arrayParam)
          var func = (ctx2,data2) => 
            jb_flattenArray(valOrDefaultArray.map((prof,i)=>
              ctx.extendVars(ctx2,data2).runInner(prof,param,path+'~'+i)))
        else
          var func = (ctx2,data2) => 
                valOrDefault != null ? ctx.extendVars(ctx2,data2).runInner(valOrDefault,param,path) : valOrDefault;

        Object.defineProperty(func, "name", { value: p }); // for debug
        func.profile = (typeof(val) != "undefined") ? val : (typeof(param.defaultValue) != 'undefined') ? param.defaultValue : null;
        func.srcPath = ctx.path;
        return { name: p, type: 'function', func: func };
      } 

      if (arrayParam) // array of profiles
        return { name: p, type: 'array', array: valOrDefaultArray, param: {} };
      else 
        return { name: p, type: 'run', context: jb_ctx(ctx,{profile: valOrDefault, path: p}), param: param };
  })
}

function jb_prepare(context,parentParam) {
  var profile = context.profile;
  var profile_jstype = typeof profile;
  var parentParam_type = parentParam && parentParam.type;
  var jstype = parentParam && parentParam.as;
  var isArray = Array.isArray(profile);

  if (profile_jstype === 'string' && parentParam_type === 'boolean') return { type: 'booleanExp' };
  if (profile_jstype === 'boolean' || profile_jstype === 'number' || parentParam_type == 'asIs') return { type: 'asIs' };// native primitives
  if (profile_jstype === 'object' && jstype === 'object') return { type: 'object' };
  if (profile_jstype === 'string') return { type: 'expression' };
  if (profile_jstype === 'function') return { type: 'function' };
  if (profile_jstype === 'object' && !isArray && jb_entries(profile).filter(p=>p[0].indexOf('$') == 0).length == 0) return { type: 'asIs' };
  if (profile_jstype === 'object' && (profile instanceof RegExp)) return { type: 'asIs' };
  if (profile == null) return { type: 'asIs' };

  if (isArray) {
    if (!profile.length) return { type: 'null' };
    if (!parentParam || !parentParam.type || parentParam.type === 'data' ) //  as default for array
      return { type: 'list' };
    if (parentParam_type === 'action' || parentParam_type === 'action[]' && profile.isArray) {
      profile.sugar = true;
      return { type: 'runActions' };
    }
  } else if (profile.$if) 
  return {
      type: 'if',
      ifContext: jb_ctx(context,{profile: profile.$if, path: '$if'}),
      IfParentParam: { type: 'boolean', as:'boolean' },
      thenContext: jb_ctx(context,{profile: profile.then || 0 , path: '~then'}),
      thenParentParam: { type: parentParam_type, as:jstype },
      elseContext: jb_ctx(context,{profile: profile['else'] || 0 , path: '~else'}),
      elseParentParam: { type: parentParam_type, as:jstype }
    }
  var comp_name = jb_compName(profile);
  if (!comp_name) 
    return { type: 'ignore' }
  var comp = jbart.comps[comp_name];
  if (!comp && comp_name) { jb_logError('component ' + comp_name + ' is not defined'); return { type:'null' } }
  if (!comp.impl) { jb_logError('component ' + comp_name + ' has no implementation'); return { type:'null' } }

  var ctx = new jbCtx(context,{});
  ctx.parentParam = parentParam;
  ctx.params = {}; // TODO: try to delete this line
  var preparedParams = jb_prepareParams(comp,profile,ctx);
  if (typeof comp.impl === 'function') {
    Object.defineProperty(comp.impl, "name", { value: comp_name }); // comp_name.replace(/[^a-zA-Z0-9]/g,'_')
    return { type: 'profile', impl: comp.impl, ctx: ctx, preparedParams: preparedParams }
  } else
    return { type:'profile', ctx: jb_ctx(ctx,{profile: comp.impl, comp: comp_name, path: ''}), preparedParams: preparedParams };
}

function jb_resolveFinishedPromise(val) {
  if (!val) return val;
  if (val.$jb_parent) 
    val.$jb_parent = jb_resolveFinishedPromise(val.$jb_parent);
  if (val && typeof val == 'object' && val._state == 1) // finished promise
    return val._result; 
  return val; 
}

function jb_var(context,varname) {
  var res;
  if (context.componentContext && typeof context.componentContext.params[varname] != 'undefined') 
    res = context.componentContext.params[varname];
  else if (context.vars[varname] != null) 
    res = context.vars[varname];
  else if (context.vars.scope && context.vars.scope[varname] != null) 
    res = context.vars.scope[varname];
  else if (context.resources && context.resources[varname] != null) 
    res = context.resources[varname];
  return jb_resolveFinishedPromise(res);
}

function jb_expression(expression, context, parentParam) {
  var jstype = parentParam && parentParam.as;
  expression = '' + expression;
  if (jstype == 'boolean') return jb_bool_expression(expression, context);
  if (expression.indexOf('$debugger:') == 0) {
    debugger;
    expression = expression.split('$debugger:')[1];
  }
  if (expression.indexOf('$log:') == 0) {
    var out = jb_expression(expression.split('$log:')[1],context,parentParam);
    jbart.comps.log.impl(context, out);
    return out;
  }
  if (expression.indexOf('%') == -1 && expression.indexOf('{') == -1) return expression;
  // if (context && !context.ngMode)
  //   expression = expression.replace(/{{/g,'{%').replace(/}}/g,'%}')
  if (expression == '{%%}' || expression == '%%')
      return expPart('',context,jstype);

  if (expression.lastIndexOf('{%') == 0 && expression.indexOf('%}') == expression.length-2) // just one expression filling all string
    return expPart(expression.substring(2,expression.length-2),context,jstype);

  expression = expression.replace(/{%(.*?)%}/g, function(match,contents) {
      return jb_tostring(expPart(contents,context,'string'));
  })
  expression = expression.replace(/{\?(.*?)\?}/g, function(match,contents) {
      return jb_tostring(conditionalExp(contents));
  })
  if (expression.match(/^%[^%;{}\s><"']*%$/)) // must be after the {% replacer
    return expPart(expression.substring(1,expression.length-1),context,jstype);

  expression = expression.replace(/%([^%;{}\s><"']*)%/g, function(match,contents) {
      return jb_tostring(expPart(contents,context,'string'));
  })

  function conditionalExp(expression) {
    // check variable value - if not empty return all expression, otherwise empty
    var match = expression.match(/%([^%;{}\s><"']*)%/);
    if (match && jb_tostring(expPart(match[1],context,'string')))
      return jb_expression(expression, context, { as: 'string' });
    else
      return '';
  }

  function expPart(expressionPart,context,jstype) {
    return jb_resolveFinishedPromise(jb_evalExpressionPart(expressionPart,context,jstype))
  }

  return expression;
}


function jb_evalExpressionPart(expressionPart,context,jstype) {
  if (!jbart.jstypes) jb_initJstypes();
 
  // example: {{$person.name}}.     
  if (expressionPart == ".") expressionPart = "";

  // empty primitive expression
  if (!expressionPart && (jstype == 'string' || jstype == 'boolean' || jstype == 'number')) 
    return jbart.jstypes[jstype](context.data);

  if (expressionPart.indexOf('=') == 0) { // function
    var parsed = expressionPart.match(/=([a-zA-Z]*)\(?([^)]*)\)?/);
    var funcName = parsed && parsed[1];
    if (funcName && jbart.functions[funcName])
      return jb_tojstype(jbart.functions[funcName](context,parsed[2]),jstype,context);
  }

  var parts = expressionPart.split(/[.\/]/);
  var item = context.data;

  for(var i=0;i<parts.length;i++) {
    var part = parts[i], index, match;
    if ((match = part.match(/(.*)\[([0-9]+)\]/)) != null) { // x[y]
      part = match[1];
      index = Number(match[2]);
    }
    if (part == '') ;
    else if (part == '$parent' && item.$jb_parent && i > 0) 
      item = item.$jb_parent;
    else if (part.charAt(0) == '$' && i == 0 && part.length > 1)
      item = jb_var(context,part.substr(1));

    else if (Array.isArray(item))
      item = jb_map(item,function(inner) {
        return typeof inner === "object" ? jb_objectProperty(inner,part,jstype,i == parts.length -1) : inner;
      });
    else if (typeof item === 'object')
      item = item && jb_objectProperty(item,part,jstype,i == parts.length -1);
    else if (index && Array.isArray(item)) 
      item = item[index];
    else
      item = null; // no match
    if (!item) 
      return item;	// 0 should return 0
  }
  return item;
}

function jb_bool_expression(expression, context) {
  if (expression.indexOf('$debugger:') == 0) {
    debugger;
    expression = expression.split('$debugger:')[1];
  }
  if (expression.indexOf('$log:') == 0) {
    var calculated = jb_expression(expression.split('$log:')[1],context,{as: 'string'});
    var result = jb_bool_expression(expression.split('$log:')[1], context);
    jbart.comps.log.impl(context, calculated + ':' + result);
    return result;
  }
  if (expression.indexOf('!') == 0)
    return !jb_bool_expression(expression.substring(1), context);
  var parts = expression.match(/(.+)(==|!=|<|>|>=|<=|\^=|\$=)(.+)/);
  if (!parts) {
    var asString = jb_expression(expression, context, {as: 'string'});
    return !!asString && asString != 'false';
  }
  if (parts.length != 4)
    return jb_logError('invalid boolean expression: ' + expression);
  var op = parts[2].trim();

  if (op == '==' || op == '!=' || op == '$=' || op == '^=') {
    var p1 = jb_tostring(jb_expression(trim(parts[1]), context, {as: 'string'}))
    var p2 = jb_tostring(jb_expression(trim(parts[3]), context, {as: 'string'}))
    // var p1 = jb_expression(trim(parts[1]), context, {as: 'string'});
    // var p2 = jb_expression(trim(parts[3]), context, {as: 'string'});
    p2 = (p2.match(/^["'](.*)["']/) || [,p2])[1]; // remove quotes
    if (op == '==') return p1 == p2;
    if (op == '!=') return p1 != p2;
    if (op == '^=') return p1.lastIndexOf(p2,0) == 0; // more effecient
    if (op == '$=') return p1.indexOf(p2, p1.length - p2.length) !== -1;
  }

  var p1 = jb_tojstype(jb_expression(parts[1].trim(), context), {as:'number'});
  var p2 = jb_tojstype(jb_expression(parts[3].trim(), context), {as:'number'});

  if (op == '>') return p1 > p2;
  if (op == '<') return p1 < p2;
  if (op == '>=') return p1 >= p2;
  if (op == '<=') return p1 <= p2;

  function trim(str) {  // trims also " and '
    return str.trim().replace(/^"(.*)"$/,'$1').replace(/^'(.*)'$/,'$1');
  }
}

function jb_tojstype(value,jstype,context) {
  if (!jstype) return value;
  if (!jbart.jstypes) jb_initJstypes();
  if (typeof jbart.jstypes[jstype] != 'function') debugger;
  return jbart.jstypes[jstype](value,context);
}

function jb_tostring(value) { return jb_tojstype(value,'string') }
function jb_toarray(value) { return jb_tojstype(value,'array') }
function jb_toboolean(value) { return jb_tojstype(value,'boolean') }
function jb_tosingle(value) { return jb_tojstype(value,'single') }
function jb_tonumber(value) { return jb_tojstype(value,'number') }

function jb_initJstypes() {
  jbart.jstypes = {
    'asIs': x => x,
    'object': x => x,
    'string': function(value) {
      if (Array.isArray(value)) value = value[0];
      if (value == null) return '';
      value = jb_val(value);
      if (typeof(value) == 'undefined') return '';
      return '' + value;
    },
    'number': function(value) {
      if (Array.isArray(value)) value = value[0];
      if (value == null || value == undefined) return null;	// 0 is not null
      value = jb_val(value);
      var num = Number(value);
      return isNaN(num) ? null : num;
    },
    'array': function(value) {
      if (Array.isArray(value)) return value;
      if (value == null) return [];
      return [value];
    },
    'boolean': function(value) {
      if (Array.isArray(value)) value = value[0];
      return jb_val(value) ? true : false;
    },
    'single': function(value) {
      if (Array.isArray(value)) return value[0];
      if (!value) return value;
      value = jb_val(value);
      return value;
    },
    'ref': function(value) {
      if (Array.isArray(value)) value = value[0];
      if (value == null) return value;
      if (value && (value.$jb_parent || value.$jb_val))
        return value;
      return { $jb_val: () => value }
    }
  }
}

function jb_profileType(profile) {
  if (!profile) return '';
  if (typeof profile == 'string') return 'data';
  var comp_name = jb_compName(profile);
  return (jbart.comps[comp_name] && jbart.comps[comp_name].type) || '';
}

function jb_sugarProp(profile) {
  return jb_entries(profile)
    .filter(p=>p[0].indexOf('$') == 0 && p[0].length > 1)
    .filter(p=>['$vars','$debugger','$log'].indexOf(p[0]) == -1)[0]
}

function jb_compName(profile) {
  if (!profile) return;
  if (profile.$) return profile.$;
  var f = jb_sugarProp(profile);
  return f && f[0].slice(1);
}

// give a name to the impl function. Used for tgp debugging
function jb_assignNameToFunc(name, fn) {
  Object.defineProperty(fn, "name", { value: name });
  return fn;
} 
