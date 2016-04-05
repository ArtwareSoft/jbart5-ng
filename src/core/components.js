jb_type('control',{description: "can be rendered to create a HTML control"});
jb_type('data',{description: "The most basic type of jbart. returns a data (usually without side effects)"});
jb_type('aggregator');
jb_type('boolean',{description: "Returns true/false"});
jb_type('action',{description: "Does some action"});
jb_type('dataResource');
jb_type('httpFeature');
jb_type('feature');

jb_component('call',{
 	type: '*',
 	params: {
 		param: { as: 'string' }
 	},
 	impl: function(context,param) {
      if (context.componentContext && typeof(context.componentContext.params[param]) == 'function')
 		return context.componentContext.params[param](jb_ctx(context, { data: context.data, vars: context.vars, componentContext: context.componentContext.componentContext }));
      else
        return context.componentContext && context.componentContext.params[param];
 	}
});

jb_component('pipeline',{
	type: "data",
	params: {
		items: { type: "data[]", ignore: true, essential: true }
	},
	impl: function(context,items) {
		var data = jb_toarray(context.data);
		var curr = (data.length) ? jb_toarray(context.data) : [null];
		var profiles = jb_toarray(context.profile.items || context.profile['$pipeline']);
		profiles.forEach(function(profile) {
			if (jb_profileType(profile) == 'aggregator')
				curr = jb_run(jb_ctx(context,	{ data: curr, profile: profile }), { as: 'array'});
			else 
				curr = [].concat.apply([],curr.map(function(item) {
					return jb_run(jb_ctx(context,{data: item, profile: profile}), { as: 'array'});
				})).filter(notNull);
		});
		return curr;
		function notNull(value) { return value != null; }
  }
})

jb_component('run',{
 	type: '*',
 	params: {
 		profile: {},
 		as: { as: 'string' }
 	},
 	impl: function(context,profile,as) {
 		var param = as ? { as: as} : null;
 	  	return context.run(profile,param);
 	}
});

jb_component('list',{
	type: "data",
	params: {
		items: { type: "data[]", as: 'array' }
	},
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
	params: {
		items: { type: "data[]", as: 'array' }
	},
	impl: function(context,items) {
		for(var i=0;i<items.length;i++)
			if (jb_val(items[i]))
				return items[i];
	}
});

jb_component('jsonPath',{
	type: "data",
	params: {
		parent: { defaultValue: '{%%}', as: 'single' },
		path: { as: 'string' }
	},
	impl: function(context,parent,path) {
		return parent && jb_run(jb_ctx(context,{ data: parent, profile: '{{' + path + '}}' }));
	}
});

jb_component('objectProperties',{
	type: "data",
	params: {
		object: { defaultValue: '{%%}', as: 'single' }
	},
	impl: function(context,object) {
		return jb_ownPropertyNames(object); // object && jb_evalExpressionPart('*',jb_ctx(context,{data:object}));
	}
})

jb_component('extend',{
	type: "data",
	params: {
		with: { as: 'single' },
		object: { defaultValue: '{%%}', as: 'single' }
	},
	impl: function(context,_with,object) {
		return jb_extend({},object,_with);
	}
})

jb_component('objectToArray',{
	type: "data",
	params: {
		object: { defaultValue: '{%%}', as: 'single' }
	},
	impl: function(context,object) {
		return jb_ownPropertyNames(object).map(function(id) { return {id: id, val: object[id]}});
	}
});

jb_component('objectMap',{
	type: "data",
	params: {
		object: { defaultValue: '{%%}', as: 'single' },
		map: { dynamic: true }
	},
	impl: function(context,object,map) {
		var ret = {};
		jb_ownPropertyNames(object).forEach(function(k) { ret[k] = map(jb_ctx(context,{ data: object[k]})) });
		return ret;
  }
})

jb_component('propertyName',{
	type: "data",
	impl: function(context) {
		return context.data && context.data.$jb_property;
	}
});

jb_component('prefix', {
	type: 'data',
	params: {
		separator: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,separator,text) {
		return (text||'').substring(0,text.indexOf(separator))
	}
});

jb_component('suffix', {
	type: 'data',
	params: {
		separator: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,separator,text) {
		return (text||'').substring(text.lastIndexOf(separator)+separator.length)
	}
});

