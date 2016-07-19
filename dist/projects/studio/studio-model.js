System.register(['jb-core', 'jb-ui/jb-rx'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, jb_rx;
    var modifyOperationsEm, studioActivityEm, pathChangesEm, ControlModel, model, FixReplacingPaths;
    function jbart_base() {
        return jbart.previewjbart || jbart;
    }
    exports_1("jbart_base", jbart_base);
    function compAsStr(id) {
        return jb_prettyPrintComp(id, getComp(id));
    }
    exports_1("compAsStr", compAsStr);
    function parentPath(path) {
        return path.split('~').slice(0, -1).join('~');
    }
    exports_1("parentPath", parentPath);
    function compAsStrFromPath(path) {
        return compAsStr(path.split('~')[0]);
    }
    exports_1("compAsStrFromPath", compAsStrFromPath);
    function notifyModifcation(path, before, ctx) {
        var comp = path.split('~')[0];
        modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, ctx: ctx, jbart: findjBartToLook(path) });
    }
    exports_1("notifyModifcation", notifyModifcation);
    function message(message, error) {
        $('.studio-message').text(message); // add animation
        $('.studio-message').css('background', error ? 'red' : '#327DC8');
        $('.studio-message').css('animation', '');
        jb_core_1.jb.delay(1).then(function () {
            return $('.studio-message').css('animation', 'slide_from_top 5s ease');
        });
    }
    exports_1("message", message);
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
                if (typeof value == 'undefined')
                    return profileFromPath(this.path);
                if (profileFromPath(parentPath(this.path)) == profileFromPath(this.path))
                    var actual_path = parentPath(this.path);
                else
                    var actual_path = this.path;
                var parent = profileFromPath(parentPath(actual_path));
                parent[actual_path.split('~').pop()] = value;
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
        if (!comp) {
            console.log('can not find path ', path);
            return;
        }
        var innerPath = path.split('~').slice(1).join('~');
        if (!innerPath)
            return comp;
        return comp && innerPath.split('~').reduce(function (obj, p) {
            if (!obj)
                jb_core_1.jb.logError('profileFromPath: non existing path ' + path + ' property: ' + p);
            if (obj && p == '0' && obj[p] == null)
                return obj;
            return obj && (obj[p] || obj['$' + p]);
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
    exports_1("findjBartToLook", findjBartToLook);
    function evalProfile(prof_str) {
        try {
            return eval('(' + prof_str + ')');
        }
        catch (e) {
            jb_core_1.jb.logException(e, 'eval profile:' + prof_str);
        }
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
    function fixReplacingPaths(path1, path2) {
        pathChangesEm.next(new FixReplacingPaths(path1, path2));
    }
    function fixArrayWrapperPath() {
        pathChangesEm.next(function (pathToFix) {
            var base = pathToFix.split('~')[0];
            var first = jb_core_1.jb.val(profileRefFromPath(base));
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
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            }],
        execute: function() {
            exports_1("modifyOperationsEm", modifyOperationsEm = new jb_rx.Subject());
            exports_1("studioActivityEm", studioActivityEm = new jb_rx.Subject());
            exports_1("pathChangesEm", pathChangesEm = new jb_rx.Subject());
            // The jbart control model return string paths and methods to fix them on change
            ControlModel = (function () {
                function ControlModel(rootPath, childrenType) {
                    this.rootPath = rootPath;
                    this.childrenType = childrenType;
                }
                ControlModel.prototype.val = function (path) {
                    return profileFromPath(path);
                };
                ControlModel.prototype.subNodes = function (path, childrenType) {
                    if (childrenType == 'jb-editor')
                        return this.jbEditorSubNodes(path);
                    var val = profileFromPath(path);
                    if (childrenType == 'controls') {
                        var prop = this.controlParam(path);
                        if (!prop || !val[prop])
                            return [];
                        return childPath(prop);
                    }
                    else if (childrenType == 'non-controls') {
                        return this.nonControlParams(path).map(function (prop) { return path + '~' + prop; });
                    }
                    else if (childrenType == 'array') {
                        if (!val)
                            return [];
                        else if (!Array.isArray(val))
                            return [path + '~0'];
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
                ControlModel.prototype.jbEditorSubNodes = function (path) {
                    var val = profileFromPath(path);
                    var comp = getComp(jb_core_1.jb.compName(val || {}));
                    if (Array.isArray(val))
                        return Object.getOwnPropertyNames(val)
                            .map(function (x) { return x == 'length' ? val.length : x; })
                            .map(function (k) { return path + '~' + k; });
                    else if (comp)
                        return jb_core_1.jb.entries(comp.params)
                            .map(function (p) { return ({ path: path + '~' + p[0], param: p[1] }); })
                            .filter(function (e) { return profileFromPath(e.path) != null || e.param.essential; })
                            .map(function (e) { return e.path; });
                };
                ControlModel.prototype.jbEditorTitle = function (path, collapsed) {
                    var val = profileFromPath(path);
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
                ControlModel.prototype.title = function (path, collapsed) {
                    collapsed = collapsed || this.isArray(path);
                    var val = profileFromPath(path);
                    if (path.indexOf('~') == -1)
                        return path;
                    if (this.childrenType == 'jb-editor')
                        return this.jbEditorTitle(path, collapsed);
                    return (val && val.title) || (val && jb_core_1.jb.compName(val)) || path.split('~').pop();
                };
                ControlModel.prototype.icon = function (path) {
                    if (parentPath(path)) {
                        var parentVal = profileFromPath(parentPath(path));
                        if (Array.isArray(parentVal) && path.split('~').pop() == parentVal.length)
                            return 'add';
                    }
                    if (this.paramType(path) == 'control') {
                        if (this.compName(path + '~style') == 'layout.horizontal')
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
                ControlModel.prototype.compName = function (path) {
                    var val = profileFromPath(path);
                    return val && jb_core_1.jb.compName(val);
                };
                ControlModel.prototype.isOfType = function (path, type) {
                    var val = profileFromPath(path);
                    var name = val && jb_core_1.jb.compName(val);
                    if (name && jbart.comps[name])
                        return (jbart.comps[name].type || '').indexOf(type) == 0;
                };
                ControlModel.prototype.shortTitle = function (path) {
                    return this.title(path, false);
                };
                ControlModel.prototype.isArray = function (path) {
                    if (this.childrenType == 'jb-editor')
                        return typeof profileFromPath(path) == 'object';
                    return this.controlParam(path);
                };
                ControlModel.prototype.modify = function (op, path, args, ctx) {
                    var comp = path.split('~')[0];
                    var before = compAsStr(comp);
                    op.call(this, path, args);
                    modifyOperationsEm.next({ comp: comp, before: before, after: compAsStr(comp), path: path, args: args, ctx: ctx, jbart: findjBartToLook(path) });
                };
                ControlModel.prototype._delete = function (path) {
                    var prop = path.split('~').pop();
                    var parent = profileFromPath(parentPath(path));
                    if (Array.isArray(parent)) {
                        var index = Number(prop);
                        parent.splice(index, 1);
                    }
                    else {
                        if (parent[prop] === undefined) {
                            var pathToDelete = parentPath(path);
                            var parent = profileFromPath(parentPath(pathToDelete));
                            var prop = pathToDelete.split('~').pop();
                        }
                        delete parent[prop];
                    }
                };
                // modify operations - must have same interface: path,args
                ControlModel.prototype.move = function (path, args) {
                    var dragged = profileFromPath(args.dragged);
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
                ControlModel.prototype.moveInArray = function (path, args) {
                    var arr = profileFromPath(parentPath(path));
                    if (Array.isArray(arr)) {
                        var index = Number(path.split('~').pop());
                        var base = args.moveUp ? index - 1 : index;
                        if (base < 0 || base >= arr.length - 1)
                            return; // the + elem
                        arr.splice(base, 2, arr[base + 1], arr[base]);
                        fixReplacingPaths(parentPath(path) + '~' + base, parentPath(path) + '~' + (base + 1));
                    }
                };
                ControlModel.prototype.writeValue = function (path, args) {
                    jb_core_1.jb.writeValue(profileRefFromPath(path), args.value);
                };
                ControlModel.prototype.newComp = function (path, args) {
                    jbart.previewjbart.comps[path] = jbart.previewjbart.comps[path] || args.profile;
                };
                ControlModel.prototype.wrapWithGroup = function (path) {
                    var result = { $: 'group', controls: [profileFromPath(path)] };
                    jb_core_1.jb.writeValue(profileRefFromPath(path), result);
                };
                ControlModel.prototype.duplicate = function (path) {
                    var prop = path.split('~').pop();
                    var val = profileFromPath(path);
                    var arr = profileFromPath(parentPath(path));
                    if (Array.isArray(arr)) {
                        var clone = evalProfile(jb_core_1.jb.prettyPrint(val));
                        var index = Number(prop);
                        arr.splice(index, 0, clone);
                        fixIndexPaths(path, 1);
                    }
                };
                ControlModel.prototype.setComp = function (path, args) {
                    var compName = args.comp;
                    var comp = compName && getComp(compName);
                    if (!compName || !comp)
                        return;
                    var result = { $: compName };
                    var existing = profileFromPath(path);
                    // copy properties from existing & default values
                    if (existing && typeof existing == 'object')
                        jb_core_1.jb.entries(comp.params).forEach(function (p) {
                            if (existing[p[0]])
                                result[p[0]] = existing[p[0]];
                            if (typeof p[1].defaultValue != 'object')
                                result[p[0]] = p[1].defaultValue;
                        });
                    jb_core_1.jb.writeValue(profileRefFromPath(path), result);
                };
                ControlModel.prototype.insertComp = function (path, args) {
                    var compName = args.comp;
                    var comp = compName && getComp(compName);
                    if (!compName || !comp)
                        return;
                    var result = { $: compName };
                    // copy default values
                    jb_core_1.jb.entries(comp.params).forEach(function (p) {
                        if (p[1].defaultValue)
                            result[p[0]] = JSON.parse(JSON.stringify(p[1].defaultValue));
                    });
                    // find group parent that can insert the control
                    var group_path = path;
                    while (!this.controlParam(group_path) && group_path)
                        group_path = parentPath(group_path);
                    var arr = this.asArray(group_path);
                    if (arr) {
                        arr.push(result);
                        args.modifiedPath = [group_path, this.controlParam(group_path), arr.length - 1].join('~');
                        this.fixArray(group_path);
                    }
                };
                ControlModel.prototype.makeLocal = function (path) {
                    var compName = this.compName(path);
                    var comp = compName && getComp(compName);
                    if (!compName || !comp || typeof comp.impl != 'object')
                        return;
                    var res = JSON.stringify(comp.impl, function (key, val) { return typeof val === 'function' ? '' + val : val; }, 4);
                    // inject param values - only primitives
                    var profile = profileFromPath(path);
                    jb_core_1.jb.entries(comp.params)
                        .forEach(function (p) {
                        res = res.replace(new RegExp("%\\$" + p[0] + "%", 'g'), '' + (profile[p[0]] || p[1].defaultValue || ''));
                    });
                    jb_core_1.jb.writeValue(profileRefFromPath(path), evalProfile(res));
                };
                ControlModel.prototype.children = function (path, childrenType) {
                    childrenType = childrenType || this.childrenType || 'controls';
                    this.cache = this.cache || {};
                    var res = this.subNodes(path, childrenType);
                    if (!jb_core_1.jb.compareArrays(res, this.cache[path]))
                        this.cache[path] = res;
                    return this.cache[path];
                };
                ControlModel.prototype.paramDef = function (path) {
                    if (!parentPath(path))
                        return;
                    if (!isNaN(Number(path.split('~').pop())))
                        path = parentPath(path);
                    var parent_prof = profileFromPath(parentPath(path));
                    var compDef = parent_prof && getComp(jb_core_1.jb.compName(parent_prof));
                    var params = (compDef || {}).params;
                    var paramName = path.split('~').pop();
                    return jb_core_1.jb.entries(params)
                        .filter(function (p) { return p[0] == paramName; })
                        .map(function (p) { return p[1]; })[0] || {};
                };
                ControlModel.prototype.paramType = function (path) {
                    return (this.paramDef(path) || {}).type || 'data';
                };
                ControlModel.prototype.PTsOfPath = function (path) {
                    return this.PTsOfType(this.paramType(path), findjBartToLook(path));
                };
                ControlModel.prototype.PTsOfType = function (type, jbartToLook) {
                    var types = [].concat.apply([], (type || '').split(',')
                        .map(function (x) {
                        return x.match(/([^\[]*)([])?/)[1];
                    })
                        .map(function (x) {
                        return x == 'data' ? ['data', 'aggregator'] : [x];
                    }));
                    var comp_arr = types.map(function (t) { return jb_entries((jbartToLook || jbart_base()).comps)
                        .filter(function (c) {
                        return (c[1].type || 'data').split(',').indexOf(t) != -1
                            || (c[1].typePattern && t.match(c[1].typePattern.match));
                    })
                        .map(function (c) { return c[0]; }); });
                    return comp_arr.reduce(function (all, ar) { return all.concat(ar); }, []);
                };
                ControlModel.prototype.controlParam = function (path) {
                    var prof = profileFromPath(path);
                    if (!prof)
                        return [];
                    var params = (getComp(jb_core_1.jb.compName(prof)) || {}).params;
                    return jb_core_1.jb.entries(params).filter(function (p) { return (p[1].type || '').indexOf('control') != -1; }).map(function (p) { return p[0]; })[0];
                };
                ControlModel.prototype.nonControlParams = function (path) {
                    var prof = profileFromPath(path);
                    if (!prof)
                        return [];
                    var params = (getComp(jb_core_1.jb.compName(prof)) || {}).params;
                    return jb_core_1.jb.entries(params)
                        .filter(function (p) {
                        return (p[1].type || '').indexOf('control') == -1;
                    })
                        .map(function (p) { return p[0]; });
                };
                ControlModel.prototype.asArray = function (path) {
                    var val = profileFromPath(path);
                    var prop = this.controlParam(path);
                    if (!prop)
                        return console.log('pushing to non array');
                    if (val[prop] === undefined)
                        val[prop] = [];
                    if (!Array.isArray(val[prop]))
                        val[prop] = [val[prop]];
                    return val[prop];
                };
                ControlModel.prototype.addArrayItem = function (path, args) {
                    var val = profileFromPath(path);
                    var toAdd = args.toAdd || { $: '' };
                    if (Array.isArray(val))
                        val.push(toAdd);
                    else if (!val)
                        jb_core_1.jb.writeValue(profileRefFromPath(path), toAdd);
                    else
                        jb_core_1.jb.writeValue(profileRefFromPath(path), [val].concat(toAdd));
                };
                ControlModel.prototype.fixArray = function (path) {
                    // var val = profileFromPath(path);
                    // var prop = controlParam(path);
                    // if (!prop) return;
                    // var arr = val[prop];
                    // if (Array.isArray(arr) && arr.length == 1)
                    // 	val[prop] = arr[0];
                    //			fixArrayWrapperPath();
                };
                ControlModel.prototype.propName = function (path) {
                    if (!isNaN(Number(path.split('~').pop())))
                        return parentPath(path).split('~').pop().replace(/s$/, '');
                    var paramDef = this.paramDef(path);
                    var val = profileFromPath(path);
                    if ((paramDef.type || '').indexOf('[]') != -1) {
                        var length = this.subNodes(path, 'array').length;
                        if (length)
                            return path.split('~').pop() + ' (' + length + ')';
                    }
                    return path.split('~').pop();
                };
                return ControlModel;
            }());
            exports_1("ControlModel", ControlModel);
            exports_1("model", model = new ControlModel(''));
            FixReplacingPaths = (function () {
                function FixReplacingPaths(path1, path2) {
                    this.path1 = path1;
                    this.path2 = path2;
                }
                FixReplacingPaths.prototype.fix = function (pathToFix) {
                    if (pathToFix.indexOf(this.path1) == 0)
                        return pathToFix.replace(this.path1, this.path2);
                    else if (pathToFix.indexOf(this.path2) == 0)
                        return pathToFix.replace(this.path2, this.path1);
                    return pathToFix;
                };
                return FixReplacingPaths;
            }());
        }
    }
});
