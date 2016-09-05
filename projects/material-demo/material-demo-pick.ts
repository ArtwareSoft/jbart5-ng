import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import {model} from './studio-tgp-model';

jb.component('material-demo.pick', {
	type: 'action',
	params: [
		{ id: 'onSelect', type:'action', dynamic:true }
	],
	impl :{$: 'openDialog',
		$vars: {
			pickPath: { path: ''}
		},
		style: {$: 'dialog.material-demo-pick-dialog' },
		content: {$: 'label', title: ''}, // dummy
		onOK: ctx =>
			ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickPath.path))
	 }
})

jb.component('dialog.material-demo-pick-dialog', {
	hidden: true,
	type: 'dialog.style',
	params: [
		{ id: 'from', as: 'string' },
	],
	impl: {$: 'customStyle',
			template: `<div class="jb-dialog">
<div class="edge top" [style.width]="width+'px'" [style.top]="top+'px'" [style.left]="left+'px'"></div>
<div class="edge left" [style.height]="height+'px'" [style.top]="top+'px'" [style.left]="left+'px'"></div>
<div class="edge right" [style.height]="height+'px'" [style.top]="top+'px'" [style.left]="left+width+'px'"></div>
<div class="edge bottom" [style.width]="width+'px'" [style.top]="top+height+'px'" [style.left]="left+'px'"></div>
<div class="title" [class.bottom]="titleBelow" [style.top]="titleTop+'px'" [style.left]="titleLeft+'px'">
	<div class="text">{{title}}</div>
	<div class="triangle"></div>
</div>

</div>`, 
			css: `
.edge { 
	z-index: 6001;
	position: absolute;
	background: red;
	box-shadow: 0 0 1px 1px gray;
	width: 1px; height: 1px;
	cursor: pointer;
}
.title {
	z-index: 6001;
	position: absolute;
	font: 14px arial; padding: 0; cursor: pointer;
	transition:top 100ms, left 100ms;
}
.title .triangle {	width:0;height:0; border-style: solid; 	border-color: #e0e0e0 transparent transparent transparent; border-width: 6px; margin-left: 14px;}
.title .text {	background: #e0e0e0; font: 14px arial; padding: 3px; }
.title.bottom .triangle { background: #fff; border-color: transparent transparent #e0e0e0 transparent; transform: translateY(-28px);}
.title.bottom .text { transform: translateY(6px);}
				`,
			features: [
				{ $: 'dialog-feature.material-demo-pick' },
			]
	}
})


jb.component('dialog-feature.material-demo-pick', {
	type: 'dialog-feature',
	params: [
	],
	impl: ctx =>
	({
      init: cmp=> {
		  var previewOffset = $('#jb-preview').offset().top : 0;
		  cmp.titleBelow = false;

		  var mouseMoveEm = jb_rx.Observable.fromEvent(document, 'mousemove');
		  var userPick = jb_rx.Observable.fromEvent(document, 'mousedown');
		  var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup');

		  mouseMoveEm
		  	.takeUntil(
		  		keyUpEm.filter(e=>
		  			e.keyCode == 27)
		  			  .merge(userPick))
		  	.do(e=>{
		  		if (e.keyCode == 27)
		  			ctx.vars.$dialog.close({OK:false});	
		  	})
		  	.map(e=>
		  		eventToProfileElem(e))
		  	.filter(x=>x.length > 0)
		  	.do(profElem=> {
		  		ctx.vars.pickPath.path = profElem.attr('jb-path');
		  		showBox(cmp,profElem,previewOffset);
		  		jb_ui.apply(ctx);
		  	})
		  	.last()
		  	.subscribe(x=> {
		  		ctx.vars.$dialog.close({OK:true});
		  	})
		}
	})			
})

function eventToProfileElem(e) {
	var $el = $(document.elementFromPoint(e.pageX - $(window).scrollLeft(), e.pageY - $(window).scrollTop()));
	if (!$el[0]) return;
	return $($el.get().concat($el.parents().get()))
		.filter((i,e) => 
			$(e).attr('jb-path') )
		.first();
}

function showBox(cmp,profElem,previewOffset) {
	if (profElem.offset() == null || $('#jb-preview').offset() == null) 
		return;

	cmp.top = previewOffset + profElem.offset().top;
	cmp.left = profElem.offset().left;
	if (profElem.outerWidth() == $(document.body).width())
		cmp.width = (profElem.outerWidth() -10);
	else
		cmp.width = profElem.outerWidth();
	cmp.height = profElem.outerHeight();

	cmp.title = model.shortTitle(profElem.attr('jb-path'));

	var $el = $(cmp.elementRef.nativeElement);
	var $titleText = $el.find('.title .text');
	$el.find('.title .text').text(cmp.title);
	cmp.titleBelow = top - $titleText.outerHeight() -6 < $(window).scrollTop();
	cmp.titleTop = cmp.titleBelow ? cmp.top + cmp.height : cmp.top - $titleText.outerHeight() -6;
	cmp.titleLeft = cmp.left + (cmp.width - $titleText.outerWidth())/2;
	$el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth()/2-6 })
}
