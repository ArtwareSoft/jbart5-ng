jb_type('control',{description: "can be rendered to create a HTML control"});
jb_type('data',{description: "The most basic type of jbart. returns a data (usually without side effects)"});
jb_type('aggregator');
jb_type('boolean',{description: "Returns true/false"});
jb_type('action',{description: "Does some action"});
jb_type('dataResource');
jb_type('feature');

jb_component('call',{
 	type: '*',
 	params: [
 		{ id: 'param', as: 'string' }
 	],
 	impl: function(context,param) {
 	  var paramObj = context.componentContext && context.componentContext.params[param];
      if (typeof(paramObj) == 'function')
 		return paramObj(jb_ctx(context, { 
 			data: context.data, 
 			vars: context.vars, 
 			componentContext: context.componentContext.componentContext,
 			comp: paramObj.srcPath // overrides path - use the former path
 		}));
      else
        return paramObj;
 	}
});

jb_component('pipeline',{
	type: "data",
	params: [
		{ id: 'items', type: "data,aggregator[]", ignore: true, essential: true, composite: true }
	],
	impl: function(context,items) {
		var data = jb_toarray(context.data);
		var curr = [data[0]]; // use only one data item, the first or null
		if (typeof context.profile.items == 'string')
			return context.runInner(context.profile.items,null,'items');
		var profiles = jb_toarray(context.profile.items || context.profile['$pipeline']);
		if (context.profile.items && context.profile.items.sugar)
			var innerPath =  '' ;
		else 
			var innerPath = context.profile['$pipeline'] ? '$pipeline~' : 'items~';

		profiles.forEach(function(profile,i) {
			var parentParam = (i == profiles.length - 1 && context.parentParam) ? context.parentParam : { as: 'array'};
			if (jb_profileType(profile) == 'aggregator')
				curr = jb_run(jb_ctx(context,	{ data: curr, profile: profile, path: innerPath+i }), parentParam);
			else 
				curr = [].concat.apply([],curr.map(function(item) {
					return jb_run(jb_ctx(context,{data: item, profile: profile, path: innerPath+i}), parentParam);
				})).filter(notNull);
		});
		return curr;
		function notNull(value) { return value != null; }
  }
})

jb_component('run',{
 	type: '*',
 	params: [
 		{ id: 'profile', as: 'single'},
 	],
 	impl: function(context,profile) {
 	  	return context.run(profile);
 	}
});

jb_component('list',{
	type: "data",
	params: [
		{ id: 'items', type: "data[]", as: 'array', composite: true }
	],
	impl: function(context,items) {
		var out = [];
		items.forEach(function(item) {
			if (Array.isArray(item))
				out = out.concat(item);
			else
				out.push(item);
		});
		return out;
	}
});

jb_component('firstSucceeding',{
	type: "data",
	params: [
		{ id: 'items', type: "data[]", as: 'array' }
	],
	impl: function(context,items) {
		for(var i=0;i<items.length;i++)
			if (jb_val(items[i]))
				return items[i];
	}
});

jb_component('objectProperties',{
	type: "data",
	params: [
		{ id: 'object', defaultValue: '%%', as: 'single' }
	],
	impl: (ctx,object) =>
		jb_ownPropertyNames(object)
})

jb_component('extend',{
	type: "data",
	params: [
		{ id: 'with', as: 'single' },
		{ id: 'object', defaultValue: '%%', as: 'single' }
	],
	impl: function(context,_with,object) {
		return jb_extend({},object,_with);
	}
})

jb_component('objectToArray',{
	type: "data",
	params: [
		{ id: 'object', defaultValue: '%%', as: 'single' }
	],
	impl: (context,object) =>
		jb_ownPropertyNames(object).map((id,index) => 
			({id: id, val: object[id], index: index}))
});

jb_component('propertyName',{
	type: "data",
	impl: function(context) {
		return context.data && context.data.$jb_property;
	}
});

jb_component('prefix', {
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,separator,text) {
		return (text||'').substring(0,text.indexOf(separator))
	}
});

