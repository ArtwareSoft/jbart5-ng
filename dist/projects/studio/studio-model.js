System.register(['js/jb', 'ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, jb_rx;
    var modifyOperationsEm, pathChangesEm, ControlModel, model;
    function jbart_base() {
        return jbart.previewjbart || jbart;
    }
    exports_1("jbart_base", jbart_base);
    function comp_asStr(id) {
        return jb_prettyPrintComp(id, getComp(id));
    }
    exports_1("comp_asStr", comp_asStr);
    function parentPath(path) {
        return path.split('~').slice(0, -1).join('~');
    }
    exports_1("parentPath", parentPath);
    function profileValFromPath(path) {
        return profileFromPath(path);
    }
    exports_1("profileValFromPath", profileValFromPath);
    function profileRefFromPath(path) {
        if (path.indexOf('~') == -1)
            return {
                $jb_val: function (value) {
                    if (typeof value == 'undefined')
                        return profileFromPath(path);
                    else
                        findjBartToLook(path).comps[path].impl = value;
                }
            };
        var ref = {
            path: path,
            $jb_val: function (value) {
                var parent = profileFromPath(parentPath(path));
                if (!parent)
                    return;
                if (typeof value == 'undefined')
                    return parent[this.path.split('~').pop()];
                else
                    parent[this.path.split('~').pop()] = value;
            }
        };
        pathChangesEm.subscribe(function (fixer) { return ref.path = fixer.fix(ref.path); });
        return ref;
    }
    exports_1("profileRefFromPath", profileRefFromPath);
    function profileFromPath(path) {
        var id = path.split('~')[0];
        var comp = jbart_base().comps[id] || jbart.comps[id];
        comp = comp && comp.impl;
        if (!comp)
            debugger;
        var innerPath = path.split('~').slice(1).join('~');
        if (!innerPath)
            return comp;
        return comp && innerPath.split('~').reduce(function (obj, p) {
            if (!obj)
                debugger;
            return obj && obj[p];
        }, comp);
    }
    function getComp(id) {
        return jbart_base().comps[id] || jbart.comps[id];
    }
    // used for PTs of type
    function findjBartToLook(path) {
        var id = path.split('~')[0];
        if (jbart_base().comps[id])
            return jbart_base();
        if (jbart.comps[id])
            return jbart;
    }
    //var ref = profileRefFromPath; // function alias
    // export function profilePath(profile, jbartToLook) {
    // 	return getPath((jbartToLook || jbart_base()).comps, profile).slice(0, -2).replace(/([^~]*)~impl(.*)/, '$1$2');
    // 	function getPath(parent, dest, depth) {
    // 		if (depth > 50) debugger;
    // 		if (!parent) return '';
    // 		if (parent === dest) return '~'; // will be removed
    // 		return Object.getOwnPropertyNames(parent).filter(p => typeof parent[p] === 'object' && p.indexOf('$jb') != 0).map(function(p) {
    // 			var path = getPath(parent[p], dest, (depth || 0) + 1);
    // 			return path ? (p + '~' + path) : '';
    // 		}).join(''); // only one will succeed
    // 	}
    // }
    function evalProfile(prof_str) {
        try {
            return eval('x = ' + prof_str);
        }
        catch (e) { }
    }
    exports_1("evalProfile", evalProfile);
    // ***************** path fixers after changes **************************
    function fixMovePaths(from, to) {
        //	console.log('fixMovePath',from,to);
        var parent_path = parentPath(to);
        var depth = parent_path.split('~').length;
        var index = Number(to.split('~').pop()) || 0;
        pathChangesEm.next({ from: from, to: to,
            fix: function (pathToFix) {
                if (!pathToFix)
                    return;
                if (pathToFix.indexOf(from) == 0) {
                    //				console.log('fixMovePath - action',pathToFix, 'to',to + pathToFix.substr(from.length));
                    return to + pathToFix.substr(from.length);
                }
                else {
                    var fixed1 = fixIndexOfPath(pathToFix, from, -1);
                    return fixIndexOfPath(fixed1, to, 1);
                }
            }
        });
    }
    function fixIndexOfPath(pathToFix, changedPath, diff) {
        var parent_path = parentPath(changedPath);
        var depth = parent_path.split('~').length;
        if (pathToFix.indexOf(parent_path) == 0 && pathToFix.split('~').length > depth) {
            var index = Number(changedPath.split('~').pop()) || 0;
            var elems = pathToFix.split('~');
            var indexToFix = Number(elems[depth]);
            if (indexToFix >= index) {
                elems[depth] = Math.max(0, indexToFix + diff);
            }
            return elems.join('~');
        }
        return pathToFix;
    }
    function fixIndexPaths(path, diff) {
        pathChangesEm.next(function (pathToFix) {
            return fixIndexOfPath(pathToFix, path, diff);
        });
    }
    function fixArrayWrapperPath() {
        pathChangesEm.next(function (pathToFix) {
            var base = pathToFix.split('~')[0];
            var first = jb_1.jb.val(profileRefFromPath(base));
            var res = pathToFix.split('~')[0];
            pathToFix.split('~').slice(1).reduce(function (obj, prop) {
                if (!obj || (obj[prop] == null && prop == '0'))
                    return;
                if (Array.isArray(obj) && isNaN(Number(prop))) {
                    res += '~0~' + prop;
                    debugger;
                }
                else
                    res += '~' + prop;
                return obj[prop];
            }, first);
            return res;
        });
    }
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            exports_1("modifyOperationsEm", modifyOperationsEm = new jb_rx.Subject());
            exports_1("pathChangesEm", pathChangesEm = new jb_rx.Subject());
            // The jbart control model return string paths and methods to fix them on change
            ControlModel = (function () {
                function ControlModel(rootPath) {
                    this.rootPath = rootPath;
                }
                ControlModel.prototype.val = function (path) {
                    return profileValFromPath(path);
                };
                ControlModel.prototype.subNodes = function (path, childrenType) {
                    var val = profileValFromPath(path);
                    if (childrenType == 'controls') {
                        var prop = this.controlParam(path);
                        if (!prop || !val[prop])
                            return [];
                        return childPath(prop);
                    }
                    else {
                        return this.nonControlParams(path).map(function (prop) { return childPath(prop); });
                    }
                    function childPath(prop) {
                        if (Array.isArray(val[prop]))
                            return val[prop].map(function (inner, i) { return path + '~' + prop + '~' + i; });
                        else
                            return [path + '~' + prop];
                    }
                };
                ControlModel.prototype.iconPos = function (path) {
                    if (this.controlParam(path))
                        return '21,1';
                    var compName = this.compName(path);
                    if (compName == 'label')
                        return '27,0';
                    if (compName == 'button')
                        return '20,1';
                    return '17,1';
                };
                ControlModel.prototype.compName = function (path) {
                    var val = profileValFromPath(path);
                    return val && jb_1.jb.compName(val);
                };
                ControlModel.prototype.title = function (path, collapsed) {
                    var val = profileValFromPath(path);
                    if (path.indexOf('~') == -1)
                        return path;
                    return (val && val.title) || (val && jb_1.jb.compName(val)) || path.split('~').pop();
                };
                ControlModel.prototype.shortTitle = function (path) {
                    return this.title(path, false);
                };
                ControlModel.prototype.isArray = function (path) {
                    return this.controlParam(path);
                };
                ControlModel.prototype.modify = function (op, path, args, ctx) {
                    var comp = path.split('~')[0];
                    var before = comp_asStr(comp);
                    op.call(this, path, args);
                    modifyOperationsEm.next({ comp: comp, before: before, path: path, args: args, ctx: ctx });
                };
                ControlModel.prototype._delete = function (path) {
                    var prop = path.split('~').pop();
                    var arr = profileValFromPath(parentPath(path));
                    if (Array.isArray(arr)) {
                        var index = Number(prop);
                        arr.splice(index, 1);
                    }
                    else {
                        delete arr[prop];
                    }
                };
                // modify operations - must have same interface: path,args
                ControlModel.prototype.push = function (path, args) {
                    var arr = this.asArray(path);
                    if (arr) {
                        arr.push(args.val);
                        args.resultRef = [path, this.controlParam(path), arr.length - 1].join('~');
                        this.fixArray(path);
                    }
                };
                ControlModel.prototype.move = function (path, args) {
                    var dragged = profileValFromPath(args.dragged);
                    var arr = this.asArray(path);
                    if (arr) {
                        var ctrlParam = this.controlParam(path);
                        this._delete(args.dragged);
                        var index = (args.index == -1) ? arr.length : args.index;
                        arr.splice(index, 0, dragged);
                        fixMovePaths(args.dragged, path + '~' + ctrlParam + '~' + index);
                        this.fixArray(path);
                    }
                };
                ControlModel.prototype.writeValue = function (path, args) {
                    jb_1.jb.writeValue(profileRefFromPath(path), args.value);
                };
                ControlModel.prototype.makeLocal = function (path) {
                    var compName = this.compName(path);
                    var comp = compName && getComp(compName);
                    if (!compName || !comp || typeof comp.impl != 'object')
                        return;
                    var res = JSON.stringify(comp.impl, function (key, val) { return typeof val === 'function' ? '' + val : val; }, 4);
                    // inject param values - only primitives
                    var profile = profileValFromPath(path);
                    jb_1.jb.entries(comp.params)
                        .forEach(function (p) { res = res.replace(new RegExp("%$" + p[0] + "%", 'g'), '' + (profile[p[0]] || p[1].defaultValue || '')); });
                    jb_1.jb.writeValue(profileRefFromPath(path), evalProfile(res));
                };
                ControlModel.prototype.controlChildren = function (path) {
                    return this.children(path);
                };
                ControlModel.prototype.nonControlChildren = function (path) {
                    return this.children(path, 'non-controls');
                };
                ControlModel.prototype.children = function (path, childrenType) {
                    childrenType = childrenType || 'controls';
                    this.cache = this.cache || {};
                    var res = this.subNodes(path, childrenType);
                    if (!jb_1.jb.compareArrays(res, this.cache[path])) {
                        //			console.log(path,'diff', res,this.cache[path]);
                        this.cache[path] = res;
                    }
                    else {
                    }
                    return this.cache[path];
                };
                ControlModel.prototype.paramDef = function (path) {
                    var parent_prof = profileValFromPath(parentPath(path));
                    if (!parent_prof)
                        return;
                    var params = (getComp(jb_1.jb.compName(parent_prof)) || {}).params;
                    return jb_1.jb.entries(params).filter(function (p) { return p[0] == path.split('~').pop(); }).map(function (p) { return p[1]; })[0];
                };
                ControlModel.prototype.PTsOfPath = function (path) {
                    return this.PTsOfType((this.paramDef(path) || {}).type, findjBartToLook(path));
                };
                ControlModel.prototype.PTsOfType = function (type, jbartToLook) {
                    var types = (type || '').split(',').map(function (x) { return x.match(/([^\[]*)([])?/)[1]; });
                    var comp_arr = types.map(function (t) { return jb_entries((jbartToLook || jbart_base()).comps)
                        .filter(function (c) {
                        return (c[1].type || 'data').split(',').indexOf(t) != -1;
                    })
                        .map(function (c) { return c[0]; }); });
                    return comp_arr.reduce(function (all, ar) { return all.concat(ar); }, []);
                };
                ControlModel.prototype.controlParam = function (path) {
                    var prof = profileValFromPath(path);
                    if (!prof)
                        return [];
                    var params = (getComp(jb_1.jb.compName(prof)) || {}).params;
                    return jb_1.jb.entries(params).filter(function (p) { return (p[1].type || '').indexOf('control') != -1; }).map(function (p) { return p[0]; })[0];
                };
                ControlModel.prototype.nonControlParams = function (path) {
                    var prof = profileValFromPath(path);
                    if (!prof)
                        return [];
                    var params = (getComp(jb_1.jb.compName(prof)) || {}).params;
                    return jb_1.jb.entries(params).filter(function (p) { return (p[1].type || '').indexOf('control') == -1; }).map(function (p) { return p[0]; });
                };
                ControlModel.prototype.asArray = function (path) {
                    var val = profileValFromPath(path);
                    var prop = this.controlParam(path);
                    if (!prop)
                        return console.log('pushing to non array');
                    if (val[prop] == undefined)
                        val[prop] = [];
                    var arr = val[prop];
                    if (!Array.isArray(val[prop])) {
                        arr = [arr];
                    }
                    return arr;
                };
                ControlModel.prototype.fixArray = function (path) {
                    // var val = profileValFromPath(path);
                    // var prop = controlParam(path);
                    // if (!prop) return;
                    // var arr = val[prop];
                    // if (Array.isArray(arr) && arr.length == 1)
                    // 	val[prop] = arr[0];
                    //			fixArrayWrapperPath();
                };
                return ControlModel;
            }());
            exports_1("ControlModel", ControlModel);
            exports_1("model", model = new ControlModel(''));
        }
    }
});
//# sourceMappingURL=studio-model.js.map