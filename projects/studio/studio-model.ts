import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';

export var modifyOperationsEm = new jb_rx.Subject();
export var studioActivityEm = new jb_rx.Subject();
export var pathChangesEm = new jb_rx.Subject();

export var modifiedCtrlsEm;

// very strange bug after upgrading to rc4 - no flatmap at init phase
var intervalID = window.setInterval(()=> {
		if (modifyOperationsEm.flatMap) {
			window.clearInterval(intervalID);
			modifiedCtrlsEm = modifyOperationsEm.flatMap(x=>{
			    var path_parts = x.path.split('~');
			    var sub_paths = path_parts.map((e,i)=>
			      path_parts.slice(0,i+1).join('~')).reverse();
			    var firstCtrl = sub_paths
			      .filter(p=>
			      	model.isCompNameOfType(jb.compName(profileFromPath(p)),'control'))
			      [0];
			     return firstCtrl ? [{ path: firstCtrl}] : [];
				})
		}
	}
,30);

export function jbart_base() {
	return jbart.previewjbart || jbart;
}

export function compAsStr(id) {
	return jb_prettyPrintComp(id,getComp(id))
}

export function parentPath(path) {
	return path.split('~').slice(0,-1).join('~');
}

export function compAsStrFromPath(path) {
	return compAsStr(path.split('~')[0])
}

export function notifyModifcation(path,before,ctx) {
	var comp = path.split('~')[0];
	modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, ctx: ctx, jbart: findjBartToLook(path) });
}

export function message(message,error) {
	$('.studio-message').text(message); // add animation
	$('.studio-message').css('background', error ? 'red' : '#327DC8');
	$('.studio-message').css('animation','');
	jb.delay(1).then(()=>
		$('.studio-message').css('animation','slide_from_top 5s ease')
	)

}

export function profileRefFromPathWithNotification(path,ctx) {
	var _ref = profileRefFromPath(path);
	return {
		$jb_val: function(value) {
			if (typeof value == 'undefined') 
				return _ref.$jb_val(value);
			if (_ref.$jb_val() == value) return;
			var comp = path.split('~')[0];
			var before = compAsStr(comp);
			_ref.$jb_val(value);
			notifyModifcation(path,before,ctx);
		}
	}
}

export function profileRefFromPath(path) {
	if (path.indexOf('~') == -1) return {
		$jb_val: function(value) {
			if (typeof value == 'undefined') 
				return profileFromPath(path);
			else
				findjBartToLook(path).comps[path].impl = value;
		}
	}

	var ref = {
		path: path,
		$jb_val: function(value) {
			if (typeof value == 'undefined') 
				return profileFromPath(this.path);

			if (profileFromPath(parentPath(this.path)) == profileFromPath(this.path)) // flatten one-item array
				var actual_path = parentPath(this.path);
			else
				var actual_path = this.path;
			
			var parent = profileFromPath(parentPath(actual_path));
			parent[actual_path.split('~').pop()] = value;
		}
	}
	pathChangesEm.subscribe(fixer => ref.path = fixer.fix(ref.path))
	return ref;
}

function profileFromPath(path) {
	var id = path.split('~')[0];
	var comp = jbart_base().comps[id] || jbart.comps[id];
	comp = comp && comp.impl;
	if (!comp) {
		console.log('can not find path ',path);
		return;
	}
	var innerPath = path.split('~').slice(1).join('~');
	if (!innerPath)
		return comp;
	return comp && innerPath.split('~').reduce(function(obj, p) { 
		if (!obj)
			jb.logError('profileFromPath: non existing path '+ path+ ' property: ' + p);
		if (obj && p == '0' && obj[p] == null) // flatten one-item array
			return obj;
		return obj && (obj[p] || obj['$'+p]); 
	}, comp);
}

function getComp(id) {
	return jbart_base().comps[id] || jbart.comps[id];
}

