System.register(['jb-core', './studio-utils'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1, studio_utils_1;
    var pathFixer, FixReplacingPathsObj;
    function parentPath(path) {
        return path.split('~').slice(0, -1).join('~');
    }
    exports_1("parentPath", parentPath);
    function profileRefFromPath(path) {
        if (path.indexOf('~') == -1)
            return {
                $jb_val: function (value) {
                    if (typeof value == 'undefined')
                        return profileFromPath(path);
                    else
                        studio_utils_1.findjBartToLook(path).comps[path].impl = value;
                }
            };
        var ref = {
            path: path,
            $jb_val: function (value) {
                if (typeof value == 'undefined')
                    return profileFromPath(this.path);
                // if (profileFromPath(parentPath(this.path)) == profileFromPath(this.path)) // flatten one-item array
                // 	var actual_path = parentPath(this.path);
                // else
                // 	var actual_path = this.path;
                var parent = profileFromPath(parentPath(this.path));
                parent[this.path.split('~').pop()] = value;
            }
        };
        studio_utils_1.pathChangesEm.subscribe(function (fixer) { return ref.path = fixer.fix(ref.path); });
        return ref;
    }
    exports_1("profileRefFromPath", profileRefFromPath);
    function profileFromPath(path, silent) {
        var id = path.split('~')[0];
        var comp = studio_utils_1.jbart_base().comps[id] || jbart.comps[id];
        comp = comp && comp.impl;
        if (!comp) {
            jb_core_1.jb.logError('profileFromPath: can not find path ', path);
            return;
        }
        var innerPath = path.split('~').slice(1).join('~');
        if (!innerPath)
            return comp;
        return comp && innerPath.split('~').reduce(function (obj, p) {
            if (!obj && !silent)
                jb_core_1.jb.logError('profileFromPath: non existing path ' + path + ' property: ' + p);
            // if (obj && p == '0' && obj[p] == null) // flatten one-item array
            // 	return obj;
            if (obj == null)
                return null;
            else if (obj[p] == null)
                return obj['$' + p];
            else
                return obj[p];
        }, comp);
    }
    exports_1("profileFromPath", profileFromPath);
    function profileRefFromPathWithNotification(path, ctx) {
        var _ref = profileRefFromPath(path);
        return {
            $jb_val: function (value) {
                if (typeof value == 'undefined')
                    return _ref.$jb_val(value);
                if (_ref.$jb_val() == value)
                    return;
                var comp = path.split('~')[0];
                var before = studio_utils_1.compAsStr(comp);
                _ref.$jb_val(value);
                studio_utils_1.notifyModification(path, before, ctx, this.ngPath);
            }
        };
    }
    function closest(path) {
        if (!path)
            return '';
        var _path = path;
        while (profileFromPath(_path, true) == null && Number(_path.split('~').pop()))
            _path = _path.replace(/([0-9]+)$/, function (x, y) { return Number(y) - 1; });
        while (profileFromPath(_path, true) == null && _path.indexOf('~') != -1)
            _path = parentPath(_path);
        if (profileFromPath(_path, true))
            return _path;
    }
    // ***************** path fixers after changes **************************
    function fixMovePaths(from, to) {
        //	console.log('fixMovePath',from,to);
        var parent_path = parentPath(to);
        var depth = parent_path.split('~').length;
        var index = Number(to.split('~').pop()) || 0;
        studio_utils_1.pathChangesEm.next({ from: from, to: to,
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
    function fixIndexPaths(path, diff) {
        studio_utils_1.pathChangesEm.next(function (pathToFix) {
            return fixIndexOfPath(pathToFix, path, diff);
        });
    }
    function fixReplacingPaths(path1, path2) {
        studio_utils_1.pathChangesEm.next(new FixReplacingPathsObj(path1, path2));
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
    function fixArrayWrapperPath() {
        studio_utils_1.pathChangesEm.next(function (pathToFix) {
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
            function (studio_utils_1_1) {
                studio_utils_1 = studio_utils_1_1;
            }],
        execute: function() {
            jbart.profileFromPath = profileFromPath;
            exports_1("pathFixer", pathFixer = {
                fixIndexPaths: fixIndexPaths,
                fixReplacingPaths: fixReplacingPaths,
                fixMovePaths: fixMovePaths,
                fixArrayWrapperPath: fixArrayWrapperPath
            });
            FixReplacingPathsObj = (function () {
                function FixReplacingPathsObj(path1, path2) {
                    this.path1 = path1;
                    this.path2 = path2;
                }
                FixReplacingPathsObj.prototype.fix = function (pathToFix) {
                    if (pathToFix.indexOf(this.path1) == 0)
                        return pathToFix.replace(this.path1, this.path2);
                    else if (pathToFix.indexOf(this.path2) == 0)
                        return pathToFix.replace(this.path2, this.path1);
                    return pathToFix;
                };
                return FixReplacingPathsObj;
            }());
            // ******* components ***************
            jb_core_1.jb.component('studio.ref', {
                params: [{ id: 'path', as: 'string' }],
                impl: function (context, path) {
                    return profileRefFromPathWithNotification(path, context);
                }
            });
            jb_core_1.jb.component('studio.fix-to-closest-path', {
                params: [{ id: 'path', as: 'ref' }],
                impl: function (ctx, pathRef) {
                    var path = jb_core_1.jb.val(pathRef);
                    var closest_path = closest(path);
                    if (path && path != closest_path) {
                        jb_core_1.jb.writeValue(pathRef, closest_path);
                    }
                }
            });
        }
    }
});
