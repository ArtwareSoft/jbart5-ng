System.register(['jb-core', 'jb-ui', 'jb-ui/jb-rx', 'rxjs/Rx', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var jb_core_1, jb_ui, jb_rx, Rx_1, core_1;
    return {
        setters:[
            function (jb_core_1_1) {
                jb_core_1 = jb_core_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            jb_core_1.jb.type('tree.nodeModel');
            jb_core_1.jb.type('tree.style');
            jb_core_1.jb.component('tree', {
                type: 'control',
                params: {
                    nodeModel: { type: 'tree.nodeModel', dynamic: true, essential: true },
                    style: { type: "tree.style", defaultValue: { $: "tree.ul-li" }, dynamic: true },
                    features: { type: "feature[]", dynamic: true }
                },
                impl: function (context) {
                    if (!context.params.nodeModel())
                        return jb_core_1.jb.logException('missing nodeModel in tree');
                    var tree = { nodeModel: context.params.nodeModel(ctx) };
                    var ctx = context.setVars({ $tree: tree });
                    return jb_ui.ctrl(ctx).jbExtend({
                        host: { 'class': 'jb-tree' },
                        beforeInit: function (cmp) {
                            cmp.tree = jb_core_1.jb.extend(tree, {
                                expanded: jb_core_1.jb.obj(tree.nodeModel.rootPath, true),
                                el: cmp.elementRef.nativeElement,
                                elemToPath: function (el) { return $(el).closest('.treenode').attr('path'); },
                                selectionEmitter: new jb_rx.Subject(),
                            });
                        },
                    }, ctx);
                }
            });
            jb_core_1.jb.component('tree.ul-li', {
                type: 'tree.style',
                impl: function (context) {
                    var tree = context.vars.$tree;
                    var TreeNodeLine = (function () {
                        function TreeNodeLine() {
                        }
                        TreeNodeLine.prototype.ngOnInit = function () {
                            this.tree = tree;
                            this.model = tree.nodeModel;
                        };
                        TreeNodeLine.prototype.ngDoCheck = function () {
                            this.title = this.model.title(this.path, !this.tree.expanded[this.path]);
                            this.icon = tree.nodeModel.icon ? tree.nodeModel.icon(this.path) : 'radio_button_unchecked';
                        };
                        TreeNodeLine.prototype.flip = function (x) {
                            tree.expanded[this.path] = !(tree.expanded[this.path]);
                        };
                        ;
                        __decorate([
                            core_1.Input('path'), 
                            __metadata('design:type', Object)
                        ], TreeNodeLine.prototype, "path", void 0);
                        TreeNodeLine = __decorate([
                            core_1.Component({
                                selector: 'node_line',
                                template: "<div class=\"treenode-line\" [ngClass]=\"{collapsed: !tree.expanded[path]}\">\n\t\t\t\t\t\t<button class=\"treenode-expandbox\" (click)=\"flip()\" [ngClass]=\"{nochildren: !model.isArray(path)}\">\n\t\t\t\t\t\t\t<div class=\"frame\"></div><div class=\"line-lr\"></div><div class=\"line-tb\"></div>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<i class=\"material-icons\">{{icon}}</i>\n\t\t\t\t\t\t<span class=\"treenode-label\" [innerHTML]=\"title\"></span>\n\t\t\t\t\t  </div>",
                                styles: ["i {font-size: 16px; margin-left: -4px; padding-right:2px }"]
                            }), 
                            __metadata('design:paramtypes', [])
                        ], TreeNodeLine);
                        return TreeNodeLine;
                    }());
                    var TreeNode = (function () {
                        function TreeNode(elementRef) {
                            this.elementRef = elementRef;
                        }
                        TreeNode.prototype.ngOnInit = function () {
                            this.tree = tree;
                        };
                        TreeNode.prototype.ngDoCheck = function () {
                            if (tree.nodeModel.isArray(this.path))
                                $(this.elementRef.nativeElement).addClass('jb-array-node');
                            $(this.elementRef.nativeElement).attr('path', this.path);
                        };
                        __decorate([
                            core_1.Input('path'), 
                            __metadata('design:type', Object)
                        ], TreeNode.prototype, "path", void 0);
                        TreeNode = __decorate([
                            core_1.Component({
                                selector: 'jb_node',
                                template: "<node_line [path]=\"path\"></node_line>\n\t\t\t\t<ul *ngIf=\"tree.expanded[path]\" class=\"treenode-children\">\n\t\t\t\t  <li *ngFor=\"let childPath of tree.nodeModel.children(path)\" class=\"treenode-li\">\n\t\t\t\t\t<jb_node [path]=\"childPath\" class=\"treenode\" [ngClass]=\"{selected: tree.selected == childPath}\"></jb_node>\n\t\t\t\t  </li>\n\t\t\t\t</ul>",
                                directives: [TreeNodeLine, TreeNode]
                            }), 
                            __metadata('design:paramtypes', [core_1.ElementRef])
                        ], TreeNode);
                        return TreeNode;
                    }());
                    return {
                        template: '<jb_node [path]="tree.nodeModel.rootPath" class="treenode" [ngClass]="{selected: tree.selected == tree.nodeModel.rootPath}"></jb_node>',
                        directives: [TreeNode, TreeNodeLine]
                    };
                }
            });
            jb_core_1.jb.component('tree.selection', {
                type: 'feature',
                params: {
                    databind: { as: 'ref' },
                    onSelection: { type: 'action', dynamic: true },
                    onDoubleClick: { type: 'action', dynamic: true },
                    autoSelectFirst: { type: 'boolean' }
                },
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            cmp.alert = function (x) { return alert(x); };
                            var tree = cmp.tree;
                            cmp.click = new jb_rx.Subject();
                            cmp.click.buffer(cmp.click.debounceTime(250)) // double click
                                .map(function (list) { return list.length; })
                                .filter(function (x) { return x === 2; })
                                .subscribe(function (x) { return context.params.onDoubleClick(context.setData(tree.selected)); });
                            tree.selectionEmitter.distinctUntilChanged().subscribe(function (selected) {
                                tree.selected = selected;
                                selected.split('~').slice(0, -1).reduce(function (base, x) {
                                    var path = base ? (base + '~' + x) : x;
                                    tree.expanded[path] = true;
                                    return path;
                                }, '');
                                if (context.params.databind)
                                    jb_core_1.jb.writeValue(context.params.databind, selected);
                                context.params.onSelection(context.setData(selected));
                            });
                            // first auto selection selection
                            var first_selected = jb_core_1.jb.val(context.params.databind);
                            if (!first_selected && context.params.autoSelectFirst) {
                                var first = tree.el.querySelectorAll('.treenode')[0];
                                first_selected = tree.elemToPath(first);
                            }
                            if (first_selected)
                                jb_core_1.jb.delay(1).then(function () { return tree.selectionEmitter.next(first_selected); });
                            cmp.click.map(function (event) { return tree.elemToPath(event.target); })
                                .subscribe(function (x) { return tree.selectionEmitter.next(x); });
                        },
                        host: {
                            '(click)': 'click.next($event)',
                        }
                    };
                }
            });
            jb_core_1.jb.component('tree.keyboard-selection', {
                type: 'feature',
                params: {
                    onKeyboardSelection: { type: 'action', dynamic: true },
                    onEnter: { type: 'action', dynamic: true },
                    autoFocus: { type: 'boolean' }
                },
                impl: function (context) {
                    return {
                        host: {
                            '(keydown)': 'keydown.next($event)',
                            'tabIndex': '0',
                            '(mousedown)': 'getKeyboardFocus()',
                        },
                        init: function (cmp) {
                            var tree = cmp.tree;
                            cmp.keydown = cmp.keydown || new Rx_1.Subject();
                            cmp.getKeyboardFocus = cmp.getKeyboardFocus || (function () { cmp.elementRef.nativeElement.focus(); return false; });
                            if (context.params.autoFocus)
                                setTimeout(function () { return cmp.elementRef.nativeElement.focus(); }, 1);
                            cmp.keydown.filter(function (e) {
                                return e.keyCode == 13;
                            })
                                .subscribe(function () {
                                context.params.onEnter(context.setData(tree.selected));
                            });
                            cmp.keydown.filter(function (e) { return e.keyCode == 38 || e.keyCode == 40; })
                                .map(function (event) {
                                event.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                var nodes = Array.from(tree.el.querySelectorAll('.treenode'));
                                var selected = tree.el.querySelector('.treenode.selected');
                                return tree.elemToPath(nodes[nodes.indexOf(selected) + diff]) || tree.selected;
                            }).subscribe(function (x) { return tree.selectionEmitter.next(x); });
                            // expand collapse
                            cmp.keydown.filter(function (e) { return e.keyCode == 37 || e.keyCode == 39; }).subscribe(function (event) {
                                event.stopPropagation();
                                if (tree.selected)
                                    tree.expanded[tree.selected] = (event.keyCode == 39);
                            });
                        }
                    };
                }
            });
            jb_core_1.jb.component('tree.keyboard-shortcut', {
                type: 'feature',
                params: {
                    key: { as: 'string', description: 'Ctrl+C or Alt+V' },
                    action: { type: 'action', dynamic: true },
                },
                impl: function (context, key, action) {
                    return {
                        host: {
                            '(keydown)': 'keydown.next($event)',
                            'tabIndex': '0',
                            '(mousedown)': 'getKeyboardFocus()',
                        },
                        init: function (cmp) {
                            var tree = cmp.tree;
                            cmp.keydown = cmp.keydown || new Rx_1.Subject();
                            cmp.getKeyboardFocus = cmp.getKeyboardFocus || (function () { cmp.elementRef.nativeElement.focus(); return false; });
                            cmp.keydown.subscribe(function (event) {
                                var keyCode = key.split('+').pop().charCodeAt(0);
                                if (key == 'Delete')
                                    keyCode = 46;
                                var helper = (key.match('([A-Za-z]*)+') || ['', ''])[1];
                                if (helper == 'Ctrl' && !event.ctrlKey)
                                    return;
                                if (helper == 'Alt' && !event.altKey)
                                    return;
                                if (event.keyCode == keyCode)
                                    action(context.setData(tree.selected));
                            });
                        }
                    };
                }
            });
            jb_core_1.jb.component('tree.drag-and-drop', {
                type: 'feature',
                params: {},
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            var tree = cmp.tree;
                            var drake = tree.drake = dragula([], {
                                moves: function (el) {
                                    return $(el).is('.jb-array-node>.treenode-children>.treenode-li');
                                }
                            });
                            drake.on('drag', function (el, source) {
                                var path = tree.elemToPath(el.firstElementChild);
                                el.dragged = { path: path, expanded: tree.expanded[path] };
                                tree.expanded[path] = false; // collapse when dragging
                            });
                            drake.on('drop', function (dropElm, target, source, sibling) {
                                if (!dropElm.dragged)
                                    return;
                                $(dropElm).remove();
                                tree.expanded[dropElm.dragged.path] = dropElm.dragged.expanded; // restore expanded state
                                var index = sibling ? $(sibling).index() : -1;
                                var path = tree.elemToPath(target);
                                tree.nodeModel.modify(tree.nodeModel.move, path, { dragged: dropElm.dragged.path, index: index }, context);
                                dropElm.dragged = null;
                                // refresh the nodes on the tree - to avoid bugs
                                tree.expanded[tree.nodeModel.rootPath] = false;
                                jb_core_1.jb.delay(1).then(function () { return tree.expanded[tree.nodeModel.rootPath] = true; });
                            });
                        },
                        doCheck: function (cmp) {
                            var tree = cmp.tree;
                            if (tree.drake) {
                                tree.drake.containers =
                                    $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-array-node').children().filter('.treenode-children').get();
                                // make a place for drop in empty containers
                                tree.drake.containers.forEach(function (el) {
                                    if ($(el).height() < 3)
                                        $(el).height(7);
                                });
                            }
                        }
                    };
                }
            });
        }
    }
});