// used for PTs of type
export function findjBartToLook(path) {
	var id = path.split('~')[0];
	if (jbart_base().comps[id])
		return jbart_base();
	if (jbart.comps[id])
		return jbart;
}

export function evalProfile(prof_str) {
	try {
		return eval('('+prof_str+')')
	} catch (e) {
		jb.logException(e,'eval profile:'+prof_str);
	}
}

// The jbart control model return string paths and methods to fix them on change
export class ControlModel {
	constructor(public rootPath, private childrenType) { }

	val(path) { 
		return profileFromPath(path) 
	}

	subNodes(path,childrenType) {
		if (childrenType == 'jb-editor')
			return this.jbEditorSubNodes(path);

		var val = profileFromPath(path);
		if (childrenType == 'controls') {
			var prop = this.controlParam(path);
			if (!prop || !val[prop]) 
				var out = [];
			else
				var out = childPath(prop);
			return out.concat(this.innerControlPaths(path));
		} else if (childrenType == 'non-controls') {
			return this.nonControlParams(path).map(prop=>path + '~' + prop)
		} else if (childrenType == 'array') {
			if (!val) 
				return [];
			else if (!Array.isArray(val)) 
				return [path + '~0'];
			else
				return val.map((inner, i) => path + '~' + i)
		}

		function childPath(prop) {
			if (Array.isArray(val[prop]))
				return val[prop].map((inner, i) => path + '~' + prop + '~' + i)
			else
				return [path + '~' + prop + '~0']
		}
	}

	innerControlPaths(path) {
		var out = ['action~content'] // add more inner paths here
			.map(x=>path+'~'+x)
			.filter(p=>
				this.paramType(p) == 'control');
		return out;
	}


	jbEditorSubNodes(path) {
		var val = profileFromPath(path);
		var comp = getComp(jb.compName(val||{}));
//		var param = this.paramDef(path);
		// if (Array.isArray(val) && (param.type == 'data' || param.type == null)) // pipeline
		// 	return Object.getOwnPropertyNames(val)
		// 		.map(x=>x=='length'? val.length : x)
		// 		.map(k=> path +'~items~'+k)
		if (Array.isArray(val))
			return Object.getOwnPropertyNames(val)
				.map(x=>x=='length'? val.length : x)
				.map(k=> path +'~'+k)
		else if (comp) {
			var composite = jb.entries(comp.params)
				.filter(p=>
					p[1].composite)
				.map(p=>flattenArray(p[0]))
				[0];

			return (composite || []).concat(jb.entries(comp.params)
					.filter(p=>!p[1].composite)
					.map(p=> ({ path: path + '~' + p[0], param: p[1]}))
					.filter(e=>profileFromPath(e.path) != null || e.param.essential)
					.map(e=>e.path)
				)
		}

		function flattenArray(prop) {
			if (Array.isArray(val[prop]))
				return val[prop].map((inner, i) => path + '~' + prop + '~' + i)
			else
				return [path + '~' + prop + '~0']
		}

	}

	jbEditorMoreParams(path) {
		var val = profileFromPath(path);
		var comp = getComp(jb.compName(val||{}));
		if (comp) {
			var existing = this.jbEditorSubNodes(path);
			return jb.entries(comp.params)
					.map(p=> path + '~' + p[0])
					.filter(p=> existing.indexOf(p) == -1)
		}
		return [];
	}


	jbEditorTitle(path, collapsed) { 
		var val = profileFromPath(path);
		var compName = jb.compName(val||{});
		var prop = path.split('~').pop();
		if (!isNaN(Number(prop))) // array value - title as a[i]
			prop = path.split('~').slice(-2).join('[') + ']';
		if (Array.isArray(val) && this.paramType(path) == 'data')
			compName = `pipeline (${val.length})`;
		if (Array.isArray(val) && this.paramType(path) == 'action')
			compName = `actions (${val.length})`;
		if (compName)
			return prop + `= <span class="treenode-val">${compName}</span>`;
		else if (typeof val == 'string')
			return prop + (collapsed ? `: <span class="treenode-val" title="${val}">${val}</span>` : '');
		return prop + (Array.isArray(val) ? ` (${val.length})` : '');
	}