jb_component('removePrefix',{
	type: 'data',
	params: {
		separator: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,separator,text) {
		return (text||'').substring(text.indexOf(separator)+separator.length)
	}
});

jb_component('removePrefixRegex',{
	type: 'data',
	params: {
		prefix: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,prefix,text) {
		context.profile.prefixRegexp = context.profile.prefixRegexp || new RegExp('^'+prefix);
		var m = (text||'').match(context.profile.prefixRegexp);
		return ((m && m.index==0 && text || '').substring(m[0].length)) || text;
	}
});

jb_component('removeSuffix',{
	type: 'data',
	params: {
		separator: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,separator,text) {
		return (text||'').substring(0,text.lastIndexOf(separator))
	}
});

jb_component('removeSuffixRegex',{
	type: 'data',
	params: {
		suffix: { as: 'string', essential: true },
		text: { as: 'string', defaultValue: '{%%}' },
	},
	impl: function(context,suffix,text) {
		context.profile.prefixRegexp = context.profile.prefixRegexp || new RegExp(suffix+'$');
		var m = (text||'').match(context.profile.prefixRegexp);
		return (m && (text||'').substring(m.index+1)) || text;
	}
});

jb_component('writeValue',{
	type: 'action',
	params: {
		to: { as: 'ref' },
		value: {}
	},
	impl: function(context,to,value) {
		jb_writeValue(to,value,true);
	}
});

jb_component('assign',{
	type: 'action',
	params: {
		parent: { as:'single', defaultValue: '{%%}'},
		property: { as:'string'},
		value: { }
	},
	impl: function(context,parent,property,value) {
		jb_assign(parent,property,value);
	}
});

jb_component('toggleBooleanValue',{
	type: 'action',
	params: {
		parent: { as: 'single' },
		property: { as: 'string'}
	},
	impl: function(context,parent,property) {
		if (!parent || typeof(parent) != 'object') return;
		parent[property] = parent[property] ? false : true;
	}
});

jb_component('addToArray',{
	type: 'action',
	params: {
		array: {},
		add: {}
	},
	impl: function(context,array,add) {
		jb_addToArray(array,add,true);
	}
});

jb_component('removeFromArray',{
	type: 'action',
	params: {
		array: { as:'array' },
		remove: { as:'array' }
	},
	impl: function(context,array,remove) {
		for (var i=0; i<array.length; i++)
			if (remove.indexOf(array[i]) >= 0)
				array.splice(i--,1);
	}
});

jb_component('remove',{
	type: 'action',
	params: {	value: {}	},
	impl: function(context,value) {
		jb_remove(value,true);
	}
});


jb_component('slice',{
	params: {
		start: { as: 'number', defaultValue: 0, description: '0-based index' },
		end: { as: 'number', description: '0-based index of where to end the selection (not including itself)' }
	},
	type: 'aggregator',
	impl: function(context,begin,end) {
		if (!context.data || !context.data.slice) return null;
		return end ? context.data.slice(begin,end) : context.data.slice(begin);
	}
});

jb_component('not',{
	type: 'boolean',
	params: { of: { type: 'boolean', as: 'boolean'} },
	impl: function(context, of) {
		return !of;
	}
});

jb_component('and',{
	type: 'boolean',
	params: { items: { type: 'boolean[]', ignore: true } },
	impl: function(context) {
		var items = context.profile.$and || context.profile.items || [];
		for(var i=0;i<items.length;i++) {
			if (!jb_run(jb_ctx(context,{ profile: items[i]}),{ type: 'boolean' }))
				return false;
		}
		return true;
	}
});

jb_component('or',{
	type: 'boolean',
	params: { items: { type: 'boolean[]', ignore: true } },
	impl: function(context) {
		var items = context.profile.$or || context.profile.items || [];
		for(var i=0;i<items.length;i++) {
			if (jb_run(jb_ctx(context,{ profile: items[i]}),{ type: 'boolean' }))
				return true;
		}
		return false;
	}
});

jb_component('contains',{
	type: 'boolean',
	params: {
		text: { type: 'data[]', as: 'array' },
		allText: { defaultValue: '{%%}', as:'array'}
	},
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
      for(var i=0;i<text.length;i++)
      	if (all.indexOf(jb_tostring(text[i])) == -1) return false;
      return true;
	}
})

