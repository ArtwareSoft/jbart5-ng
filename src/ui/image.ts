import {jb} from 'js/jb';
import * as jb_ui from 'ui/jb-ui';

jb.type('image.style');

jb.component('image',{
	type: 'control',
	params: {
		url: { as: 'string', dynamic:true },
		imageWidth: { as: 'number' },
		imageHeight: { as: 'number' },
		width: { as: 'number' },
		height: { as: 'number' },
		units: { as: 'string', defaultValue : 'px'},
		style: { type: 'image.style', dynamic: true, defaultValue: { $: 'image.default' } },
		features: { type: 'feature[]', dynamic: true }
	},
	impl: function(context) {
		return jb_ui.ctrl(context).jbExtend({ init: function(cmp) {
			var image = context.params;
			var units = image.units;
			if (image.width) cmp.width = image.width + units;
			if (image.height) cmp.height = image.height + units;
			if (image.imageWidth) cmp.imageWidth = image.imageWidth + units;
			if (image.imageHeight) cmp.imageHeight = image.imageHeight + units;
			cmp.url = image.url();
		}},context);
	}
})

jb.component('image.default', {
	type: 'image.style',
	impl: function() {
		return {
			template: `<div [style.width]="width" [style.height]="height">
			               <img [style.width]="imageWidth" [style.height]="imageHeight" src="{{url}}"/>
			           </div>`,
			cssClass: 'jb-image',
}}})