	title(path, collapsed) {
		collapsed = collapsed || this.isArray(path);
		var val = profileFromPath(path);
		if (path.indexOf('~') == -1)
			return path;

		if (this.childrenType == 'jb-editor') 
			return this.jbEditorTitle(path,collapsed);

		return (val && val.title) || (val && jb.compName(val)) || path.split('~').pop();
	}

	icon(path) {
		if (parentPath(path)) {
			var parentVal = profileFromPath(parentPath(path));
			if (Array.isArray(parentVal) && path.split('~').pop() == parentVal.length)
				return 'add';
		}
		if (this.paramType(path) == 'control') {
			if (this.compName(path+'~style') == 'layout.horizontal')
				return 'view_column'
			return 'folder_open'; //'view_headline' , 'folder_open'
		}
		var comp2icon = { 
			label: 'font_download',
			button: 'crop_landscape',
			tab: 'tab',
			image: 'insert_photo',
			'custom-control': 'build',
			'editable-text': 'data_usage',
			'editable-boolean': 'radio_button',
			'editable-number': 'donut_large',
		}
		var compName = this.compName(path);
		if (comp2icon[compName])
			return comp2icon[compName];

		if (this.isOfType(path,'action'))
			return 'play_arrow'

		return 'radio_button_unchecked';
	}

	compName(path) {
		var val = profileFromPath(path);
		return val && jb.compName(val);
	}

	isOfType(path,type) {
		return this.isCompNameOfType(this.compName(path),type);
	}
	isCompNameOfType(name,type) {
		var _jbart = jbart_base().comps[name] ? jbart_base() : jbart;
		if (name && _jbart.comps[name]) {
			while (!_jbart.comps[name].type && jb.compName(jbart.comps[name].impl))
				name = jb.compName(_jbart.comps[name].impl);
			return (_jbart.comps[name].type || '').indexOf(type) == 0;
		}
	}

	shortTitle(path) {
		return this.title(path,false);
	}

	// differnt from children() == 0, beacuse in the control tree you can drop into empty group
	isArray(path) {
		if (this.childrenType == 'jb-editor')
			return (this.children(path)||[]).length > 0;
		
		return this.controlParam(path) || this.innerControlPaths(path).length > 0;
	}

	modify(op,path,args,ctx) {
		var comp = path.split('~')[0];
		var before = getComp(comp) && compAsStr(comp);
		op.call(this,path,args);
		modifyOperationsEm.next({ 
			comp: comp, 
			before: before, 
			after: compAsStr(comp), 
			path: path, 
			args: args, 
			ctx: ctx, 
			jbart: findjBartToLook(path),
			newComp: before ? false: true
		});
	}

	_delete(path) {
		var prop = path.split('~').pop();
		var parent = profileFromPath(parentPath(path))
		if (Array.isArray(parent)) {
			var index = Number(prop);
			parent.splice(index, 1);
			// fixIndexPath(path,-1);
			// this.fixArray(path.split('~').slice(0,-2).join('~'));
		} else { 
			if (parent[prop] === undefined) { // array type with one element
				var pathToDelete = parentPath(path);
				var parent = profileFromPath(parentPath(pathToDelete));
				var prop = pathToDelete.split('~').pop();
			}
			delete parent[prop]
		}
	}
	// modify operations - must have same interface: path,args

	move(path,args) { // drag & drop
		var dragged = profileFromPath(args.dragged);
		var arr = this.getOrCreateArray(path);
		if (arr) {
			var ctrlParam = this.controlParam(path);
			this._delete(args.dragged);
			var index = (args.index == -1) ? arr.length : args.index;
			arr.splice(index,0,dragged);
			fixMovePaths(args.dragged,path+'~'+ctrlParam+ '~' + index);
			this.fixArray(path);
		}
	}

