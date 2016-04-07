import {jb} from 'jb-core/jb';;
import * as jb_ui from 'jb-ui';
import * as utils from 'jb-ui/jb-ui-utils';
import * as jb_rx from 'jb-ui/jb-rx';

jb.component('editable-number.slider', {
	type: 'editable-number.style',
	params: {
		width: { as: 'string', defaultValue: '200px' }
	},
	impl :{$:'customStyle',
		template: `<div class="jb-slider">
						<div class="slider_scale">
							<div class="slider_text"></div>
							<div class="slider_thumb"></div>
							<input class="slider_input">
						</div>
					</div>`,
		css: `{ height: 30px; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 12px; }
			.slider_scale { position:relative; float: left; background-color:#aaa; width: %$width%; 
			  height: 1px; border-radius: 3px; margin-top: 13px; margin-right: 6px; 
			  margin-bottom: 13px; margin-left: 6px; 
			  border-bottom: 1px solid #efefef; }
			.slider_thumb { cursor: pointer; position: absolute; color:black; 
			  background-color:#efefef; width: 6px; height: 13px; 
			  border-radius: 2px; border: 1px solid #adadad; 
			  box-shadow:  inset 0 0 3px 0px gray; top: -7px; left: 0px; }
			.slider_thumb:hover { background-color:#eee; border-color: #777; }
			.slider_scale:hover .aa_slider_text { color:black; }
			.slider_thumb:focus { background-color:#383838; }
			.slider_text { color:#aaa; font-size: 10px; margin-top: -12px; margin-right: 0px; margin-bottom: 0px; margin-left: -19px; }
			.slider_scale.empty_value { opacity: 0.5; transition: opacity, 0.5s; }
			.slider_text:hover { cursor: pointer; text-decoration:underline; }
			.slider_input { position:absolute; width: 98px; height: 20px; border-radius: 6px; 
			  padding-top: 4px; padding-right: 4px; padding-bottom: 4px; 
			  padding-left: 18px; margin-top: -13px; margin-left: 24px; 
			  border: 1px solid #D1D1D1; box-shadow:  2px 2px 6px 1px gray; 
			}
			.slider_thumb.aa_disabled { opacity: 0.5 }
			.slider_text.aa_disabled { opacity: 0.5 }
			.slider_scale.aa_disabled { opacity: 0.5 }

			.noselect {
			    -webkit-touch-callout: none;
			    -webkit-user-select: none;
			    -khtml-user-select: none;
			    -moz-user-select: none;
			    -ms-user-select: none;
			    user-select: none;
			}		
`,
		methods: {
			init: ctx => cmp =>
				cmp.slider = new Slider(ctx,cmp,$(cmp.elementRef.nativeElement)),
			afterViewInit: ctx => cmp => {
				cmp.slider.initSizes();
				cmp.slider.adjustScale();
				cmp.slider.setThumbPosition();
			}
		}
	}
})


class Slider {	
	 constructor(public ctx, public cmp, public $el) {
	 	this.field = ctx.vars.field;
		this.editableNumber = ctx.vars.editableNumber;
		this.scaleElement = $el.find('.slider_scale')[0];
		this.thumbElement = $el.find('.slider_thumb')[0];
		this.inputElement = $el.find('.slider_input')[0];
		this.textElement = $el.find('.slider_text')[0];

		this.thumbElement.tabIndex = 1;
		$(this.thumbElement).bind('mousedown', e => this.dragBegin(e) );
		$(this.thumbElement).bind('keydown', e => this.keyDown(e) ); 
		$(this.inputElement).bind('keydown', e => this.inputKeyDown(e)); 
		$(this.inputElement).bind('blur', e => this.setInputValue());
		$(this.inputElement).hide();
		$(this.textElement).bind('mousedown', e => this.mouseDown(e) );

		this.numericValue = this.editableNumber.numericPart(this.field.getValue());
		this.$el.addClass('noselect');

		this.valueChangeEm = new jb_rx.Subject();
		this.valueChangeEm.distinctUntilChanged()
			.debounceTime(100)
			.filter(x => 
				x != this.field.getValue())
			.subscribe(x=>{ 
				this.field.writeValue(x); jb_ui.apply(this.ctx)}
			)
	}
	setValue(val) {
		var fix1 = this.applyRangeAndResolution(val);
		this.numericValue = isNaN(fix1) ? '' : '' + fix1;
		var value_to_save = this.editableNumber.calcDataString(fix1,this.ctx);
		this.valueChangeEm.next(value_to_save);
		return this;
	}

