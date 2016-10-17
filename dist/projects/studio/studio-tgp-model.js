System.register(['jb-core', './studio-path', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_path_1, studio_utils_1;
    var TgpModel, model;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (studio_path_1_1) {
                studio_path_1 = studio_path_1_1;
            },
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            // The jbart control model return string paths and methods to fix them on change
            TgpModel = (function () {
                function TgpModel(rootPath, childrenType) {
                    this.rootPath = rootPath;
                    this.childrenType = childrenType;
                }
                TgpModel.prototype.val = function (path) {
                    return studio_path_1.profileFromPath(path);
                };
                TgpModel.prototype.subNodes = function (path, childrenType) {
                    if (childrenType == 'jb-editor')
                        return this.jbEditorSubNodes(path);
                    var val = studio_path_1.profileFromPath(path);
                    if (childrenType == 'controls') {
                        return [].concat.apply([], this.controlParams(path).map(function (prop) {
                            return childPath(prop);
                        }))
                            .concat(this.innerControlPaths(path));
                    }
                    else if (childrenType == 'non-controls') {
                        return this.nonControlParams(path).map(function (prop) { return path + '~' + prop; });
                    }
                    else if (childrenType == 'array') {
                        if (!val)
                            return [];
                        else if (!Array.isArray(val))
                            return [path];
                        else
                            return val.map(function (inner, i) { return path + '~' + i; });
                    }
                    function childPath(prop) {
                        if (Array.isArray(val[prop]))
                            return val[prop].map(function (inner, i) { return path + '~' + prop + '~' + i; });
                        else
                            return [path + '~' + prop];
                    }
                };
                TgpModel.prototype.innerControlPaths = function (path) {
                    var _this = this;
                    var out = ['action~content'] // add more inner paths here
                        .map(function (x) { return path + '~' + x; })
                        .filter(function (p) {
                        return _this.paramType(p) == 'control';
                    });
                    return out;
                };
                TgpModel.prototype.jbEditorSubNodes = function (path) {
                    var val = studio_path_1.profileFromPath(path);
                    if (!val || typeof val != 'object')
                        return [];
                    var compName = jb_core_1.jb.compName(val);
                    var comp = studio_utils_1.getComp(compName);
                    if (Array.isArray(val))
                        return Object.getOwnPropertyNames(val)
                            .map(function (x) { return x == 'length' ? val.length : x; })
                            .map(function (k) { return path + '~' + k; });
                    else if (val['$' + compName]) {
                        var arr = val['$' + compName];
                        var res_path = path + '~$' + compName;
                        if (Array.isArray(arr))
                            return Object.getOwnPropertyNames(arr)
                                .map(function (x) { return x == 'length' ? arr.length : x; })
                                .map(function (k) { return res_path + '~' + k; });
                        return [res_path];
                    }
                    else if (comp) {
                        var composite = (comp.params || [])
                            .filter(function (p) {
                            return p.composite;
                        })
                            .map(function (p) { return flattenArray(p.id); });
                        return (composite[0] || []).concat((comp.params || [])
                            .filter(function (p) { return !p.composite; })
                            .map(function (p) { return ({ path: path + '~' + p.id, param: p }); })
                            .filter(function (e) { return studio_path_1.profileFromPath(e.path) != null || e.param.essential; })
                            .map(function (e) { return e.path; }));
                    }
                    function flattenArray(prop) {
                        var innerVal = val[prop];
                        if (Array.isArray(innerVal))
                            return Object.getOwnPropertyNames(innerVal)
                                .map(function (x) { return x == 'length' ? innerVal.length : x; })
                                .map(function (k) { return path + '~' + prop + '~' + k; });
                        else
                            return [path + '~' + prop];
                    }
                };
                TgpModel.prototype.jbEditorMoreParams = function (path) {
                    var val = studio_path_1.profileFromPath(path);
                    var comp = studio_utils_1.getComp(jb_core_1.jb.compName(val || {}));
                    if (comp) {
                        var existing = this.jbEditorSubNodes(path);
                        return (comp.params || [])
                            .map(function (p) { return path + '~' + p.id; })
                            .filter(function (p) { return existing.indexOf(p) == -1; });
                    }
                    return [];
                };
                TgpModel.prototype.jbEditorTitle = function (path, collapsed) {
                    var val = studio_path_1.profileFromPath(path);
                    var compName = jb_core_1.jb.compName(val || {});
                    var prop = path.split('~').pop();
                    if (!isNaN(Number(prop)))
                        prop = path.split('~').slice(-2).join('[') + ']';
                    if (Array.isArray(val) && this.paramType(path) == 'data')
                        compName = "pipeline (" + val.length + ")";
                    if (Array.isArray(val) && this.paramType(path) == 'action')
                        compName = "actions (" + val.length + ")";
                    if (compName)
                        return prop + ("= <span class=\"treenode-val\">" + compName + "</span>");
                    else if (typeof val == 'string')
                        return prop + (collapsed ? ": <span class=\"treenode-val\" title=\"" + val + "\">" + val + "</span>" : '');
                    return prop + (Array.isArray(val) ? " (" + val.length + ")" : '');
                };
                TgpModel.prototype.title = function (path, collapsed) {
                    collapsed = collapsed || !this.isArray(path);
                    var val = studio_path_1.profileFromPath(path);
                    if (path.indexOf('~') == -1)
                        return path;
                    if (this.childrenType == 'jb-editor')
                        return this.jbEditorTitle(path, collapsed);
                    return (val && val.title) || (val && jb_core_1.jb.compName(val)) || path.split('~').pop();
                };
                TgpModel.prototype.icon = function (path) {
                    if (studio_path_1.parentPath(path)) {
                        var parentVal = studio_path_1.profileFromPath(studio_path_1.parentPath(path));
                        if (Array.isArray(parentVal) && path.split('~').pop() == parentVal.length)
                            return 'add';
                    }
                    if (this.paramType(path) == 'control') {
                        if (studio_path_1.profileFromPath(path + '~style', true) && this.compName(path + '~style') == 'layout.horizontal')
                            return 'view_column';
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
                    };
                    var compName = this.compName(path);
                    if (comp2icon[compName])
                        return comp2icon[compName];
                    if (this.isOfType(path, 'action'))
                        return 'play_arrow';
                    return 'radio_button_unchecked';
                };
                TgpModel.prototype.compName = function (path) {
                    var val = studio_path_1.profileFromPath(path);
                    return val && jb_core_1.jb.compName(val);
                };
                TgpModel.prototype.isOfType = function (path, type) {
                    var paramDef = this.paramDef(path);
                    if (paramDef)
                        return (paramDef.type || 'data').split(',').indexOf(type) != -1;
                    return this.isCompNameOfType(this.compName(path), type);
                };
                TgpModel.prototype.isCompNameOfType = function (name, type) {
                    var _jbart = studio_utils_1.jbart_base().comps[name] ? studio_utils_1.jbart_base() : jbart;
                    if (name && _jbart.comps[name]) {
                        while (!_jbart.comps[name].type && jb_core_1.jb.compName(jbart.comps[name].impl))
                            name = jb_core_1.jb.compName(_jbart.comps[name].impl);
                        return (_jbart.comps[name].type || '').indexOf(type) == 0;
                    }
                };
                TgpModel.prototype.shortTitle = function (path) {
                    return this.title(path, false);
                };
                // differnt from children() == 0, beacuse in the control tree you can drop into empty group
                TgpModel.prototype.isArray = function (path) {
                    if (this.childrenType == 'jb-editor')
                        return (this.children(path) || []).length > 0;
                    return this.controlParam(path) || this.innerControlPaths(path).length > 0;
                };
                TgpModel.prototype.modify = function (op, path, args, ctx, delayed) {
                    var comp = path.split('~')[0];
                    var before = studio_utils_1.getComp(comp) && studio_utils_1.compAsStr(comp);
                    var res = op.call(this, path, args);
                    if (res && res.newPath)
                        path = res.newPath;
                    jb_core_1.jb.delay(delayed ? 1 : 0).then(function () {
                        studio_utils_1.modifyOperationsEm.next({
                            comp: comp,
                            before: before,
                            after: studio_utils_1.compAsStr(comp),
                            path: path,
                            args: args,
                            ctx: ctx,
                            //				jbart: findjBartToLook(path),
                            newComp: before ? false : true
                        });
                    });
                };
                TgpModel.prototype._delete = function (path) {
                    var prop = path.split('~').pop();
                    var parent = studio_path_1.profileFromPath(studio_path_1.parentPath(path));
                    if (Array.isArray(parent)) {
                        var index = Number(prop);
                        parent.splice(index, 1);
                        studio_path_1.pathFixer.fixIndexPath(path, -1);
                    }
                    else {
                        // if (parent[prop] === undefined) { // array type with one element
                        // 	var pathToDelete = parentPath(path);
                        // 	var parent = profileFromPath(parentPath(pathToDelete));
                        // 	var prop = pathToDelete.split('~').pop();
                        // }
                        delete parent[prop];
                    }
                };
                // modify operations - must have same interface: path,args
                TgpModel.prototype.move = function (path, args) {
                    var dragged = studio_path_1.profileFromPath(args.dragged);
                    var arr = this.getOrCreateArray(path);
                    if (arr) {
                        var ctrlParam = this.controlParam(path);
                        this._delete(args.dragged);
                        var index = (args.index == -1) ? arr.length : args.index;
                        arr.splice(index, 0, dragged);
                        studio_path_1.pathFixer.fixMovePaths(args.dragged, path + '~' + ctrlParam + '~' + index);
                        this.fixArray(path);
                    }
                };
                TgpModel.prototype.moveInArray = function (path, args) {
                    var arr = studio_path_1.profileFromPath(studio_path_1.parentPath(path));
                    if (Array.isArray(arr)) {
                        var index = Number(path.split('~').pop());
                        var base = args.moveUp ? index - 1 : index;
                        if (base < 0 || base >= arr.length - 1)
                            return; // the + elem
                        arr.splice(base, 2, arr[base + 1], arr[base]);
                        studio_path_1.pathFixer.fixReplacingPaths(studio_path_1.parentPath(path) + '~' + base, studio_path_1.parentPath(path) + '~' + (base + 1));
                    }
                };
                TgpModel.prototype.writeValue = function (path, args) {
                    jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), args.value);
                };
                TgpModel.prototype.newComp = function (path, args) {
                    jbart.previewjbart.comps[path] = jbart.previewjbart.comps[path] || args.profile;
                };
                TgpModel.prototype.wrapWithGroup = function (path) {
                    var result = { $: 'group', controls: [studio_path_1.profileFromPath(path)] };
                    jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), result);
                };
                TgpModel.prototype.wrap = function (path, args) {
                    var compDef = studio_utils_1.getComp(args.compName);
                    var firstParam = ((compDef || {}).params || [])[0];
                    if (firstParam) {
                        var result = jb_core_1.jb.extend({ $: args.compName }, jb_core_1.jb.obj(firstParam.id, [studio_path_1.profileFromPath(path)]));
                        jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), result);
                    }
                };
                TgpModel.prototype.getStyleComp = function (path) {
                    var style = this.val(path);
                    var compName = jb_core_1.jb.compName(style);
                    if (compName == 'customStyle')
                        return { type: 'inner', path: path, style: style };
                    var comp = compName && studio_utils_1.getComp(compName);
                    if (jb_core_1.jb.compName(comp.impl) == 'customStyle')
                        return { type: 'global', path: compName, style: comp.impl, innerPath: path };
                };
                TgpModel.prototype.addProperty = function (path) {
                    var parent = studio_path_1.profileFromPath(studio_path_1.parentPath(path));
                    if (this.paramType(path) == 'data')
                        return jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), '');
                    var param = this.paramDef(path);
                    jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), param.defaultValue || { $: '' });
                };
                TgpModel.prototype.duplicate = function (path) {
                    var prop = path.split('~').pop();
                    var val = studio_path_1.profileFromPath(path);
                    var arr = this.getOrCreateArray(studio_path_1.parentPath(studio_path_1.parentPath(path)));
                    if (Array.isArray(arr)) {
                        var clone = studio_utils_1.evalProfile(jb_core_1.jb.prettyPrint(val));
                        var index = Number(prop);
                        arr.splice(index, 0, clone);
                        if (index < arr.length - 2)
                            studio_path_1.pathFixer.fixIndexPaths(path, 1);
                    }
                };
                TgpModel.prototype.setComp = function (path, args) {
                    var compName = args.comp;
                    var comp = compName && studio_utils_1.getComp(compName);
                    if (!compName || !comp)
                        return;
                    var result = { $: compName };
                    var existing = studio_path_1.profileFromPath(path);
                    (comp.params || []).forEach(function (p) {
                        if (p.composite)
                            result[p.id] = [];
                        if (existing && existing[p.id])
                            result[p.id] = existing[p.id];
                        if (p.defaultValue && typeof p.defaultValue != 'object')
                            result[p.id] = p.defaultValue;
                        if (p.defaultValue && typeof p.defaultValue == 'object' && (p.forceDefaultCreation || Array.isArray(p.defaultValue)))
                            result[p.id] = JSON.parse(JSON.stringify(p.defaultValue));
                    });
                    jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), result);
                };
                TgpModel.prototype.insertComp = function (path, args) {
                    var compName = args.comp;
                    var comp = compName && studio_utils_1.getComp(compName);
                    if (!compName || !comp)
                        return;
                    var result = { $: compName };
                    // copy default values
                    (comp.params || []).forEach(function (p) {
                        if (p.defaultValue)
                            result[p.id] = JSON.parse(JSON.stringify(p.defaultValue));
                    });
                    // find group parent that can insert the control
                    var group_path = path;
                    while (!this.controlParam(group_path) && group_path)
                        group_path = studio_path_1.parentPath(group_path);
                    var arr = this.getOrCreateArray(group_path);
                    if (arr) {
                        arr.push(result);
                        args.modifiedPath = [group_path, this.controlParam(group_path), arr.length - 1].join('~');
                        this.fixArray(group_path);
                    }
                };
                TgpModel.prototype.makeLocal = function (path) {
                    var compName = this.compName(path);
                    var comp = compName && studio_utils_1.getComp(compName);
                    if (!compName || !comp || typeof comp.impl != 'object')
                        return;
                    var res = JSON.stringify(comp.impl, function (key, val) { return typeof val === 'function' ? '' + val : val; }, 4);
                    var profile = studio_path_1.profileFromPath(path);
                    // inject conditional param values
                    (comp.params || [])
                        .forEach(function (p) {
                        var pUsage = '%$' + p.id + '%';
                        var pVal = '' + (profile[p.id] || p.defaultValue || '');
                        res = res.replace(new RegExp('{\\?(.*?)\\?}', 'g'), function (match, condition_exp) {
                            if (condition_exp.indexOf(pUsage) != -1)
                                return pVal ? condition_exp : '';
                            return match;
                        });
                    })(comp.params || [])
                        .forEach(function (p) {
                        var pVal = '' + (profile[p.id] || p.defaultValue || ''); // only primitives
                        res = res.replace(new RegExp("%\\$" + p.id + "%", 'g'), pVal);
                    });
                    jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), studio_utils_1.evalProfile(res));
                };
                TgpModel.prototype.children = function (path, childrenType) {
                    childrenType = childrenType || this.childrenType || 'controls';
                    this.cache = this.cache || {};
                    var res = this.subNodes(path, childrenType);
                    if (!jb_core_1.jb.compareArrays(res, this.cache[path]))
                        this.cache[path] = res;
                    return this.cache[path];
                };
                TgpModel.prototype.paramDef = function (path) {
                    if (!studio_path_1.parentPath(path))
                        return;
                    if (!isNaN(Number(path.split('~').pop())))
                        path = studio_path_1.parentPath(path);
                    var parent_prof = studio_path_1.profileFromPath(studio_path_1.parentPath(path), true);
                    var compDef = parent_prof && studio_utils_1.getComp(jb_core_1.jb.compName(parent_prof));
                    var params = (compDef || {}).params || [];
                    var paramName = path.split('~').pop();
                    return params.filter(function (p) { return p.id == paramName; })[0] || {};
                };
                TgpModel.prototype.paramType = function (path) {
                    return (this.paramDef(path) || {}).type || 'data';
                };
                TgpModel.prototype.PTsOfPath = function (path) {
                    return this.PTsOfType(this.paramType(path), studio_utils_1.findjBartToLook(path));
                };
                TgpModel.prototype.PTsOfType = function (type, jbartToLook) {
                    var single = /([^\[]*)([])?/;
                    var types = [].concat.apply([], (type || '').split(',')
                        .map(function (x) {
                        return x.match(single)[1];
                    })
                        .map(function (x) {
                        return x == 'data' ? ['data', 'aggregator'] : [x];
                    }));
                    var comp_arr = types.map(function (t) {
                        return jb_entries((jbartToLook || studio_utils_1.jbart_base()).comps)
                            .filter(function (c) {
                            return (c[1].type || 'data').split(',').indexOf(t) != -1
                                || (c[1].typePattern && t.match(c[1].typePattern.match));
                        })
                            .map(function (c) { return c[0]; });
                    });
                    return comp_arr.reduce(function (all, ar) { return all.concat(ar); }, []);
                };
                TgpModel.prototype.controlParam = function (path) {
                    return this.controlParams(path)[0];
                };
                TgpModel.prototype.controlParams = function (path) {
                    var prof = studio_path_1.profileFromPath(path, true);
                    if (!prof)
                        return [];
                    var params = (studio_utils_1.getComp(jb_core_1.jb.compName(prof)) || {}).params || [];
                    return params.filter(function (p) { return (p.type || '').indexOf('control') != -1; }).map(function (p) { return p.id; });
                };
                TgpModel.prototype.nonControlParams = function (path) {
                    var prof = studio_path_1.profileFromPath(path);
                    if (!prof)
                        return [];
                    var params = (studio_utils_1.getComp(jb_core_1.jb.compName(prof)) || {}).params || [];
                    return params.filter(function (p) {
                        return (p.type || '').indexOf('control') == -1;
                    })
                        .map(function (p) { return p.id; });
                };
                TgpModel.prototype.getOrCreateArray = function (path) {
                    var val = studio_path_1.profileFromPath(path);
                    var prop = this.controlParam(path);
                    if (!prop)
                        return console.log('pushing to non array');
                    if (val[prop] === undefined)
                        val[prop] = [];
                    if (!Array.isArray(val[prop]))
                        val[prop] = [val[prop]];
                    return val[prop];
                };
                TgpModel.prototype.addArrayItem = function (path, args) {
                    var val = studio_path_1.profileFromPath(path);
                    var toAdd = args.toAdd || { $: '' };
                    if (Array.isArray(val)) {
                        val.push(toAdd);
                        return { newPath: path + '~' + (val.length - 1) };
                    }
                    else if (!val) {
                        jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), toAdd);
                    }
                    else {
                        jb_core_1.jb.writeValue(studio_path_1.profileRefFromPath(path), [val].concat(toAdd));
                        return { newPath: path + '~1' };
                    }
                };
                TgpModel.prototype.propName = function (path) {
                    if (!isNaN(Number(path.split('~').pop())))
                        return studio_path_1.parentPath(path).split('~').pop().replace(/s$/, '');
                    var paramDef = this.paramDef(path);
                    var val = studio_path_1.profileFromPath(path);
                    if ((paramDef.type || '').indexOf('[]') != -1) {
                        var length = this.subNodes(path, 'array').length;
                        if (length)
                            return path.split('~').pop() + ' (' + length + ')';
                    }
                    return path.split('~').pop();
                };
                return TgpModel;
            }());
            exports_1("TgpModel", TgpModel);
            exports_1("model", model = new TgpModel(''));
        }
    }
});