jb_component('suffix', {
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,separator,text) {
		return (text||'').substring(text.lastIndexOf(separator)+separator.length)
	}
});

jb_component('removePrefix',{
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,separator,text) {
		return (text||'').substring(text.indexOf(separator)+separator.length)
	}
});

jb_component('removePrefixRegex',{
	type: 'data',
	params: [
		{ id: 'prefix', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,prefix,text) {
		context.profile.prefixRegexp = context.profile.prefixRegexp || new RegExp('^'+prefix);
		var m = (text||'').match(context.profile.prefixRegexp);
		return ((m && m.index==0 && text || '').substring(m[0].length)) || text;
	}
});

jb_component('removeSuffix',{
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,separator,text) {
		return (text||'').substring(0,text.lastIndexOf(separator))
	}
});

jb_component('removeSuffixRegex',{
	type: 'data',
	params: [
		{ id: 'suffix', as: 'string', essential: true },
		{ id: 'text', as: 'string', defaultValue: '%%' },
	],
	impl: function(context,suffix,text) {
		context.profile.prefixRegexp = context.profile.prefixRegexp || new RegExp(suffix+'$');
		var m = (text||'').match(context.profile.prefixRegexp);
		return (m && (text||'').substring(m.index+1)) || text;
	}
});

jb_component('writeValue',{
	type: 'action',
	params: [
		{ id: 'to', as: 'ref' },
		{ id: 'value',}
	],
	impl: (ctx,to,value) =>
		jb_writeValue(to,value)
});

jb_component('toggleBooleanValue',{
	type: 'action',
	params: [
		{ id: 'of', as: 'ref' },
	],
	impl: (ctx,of) =>
		jb_writeValue(of,jb_val(of) ? false : true)
});

jb_component('addToArray', {
	type: 'action',
	params: [
		{ id: 'array',},
		{ id: 'add',}
	],
	impl: function(context,array,add) {
		jb_addToArray(array,add,true);
	}
});

jb_component('removeFromArray',{
	type: 'action',
	params: [
		{ id: 'array', as:'array' },
		{ id: 'remove', as:'array' }
	],
	impl: function(context,array,remove) {
		for (var i=0; i<array.length; i++)
			if (remove.indexOf(array[i]) >= 0)
				array.splice(i--,1);
	}
});

jb_component('remove', {
	type: 'action',
	params: [{ id: 'value' }],
	impl: function(context,value) {
		jb_remove(value,true);
	}
});


jb_component('slice', {
	params: [
		{ id: 'start', as: 'number', defaultValue: 0, description: '0-based index', essential: true },
		{ id: 'end', as: 'number', essential: true, description: '0-based index of where to end the selection (not including itself)' }
	],
	type: 'aggregator',
	impl: function(context,begin,end) {
		if (!context.data || !context.data.slice) return null;
		return end ? context.data.slice(begin,end) : context.data.slice(begin);
	}
});

jb_component('not',{
	type: 'boolean',
	params: [ 
		{ id: 'of', type: 'boolean', as: 'boolean', essential: true} 
	],
	impl: function(context, of) {
		return !of;
	}
});

jb_component('and',{
	type: 'boolean',
	params: [ 
		{ id: 'items', type: 'boolean[]', ignore: true, essential: true } 
	],
	impl: function(context) {
		var items = context.profile.$and || context.profile.items || [];
		for(var i=0;i<items.length;i++) {
			if (!jb_run(jb_ctx(context,{ profile: items[i], path: i}),{ type: 'boolean' }))
				return false;
		}
		return true;
	}
});

jb_component('or',{
	type: 'boolean',
	params: [ 
		{ id: 'items', type: 'boolean[]', ignore: true, essential: true } 
	],
	impl: function(context) {
		var items = context.profile.$or || context.profile.items || [];
		for(var i=0;i<items.length;i++) {
			if (jb_run(jb_ctx(context,{ profile: items[i], path: i}),{ type: 'boolean' }))
				return true;
		}
		return false;
	}
});

