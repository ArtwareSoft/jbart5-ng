import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as ui_utils from 'jb-ui/jb-ui-utils';
import {NgClass} from 'angular2/common';
import {Observable,Subject} from 'rxjs/Rx';
import {Directive, Component, ElementRef, Injector, Input, NgZone} from '@angular/core';

jb.type('tree.nodeModel');
jb.type('tree.style'); 

declare var $: any;
declare var dragula: any;

export interface jbTree {
	el: any,
	// injected by TreeSelection feature
	selectedNode() : any,
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
		var nodeModel = context.params.nodeModel();
		if (!nodeModel)
			return jb.logException('missing nodeModel in tree');
		var tree = { nodeModel: nodeModel };
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
	impl :{$:'customStyle',
		template: '<span><jb_node [tree]="tree" [path]="tree.nodeModel.rootPath" class="jb-control-tree treenode" [ngClass]="{selected: tree.selected == tree.nodeModel.rootPath}"></jb_node></span>',
		directives: ['TreeNode', 'TreeNodeLine'],
	}
})

// part of ul-li
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
	@Input('tree') tree;
	model: any;
	icon: string;
	title: string;

	ngOnInit() {
//		this.tree = tree;
		this.model = this.tree.nodeModel;
	}
	ngDoCheck() {
		this.title = this.model.title(this.path,!this.tree.expanded[this.path]);
		this.icon = this.tree.nodeModel.icon ? this.tree.nodeModel.icon(this.path) : 'radio_button_unchecked';
	}
	flip(x) { 
		this.tree.expanded[this.path] = !(this.tree.expanded[this.path]);
	};
}

@Component({
    selector: 'jb_node',
	template: `<node_line [tree]="tree" [path]="path"></node_line>
		<ul *ngIf="tree.expanded[path]" class="treenode-children">
		  <li *ngFor="let childPath of tree.nodeModel.children(path)" class="treenode-li">
			<jb_node [tree]="tree" [path]="childPath" class="treenode" [ngClass]="{selected: tree.selected == childPath}"></jb_node>
		  </li>
		</ul>`,
	directives: [TreeNodeLine,TreeNode]
})
class TreeNode {
	@Input('path') path;
	@Input('tree') tree;
	constructor(private elementRef: ElementRef) { }
	ngOnInit() {
//		this.tree = tree;
	}
	ngDoCheck() {
		if (this.tree.nodeModel.isArray(this.path))
			$(this.elementRef.nativeElement).addClass('jb-array-node');
		$(this.elementRef.nativeElement).attr('path', this.path);
	}
}

jb_ui.registerDirectives({TreeNode: TreeNode, TreeNodeLine:TreeNodeLine});

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
  				.filter(x => x.length === 2)
  				.subscribe(x=> {
					jb_ui.wrapWithLauchingElement(context.params.onDoubleClick, context.setData(tree.selected), x[0].srcElement)()
  				})

  		  var databindObs = (context.params.databind && jb_rx.refObservable(context.params.databind,context)
        	.distinctUntilChanged()) || jb_rx.Observable.of();

		  tree.selectionEmitter
		  	.merge(databindObs)
		  	.filter(x=>x)
		  	.subscribe(selected=> { // .distinctUntilChanged()
		  	  if (tree.selected == selected)
		  	  	return;
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
		onRightClickOfExpanded: { type: 'action', dynamic: true },
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
				var keyDownNoAlts = cmp.keydown.filter(e=> 
					!e.ctrlKey && !e.altKey);

				cmp.getKeyboardFocus = cmp.getKeyboardFocus || (() => {
					cmp.elementRef.nativeElement.focus(); 
					return false;
				});

				if (context.params.autoFocus)
					setTimeout(() => 
						cmp.elementRef.nativeElement.focus(), 1);

				keyDownNoAlts
					.filter(e=> e.keyCode == 13)
						.subscribe(e =>
							runActionInTreeContext(context.params.onEnter))

				keyDownNoAlts.filter(e=> e.keyCode == 38 || e.keyCode == 40)
					.map(event => {
//						event.stopPropagation();
						var diff = event.keyCode == 40 ? 1 : -1;
						var nodes = Array.from(tree.el.querySelectorAll('.treenode'));
						var selected = tree.el.querySelector('.treenode.selected');
						return tree.elemToPath(nodes[nodes.indexOf(selected) + diff]) || tree.selected;
					}).subscribe(x=> 
						tree.selectionEmitter.next(x))
				// expand collapse
				keyDownNoAlts
					.filter(e=> e.keyCode == 37 || e.keyCode == 39)
					.subscribe(event => {
//						event.stopPropagation();
						var isArray = tree.nodeModel.isArray(tree.selected);
						if (!isArray || (tree.expanded[tree.selected] && event.keyCode == 39))
							runActionInTreeContext(context.params.onRightClickOfExpanded);	
						if (isArray && tree.selected) 
							tree.expanded[tree.selected] = (event.keyCode == 39);
					});

				function runActionInTreeContext(action) {
					jb_ui.wrapWithLauchingElement(action, 
						context.setData(tree.selected).setVars({regainFocus: cmp.getKeyboardFocus }), 
						tree.el.querySelector('.treenode.selected'))()
				}
			}
		}
	}
})

jb.component('tree.regain-focus', {
	type: 'action',
	impl : ctx =>
		ctx.vars.regainFocus && ctx.vars.regainFocus()
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
	              if (key.match(/\+Up$/)) keyCode = 38;
	              if (key.match(/\+Down$/)) keyCode = 40;

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
		  	if (tree.drake)
			  tree.drake.containers = 
				  $(cmp.elementRef.nativeElement).findIncludeSelf('.jb-array-node').children().filter('.treenode-children').get();
  		}

  	}
  }
})