	moveInArray(path,args) { // drag & drop
		var arr = profileFromPath(parentPath(path));
		if (Array.isArray(arr)) {
			var index = Number(path.split('~').pop());
			var base = args.moveUp ? index -1 : index; 
			if (base <0 || base >= arr.length-1) 
				return; // the + elem
			arr.splice(base,2,arr[base+1],arr[base]);
			fixReplacingPaths(parentPath(path)+'~'+base,parentPath(path)+'~'+(base+1));
		}
	}

	writeValue(path,args) {
		jb.writeValue(profileRefFromPath(path),args.value);
	}

	newComp(path,args) {
        jbart.previewjbart.comps[path] = jbart.previewjbart.comps[path] || args.profile;
	}

	wrapWithPipeline(path) {
		jb.writeValue(profileRefFromPath(path),[ profileFromPath(path) ]);
	}

	wrapWithGroup(path) {
		var result = { $: 'group', controls: [ profileFromPath(path) ] };
		jb.writeValue(profileRefFromPath(path),result);
	}
	wrap(path,args) {
		var compDef = getComp(args.compName);
		var paramNames = Object.getOwnPropertyNames((compDef || {}).params);
		if (paramNames[0]) {
			var result = jb.extend({$: args.compName}, jb.obj(paramNames[0],[ profileFromPath(path) ]));
			jb.writeValue(profileRefFromPath(path),result);
		}
	}

	getStyleComp(path) {
	    var style = this.val(path);
	    var compName = jb.compName(style);
	    if (compName == 'customStyle')
	      return { type: 'inner', path: path, style : style }
		var comp = compName && getComp(compName);
		if (jb.compName(comp.impl) == 'customStyle') 
	      return { type: 'global', path: compName, style: comp.impl, innerPath: path }
	}

	addProperty(path) {
		var parent = profileFromPath(parentPath(path));
		if (this.paramType(path) == 'data')
			return jb.writeValue(profileRefFromPath(path),'');
		var param = this.paramDef(path);
		jb.writeValue(profileRefFromPath(path),param.defaultValue || {$: ''});
	}

	duplicate(path) {
		var prop = path.split('~').pop();
		var val = profileFromPath(path);
		var arr = this.getOrCreateArray(parentPath(parentPath(path)));
		if (Array.isArray(arr)) {
			var clone = evalProfile(jb.prettyPrint(val));
			var index = Number(prop);
			arr.splice(index, 0,clone);
			if (index < arr.length-2)
				fixIndexPaths(path,1);
		}
	}

	setComp(path,args) {
		var compName = args.comp;
		var comp = compName && getComp(compName);
		if (!compName || !comp) return;
		var result = { $: compName };
		var existing = profileFromPath(path);
		// copy properties from existing & default values
		if (existing && typeof existing == 'object')
			jb.entries(comp.params).forEach(p=>{
				if (existing[p[0]])
					result[p[0]] = existing[p[0]];
				if (typeof p[1].defaultValue != 'object')
					result[p[0]] = p[1].defaultValue
				if (typeof p[1].defaultValue == 'object' && p[1].forceDefaultCreation)
					result[p[0]] = JSON.parse(JSON.stringify(p[1].defaultValue));
			})
		jb.writeValue(profileRefFromPath(path),result);
	}

	insertComp(path,args) {
		var compName = args.comp;
		var comp = compName && getComp(compName);
		if (!compName || !comp) return;
		var result = { $: compName };
		// copy default values
		jb.entries(comp.params).forEach(p=>{
			if (p[1].defaultValue)
				result[p[0]] = JSON.parse(JSON.stringify(p[1].defaultValue))
		})
		// find group parent that can insert the control
		var group_path = path;
		while (!this.controlParam(group_path) && group_path)
			group_path = parentPath(group_path);
		var arr = this.getOrCreateArray(group_path);
		if (arr) {
			arr.push(result);
			args.modifiedPath = [group_path,this.controlParam(group_path),arr.length-1].join('~');
			this.fixArray(group_path);
		}
	}