jb_component('contains',{
	type: 'boolean',
	params: [
		{ id: 'text', type: 'data[]', as: 'array', essential: true },
		{ id: 'allText', defaultValue: '%%', as:'array'}
	],
	impl: function(context,text,allText) {
      var all = "";
      allText.forEach(function(allTextItem) {
		if (allTextItem.outerHTML)
			all += allTextItem.outerHTML + $(allTextItem).findIncludeSelf('input,textarea').get().map(function(item) { return item.value; }).join();
		else if (typeof(allTextItem) == 'object') 
			all += JSON.stringify(allTextItem);
		else 
			all += jb_tostring(allTextItem);
      });
      var prevIndex = -1;
      for(var i=0;i<text.length;i++) {
      	var newIndex = all.indexOf(jb_tostring(text[i]),prevIndex);
      	if (newIndex <= prevIndex) return false;
      	prevIndex = newIndex;
      }
      return true;
	}
})

jb_component('startsWith',{
	type: 'boolean',
	params: [
		{ id: 'startsWith', as: 'string', essential: true },
		{ id: 'text', defaultValue: '%%', as:'string'}
	],
	impl: function(context,startsWith,text) {
		return text.lastIndexOf(startsWith,0) == 0;
	}
})

jb_component('endsWith',{
	type: 'boolean',
	params: [
		{ id: 'endsWith', as: 'string', essential: true },
		{ id: 'text', defaultValue: '%%', as:'string'}
	],
	impl: function(context,endsWith,text) {
		return text.indexOf(endsWith,text.length-endsWith.length) !== -1;
	}
})


jb_component('filter',{
	type: 'aggregator',
	params: [
		{ id: 'filter', type: 'boolean', as: 'boolean', dynamic: true, essential: true }
	],
	impl: (context,filter) =>
		jb_toarray(context.data).filter(item =>
			filter(context,item)
		)
});

jb_component('count',{
	type: 'aggregator',
	params: [
		{ id: 'items', as:'array', defaultValue: '%%'}
	],
	impl: (ctx,items) =>
		items.length
});

jb_component('toUpperCase', {
	params: [
		{ id: 'text', as: 'string', defaultValue: '%%'}
	],
	impl: (ctx,text) =>
		text.toUpperCase()
});

jb_component('toLowerCase', {
	params: [
		{ id: 'text', as: 'string', defaultValue: '%%'}
	],
	impl: (ctx,text) =>
		text.toLowerCase()
});

jb_component('capitalize', {
	params: [
		{ id: 'text', as: 'string', defaultValue: '%%'}
	],
	impl: (ctx,text) =>
		text.charAt(0).toUpperCase() + text.slice(1)
});


jb_component('join',{
	params: [
		{ id: 'separator', as: 'string', defaultValue:',', essential: true },
		{ id: 'prefix', as: 'string' },
		{ id: 'suffix', as: 'string' },
		{ id: 'items', as: 'array', defaultValue: '%%'},
		{ id: 'itemName', as: 'string', defaultValue: 'item'},
		{ id: 'itemText', as: 'string', dynamic:true, defaultValue: '%%'}
	],
	type: 'aggregator',
	impl: function(context,separator,prefix,suffix,items,itemName,itemText) {
		var itemToText = (context.profile.itemText) ?
			function(item) { return itemText(jb_ctx(context, {data: item, vars: jb_obj(itemName,item) }));	} :
			function(item) { return jb_tostring(item); };	// performance

		return prefix + items.map(itemToText).join(separator) + suffix;
	}
});

jb_component('unique',{
	params: [
		{ id: 'id', as: 'string', dynamic: true, defaultValue: '%%' },
		{ id: 'items', as:'array', defaultValue: '%%'}
	],
	type: 'aggregator',
	impl: function(context,id,items) {
		var out = [];
		var soFar = {};
		for(var i=0;i<items.length;i++) {
			var itemId = id( jb_ctx(context, {data: items[i] } ));
			if (soFar[itemId]) continue;
			soFar[itemId] = true;
			out.push(items[i]);
		}
		return out;
	}
});

