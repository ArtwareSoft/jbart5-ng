import {jb} from 'jb-core';

jb.component('tree.json-read-only',{
	type: 'tree.nodeModel',
	params: {
		object : {},
		rootPath: { as: 'string'}
	},
	impl: function(context, json, rootPath) {
		return new ROjson(json,rootPath)
	}
})

class ROjson {
	constructor(private json,private rootPath) {}
	children(path) {
		var val = this.val(path);
		var out = [];
		if (typeof val == 'object')
			out = Object.getOwnPropertyNames(val || {});
		if (Array.isArray(val))
			out = out.slice(-1);
		return out.map(x=>path+'~'+x);
	}
	val(path) {
		if (path.indexOf('~') == -1)
			return this.json;
		return path.split('~').slice(1).reduce((o,p) =>o[p], this.json)
	}
	isArray(path) {
		var val = this.val(path);
		return typeof val == 'object' && val !== null;
	}
	icon() { 
		return '' 
	}
	title(path,collapsed) {
		var val = this.val(path);
		var prop = path.split('~').pop();
		if (val == null) 
			return prop + ': null';
		if (!collapsed && typeof val == 'object')
			return prop;

		if (typeof val != 'object')
			return prop + ': <span class="treenode-val">' + val + "</span>";

		return prop + ': ' + Object.getOwnPropertyNames(val)
			.filter(p=> p.indexOf('$jb') != 0)
			.filter(p=> typeof val[p] == 'string' || typeof val[p] == 'number' || typeof val[p] == 'boolean')
			.map(p=> 
				p + '= ' + '<span class="treenode-val">' + val[p] + "</span>" )
			.join(', ')
	}
}