jb_component('startsWith',{
	type: 'boolean',
	params: {
		startsWith: { as: 'string' },
		text: { defaultValue: '{%%}', as:'string'}
	},
	impl: function(context,startsWith,text) {
		return text.lastIndexOf(startsWith,0) == 0;
	}
})

jb_component('endsWith',{
	type: 'boolean',
	params: {
		endsWith: { as: 'string' },
		text: { defaultValue: '{%%}', as:'string'}
	},
	impl: function(context,endsWith,text) {
		return text.indexOf(endsWith,text.length-endsWith.length) !== -1;
	}
})


jb_component('filter',{
	type: 'aggregator',
	params: {
		filter: { type: "boolean", as: 'boolean', dynamic: true }
	},
	impl: function(context,filter) {
		return context.data.filter(function(item) {
			return filter(context,item);
		});
	}
});

jb_component('count',{
	type: 'aggregator',
	params: {
		items: { as:'array', defaultValue: '{%%}'}
	},
	impl: function(context,items) {
		return items.length;
	}
});

jb_component('toUpperCase',{
	impl: function(context,filter) {
		return jb_tostring(context.data).toUpperCase();
	}
});

jb_component('join',{
	params: {
		separator: { as: 'string', defaultValue:',' },
		prefix: { as: 'string' },
		suffix: { as: 'string' },
		items: { as: 'array', defaultValue: '{%%}'},
		itemName: { as: 'string', defaultValue: 'item'},
		itemText: { as: 'string', dynamic:true, defaultValue: '{%%}'}
	},
	type: 'aggregator',
	impl: function(context,separator,prefix,suffix,items,itemName,itemText) {
		var itemToText = (context.profile.itemText) ?
			function(item) { return itemText(jb_ctx(context, {data: item, vars: jb_obj(itemName,item) }));	} :
			function(item) { return jb_tostring(item); };	// performance

		return prefix + items.map(itemToText).join(separator) + suffix;
	}
});

