System.register(['js/jb', './studio-model'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1, studio;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            },
            function (studio_1) {
                studio = studio_1;
            }],
        execute: function() {
            jb_1.jb.component('studio.editSource', {
                type: 'action',
                impl: {
                    $: 'openDialog',
                    title: 'edit source - %$globals/profile_path%',
                    style: { $: 'dialog.studioFloating', id: 'edit source', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.currentProfileAsScript' },
                        style: { $: 'editable-text.codemirror', mode: 'javascript' },
                    }
                }
            });
            jb_1.jb.component('studio.showNgComponent', {
                type: 'action',
                impl: {
                    $: 'openDialog',
                    title: 'angular component - %$globals/profile_path%',
                    style: { $: 'dialog.studioFloating', id: 'angular component', width: 600 },
                    features: { $: 'css', css: '.jb-dialog-content-parent {overflow-y: hidden}' },
                    content: { $: 'editable-text',
                        databind: { $: 'studio.ngComponent' },
                        style: { $: 'editable-text.codemirror', mode1: 'javascript' },
                    }
                }
            });
            //   cm_settings: {
            //     extraKeys: {
            //         "Ctrl-Space": "autocomplete",
            //         "Ctrl-Enter": editor => updateJbartScriptFromCM(editor.getValue())
            //     }
            // }
            //			features:  { $onupdate: { $:'studio.markSourceAsDirty' } }
            jb_1.jb.component('studio.currentProfileAsScript', {
                type: 'data',
                params: {
                    path: { as: 'string', defaultValue: '%$globals/profile_path%' }
                },
                impl: function (context, path) {
                    var ref = studio.profileRefFromPath(path);
                    return {
                        $jb_val: function (value) {
                            if (typeof value == 'undefined')
                                return jb_1.jb.prettyPrint(jb_1.jb.val(ref));
                            else {
                                var newProf = studio.evalProfile(value);
                                if (newProf)
                                    studio.model.modify(studio.model.writeValue, path, { value: newProf }, context);
                            }
                        }
                    };
                }
            });
            jb_1.jb.component('studio.ngComponent', {
                type: 'data',
                params: {
                    path: { as: 'string', defaultValue: '{%$globals/project%}.{%$globals/page%}' }
                },
                impl: function (context, path) {
                    return { $jb_val: function () { return studio.ngComponent(path); } };
                }
            });
            jb_1.jb.component('dialog.studioFloating', {
                type: 'dialog.style',
                params: {
                    id: { as: 'string' },
                    width: { as: 'number', default: 300 },
                    height: { as: 'number', default: 100 },
                },
                impl: function (context, id, width, height) {
                    return {
                        template: "<div class=\"top\">\n\t\t\t\t\t\t\t  <h2 class=\"md-title dialog-title\">{{title}}</h2>\n\t\t\t\t\t\t\t  <button class=\"dialog-close\" (click)=\"dialogClose()\">&#215;</button>\n\t\t\t\t\t\t\t  <div class=\"jb-dialog-content-parent\">\n\t\t\t\t\t\t  \t \t<div #content></div>\n\t\t\t\t\t\t  \t  </div>\n\t\t\t\t\t\t</div>",
                        // template: `<div class="top">
                        // 		<div class="dialog-title">{{title}}</div>
                        // 		<button class="dialog-close" (click)="dialogClose()">&#215;</button>
                        // 		<div class="content">
                        // 			<div #content></div>
                        // 		</div>
                        // 	</div>`,
                        //			cssClass: 'studio-floating-dialog2',
                        features: [
                            { $: 'dialogFeature.dragTitle', id: id },
                            { $: 'dialogFeature.uniqueDialog', id: id, remeberLastLocation: true },
                            { $: 'dialogFeature.maxZIndexOnClick', minZIndex: 5000 },
                            { $: 'studio-dialogFeature.studioPopupLocation' },
                        ],
                        styles: [
                            (".top { position: fixed; \n\t\t\t\t\t\tbackground: #F9F9F9; \n\t\t\t\t\t\twidth: " + width + "px; \n\t\t\t\t\t\tmin-height: " + height + "px; \n\t\t\t\t\t\toverflow: auto;\n\t\t\t\t\t\tborder-radius: 4px; \n\t\t\t\t\t\tpadding: 0 12px 12px 12px; \n\t\t\t\t\t\tbox-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)\n\t\t\t\t}"),
                            //				`{ border-radius: 4px; padding: 0 12px 12px 12px; box-shadow: 0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 13px 19px 2px rgba(0, 0, 0, 0.14), 0px 5px 24px 4px rgba(0, 0, 0, 0.12)}`,
                            //				'.content { padding:3px }',
                            ".md-title { cursor: move; text-align: left; padding-right: 30px;}",
                            '.jb-dialog-content-parent { padding: 8px; overflow-y: scroll; max-height: 500px }',
                            // `.dialog-title1 {
                            // 	  cursor: move;
                            // 	  text-align: left;
                            // 	  background: #fff url('jbart.png') no-repeat 5px 9px;
                            // 	  font-weight: bold;
                            // 	  font-size: 15px;
                            // 	  padding: 7px 10px 7px 30px;
                            // 	  color: #6D6E71;
                            // 	  min-height: 12px;
                            // 	  border-bottom: 1px solid #BEBEBE; 					
                            // }`,
                            ".dialog-close {\n\t\t\t\t\t\tposition: absolute; \n\t\t\t\t\t\tcursor: pointer; \n\t\t\t\t\t\tright: 4px; top: 4px; \n\t\t\t\t\t\tfont: 21px sans-serif; \n\t\t\t\t\t\tborder: none; \n\t\t\t\t\t\tbackground: transparent; \n\t\t\t\t\t\tcolor: #000; \n\t\t\t\t\t\ttext-shadow: 0 1px 0 #fff; \n\t\t\t\t\t\tfont-weight: 700; \n\t\t\t\t\t\topacity: .2;\n\t\t\t\t}",
                            '.dialog-close:hover { opacity: .5 }'
                        ]
                    };
                }
            });
            jb_1.jb.component('studio-dialogFeature.studioPopupLocation', {
                type: 'dialogFeature',
                impl: function (context) {
                    var dialog = context.vars.$dialog;
                    jb_1.jb.bind(dialog, 'attach', function () {
                        if (sessionStorage[dialog.id])
                            return;
                        if (dialog.id == 'studio properties')
                            // dialog.$el.css('top','100px').css('left',(window.outerWidth-320)+'px');
                            dialog.$el.css('top', '110px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio control tree')
                            dialog.$el.css('top', '0px').css('right', '306px').css('left', 'initial');
                        // dialog.$el.css('top','100px').css('left',(window.outerWidth-320-310)+'px');
                        if (dialog.id == 'studio main window')
                            dialog.$el.css('top', '0px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio templates')
                            dialog.$el.css('top', '73px').css('right', '0px').css('left', 'initial');
                        if (dialog.id == 'studio template code')
                            dialog.$el.css('bottom', '0px').css('left', '0px').css('top', 'initial');
                        if (dialog.id == 'code-mirror')
                            dialog.$el.css('top', '0px').css('left', '0px');
                        dialog.$el.addClass('default-location');
                    });
                }
            });
        }
    }
});
//# sourceMappingURL=studio-popups.js.map