import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as ui_utils from 'jb-ui/jb-ui-utils';
import {NgClass} from 'angular2/common';
import {Observable,Subject} from 'rxjs/Rx';
import {Directive, Component, View, ElementRef, Injector, Input, NgZone} from '@angular/core';

jb.type('tree.nodeModel');
jb.type('tree.style'); 

export interface jbTree {
	el: any,
	// injected by TreeSelection feature
	selectedNode() : NodeModel,
	triggerOnSelected(string),
	moveSelection(number), 
}

jb.component('tree', {
	type: 'control',
	params: {
		nodeModel: { type: 'tree.nodeModel', dynamic: true, essential: true },
		style: { type: "tree.style", defaultValue: { $: "tree.ul-li" }, dynamic: true },
		features: { type: "feature[]", dynamic: true }
	},
	impl: function(context) { 
		if (!context.params.nodeModel())
			return jb.logException('missing nodeModel in tree');
		var tree = { nodeModel: context.params.nodeModel(ctx) };
		var ctx = context.setVars({$tree: tree});
		return jb_ui.ctrl(ctx).jbExtend({
			host: { 'class': 'jb-tree' }, // define host element to keep the wrapper
			beforeInit: function(cmp) {
				cmp.tree = jb.extend(tree,{
					expanded: jb.obj(tree.nodeModel.rootPath, true),
					el: cmp.elementRef.nativeElement,
					elemToPath: el => $(el).closest('.treenode').attr('path'),
					selectionEmitter: new jb_rx.Subject(),
				})
			},
		},ctx) 
	}
})

jb.component('tree.ul-li', {
	type: 'tree.style',
	impl: function(context) { 
		var tree = context.vars.$tree;
		@Component({
			selector: 'node_line',
			template: `<div class="treenode-line" [ngClass]="{collapsed: !tree.expanded[path]}">
						<button class="treenode-expandbox" (click)="flip()" [ngClass]="{nochildren: !model.isArray(path)}">
							<div class="frame"></div><div class="line-lr"></div><div class="line-tb"></div>
						</button>
						<i class="material-icons">{{icon}}</i>
						<span class="treenode-label" [innerHTML]="title"></span>
					  </div>`,
			styles: [`i {font-size: 16px; margin-left: -4px; padding-right:2px }`]
		})
		class TreeNodeLine {
			@Input('path') path;
			ngOnInit() {
				this.tree = tree;
				this.model = tree.nodeModel;
			}
			ngDoCheck() {
				this.title = this.model.title(this.path,!this.tree.expanded[this.path]);
				this.icon = tree.nodeModel.icon ? tree.nodeModel.icon(this.path) : 'radio_button_unchecked';
			}
			flip(x) { 
				tree.expanded[this.path] = !(tree.expanded[this.path]);
			};
		}
		
		@Component({
		    selector: 'jb_node',
			template: `<node_line [path]="path"></node_line>
				<ul *ngIf="tree.expanded[path]" class="treenode-children">
				  <li *ngFor="let childPath of tree.nodeModel.children(path)" class="treenode-li">
					<jb_node [path]="childPath" class="treenode" [ngClass]="{selected: tree.selected == childPath}"></jb_node>
				  </li>
				</ul>`,
			directives: [TreeNodeLine,TreeNode]
		})
		class TreeNode {
			@Input('path') path;
			constructor(private elementRef: ElementRef) { }
			ngOnInit() {
				this.tree = tree;
			}
			ngDoCheck() {
				if (tree.nodeModel.isArray(this.path))
					$(this.elementRef.nativeElement).addClass('jb-array-node');
				$(this.elementRef.nativeElement).attr('path', this.path);
			}
		}

		return {
			template: '<jb_node [path]="tree.nodeModel.rootPath" class="treenode" [ngClass]="{selected: tree.selected == tree.nodeModel.rootPath}"></jb_node>',
			directives: [TreeNode, TreeNodeLine]
		}
	}
})

jb.component('tree.selection', {
  type: 'feature',
  params: {
	  databind: { as: 'ref' },
	  onSelection: { type: 'action', dynamic: true },
	  onDoubleClick: { type: 'action', dynamic: true },
	  autoSelectFirst: { type: 'boolean' }
  },
  impl: function(context) {
  	return {
  		init: function(cmp) {
  			cmp.alert = x=>alert(x);
  		  var tree = cmp.tree;
	      cmp.click = new jb_rx.Subject();
      	  cmp.click.buffer(cmp.click.debounceTime(250)) // double click
  				.map(list => list.length)
  				.filter(x => x === 2)
  				.subscribe(x=>context.params.onDoubleClick(context.setData(tree.selected)))

		  tree.selectionEmitter.distinctUntilChanged().subscribe(selected=> {
			  tree.selected = selected;
			  selected.split('~').slice(0,-1).reduce(function(base, x) { 
				  var path = base ? (base + '~' + x) : x;
				  tree.expanded[path] = true;
				  return path; 
			  },'')
			  if (context.params.databind)
				  jb.writeValue(context.params.databind, selected);
			  context.params.onSelection(context.setData(selected));
		  });
		  // first auto selection selection
		  var first_selected = jb.val(context.params.databind);
		  if (!first_selected && context.params.autoSelectFirst) {
			  var first = tree.el.querySelectorAll('.treenode')[0];
			  first_selected = tree.elemToPath(first);
		  }
		  if (first_selected)
			jb.delay(1).then(() => tree.selectionEmitter.next(first_selected))

		  cmp.click.map(event => tree.elemToPath(event.target))
		  	.subscribe(x=> tree.selectionEmitter.next(x))

  		},
      	host: {
        	'(click)': 'click.next($event)',
      	}
  	}
  }
})


