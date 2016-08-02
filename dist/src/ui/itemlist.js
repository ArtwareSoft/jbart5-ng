System.register(['jb-core/jb', 'jb-ui/jb-ui', 'jb-ui/jb-rx', '@angular/core'], function(exports_1, context_1) {
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
    var jb_1, jb_ui, jb_rx, core_1;
    function jb_itemlist_comp(model, context) {
        var ItemListChild = (function () {
            function ItemListChild(componentResolver) {
                this.componentResolver = componentResolver;
            }
            ItemListChild.prototype.ngAfterViewInit = function () {
                var cmp = this;
                var vars = { item: cmp.item };
                if (model.itemVariable && model.itemVariable != 'item')
                    vars[model.itemVariable] = cmp.item;
                var ctx = jb_1.jb.ctx(context, { data: cmp.item, vars: vars });
                model.controls(ctx).forEach(function (ctrl) {
                    return jb_ui.insertComponent(ctrl, cmp.componentResolver, cmp.childView);
                });
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Object)
            ], ItemListChild.prototype, "item", void 0);
            __decorate([
                core_1.ViewChild('jb_item_repl', { read: core_1.ViewContainerRef }), 
                __metadata('design:type', Object)
            ], ItemListChild.prototype, "childView", void 0);
            ItemListChild = __decorate([
                core_1.Component({
                    selector: 'jb_item',
                    template: '<div #jb_item_repl></div>',
                }), 
                __metadata('design:paramtypes', [core_1.ComponentResolver])
            ], ItemListChild);
            return ItemListChild;
        }());
        return ItemListChild;
    }
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (jb_ui_1) {
                jb_ui = jb_ui_1;
            },
            function (jb_rx_1) {
                jb_rx = jb_rx_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ;
            jb_1.jb.type('itemlist.style');
            jb_1.jb.component('itemlist', {
                type: 'control',
                params: {
                    title: { as: 'string' },
                    items: { as: 'array', dynamic: true, essential: true },
                    controls: { type: 'control[]', essential: true, dynamic: true },
                    style: { type: 'itemlist.style', dynamic: true, defaultValue: { $: 'itemlist.ul-li' } },
                    dynamicItems: { type: 'boolean', as: 'boolean', defaultValue: true },
                    itemVariable: { as: 'string' },
                    features: { type: 'feature[]', dynamic: true },
                },
                impl: function (context) {
                    //    var items = context.params.items();
                    return jb_ui.ctrl(context).jbExtend({
                        doCheck: function (cmp) {
                            if (context.params.dynamicItems)
                                cmp.items = context.params.items(cmp.ctx);
                        },
                        beforeInit: function (cmp) {
                            cmp.items = context.params.items(cmp.ctx);
                            cmp.itemlist = {
                                items: cmp.items,
                                el: cmp.elementRef.nativeElement,
                                elemToItem: function (elem) {
                                    return cmp.items[$(elem).closest('[jb-item]').index()];
                                },
                                selectionEmitter: new jb_rx.Subject(),
                            };
                        },
                        directives: [jb_itemlist_comp(context.params, context)]
                    });
                }
            });
            jb_1.jb.component('itemlist.ul-li', {
                type: 'itemlist.style',
                impl: { $: 'customStyle',
                    template: '<div><ul class="jb-itemlist"><li *ngFor="let item of items" jb-item><jb_item [item]="item"></jb_item></li></ul></div>',
                    css: "[jb-item].selected { background: #337AB7; color: #fff ;}\n    li { list-style: none; padding: 0; margin: 0;}\n    ul { list-style: none; padding: 0; margin: 0;}\n    "
                }
            });
            jb_1.jb.component('itemlist.div', {
                type: 'itemlist.style',
                impl: function (context) {
                    return { template: '<div *ngFor="let item of items" jb-item><jb_item [item]="item"></jb_item></div>' };
                }
            });
            jb_1.jb.component('itemlist.divider', {
                type: 'feature',
                params: {
                    space: { as: 'number', defaultValue: 5 }
                },
                impl: function (ctx, space) {
                    return ({ css: "[jb-item]:not(:first-of-type) { border-top: 1px solid rgba(0,0,0,0.12); padding-top: " + space + "px }" });
                }
            });
            // ****************** Selection ******************
            jb_1.jb.component('itemlist.selection', {
                type: 'feature',
                params: {
                    databind: { as: 'ref' },
                    onSelection: { type: 'action', dynamic: true },
                    onDoubleClick: { type: 'action', dynamic: true },
                    autoSelectFirst: { type: 'boolean' }
                },
                impl: function (context) {
                    var itemlist = context.vars.$itemlist;
                    return {
                        init: function (cmp) {
                            cmp.click = new jb_rx.Subject();
                            var itemlist = cmp.itemlist;
                            context.params.databind && jb_rx.refObservable(context.params.databind, context).distinctUntilChanged()
                                .subscribe(function (selected) {
                                //            console.log('selected1',itemlist.selected);
                                itemlist.selected = selected;
                            });
                            itemlist.selectionEmitter
                                .distinctUntilChanged().subscribe(function (selected) {
                                itemlist.selected = selected;
                                //            console.log('selected2',itemlist.selected);
                                if (context.params.databind)
                                    jb_1.jb.writeValue(context.params.databind, selected);
                            });
                            // first auto selection
                            if (jb_1.jb.val(context.params.databind))
                                itemlist.selectionEmitter.next(jb_1.jb.val(context.params.databind));
                            else if (context.params.autoSelectFirst && itemlist.items[0])
                                itemlist.selectionEmitter.next(itemlist.items[0]);
                            cmp.click.buffer(cmp.click.debounceTime(250)) // double click
                                .map(function (list) { return list.length; })
                                .filter(function (x) { return x === 2; })
                                .subscribe(function (x) { return context.params.onDoubleClick(context.setData(itemlist.selected)); });
                            cmp.click.map(function (event) {
                                return itemlist.elemToItem(event.target);
                            })
                                .do(function (selected) {
                                context.params.onSelection(context.setData(selected));
                            })
                                .subscribe(function (x) { return itemlist.selectionEmitter.next(x); });
                        },
                        host: {
                            '(click)': 'click.next($event)',
                        },
                        innerhost: {
                            '[jb-item]': { '[ng-class]': '{selected: itemlist.selected == item}' },
                        },
                    };
                }
            });
            jb_1.jb.component('itemlist.keyboard-selection', {
                type: 'feature',
                params: {
                    onKeyboardSelection: { type: 'action', dynamic: true },
                    autoFocus: { type: 'boolean' }
                },
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            var itemlist = cmp.itemlist;
                            cmp.keydown = new jb_rx.Subject();
                            if (context.params.autoFocus)
                                setTimeout(function () {
                                    return cmp.elementRef.nativeElement.focus();
                                }, 1);
                            cmp.keydown.filter(function (e) { return e.keyCode == 38 || e.keyCode == 40; })
                                .map(function (event) {
                                event.stopPropagation();
                                var diff = event.keyCode == 40 ? 1 : -1;
                                return itemlist.items[itemlist.items.indexOf(itemlist.selected) + diff] || itemlist.selected;
                            }).subscribe(function (x) {
                                return itemlist.selectionEmitter.next(x);
                            });
                        },
                        host: {
                            '(keydown)': 'keydown.next($event)',
                            'tabIndex': '0'
                        }
                    };
                }
            });
            jb_1.jb.component('itemlist.drag-and-drop', {
                type: 'feature',
                params: {},
                impl: function (context) {
                    return {
                        init: function (cmp) {
                            var itemlist = cmp.itemlist;
                            var drake = itemlist.drake = dragula($(itemlist.el).findIncludeSelf('.jb-itemlist').get(), {
                                moves: function (el) { return $(el).attr('jb-item') != null; }
                            });
                            drake.on('drag', function (el, source) {
                                el.dragged = {
                                    obj: itemlist.elemToItem(el),
                                    remove: function (obj) { return itemlist.items.splice(itemlist.items.indexOf(obj), 1); }
                                };
                            });
                            drake.on('drop', function (dropElm, target, source, sibling) {
                                dropElm.dragged && dropElm.dragged.remove(dropElm.dragged.obj);
                                if (!sibling)
                                    itemlist.items.push(dropElm.dragged.obj);
                                else
                                    itemlist.items.splice($(sibling).index() - 1, 0, dropElm.dragged.obj);
                                dropElm.dragged = null;
                            });
                        }
                    };
                }
            });
        }
    }
});
