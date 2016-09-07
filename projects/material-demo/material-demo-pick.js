jbLoadModules(['jb-core','jb-ui','jb-ui/jb-rx']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'], jb_rx = loadedModules['jb-ui/jb-rx'];

jb.component('material-demo.pick', {
	type: 'action',
	params: [
		{ id: 'onHover', type:'action', dynamic:true },
		{ id: 'onSelect', type:'action', dynamic:true }
	],
	impl :{$: 'openDialog',
		$vars: {
			pickPath: { path: ''}
		},
		style: {$: 'dialog.material-demo-pick-dialog', onHover: {$call: 'onHover'} },
		content: {$: 'label', title: ''}, // dummy
		onOK: ctx =>
			ctx.componentContext.params.onSelect(ctx.setData(ctx.vars.pickPath.path))
	 }
})

jb.component('studio.ng-template-as-text', {
	type: 'data',
	params: [
		{ id: 'ngPath', as: 'string', dynamic: true },
	],
	impl: (ctx,fullPath) => 
	  ({
		$jb_val: function(value) {
			var path = fullPath();
			if (path.indexOf(':') == -1) return '';
			var jbPath = path.split(':')[0]+'~html';
			var ngPathAr = path.split(':')[1].split('~');
			var profile = ctx.run({$:'studio.ref', path: jbPath});
			if (!jb_tostring(profile))
				return '';
			var html = document.createElement('div');
			html.innerHTML = jb_tostring(profile);
			var ngElem = ngPathAr.reduce((elem,index)=>
				elem && Array.from(elem.children)[index]
				, html.firstChild)

			if (typeof value == 'undefined') {
				return ngElem && ngElem.outerHTML;
			} else {
				if (ngElem) {
					ngElem.outerHTML = value;
					profile.ngPath = path.split(':')[1];
					jb_writeValue(profile,html.innerHTML);
				}
			}
		}
	})
})


jb.component('dialog.material-demo-pick-dialog', {
	hidden: true,
	type: 'dialog.style',
	params: [
		{ id: 'from', as: 'string' },
		{ id: 'onHover', type:'action', dynamic:true },
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
	background: blue;
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
				{ $: 'dialog-feature.material-demo-pick', onHover: {$call: 'onHover'} },
			]
	}
})


jb.component('dialog-feature.material-demo-pick', {
	type: 'dialog-feature',
	params: [
		{ id: 'onHover', type:'action', dynamic:true },
	],
	impl: ctx =>
	({
      init: cmp=> {
		  cmp.titleBelow = false;

		  var mouseMoveEm = jb_rx.Observable.fromEvent(document, 'mousemove');
		  var userPick = jb_rx.Observable.fromEvent(document, 'mousedown');
		  var keyUpEm = jb_rx.Observable.fromEvent(document, 'keyup');


		  mouseMoveEm
		  	.takeUntil(
		  		keyUpEm.filter(e=>
		  			e.keyCode == 27)
		  			  .merge(userPick.do(e=>
		  			  	   e.stopPropagation())))
		  	.do(e=>{
		  		if (e.keyCode == 27)
		  			ctx.vars.$dialog.close({OK:false});	
		  	})
		  	.map(e=>
		  		eventToProfileElem(e))
		  	.filter(x=>x.length > 0)
		  	.do(profElem=> {
		  		ctx.vars.pickPath.path = profElem.attr('ng-path');
		  		showBox(cmp,profElem);
				var jb_path = $(profElem).parents().get()
						.map(e => $(e).attr('jb-path') )
						.filter(x=>x)[0];

		  		ctx.params.onHover(ctx.setData(jb_path+ ':' + profElem.attr('ng-path')).setVars({ngElem: profElem}));
//		  		jb_ui.apply(ctx);
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
			$(e).attr('ng-path') )
		.first();
}

function showBox(cmp,profElem) {
	if (profElem.offset() == null) 
		return;

	cmp.top =  profElem.offset().top;
	cmp.left = profElem.offset().left;
	if (profElem.outerWidth() == $(document.body).width())
		cmp.width = (profElem.outerWidth() -10);
	else
		cmp.width = profElem.outerWidth();
	cmp.height = profElem.outerHeight();

	cmp.title = profElem[0].tagName;

	var $el = $(cmp.elementRef.nativeElement);
	var $titleText = $el.find('.title .text');
	$el.find('.title .text').text(cmp.title);
	cmp.titleBelow = top - $titleText.outerHeight() -6 < $(window).scrollTop();
	cmp.titleTop = cmp.titleBelow ? cmp.top + cmp.height : cmp.top - $titleText.outerHeight() -6;
	cmp.titleLeft = cmp.left + (cmp.width - $titleText.outerWidth())/2;
	$el.find('.title .triangle').css({ marginLeft: $titleText.outerWidth()/2-6 })
}

})