import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';
import * as jb_rx from 'jb-ui/jb-rx';
import * as studio from './studio-model';

jb.component('studio.pick', {
	type: 'action',
	params: {
		from: { options: 'studio,preview', as: 'string', defaultValue: 'preview'},
		onSelect: { type:'action', dynamic:true }
	},
	impl :{$: 'openDialog',
		$vars: {
			pickPath: { path: ''}
		},
		style: {$: 'dialog.studio-pick-dialog', from: '%$from%'},
		content: {$: 'label', title: ''}, // dummy
		onOK: ctx =>
			ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickPath.path))
	 }
})

	// <div class="title-above" [ngIf]="titleAbove">
	// 	<div class="text">{{title}}</div>
	// 	<div class="triangle" [style.margin-left]="triangleOffset"></div>
	// </div>
	// <div class="box"></div>
	// <div class="title-below" [ngIf]="!titleAbove">
	// 	<div class="triangle triangle-below" [style.margin-left]="triangleOffset"></div>
	// 	<div class="text"></div>
	// </div>

// <div class="title">
// 	<div class="triangle"></div>
// 	<div class="title">{{title}}</div>
// </div>
// <div class="title">
// 	<div class="title">{{title}}</div>
// 	<div class="triangle triangle-below"></div>
// </div>
// [ngClass]="{bottom: titleBelow}"

jb.component('dialog.studio-pick-dialog', {
	hidden: true,
	type: 'dialog.style',
	params: {
		from: { as: 'string' },
	},
	impl: {$: 'customStyle',
			template: `<div class="jb-dialog">
<div class="edge top"></div>
<div class="edge left"></div>
<div class="edge right"></div>
<div class="edge bottom"></div>
<div class="title" >
	<div class="text">{{title}}</div>
	<div class="triangle"></div>
</div>

</div>`, 
			css: `
.edge { 
	position: absolute;
	background: red;
	box-shadow: 0 0 1px 1px gray;
	width: 1px; height: 1px;
	cursor: pointer;
}
.title {
	z-index: 6001;
	position: absolute;
	font: 14px arial; padding: 0; 
	cursor: pointer;
	transition:top 100ms, left 100ms;
}
.title .triangle {	width:0;height:0; border-style: solid; 	border-color: #e0e0e0 transparent transparent transparent; border-width: 6px; margin-left: 14px;}
.title .text {	background: #e0e0e0; font: 14px arial; padding: 3px; }
.title.bottom .triangle { background: #fff; border-color: transparent transparent #e0e0e0 transparent; transform: translateY(-28px);}
.title.bottom .text { transform: translateY(6px);}
				`,
			features: [
				{ $: 'dialogFeature.studio-pick', from: '%$from%' },
			]
	}
})


jb.component('dialogFeature.studio-pick', {
	type: 'dialogFeature',
	params: {
		from: { as: 'string' },
	},
	impl: ctx =>
	({
      init: cmp=> {
		  var _window = ctx.params.from == 'preview' ? jbart.previewWindow : window;
		  var previewOffset = ctx.params.from == 'preview' ? $('#jb-preview').offset().top : 0;
		  cmp.titleBelow = false;

		  var mouseMoveEm = jb_rx.Observable.fromEvent(_window.document, 'mousemove');
		  var userPick = jb_rx.Observable.fromEvent(document, 'mousedown')
		      			.merge(jb_rx.Observable.fromEvent(
		      				(jbart.previewWindow || {}).document, 'mousedown'));
		  var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup')
		      			.merge(jb_rx.Observable.fromEvent(
		      				(jbart.previewWindow || {}).document, 'keyup'));

		  mouseMoveEm
		  	.takeUntil(
		  		keyUpEm.filter(e=>e.keyCode == 27).merge(userPick))
		  	.map(e=>
		  		eventToProfileElem(e,_window))
		  	.filter(x=>x.length > 0)
		  	.do(profElem=> {
		  		ctx.vars.pickPath.path = profElem.attr('jb-path');
		  		showBox(cmp,profElem,_window,previewOffset)
		  	})
		  	.last()
		  	.subscribe(x=> {
		  		ctx.vars.$dialog.close({OK:true});
		  	})
		}
	})			
})

function eventToProfileElem(e,_window) {
	var $el = $(_window.document.elementFromPoint(e.pageX - $(_window).scrollLeft(), e.pageY - $(_window).scrollTop()));
	if (!$el[0]) return;
	return $($el.get().concat($el.parents().get()))
		.filter((i,e) => 
			$(e).attr('jb-path') )
		.first();
}

function showBox(cmp,profElem,_window,previewOffset) {
	if (profElem.offset() == null || $('#jb-preview').offset() == null) 
		return;

	var top = previewOffset + profElem.offset().top;
	var left = profElem.offset().left;
	if (profElem.outerWidth() == $(_window.document.body).width())
		var width = (profElem.outerWidth() -10);
	else
		var width = profElem.outerWidth();
	var height = profElem.outerHeight();

	var title = studio.model.shortTitle(profElem.attr('jb-path'));
	var $el = $(cmp.elementRef.nativeElement);
	var $titleText = $el.find('.title .text');
	cmp.titleBelow = top - $titleText.outerHeight() -6 < $(_window).scrollTop();

	$el.find('.top,.bottom').css('width',width+'px');
	$el.find('.left,.right').css('height',height+'px');
	$el.find('.top,.left,.bottom,.title').css('left',left+'px');
	$el.find('.right').css('left',left+width+'px');
	$el.find('.top,.left,.right').css('top',top+'px');
	$el.find('.bottom').css('top',top+height+'px');
	$el.find('.title').css('top',top+ (cmp.titleBelow ? height : 0) + 'px');
	$el.find('.title .text').text(title);

	$el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth()/2-6 });
	if (!cmp.titleBelow) {
		$el.find('.title').css({
			top: top - $titleText.outerHeight() -6,
			left: left + (width - $titleText.outerWidth())/2
		}).removeClass('bottom');
	} else {	// label under element
		$el.find('.title').css({
			top: top + height,
			left: left + (width - $titleText.outerWidth())/2
		}).addClass('bottom');
	};


	console.log(cmp.title,profElem);
}

jb.component('studio.highlight-in-preview',{
	params: {
		path: { as: 'string' }
	},
	impl: (ctx,path) => {
		var _window = jbart.previewWindow || window;
		if (!_window) return;
		var elems = _window.document.querySelectorAll('[jb-path="'+ path +'"]');
		if (elems.length == 0) {// studio
			elems = window.document.querySelectorAll('[jb-path="'+ path +'"]');
			if (elems.length)
				_window = window;
		}
		var boxes = [];
		
		$('.jbstudio_highlight_in_preview').remove();
		
		$(elems).each(function() {
			var $box = $('<div class="jbstudio_highlight_in_preview"/>').css({ position: 'absolute', background: 'rgb(193, 224, 228)', border: '1px solid blue' ,opacity: '1', zIndex: 5000 });
			var offset = $(this).offset();
			$box.css('left',offset.left).css('top',offset.top).width($(this).outerWidth()).height($(this).outerHeight());				
			if ($box.width() == $(_window.document.body).width())
				$box.width($box.width()-10);
			boxes.push($box[0]);
		})

		$(_window.document.body).append($(boxes));	

		$(boxes).css({ opacity: 0.5 }).
			fadeTo(1500,0,function() {
				$(boxes).remove();
			});
	}
})