	makeLocal(path,ctx) {
		var compName = this.compName(path);
		var comp = compName && getComp(compName);
		if (!compName || !comp || typeof comp.impl != 'object') return;
		var res = JSON.stringify(comp.impl, (key, val) => typeof val === 'function' ? ''+val : val , 4);

		// inject param values - only primitives
		var profile = profileFromPath(path);
		jb.entries(comp.params)
			.forEach(p=>{ 
				res = res.replace(new RegExp(`%\\$${p[0]}%`,'g') , ''+(profile[p[0]] || p[1].defaultValue || '') ) })
		var res_profile = evalProfile(res);
		// if (compName == 'customStyle' && ctx) {
		// 	try {
		// 		var comp = ctx.run(profile);
		// 		var annotations = Reflect.getMetadata('annotations', comp)[0];
		// 		res_profile.css = comp.css;
		// 		res_profile.template = comp.jbTemplate;
		// 	} catch(e) {}
		// }

		jb.writeValue(profileRefFromPath(path),res_profile);
	}

	children(path,childrenType) {
		childrenType = childrenType || this.childrenType || 'controls';
		this.cache = this.cache || {};
		var res = this.subNodes(path,childrenType);
		if (!jb.compareArrays(res, this.cache[path]))
			this.cache[path] = res;

		return this.cache[path];
	}

	paramDef(path) {
		if (!parentPath(path)) // no param def for root
			return;
		if (!isNaN(Number(path.split('~').pop()))) // array elements
			path = parentPath(path);
		var parent_prof = profileFromPath(parentPath(path));
		var compDef = parent_prof && getComp(jb.compName(parent_prof));
		var params = (compDef || {}).params;
		var paramName = path.split('~').pop();
		return jb.entries(params)
			.filter(p=>p[0]==paramName)
			.map(p=>p[1])[0] || {};
	}