jb_component('unique',{
	params: {
		id: { as: 'string', dynamic: true, defaultValue: '{%%}' },
		items: { as:'array', defaultValue: '{%%}'}
	},
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
	params: {
		obj: { as: 'single', defaultValue: '{%%}'}
	},
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

jb_component('asIs',{ params: {$asIs: {}}, impl: function(context) { return context.profile.$asIs } });
jb_component('profile',{ impl: function(context) { return jb_handledObject(context.profile.$profile); } });

jb_component('object',{
	impl: function(context) {
		var result = jb_handledObject({});
		var obj = context.profile.$object || context.profile;
		if (Array.isArray(obj)) return obj;
		for(var i in obj)
			if (i.charAt(0) != '$') {
				result[i] = jb_run(jb_ctx(context,{profile: obj[i] }));
				var native_type = obj[i]['$as'];
				if (native_type)
					result[i] = jb_tojstype(result[i],native_type);
		}
		return result;
	}
});

jb_component('stringify',{
	params: {
		value: { defaultValue: '{%%}', as:'single'},
		space: { as: 'string', description: 'use space or tab to make pretty output' }
	},
	impl: function(context,value,space) {		
		if (typeof value == 'object')
			return JSON.stringify(value,null,space);
	}
});

jb_component('jbart', {
	params: {
		script: { description: 'jbart script to run' }
	},
	impl: function(context,script) {
		return jb_run(jb_ctx(context,{profile: script.$jb_object }))
	}
});

jb_component('split',{
	type: 'data',
	params: {
		separator: { as: 'string', defaultValue: ',' },
		text : { as: 'string', defaultValue: '{%%}'},
		part: { type:'enum', values: 'first,second,last,but first,but last' }
	},
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
	params: {
		find: { as: 'string' },
		replace: { as: 'string' },
		text: { as: 'string', defaultValue: '{%%}' },
		useRegex: { type: 'boolean', as: 'boolean', defaultValue: true},
		regexFlags: { as: 'string', defaultValue: 'g', description: 'g,i,m' }
	},
	impl: function(context,find,replace,text,useRegex,regexFlags) {
		if (useRegex) {
			return text.replace(new RegExp(find,regexFlags) ,replace);
		} else
			return text.replace(find,replace);
	}
});

jb_component('foreach', {
	type: 'action',
	params: {
		items: { as: 'array', defaultValue: '{%%}'},
		action: { type:'action', dynamic:true },
		itemVariable: { as:'string' },
		inputVariable: { as:'string' }
	},
	impl: function(context,items,action,itemVariable,inputVariable) {
		items.forEach(function(item) {
			action(jb_ctx(context,{ data:item, vars: jb_obj(itemVariable,item, jb_obj(inputVariable,context.data)) }));
		});
	}
});

jb_component('isNull',{
	type: 'boolean',
	params: {
		item: { as: 'single', defaultValue: '{%%}'}
	},
	impl: function(context, item) {
		return (item == null);
	}
});

jb_component('isEmpty',{
	type: 'boolean',
	params: {
		item: { as: 'single', defaultValue: '{%%}'}
	},
	impl: function(context, item) {
		return (!item || (Array.isArray(item) && item.length == 0));
	}
});

jb_component('equals',{
	type: 'boolean',
	params: {
		item1: { as: 'single'},
		item2: { defaultValue: '{%%}', as: 'single' }
	},
	impl: function(context, item1, item2) {
		if (!item1 && !item2) return true;
		return JSON.stringify(openObject(item1)) == JSON.stringify(openObject(item2));

		function openObject(obj) {
			return (obj && obj.$jb_parent) ? obj.$jb_parent[obj.$jb_property] : obj;
		}
	}
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
	params: {
		defaultValue: { as: 'string' }
	},
	impl: function(context,defaultValue) {
		return jb_handledObject(jb_obj('v',defaultValue));
	}
});

jb_component('searchFilter', {
	type: 'aggregator',
	params: {
		pattern: { as:'string'},
		itemText: { dynamic:true, as:'string', defaultValue:'{{}}'},
		ignoreCase: { type:'boolean', as:'boolean', defaultValue:true }
	},
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
	params: {
		query: { as:'single' },
		filters: { type:'filter{}', ingore: true },
		mainFilter: { type:'filter', as:'single', defaultValue: { $:'substringFilter' } }
	},
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
	params: {
		count: { as:'number', defaultValue: '{%%}' },
		zero: { as:'string', dynamic:true },
		one: { as:'string', dynamic:true },
		other: { as:'string', dynamic:true }
	},
	impl: function(context,count,zero,one,other) {
		switch (count) {
			case 0: return (jb_profileHasValue(context,'zero') ? zero : other)(null,count);
			case 1: return (jb_profileHasValue(context,'one') ? one : other)(null,count);
			default: return other(null,count);
		}
		// todo: add offset and json when like angular
	}
})

// todo - write with reduce
jb_component('runActions', {
	type: 'action',
	params: { 
		actions: { type:'action[]', ignore: true }
	},
	impl: function(context) {
		var actions = jb_toarray(context.profile.actions || context.profile['$runActions']);
		var deferred = $.Deferred();
		function runFromIndex(index,last_result) {
			if (index >= actions.length)
				return deferred.resolve(last_result);
			var promise = jb_run(jb_ctx(context,{profile: actions[index] }),{ as: 'single'});
			$.when(promise).then(
					function(res) { runFromIndex(index+1,last_result) },
					deferred.reject
			);
		}
		runFromIndex(0);
		return deferred.promise();
	}
});

jb_component('runActionOnItems', {
	type: 'action',
	params: { 
		items: { type:'data[]', as:'array', essential: true},
		action: { type:'action', ignore: true, essential: true }
	},
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
	params: {
		mSec: { type: 'number', defaultValue: 1}
	},
	impl: ctx => jb_delay(ctx.params.mSec)
})

jb_component('extractPrefix',{
	type: 'data',
	params: {
		separator: { as: 'string', description: '/w- alphnumberic, /s- whitespace, ^- beginline, $-endline'},
		text : { as: 'string', defaultValue: '{%%}'},
		regex: { type: 'boolean', as: 'boolean', description: 'separator is regex' },
		keepSeparator: { type: 'boolean', as: 'boolean' }
	},
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
	params: {
		separator: { as: 'string', description: '/w- alphnumberic, /s- whitespace, ^- beginline, $-endline'},
		text : { as: 'string', defaultValue: '{%%}'},
		regex: { type: 'boolean', as: 'boolean', description: 'separator is regex' },
		keepSeparator: { type: 'boolean', as: 'boolean' }
	},
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
	params: {
		action: { type: 'action', dynamic: true }
	},
	impl: (ctx,action) => jb_delay(1).then(()=>action())
})