	mouseDown(e) {
		$(this.inputElement).show().focus();
		return false;
	}
	// D&D events
	dragBegin(e) {           
		var self = this;
		//if (window.aa_incapture) return;
		this.initSizes(); 
		this.adjustScale(); 
		this.setThumbPosition();
		
		this.startDragTime = new Date().getTime();
		this.suspectClick = true;
		document.onmousemove = e => this.drag(e)
		document.onmouseup   = e => this.dragEnd(e)
		$(this.thumbElement).focus();
		this.drag(e);
		return false;
	}
	drag(e) {
		if (this.suspectClick) {
			if (new Date().getTime() - this.startDragTime < 100) return;
			this.suspectClick = false;
		}
		this.fromPixel = utils.absLeft(this.scaleElement);
		var pos = utils.mousePos(e);
		pos.x = Math.max(pos.x,this.fromPixel);
		pos.x = Math.min(pos.x,this.toPixel);
		var xPixels = pos.x - this.fromPixel;
		this.setValue(this.pixelToUnits(xPixels)).setThumbPosition();
	}
	dragEnd(e) {
		document.onmouseup = null;
		document.onmousemove = null;
		if (!this.suspectClick) {
			this.setValue(this.numericValue);
			this.adjustScale().setThumbPosition();
		}
		this.suspectClick = false;
		$(this.thumbElement).focus();
	}
	// keyboards events
	keyDown(e) {
		var editableNumber = this.editableNumber;
		var str = String.fromCharCode(e.keyCode);
		if (e.keyCode == 189) str = "-";
		if (str.match(/[\-0-9]/)) {
			$(this.inputElement).show().focus();
			return true;
		}
		if (e.keyCode == 46) { // delete
			this.setValue('');
			this.adjustScale(true).setThumbPosition();
		}
		if (str == '0') this.setValue('0');
		var val = parseFloat(this.numericValue);
		if (isNaN(val)) val = 0;
		if (e.keyCode == 37 || e.keyCode == 39) { // right/left
			if (e.keyCode == 39)
				val += editableNumber.step * (e.shiftKey ? 10 : 1);
			else
				val -= editableNumber.step * (e.shiftKey ? 10 : 1);
			this.setValue(val);
			utils.stop_prop(e);
		}
		this.setThumbPosition();
		return true;
	}
	setInputValue() {
		this.setValue(this.inputElement.value);
		this.adjustScale();
		this.setThumbPosition();
		$(this.inputElement).hide();
	}
	inputKeyDown(e) {
		if (e.keyCode == 13) // enter
			this.setInputValue();
		return true;
	}
	// scale, thumb and auto scaling
	initSizes() {
		var editableNumber = this.editableNumber;
		this.from = this.to = NaN;
		this.scaleWidth = $(this.scaleElement).width();
		this.fromPixel = utils.absLeft(this.scaleElement);
		this.toPixel = this.fromPixel + this.scaleWidth;
		this.center = Math.round(this.fromPixel+ this.scaleWidth/2);
		if (!isNaN(editableNumber.min)) this.from = editableNumber.min;
		if (!isNaN(editableNumber.max)) this.to = editableNumber.max;
		if (editableNumber.initialPixelsPerUnit) this.ratio = this.ratio || editableNumber.initialPixelsPerUnit;
		if (!this.ratio && !isNaN(this.from) && !isNaN(this.to))
			this.ratio = this.scaleWidth/(this.to - this.from);
		if (!this.ratio)
			this.ratio = 1/editableNumber.step;
		if (!isNaN(this.from) && !isNaN(this.to))
			this.range = this.to - this.from;
		else 
			this.range = this.scaleWidth / this.ratio; 

		if (this.from != null)
			this.offset = this.from * this.ratio;
		this.thumbWidth = Math.round($(this.thumbElement).outerWidth()/2);
	}
	applyRangeAndResolution(val) { // recalc val according to range and resulotion constraints
		var editableNumber = this.editableNumber;
		if (isNaN(val) || val === '') return NaN;
		if (!isNaN(editableNumber.min)) val = Math.max(val,editableNumber.min);
		if (!isNaN(editableNumber.max)) val = Math.min(val,editableNumber.max);
		val = Math.round(val/editableNumber.step)*editableNumber.step; 
		val = parseFloat(val.toFixed(3)+''.replace(/0+$/,''));
		return val;		
	}
	adjustScale() {
		var editableNumber = this.editableNumber;
		var val = parseFloat(this.numericValue);
		var distanceFromSide = Math.min(val - this.from, this.to - val) * this.ratio;
		if (distanceFromSide > 10) return this; // far from sides, no need to adjust
		if (isNaN(val)) val = this.applyRangeAndResolution(0) || 0;
		// put in the middle
		if (isNaN(editableNumber.min))
			this.from = this.applyRangeAndResolution(val - this.range/2);
		if (isNaN(editableNumber.max))
			this.to = this.applyRangeAndResolution(val + this.range/2);
		if (editableNumber.min == 0 && isNaN(editableNumber.max))
			this.to = Math.max(this.to,val+this.range);
		this.offset = this.from * this.ratio;
		if (!isNaN(this.from) && !isNaN(this.to))
			this.range = this.to - this.from;
		if (!isNaN(this.range))
			this.ratio = this.scaleWidth/this.range;
		return this;
	}
	pixelToUnits(x) { 
		return (x+this.offset)/this.ratio;
	}
	setThumbPosition() {
		var val = parseFloat(this.numericValue);
		if (isNaN(val)) val = this.applyRangeAndResolution(0) || 0;
		if (!this.ratio) return;
		if (val < this.from || val > this.to)
			return;
		if (this.numericValue == '') 
			$(this.scaleElement).addClass('empty_value'); 
		else 
			$(this.scaleElement).removeClass('empty_value'); 
		var xPixels = Math.round(val * this.ratio - this.offset);
		xPixels = Math.max(xPixels,0);
		xPixels = Math.min(xPixels,this.scaleWidth);
		$(this.thumbElement).css('left', xPixels- this.thumbWidth);
		$(this.textElement).text(this.editableNumber.calcDisplayString(parseFloat(this.numericValue),this.ctx));
	}
}