jb_component('log',{
	params: [
		{ id: 'obj', as: 'single', defaultValue: '%%'}
	],
	impl: function(context,obj) {
		var out = obj;
		if (typeof GLOBAL != 'undefined' && typeof(obj) == 'object')
			out = JSON.stringify(obj,null," ");
		if (typeof window != 'undefined')
			(window.parent || window).console.log(out);
		else
			console.log(out);
		return context.data;
	}
});

jb_component('asIs',{ params: [{id: '$asIs'}], impl: function(context) { return context.profile.$asIs } });
jb_component('profile',{ impl: function(context) { return jb_handledObject(context.profile.$profile); } });

jb_component('object',{
	impl: function(context) {
		var result = {};
		var obj = context.profile.$object || context.profile;
		if (Array.isArray(obj)) return obj;
		for(var prop in obj) {
			if (prop == '$' && obj[prop] == 'object')
				continue;
			result[prop] = jb_run(jb_ctx(context,{profile: obj[prop], path: prop }));
			var native_type = obj[prop]['$as'];
			if (native_type)
				result[prop] = jb_tojstype(result[prop],native_type);
		}
		return result;
	}
});

jb_component('stringify',{
	params: [
		{ id: 'value', defaultValue: '%%', as:'single'},
		{ id: 'space', as: 'string', description: 'use space or tab to make pretty output' }
	],
	impl: (context,value,space) =>		
			JSON.stringify(value,null,space)
});

jb_component('jbart', {
	params: [
		{ id: 'script', description: 'jbart script to run' }
	],
	impl: function(context,script) {
		return jb_run(jb_ctx(context,{profile: script.$jb_object }))
	}
});

jb_component('split',{
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', defaultValue: ',' },
		{ id: 'text', as: 'string', defaultValue: '%%'},
		{ id: 'part', options: ',first,second,last,but first,but last' }
	],
	impl: function(context,separator,text,part) {
		var out = text.split(separator);
		switch (part) {
			case 'first': return out[0];
			case 'second': return out[1];
			case 'last': return out.pop();
			case 'but first': return out.slice(1);
			case 'but last': return out.slice(0,-1);
			default: return out;
		}
	}
});

jb_component('replace',{
	type: 'data',
	params: [
		{ id: 'find', as: 'string' },
		{ id: 'replace', as: 'string' },
		{ id: 'text', as: 'string', defaultValue: '%%' },
		{ id: 'useRegex', type: 'boolean', as: 'boolean', defaultValue: true},
		{ id: 'regexFlags', as: 'string', defaultValue: 'g', description: 'g,i,m' }
	],
	impl: function(context,find,replace,text,useRegex,regexFlags) {
		if (useRegex) {
			return text.replace(new RegExp(find,regexFlags) ,replace);
		} else
			return text.replace(find,replace);
	}
});

jb_component('foreach', {
	type: 'action',
	params: [
		{ id: 'items', as: 'array', defaultValue: '%%'},
		{ id: 'action', type:'action', dynamic:true },
		{ id: 'itemVariable', as:'string' },
		{ id: 'inputVariable', as:'string' }
	],
	impl: function(context,items,action,itemVariable,inputVariable) {
		items.forEach(function(item) {
			action(jb_ctx(context,{ data:item, vars: jb_obj(itemVariable,item, jb_obj(inputVariable,context.data)) }));
		});
	}
});

jb_component('touch', {
	type: 'action',
	params: [
		{ id: 'data', as: 'ref'},
	],
	impl: function(context,data_ref) {
		var val = Number(jb_val(data_ref));
		jb_writeValue(data_ref,val ? val + 1 : 1);
	}
});

jb_component('isNull',{
	type: 'boolean',
	params: [
		{ id: 'item', as: 'single', defaultValue: '%%'}
	],
	impl: function(context, item) {
		return (item == null);
	}
});

jb_component('isEmpty',{
	type: 'boolean',
	params: [
		{ id: 'item', as: 'single', defaultValue: '%%'}
	],
	impl: function(context, item) {
		return (!item || (Array.isArray(item) && item.length == 0));
	}
});