	paramType(path) {
		return (this.paramDef(path) || {}).type || 'data';
	}
	PTsOfPath(path) {
		return this.PTsOfType(this.paramType(path),findjBartToLook(path))
	}
	PTsOfType(type,jbartToLook) {
		var types = [].concat.apply([],(type||'').split(',')
			.map(x=>
				x.match(/([^\[]*)([])?/)[1])
			.map(x=> 
				x=='data' ? ['data','aggregator'] : [x]));
		var comp_arr = types.map(t=>jb_entries((jbartToLook || jbart_base()).comps)
			.filter(c=>
				(c[1].type||'data').split(',').indexOf(t) != -1
				|| (c[1].typePattern && t.match(c[1].typePattern.match))
			)
			.map(c=>c[0]));
		return comp_arr.reduce((all,ar)=>all.concat(ar),[]);
	}
	controlParam(path) {
		var prof = profileFromPath(path);
		if (!prof) return [];
		var params = (getComp(jb.compName(prof)) || {}).params;
		return jb.entries(params).filter(p=>(p[1].type||'').indexOf('control')!=-1).map(p=>p[0])[0]
	}
	nonControlParams(path) {
		var prof = profileFromPath(path);
		if (!prof) return [];
		var params = (getComp(jb.compName(prof)) || {}).params;
		return jb.entries(params)
			.filter(p=>
				(p[1].type||'').indexOf('control')==-1)
			.map(p=>p[0])
	}

	getOrCreateArray(path) {
		var val = profileFromPath(path);
		var prop = this.controlParam(path);
		if (!prop)
			return console.log('pushing to non array');
		if (val[prop] === undefined)
			val[prop] = [];
		if (!Array.isArray(val[prop]))
			val[prop] = [val[prop]];
		return val[prop];
	}

	addArrayItem(path,args) {
		var val = profileFromPath(path);
		var toAdd = args.toAdd || {$:''};
		if (Array.isArray(val))
			val.push(toAdd)
		else if (!val)
			jb.writeValue(profileRefFromPath(path),toAdd);
		else
			jb.writeValue(profileRefFromPath(path),[val].concat(toAdd));
	}

	fixArray(path) { // turn arrays with single element into single object
		// var val = profileFromPath(path);
		// var prop = controlParam(path);
		// if (!prop) return;
		// var arr = val[prop];
		// if (Array.isArray(arr) && arr.length == 1)
		// 	val[prop] = arr[0];
	//			fixArrayWrapperPath();
	}

	propName(path) {
		if (!isNaN(Number(path.split('~').pop()))) // array elements
			return parentPath(path).split('~').pop().replace(/s$/,'');

		var paramDef = this.paramDef(path);
		var val = profileFromPath(path);
		if ((paramDef.type ||'').indexOf('[]') != -1) {
			var length = this.subNodes(path,'array').length;
			if (length)
				return path.split('~').pop() + ' (' + length + ')';
		}

		return path.split('~').pop();
	}

}

export var model = new ControlModel('');


// ***************** path fixers after changes **************************

function fixMovePaths(from,to) {
//	console.log('fixMovePath',from,to);
	var parent_path = parentPath(to);
	var depth = parent_path.split('~').length;
	var index = Number(to.split('~').pop()) || 0;
	pathChangesEm.next({ from: from, to: to, 
		fix: function(pathToFix) {
			if (!pathToFix) return;
			if (pathToFix.indexOf(from) == 0) {
//				console.log('fixMovePath - action',pathToFix, 'to',to + pathToFix.substr(from.length));
				return to + pathToFix.substr(from.length);
			}
			else {
				var fixed1 = fixIndexOfPath(pathToFix,from,-1);
				return fixIndexOfPath(fixed1,to,1);
			}
		}
	})
}

function fixIndexOfPath(pathToFix,changedPath,diff) {
	var parent_path = parentPath(changedPath);
	var depth = parent_path.split('~').length;
	if (pathToFix.indexOf(parent_path) == 0 && pathToFix.split('~').length > depth) {
		var index = Number(changedPath.split('~').pop()) || 0;
		var elems = pathToFix.split('~');
		var indexToFix = Number(elems[depth]);
		if (indexToFix >= index) {
			elems[depth] = Math.max(0,indexToFix + diff);
//			console.log('fixIndexPath - action',pathToFix, indexToFix,'to',elems[depth]);
		}
		return elems.join('~')
	}
	return pathToFix;
}

function fixIndexPaths(path,diff) {
	pathChangesEm.next(function(pathToFix) {
		return fixIndexOfPath(pathToFix,path,diff)
	})
} 

function fixReplacingPaths(path1,path2) {
	pathChangesEm.next(new FixReplacingPaths(path1,path2))
} 

class FixReplacingPaths {
	constructor(private path1,private  path2) {}
	fix(pathToFix) {
		if (pathToFix.indexOf(this.path1) == 0)
			return pathToFix.replace(this.path1,this.path2)
		else if (pathToFix.indexOf(this.path2) == 0)
			return pathToFix.replace(this.path2,this.path1)
		return pathToFix;
	}
}


function fixArrayWrapperPath() {
	pathChangesEm.next(function(pathToFix) {
		var base = pathToFix.split('~')[0];
		var first = jb.val(profileRefFromPath(base));
		var res = pathToFix.split('~')[0];
		pathToFix.split('~').slice(1).reduce(function(obj,prop) {
			if (!obj || (obj[prop] == null && prop == '0')) 
				return
			if (Array.isArray(obj) && isNaN(Number(prop))) {
				res += '~0~' + prop;
				debugger;
			}
			else
				res += '~' + prop;
			return obj[prop]
		},first);
		return res;
	})
}




