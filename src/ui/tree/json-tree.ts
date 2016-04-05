import {jb} from 'js/jb';
import * as jb_ui from 'ui/jb-ui';
import {NodeModel,jbTree} from 'ui/tree/tree';
import {Directive, Component, View, DynamicComponentLoader, ElementRef, Injector, Input} from 'angular2/core';
import {Observable,Subject} from 'rxjs/Rx';

jb.component('json-editable-tree', {
	type: 'control',
	params: {
		nodeModel: { type: 'tree.nodeModel', dynamic: true },
	},
	impl: { $: 'tree', cssClass: 'jb-control-tree', nodeModel: { $call: 'nodeModel' }, 
		features: [{ $: 'tree.selection' }, {$: 'tree.keyboard-selection'}] }
})

jb.component('tree.json',{
	type: 'tree.nodeModel',
	params: {
		object : {},
		rootPath: { as: 'string'}
	},
	impl: function(context, json, rootPath) {
		var model = {
			rootPath: rootPath,
			val: path => jb.val(ref(path)),
			subNodes: function(path) { 
				var val = jb.val(ref(path));
				if (Array.isArray(val))
					return jb.range(0,val.length).map(x=>path+'~'+x)
				if (typeof val == 'object')
					return Object.getOwnPropertyNames(val || {})
				.map(x=>path+'~'+x);
				return [];
			},
			modify: () => {}, // TBD
			icon: () => '',
			title: function(path,collapsed) {
				var _ref = ref(path);
				var val = jb.val(_ref);
				if (!collapsed && typeof val == 'object')
					return _ref.$jb_property;

				if (typeof val != 'object')
					return _ref.$jb_property + ': ' + val;

				return _ref.$jb_property + ': ' + Object.getOwnPropertyNames(val)
					.filter(p=> p.indexOf('$jb') != 0).filter(p=> typeof val[p] == 'string')
					.map(p=> p + '= ' + val[p]).join(', ')
			},
			delete(path) {
				var _ref = ref(path);
				if (Array.isArray(_ref.$jb_parent))
					_ref.$jb_parent.splice(_ref.$jb_property,1)
				else
					delete _ref.$jb_parent[_ref.$jb_property];
			},
			isArray(path) {
				return typeof jb.val(ref(path)) == 'object';
			}
		}

		model.children = function(path) {
			model.cache = model.cache || {};
			var res = model.subNodes(path);
			if (!jb.compareArrays(res, model.cache[path])) {
//				console.log(path,'no cache');
				model.cache[path] = res;
			} else {
//				console.log(path,'has cache');
			}

			return model.cache[path];
		}

		model.rootPath = rootPath ? rootPath : 'root';
		model.root = jb.obj(model.rootPath,json);	

		function ref(path) {
			return {
				$jb_parent: path.split('~').slice(0,-1).reduce((o,p) =>o[p],model.root),
				$jb_property: path.split('~').pop()
			}
		}
		return model;

	}
})