jb_component('notEmpty',{
	type: 'boolean',
	params: [
		{ id: 'item', as: 'single', defaultValue: '%%'}
	],
	impl: function(context, item) {
		return (item && !(Array.isArray(item) && item.length == 0));
	}
});

jb_component('equals',{
	type: 'boolean',
	params: [
		{ id: 'item1', as: 'single', essential: true },
		{ id: 'item2', defaultValue: '%%', as: 'single' }
	],
	impl: function(context, item1, item2) {
		if (!item1 && !item2) return true;
		return JSON.stringify(openObject(item1)) == JSON.stringify(openObject(item2));

		function openObject(obj) {
			return (obj && obj.$jb_parent) ? obj.$jb_parent[obj.$jb_property] : obj;
		}
	}
});

jb_component('notEquals',{
	type: 'boolean',
	params: [
		{ id: 'item1', as: 'single', essential: true },
		{ id: 'item2', defaultValue: '%%', as: 'single' }
	],
	impl: { $not: { $: 'equals', item1: '%$item1%', item2: '%$item2%'} }
});

jb_component('parent',{
	type: "data",
	impl: function(context) {
		var object = jb_tosingle(context.data);
		return object && object.$jb_parent;
	}
});	

jb_component('writableText', {
	type: 'data',
	params: [
		{ id: 'defaultValue', as: 'string' }
	],
	impl: function(context,defaultValue) {
		return jb_handledObject(jb_obj('v',defaultValue));
	}
});

jb_component('searchFilter', {
	type: 'aggregator',
	params: [
		{ id: 'pattern', as:'string'},
		{ id: 'itemText', dynamic:true, as:'string', defaultValue:'%%'},
		{ id: 'ignoreCase', type:'boolean', as:'boolean', defaultValue:true }
	],
	impl: function(context,pattern,itemText,ignoreCase) {
		if (!pattern) return context.data;
		var patternLowCase = pattern.toLowerCase();
		return jb_map(jb_toarray(context.data), function(item) {
			if (ignoreCase) {
				if (itemText(context,item).toLowerCase().indexOf(patternLowCase) != -1)
					return item;
			} else
			 	if (itemText(context,item).indexOf(pattern) != -1)
					return item;
		} );
	}
});

jb_component('queryFilter', {
	type: 'aggregator',
	params: [
		{ id: 'query', as:'single' },
		{ id: 'filters', type:'filter{}', ingore: true },
		{ id: 'mainFilter', type:'filter', as:'single', defaultValue: { $:'substringFilter' } }
	],
	impl: function(context,query,_filters,mainFilter) {
		if (typeof(query) != 'object') return context.data;

		var filters = {};
		jb_map(_filters, function(filter,property) { 
			if (query[property])
				filters[property] = jb_run(jb_ctx(context, { profile: filter }));
		});

		return jb_toarray(context.data).filter(function(item) {
			for (var col in query)
				if (query.hasOwnProperty(col) && col.indexOf('$jb_') != 0) {
					if (! ((filters[col] || mainFilter)(item[col],query[col]))) return false;
				}
			return true;
		});
	}
});

jb_type('filter');

jb_component('substringFilter',{
	type: 'filter',
	impl: function(context) {
		return function(actual,expected) {
			if (expected == null || expected == undefined) return true;
			return (jb_tostring(actual).toLowerCase().indexOf( jb_tostring(expected).toLowerCase() ) != -1);
		}
	}
});

jb_component('strictFilter',{
	type: 'filter',
	impl: function(context) {
		return function(actual,expected) {
			if (!expected) return true;
			return (actual == expected);
		}
	}
});

jb_component('numericFilter',{
	type: 'filter',
	impl: function(context) {
		return function(actual,expected) {
			if (!expected) return true;
			if (expected.from && jb_tonumber(actual) < jb_tonumber(expected.from)) return false;
			if (expected.to && jb_tonumber(actual) > jb_tonumber(expected.to)) return false;
			return true;
		}
	}
});