jb.component('tree.keyboard-selection', {
	type: 'feature',
	params: {
		onKeyboardSelection: { type: 'action', dynamic: true },
		onEnter: { type: 'action', dynamic: true },
		autoFocus: { type: 'boolean' }
	},
	impl: function(context) {
		return {
			host: {
				'(keydown)': 'keydown.next($event)',
				'tabIndex': '0',
		        '(mousedown)': 'getKeyboardFocus()',
			},
			init: cmp=> {
				var tree = cmp.tree;
				cmp.keydown = cmp.keydown || new Subject();
				cmp.getKeyboardFocus = cmp.getKeyboardFocus || (() => {cmp.elementRef.nativeElement.focus(); return false});

				if (context.params.autoFocus)
					setTimeout(() => cmp.elementRef.nativeElement.focus(), 1);

				cmp.keydown.filter(e=> 
					e.keyCode == 13)
						.subscribe(()=>{
							context.params.onEnter(context.setData(tree.selected))})

				cmp.keydown.filter(e=> e.keyCode == 38 || e.keyCode == 40)
					.map(event => {
						event.stopPropagation();
						var diff = event.keyCode == 40 ? 1 : -1;
						var nodes = Array.from(tree.el.querySelectorAll('.treenode'));
						var selected = tree.el.querySelector('.treenode.selected');
						return tree.elemToPath(nodes[nodes.indexOf(selected) + diff]) || tree.selected;
					}).subscribe(x=> tree.selectionEmitter.next(x))
				// expand collapse
				cmp.keydown.filter(e=> e.keyCode == 37 || e.keyCode == 39).subscribe(event => {
						event.stopPropagation();
						if (tree.selected) 
							tree.expanded[tree.selected] = (event.keyCode == 39);
					});
			}
		}
	}
})

jb.component('tree.keyboard-shortcut', {
	type: 'feature',
	params: {
		key: { as: 'string', description: 'Ctrl+C or Alt+V' },
		action: { type: 'action', dynamic: true },
	},
	impl: function(context,key,action) {
		return {
			host: {
				'(keydown)': 'keydown.next($event)',
				'tabIndex': '0',
		        '(mousedown)': 'getKeyboardFocus()',
			},
			init: cmp=> {
				var tree = cmp.tree;
				cmp.keydown = cmp.keydown || new Subject();
				cmp.getKeyboardFocus = cmp.getKeyboardFocus || (() => {cmp.elementRef.nativeElement.focus(); return false});

				cmp.keydown.subscribe(event=>{
	              var keyCode = key.split('+').pop().charCodeAt(0);
	              if (key == 'Delete') keyCode = 46;

	              var helper = (key.match('([A-Za-z]*)+') || ['',''])[1];
	              if (helper == 'Ctrl' && !event.ctrlKey) return
	              if (helper == 'Alt' && !event.altKey) return
	              if (event.keyCode == keyCode)
	                action(context.setData(tree.selected));
				})
			}
		}
	}
})


jb.component('tree.drag-and-drop', {
  type: 'feature',
  params: {
  },
  impl: function(context) {
  	return {
  		init: function(cmp) {
  			var tree = cmp.tree;
			var drake = tree.drake = dragula([], {
				moves: function(el) { 
					return $(el).is('.jb-array-node>.treenode-children>.treenode-li') 
				}
	        });

	        drake.on('drag', function(el, source) { 
	          var path = tree.elemToPath(el.firstElementChild)
	          el.dragged = { path: path, expanded: tree.expanded[path]}
	          tree.expanded[path] = false; // collapse when dragging
	        })

	        drake.on('drop', (dropElm, target, source,sibling) => {
	            if (!dropElm.dragged) return;
				$(dropElm).remove();
	            tree.expanded[dropElm.dragged.path] = dropElm.dragged.expanded; // restore expanded state
	            var index =  sibling ? $(sibling).index() : -1;
				var path = tree.elemToPath(target);
				tree.nodeModel.modify(tree.nodeModel.move, 
					path, { dragged: dropElm.dragged.path, index: index },context)
				dropElm.dragged = null;

				// refresh the nodes on the tree - to avoid bugs
				tree.expanded[tree.nodeModel.rootPath] = false;
				jb.delay(1).then(()=>tree.expanded[tree.nodeModel.rootPath] = true)
	        });
  		},
  		doCheck: function(cmp) {
  			var tree = cmp.tree;
		  	if (tree.drake) {
			  tree.drake.containers = 
				  $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-array-node').children().filter('.treenode-children').get();
			// make a place for drop in empty containers
	  		  tree.drake.containers.forEach(el=>{
	  		  	if ($(el).height() < 3) $(el).height(7)})
		  	}
  		}

  	}
  }
})

