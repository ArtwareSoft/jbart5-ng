function jb_run(context,parentParam) {
  try {
    var profile = context.profile;
    if (profile === null) return;
    if (profile.$debugger == 0) debugger;
    if (profile.$asIs) return profile.$asIs;
    if (typeof profile === 'object' && Object.getOwnPropertyNames(profile).length == 0)
      return;
    var run = prepare();
    var jstype = parentParam && parentParam.as;
    switch (run.type) {
      case 'booleanExp': return jb_bool_expression(profile, context);
      case 'expression': return jb_tojstype(jb_expression(profile, context), jstype, context);
      case 'expressionRef': return jb_expression(profile, context,jstype);
      case 'asIs': return profile;
      case 'object': return jb_entriesToObject(jb_entries(profile).map(e=>[e[0],context.run(e[1])]));
      case 'function': return jb_tojstype(profile(context),jstype, context);
      case 'null': return jb_tojstype(null,jstype, context);
      case 'ignore': return context.data;
      case 'pipeline': return jb_tojstype(jbart.comps.pipeline.impl(jb_ctx(context,{profile: { items : profile }})),jstype, context);
      case 'rx-pipeline': return jb_tojstype(jbart.comps.rxPipe.impl(jb_ctx(context,{profile: { items : profile }})),jstype,context);
      case 'foreach': return profile.forEach(function(inner) { jb_run(jb_ctx(context,{profile: inner})) });
      case 'if': 
		return jb_run(run.ifContext, run.IfParentParam) ? 
          jb_run(run.thenContext, run.thenParentParam) : jb_run(run.elseContext, run.elseParentParam);      
      case 'profile':
        for(var varname in profile.$vars || {})
          run.ctx.vars[varname] = jb_run(jb_ctx(run.ctx,{ profile: profile.$vars[varname] }));
        run.paramsArray.forEach(function(paramObj) {
          switch (paramObj.type) {
            case 'function': run.ctx.params[paramObj.name] = paramObj.func; break;
            case 'array': run.ctx.params[paramObj.name] = 
              paramObj.array.map(function(prof) { return jb_run(jb_ctx(run.ctx,{profile: prof}),paramObj.param); } ); break;  // maybe we should [].concat and handle nulls
            default: run.ctx.params[paramObj.name] = jb_run(paramObj.context, paramObj.param);
          }
        });
        var out;
        if (run.impl) {
          run.args = prepareGCArgs(run.ctx);
          if (profile.$debugger) debugger;
          out = run.impl.apply(null,run.args);
        }
        else
          out = jb_run(jb_ctx(run.ctx, { componentContext: run.ctx }),parentParam);

        if (profile.$log)
          jbart.comps.log.impl(context, (profile.$log == true) ? out : jb_run( jb_ctx(context, { profile: profile.$log, data: out, vars: { data: context.data } })));

        if (profile.$probe && jbart.probes && jbart.probes[profile.$probe])
            jbart.probes[profile.$probe].next(context);
        if (profile.$trace) console.log('trace: ' + jb_compName(profile),context,out,run);
          
        return jb_tojstype(out,jstype, context);
    }
  } catch (e) {
    if (context.vars.$throw) throw e;
    jb_logException(e,'exception while running jb_run');
  }

  function prepare() {
    var profile = context.profile;
    var profile_jstype = typeof profile;
    var parentParam_type = parentParam && parentParam.type;
    var jstype = parentParam && parentParam.as;
    var isArray = Array.isArray(profile);
    var firstProp = !isArray && profile_jstype === 'object' && jb_firstProp(profile);

    if (profile_jstype === 'string' && parentParam_type === 'boolean') return { type: 'booleanExp' };
    if (profile_jstype === 'boolean' || profile_jstype === 'number' || parentParam_type == 'asIs') return { type: 'asIs' };// native primitives
    if (profile_jstype === 'string' && jstype === 'ref') return { type: 'expressionRef' };
    if (profile_jstype === 'object' && jstype === 'object') return { type: 'object' };
    if (profile_jstype === 'string') return { type: 'expression' };
    if (profile_jstype === 'function') return { type: 'function' };
    if (firstProp && firstProp.indexOf('$') != 0) return { type: 'asIs' };
    if (profile_jstype === 'object' && (profile instanceof RegExp)) return { type: 'asIs' };
    if (!profile) return { type: 'asIs' };

    if (isArray) {
      if (!profile.length) return { type: 'null' };
      if (!parentParam || !parentParam.type || parentParam.type === 'data' || parentParam.type === 'boolean' ) // pipeline as default for array
        return { type: (parentParam && parentParam.as === 'observable') ? 'rx-pipeline' : 'pipeline' };
      if (parentParam_type === 'action' || parentParam_type === 'action[]' && profile.isArray)
        return { type: 'foreach' };
    } else if (profile.$if) 
    return {
        type: 'if',
        ifContext: jb_ctx(context,{profile: profile.$if}),
        IfParentParam: { type: 'boolean', as:'boolean' },
        thenContext: jb_ctx(context,{profile: profile.then || 0 }),
        thenParentParam: { type: parentParam_type, as:jstype },
        elseContext: jb_ctx(context,{profile: profile['else'] || 0 }),
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
    ctx.params = {};
    paramsArray = [];
    var first = true;

    for (var p in comp.params) {
      var param = comp.params[p];
      var val = profile[p];
      if (!val && first && firstProp != '$') // $comp sugar
        val = profile[firstProp]; 
      if (val != null && (param.type||'').indexOf('[]') > -1 && !Array.isArray(val)) // fix to array value. e.g. single feature not in array
         val = [val];
      var valOrDefault = (typeof(val) != "undefined") ? val : (typeof(param.defaultValue) != 'undefined') ? param.defaultValue : [];

      if (!param.ignore) {
        if (param.dynamic) {
          var func = jb_funcDynamicParam(ctx,valOrDefault,param,p);
          func.profile = (typeof(val) != "undefined") ? val : (typeof(param.defaultValue) != 'undefined') ? param.defaultValue : null;
          paramsArray.push( { name: p, type: 'function', func: func } );
        } else if (param.type && param.type.indexOf('[]') > -1 && jb_isArray(valOrDefault)) // array of profiles
          paramsArray.push( { name: p, type: 'array', array: valOrDefault, param: {} } );
        else paramsArray.push( { name: p, type: 'run', context: jb_ctx(ctx,{profile: valOrDefault}), param: param } );
      }
      first = false;
    }

    if (typeof comp.impl === 'function')
      return { type: 'profile', impl: jb_func(comp_name.replace(/[^a-zA-Z0-9]/g,'_'),comp.impl), ctx: ctx, paramsArray: paramsArray }
    else
      return { type:'profile', ctx: jb_ctx(ctx,{profile: comp.impl }), paramsArray: paramsArray };
  }

  function prepareGCArgs(ctx) {
    return [ctx].concat(jb_map(ctx.params, function(p) {return [p]}));
  }
}

function jb_funcDynamicParam(ctx,profileToRun,param,paramName) {
   if (param && param.type && param.type.indexOf('[') != -1 && jb_isArray(profileToRun)) // array
    var res = jb_func(paramName,(ctx2,data2) => jb_flattenArray(profileToRun.map(prof=>(ctx2||ctx).setData(data2).run(prof,param))))
  else // single
    var res = jb_func(paramName,(ctx2,data2) => profileToRun && (ctx2||ctx).setData(data2).run(profileToRun,param))
  return res;
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

function jb_expression(expression, context, jstype) {
  expression = '' + expression;
  if (jstype == 'boolean') return jb_bool_expression(expression, context);
  if (expression.indexOf('$debugger:') == 0) {
    debugger;
    expression = expression.split('$debugger:')[1];
  }
  if (expression.indexOf('$log:') == 0) {
    var out = jb_expression(expression.split('$log:')[1],context,jstype);
    jbart.comps.log.impl(context, out);
    return out;
  }
  if (expression.indexOf('%') == -1 && expression.indexOf('{') == -1) return expression;
  if (context && !context.ngMode)
    expression = expression.replace(/{{/g,'{%').replace(/}}/g,'%}')
  if (expression == '{%%}' || expression == '%%')
      return expPart('',context,jstype);

  if (expression.lastIndexOf('{%') == 0 && expression.indexOf('%}') == expression.length-2) // just one expression filling all string
    return expPart(expression.substring(2,expression.length-2),context,jstype);

  expression = expression.replace(/{%(.*?)%}/g, function(match,contents) {
      return jb_tostring(expPart(contents,context,'string'));
  })
  if (expression.match(/^%[^%;{}\s><"']*%$/)) // must be after the {% replacer
    return expPart(expression.substring(1,expression.length-1),context,jstype);

  expression = expression.replace(/%([^%;{}\s><"']*)%/g, function(match,contents) {
      return jb_tostring(expPart(contents,context,'string'));
  })

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

    else if (jb_isArray(item))
      item = jb_map(item,function(inner) {
        return typeof inner === "object" ? jb_objectProperty(inner,part,jstype) : inner;
      });
    else if (typeof item === 'object')
      item = item && jb_objectProperty(item,part,jstype,i == parts.length -1);

    if (index && Array.isArray(item)) 
      item = item[index];
    if (!item) return item;	// 0 should return 0
  }
  return item;
}

function jb_bool_expression(expression, context) {
  if (expression.indexOf('$debugger:') == 0) {
    debugger;
    expression = expression.split('$debugger:')[1];
  }
  if (expression.indexOf('$log:') == 0) {
    var calculated = jb_expression(expression.split('$log:')[1],context,'string');
    var result = jb_bool_expression(expression.split('$log:')[1], context);
    jbart.comps.log.impl(context, calculated + ':' + result);
    return result;
  }
  if (expression.indexOf('!') == 0)
    return !jb_bool_expression(expression.substring(1), context);
  var parts = expression.match(/(.+)(==|!=|<|>|>=|<=|\^=|\$=)(.+)/);
  if (!parts) {
    var asString = jb_expression(expression, context, 'string');
    return !!asString && asString != 'false';
  }
  if (parts.length != 4)
    return jb_logError('invalid boolean expression: ' + expression);
  var op = parts[2].trim();

  if (op == '==' || op == '!=' || op == '$=' || op == '^=') {
    var p1 = jb_expression(trim(parts[1]), context, 'string');
    var p2 = jb_expression(trim(parts[3]), context, 'string');
    p2 = (p2.match(/^["'](.*)["']/) || [,p2])[1]; // remove quotes
    if (op == '==') return p1 == p2;
    if (op == '!=') return p1 != p2;
    if (op == '^=') return p1.lastIndexOf(p2,0) == 0; // more effecient
    if (op == '$=') return p1.indexOf(p2, p1.length - p2.length) !== -1;
  }

  var p1 = jb_tojstype(jb_expression(parts[1].trim(), context), 'number');
  var p2 = jb_tojstype(jb_expression(parts[3].trim(), context), 'number');

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
function jb_tostring(value) { return jb_tojstype(value,'string'); }
function jb_toarray(value) { return jb_tojstype(value,'array'); }
function jb_toboolean(value) { return jb_tojstype(value,'boolean'); }
function jb_tosingle(value) { return jb_tojstype(value,'single'); }
function jb_tosingleDataBind(value) { return jb_tojstype(value,'singleDataBind'); }
function jb_tonumber(value) { return jb_tojstype(value,'number'); }

function jb_initJstypes() {
  jbart.jstypes = {
    'string': function(value) {
      if (jb_isArray(value)) value = value[0];
      if (value == null) return '';
      value = jb_val(value);
      if (typeof(value) == 'undefined') return '';
      return '' + value;
    },
    'number': function(value) {
      if (jb_isArray(value)) value = value[0];
      if (value == null || value == undefined) return null;	// 0 is not null
      value = jb_val(value);
      var num = Number(value);
      return isNaN(num) ? null : num;
    },
    'array': function(value) {
      if (jb_isArray(value)) return value;
      if (!value) return [];
      return [value];
    },
    'boolean': function(value) {
      if (jb_isArray(value)) value = value[0];
      return jb_val(value) ? true : false;
    },
    'single': function(value) {
      if (jb_isArray(value)) return value[0];
      if (!value) return value;
      value = jb_val(value);
      return value;
    },
    'singleDataBind': function(value) {
      if (jb_isArray(value)) return value[0];
      if (!value) return value;
      return value;
    },
    'ref': val=> { 
      if (val && (val.$jb_parent || val.$jb_val))
        return val;
      return { $jb_val: () => val }
    }
  }
}

function jb_profileType(profile) {
  if (!profile) return '';
  if (typeof profile == 'string') return 'data';
  var comp_name = profile.$ || jb_firstProp(profile).split('$').pop();

  return (jbart.comps[comp_name] && jbart.comps[comp_name].type) || '';
}

function jb_compName(profile) {
  if (profile.$) return profile.$;
  var f = jb_firstProp(profile);
  return (f.indexOf('$') == 0 && f.indexOf('$jb_') != 0 && jb_firstProp(profile).split('$').pop()); // $comp sugar  
}

// give a name to the impl function. Used for tgp debugging
function jb_func(name, fn) {
  Object.defineProperty(fn, "name", { value: name });
  return fn;
} 