jb_component('pluralize', {
	type: 'data',
	params: [
		{ id: 'count', as:'number', defaultValue: '%%' },
		{ id: 'zero', as:'string', dynamic:true },
		{ id: 'one', as:'string', dynamic:true },
		{ id: 'other', as:'string', dynamic:true }
	],
	impl: function(context,count,zero,one,other) {
		switch (count) {
			case 0: return (jb_profileHasValue(context,'zero') ? zero : other)(null,count);
			case 1: return (jb_profileHasValue(context,'one') ? one : other)(null,count);
			default: return other(null,count);
		}
		// todo: add offset and json when like angular
	}
})

jb_component('runActions', {
	type: 'action',
	params: [ 
		{ id: 'actions', type:'action[]', ignore: true, composite: true, essential: true }
	],
	impl: function(context) {
		if (!context.profile) debugger;
		var actions = jb_toarray(context.profile.actions || context.profile['$runActions']);
		if (context.profile.actions && context.profile.actions.sugar)
			var innerPath =  '' ;
		else 
			var innerPath = context.profile['$runActions'] ? '$runActions~' : 'items~';
		return actions.reduce((def,action,index) =>
			def.then(() =>
				$.when(jb_run(jb_ctx(context,{profile: action, path: innerPath + index }),{ as: 'single'}))),
			$.Deferred().resolve())
	}
});

jb_component('runActionOnItems', {
	type: 'action',
	params: [ 
		{ id: 'items', type:'data[]', as:'array', essential: true},
		{ id: 'action', type:'action', ignore: true, essential: true }
	],
	impl: function(context,items) {
		var deferred = $.Deferred();
		function runFromIndex(index) {
			if (index >= items.length) 
				return deferred.resolve();

			var promise = jb_run(jb_ctx(context,{data: [items[index]], profile: context.profile.action }), {as: 'single'});
			$.when(promise).then(
					function() { runFromIndex(index+1) },
					deferred.reject
			);
		}
		runFromIndex(0);
		return deferred.promise();
	}
});

jb_component('delay', {
	params: [
		{ id: 'mSec', type: 'number', defaultValue: 1}
	],
	impl: ctx => jb_delay(ctx.params.mSec)
})

jb_component('extractPrefix',{
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', description: '/w- alphnumberic, /s- whitespace, ^- beginline, $-endline'},
		{ id: 'text', as: 'string', defaultValue: '%%'},
		{ id: 'regex', type: 'boolean', as: 'boolean', description: 'separator is regex' },
		{ id: 'keepSeparator', type: 'boolean', as: 'boolean' }
	],
	impl: function(context,separator,text,regex,keepSeparator) {
		if (!regex) {
			return text.substring(0,text.indexOf(separator)) + (keepSeparator ? separator : '');
		} else { // regex
			var match = text.match(separator);
			if (match)
				return text.substring(0,match.index) + (keepSeparator ? match[0] : '');
		}
	}
});

jb_component('extractSuffix',{
	type: 'data',
	params: [
		{ id: 'separator', as: 'string', description: '/w- alphnumberic, /s- whitespace, ^- beginline, $-endline'},
		{ id: 'text', as: 'string', defaultValue: '%%'},
		{ id: 'regex', type: 'boolean', as: 'boolean', description: 'separator is regex' },
		{ id: 'keepSeparator', type: 'boolean', as: 'boolean' }
	],
	impl: function(context,separator,text,regex,keepSeparator) {
		if (!regex) {
			return text.substring(text.lastIndexOf(separator) + (keepSeparator ? 0 : separator.length));
		} else { // regex
			var match = text.match(separator+'(?![\\s\\S]*' + separator +')'); // (?!) means not after, [\\s\\S]* means any char including new lines
			if (match)
				return text.substring(match.index + (keepSeparator ? 0 : match[0].length));
		}
	}
});

jb_component('onNextTimer',{
	type: 'action',
	params: [
		{ id: 'action', type: 'action', dynamic: true }
	],
	impl: (ctx,action) => {
		jb_delay(1,ctx).then(()=>
			action())
	}
})
