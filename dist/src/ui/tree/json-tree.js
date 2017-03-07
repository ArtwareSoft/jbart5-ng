System.register(['jb-core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_core_1;
    var ROjson, Json;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.component('tree.json-read-only', {
                type: 'tree.nodeModel',
                params: [
                    { id: 'object' },
                    { id: 'rootPath', as: 'string' }
                ],
                impl: function (context, json, rootPath) {
                    return new ROjson(json, rootPath);
                }
            });
            ROjson = (function () {
                function ROjson(json, rootPath) {
                    this.json = json;
                    this.rootPath = rootPath;
                }
                ROjson.prototype.children = function (path) {
                    var val = this.val(path);
                    var out = [];
                    if (typeof val == 'object')
                        out = Object.getOwnPropertyNames(val || {});
                    if (Array.isArray(val))
                        out = out.slice(0, -1);
                    return out.map(function (x) { return path + '~' + x; });
                };
                ROjson.prototype.val = function (path) {
                    if (path.indexOf('~') == -1)
                        return jb_core_1.jb.val(this.json);
                    return jb_core_1.jb.val(path.split('~').slice(1).reduce(function (o, p) { return o[p]; }, this.json));
                };
                ROjson.prototype.isArray = function (path) {
                    var val = this.val(path);
                    return typeof val == 'object' && val !== null;
                };
                ROjson.prototype.icon = function () {
                    return '';
                };
                ROjson.prototype.title = function (path, collapsed) {
                    var val = this.val(path);
                    var prop = path.split('~').pop();
                    if (val == null)
                        return prop + ': null';
                    if (!collapsed && typeof val == 'object')
                        return prop;
                    if (typeof val != 'object')
                        return prop + (": <span class=\"treenode-val\" title=\"" + val + "\">" + val + "</span>");
                    return prop + ': ' + Object.getOwnPropertyNames(val)
                        .filter(function (p) { return typeof val[p] == 'string' || typeof val[p] == 'number' || typeof val[p] == 'boolean'; })
                        .map(function (p) {
                        return p + ("= <span class=\"treenode-val\" title=\"" + val[p] + "\">" + val[p] + "</span>");
                    })
                        .join(', ');
                };
                return ROjson;
            }());
            jb_core_1.jb.component('tree.json', {
                type: 'tree.nodeModel',
                params: [
                    { id: 'object' },
                    { id: 'rootPath', as: 'string' }
                ],
                impl: function (context, json, rootPath) {
                    return new Json(json, rootPath);
                }
            });
            Json = (function () {
                function Json(json, rootPath) {
                    this.json = json;
                    this.rootPath = rootPath;
                }
                Json.prototype.children = function (path) {
                    var val = this.val(path);
                    var out = [];
                    if (typeof val == 'object')
                        out = Object.getOwnPropertyNames(val || {});
                    if (Array.isArray(val))
                        out = out.slice(0, -1);
                    return out.map(function (x) { return path + '~' + x; });
                };
                Json.prototype.val = function (path) {
                    if (path.indexOf('~') == -1)
                        return jb_core_1.jb.val(this.json);
                    return jb_core_1.jb.val(path.split('~').slice(1).reduce(function (o, p) { return o[p]; }, this.json));
                };
                Json.prototype.isArray = function (path) {
                    var val = this.val(path);
                    return typeof val == 'object' && val !== null;
                };
                Json.prototype.icon = function () {
                    return '';
                };
                Json.prototype.title = function (path, collapsed) {
                    var val = this.val(path);
                    var prop = path.split('~').pop();
                    if (val == null)
                        return prop + ': null';
                    if (!collapsed && typeof val == 'object')
                        return prop;
                    if (typeof val != 'object')
                        return prop + (": <span class=\"treenode-val\" title=\"" + val + "\">" + val + "</span>");
                    return prop + ': ' + Object.getOwnPropertyNames(val)
                        .filter(function (p) { return typeof val[p] == 'string' || typeof val[p] == 'number' || typeof val[p] == 'boolean'; })
                        .map(function (p) {
                        return p + ("= <span class=\"treenode-val\" title=\"" + val[p] + "\">" + val[p] + "</span>");
                    })
                        .join(', ');
                };
                Json.prototype.modify = function (op, path, args, ctx) {
                    op.call(this, path, args);
                };
                Json.prototype.move = function (path, args) {
                    var pathElems = args.dragged.split('~');
                    pathElems.shift();
                    var dragged = pathElems.reduce(function (o, p) { return o[p]; }, this.json);
                    var arr = this.val(path);
                    if (Array.isArray(arr)) {
                        var draggedIndex = Number(args.dragged.split('~').pop());
                        arr.splice(draggedIndex, 1);
                        var index = (args.index == -1) ? arr.length : args.index;
                        arr.splice(index, 0, dragged);
                    }
                };
                return Json;
            }());
        }
    }
});
