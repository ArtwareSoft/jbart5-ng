import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as ui_utils from 'jb-ui/jb-ui-utils';
import { CommonModule } from '@angular/common';
import {NgModule, Directive, Component, ElementRef, Input, NgZone} from '@angular/core';

jb.type('tree.nodeModel');
jb.type('tree.style'); 

declare var $: any;
declare var dragula: any;

// part of ul-li
@Component({
	selector: 'node_line',
	template: `<div class="treenode-line" [class.collapsed]="!tree.expanded[path]">
				<button class="treenode-expandbox" (click)="flip()" [class.nochildren]="!model.isArray(path)">
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
			<jb_node [tree]="tree" [path]="childPath" class="treenode" [class.selected]="tree.selected == childPath"></jb_node>
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
		else {
			$(this.elementRef.nativeElement).removeClass('jb-array-node');
			this.tree.expanded[this.path] = false;
		}
		$(this.elementRef.nativeElement).attr('path', this.path);
	}
}

@NgModule({
  imports: [ CommonModule],
  declarations: [ TreeNode, TreeNodeLine ], // is overriden dynamically
  exports: [ TreeNode, TreeNodeLine ],
})
class jbTreeModule { }

var emptyModel = {
	isArray: _ => false,
	children: _ => [],
	title: _ => '',
	rootPath: ''
}
 //********************* jBart Components

jb.component('tree', {
	type: 'control',
	params: [
		{ id: 'nodeModel', type: 'tree.nodeModel', dynamic: true, essential: true },
		{ id: 'style', type: "tree.style", defaultValue: { $: "tree.ul-li" }, dynamic: true },
		{ id: 'features', type: "feature[]", dynamic: true }
	],
	impl: function(context) { 
		var nodeModel = context.params.nodeModel();
		if (!nodeModel)
			return jb.logException('missing nodeModel in tree');
		var tree = { nodeModel: nodeModel };
		var ctx = context.setVars({$tree: tree});
		return jb_ui.ctrl(ctx).jbExtend({
			host: { '[class]': 'jb-tree' }, // define host element to keep the wrapper
			beforeInit: function(cmp) {
				cmp.tree = jb.extend(tree,{
					redraw: _ => { // needed after dragula that changes the DOM
						var model = tree.nodeModel;
						tree.nodeModel = emptyModel;
			            cmp.changeDt.markForCheck();cmp.changeDt.detectChanges();

						tree.nodeModel = model;
			            cmp.changeDt.markForCheck();cmp.changeDt.detectChanges();
					},
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
	impl :{$: 'customStyle',
		template: '<jb_node [tree]="tree" [path]="tree.nodeModel.rootPath" class="jb-control-tree treenode" [class.selected]="tree.selected == tree.nodeModel.rootPath"></jb_node>',
//		directives: ['TreeNode', 'TreeNodeLine'],
		imports: [jbTreeModule]
	}
})

jb.component('tree.selection', {
  type: 'feature',
  params: [
	  { id: 'databind', as: 'ref' },
	  { id: 'onSelection', type: 'action', dynamic: true },
	  { id: 'onDoubleClick', type: 'action', dynamic: true },
	  { id: 'autoSelectFirst', type: 'boolean' }
  ],
  impl: context=> ({
	    jbEmitter: true,
      	host: {
        	'(click)': 'clickSource.next($event)',
      	},
  		init: function(cmp) {
  		  var tree = cmp.tree;
	      cmp.clickSource = cmp.clickSource || new jb_rx.Subject();
	      cmp.click = cmp.click || cmp.clickSource
	          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

      	  cmp.click.buffer(cmp.click.debounceTime(250)) // double click
  				.filter(x => x.length === 2)
  				.subscribe(x=> {
					jb_ui.wrapWithLauchingElement(context.params.onDoubleClick, 
						context.setData(tree.selected), x[0].srcElement)()
  				})

  		  var databindObs = (context.params.databind && jb_rx.refObservable(context.params.databind,cmp)
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
			  context.params.onSelection(cmp.ctx.setData(selected));
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
  	})
})

jb.component('tree.keyboard-selection', {
	type: 'feature',
	params: [
		{ id: 'onKeyboardSelection', type: 'action', dynamic: true },
		{ id: 'onEnter', type: 'action', dynamic: true },
		{ id: 'onRightClickOfExpanded', type: 'action', dynamic: true },
		{ id: 'autoFocus', type: 'boolean' },
		{ id: 'applyMenuShortcuts', type: 'menu.option', dynamic: true },
	],
	impl: context => ({
			jbEmitter: true,
			host: {
        		'(keydown)': 'keydownSrc.next($event)',
				'tabIndex': '0',
		        '(mouseup)': 'getKeyboardFocus()',
			},
			init: cmp=> {
				var tree = cmp.tree;
		        cmp.keydownSrc = cmp.keydownSrc || new jb_rx.Subject();
		        cmp.keydown = cmp.keydown || cmp.keydownSrc
		          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

				var keyDownNoAlts = cmp.keydown.filter(e=> 
					!e.ctrlKey && !e.altKey);

				tree.regainFocus = cmp.getKeyboardFocus = cmp.getKeyboardFocus || (_ => {
					jb_ui.focus(cmp.elementRef.nativeElement,'tree.keyboard-selection regain focus');
					return false;
				});

				if (context.params.autoFocus)
					jb_ui.focus(cmp.elementRef.nativeElement,'tree.keyboard-selection init autofocus');

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
						context.setData(tree.selected), tree.el.querySelector('.treenode.selected'))()
				}
				// menu shortcuts
				cmp.keydown.filter(e=> e.ctrlKey || e.altKey || e.keyCode == 46) // also Delete
					.filter(e=> e.keyCode != 17 && e.keyCode != 18) // ctrl ot alt alone
					.subscribe(e => {
						var menu = context.params.applyMenuShortcuts(context.setData(tree.selected));
						menu && menu.applyShortcut && menu.applyShortcut(e);
					})
			}
		})
})

jb.component('tree.regain-focus', {
	type: 'action',
	impl : ctx =>
		ctx.vars.$tree && ctx.vars.$tree.regainFocus && ctx.vars.$tree.regainFocus()
})


jb.component('tree.onMouseRight', {
  type: 'feature',
  params: [
	  { id: 'action', type: 'action', dynamic: true, essential: true },
  ],
  impl: (context,action) => ({
	    jbEmitter: true,
      	host: {
        	'(contextmenu)' : 'contextmenuSrc.next($event)'
      	},
  		init: function(cmp) {
  		  var tree = cmp.tree;
	      cmp.contextmenuSrc = cmp.contextmenuSrc || new jb_rx.Subject();
	      cmp.contextmenuSrc.takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') )
	          .subscribe(e=>{
	          		ui_utils.stop_prop (e);
	        		var selected = tree.elemToPath(e.target);
	        		tree.selectionEmitter.next(selected);
					jb_ui.wrapWithLauchingElement(action, cmp.ctx.setData(selected), e.target)();
	        	})
	    }
	})
})

jb.component('tree.drag-and-drop', {
  type: 'feature',
  params: [
	  { id: 'afterDrop', type: 'action', dynamic: true, essential: true },
  ],
  impl: function(context) {
  	return {
		host: {
        	'(keydown)': 'keydownSrc.next($event)',
        },
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
					path, { dragged: dropElm.dragged.path, index: index },context);
				// refresh the nodes on the tree - to avoid bugs
				tree.expanded[tree.nodeModel.rootPath] = false;
				jb.delay(1).then(()=> {
					tree.expanded[tree.nodeModel.rootPath] = true;
					context.params.afterDrop(context.setData({ dragged: dropElm.dragged.path, index: index }));
					var newSelection = dropElm.dragged.path.split('~').slice(0,-1).concat([''+index]).join('~');
					tree.selectionEmitter.next(newSelection);
					dropElm.dragged = null;
					tree.redraw();
				})
	        });

	        // ctrl up and down
	        cmp.keydownSrc = cmp.keydownSrc || new jb_rx.Subject();
	        cmp.keydown = cmp.keydown || cmp.keydownSrc
	          .takeUntil( cmp.jbEmitter.filter(x=>x =='destroy') );

			cmp.keydown.filter(e=> 
				e.ctrlKey && (e.keyCode == 38 || e.keyCode == 40))
				.subscribe(e=> {
					var diff = e.keyCode == 40 ? 1 : -1;
					var selectedIndex = Number(tree.selected.split('~').pop());
					if (isNaN(selectedIndex)) return;
					var no_of_siblings = $($('.treenode.selected').parents('.treenode-children')[0]).children().length;
					var index = (selectedIndex + diff+ no_of_siblings) % no_of_siblings;
					var path = tree.selected.split('~').slice(0,-1).join('~');
					tree.nodeModel.modify(tree.nodeModel.move, path, { dragged: tree.selected, index: index },context);
					tree.selectionEmitter.next(path+'~'+index);
			})
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

//jb_ui.registerDirectives({TreeNode: TreeNode, TreeNodeLine:TreeNodeLine});
