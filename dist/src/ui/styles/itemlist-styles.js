System.register(['jb-core/jb'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var jb_1;
    return {
        setters:[
            function (jb_1_1) {
                jb_1 = jb_1_1;
            }],
        execute: function() {
            jb_1.jb.component('itemlist.ul-li', {
                type: 'itemlist.style',
                impl: { $: 'customStyle',
                    template: "<ul class=\"jb-itemlist\">\n  <li *ngFor=\"let item of items\" jb-item>\n      <jb_item [item]=\"item\"></jb_item>\n  </li>\n</ul>",
                    css: "[jb-item].selected { background: #337AB7; color: #fff ;}\n    li { list-style: none; padding: 0; margin: 0;}\n    { list-style: none; padding: 0; margin: 0;}\n    ",
                    features: { $: 'itemlist.itemlist-init' }
                }
            });
            jb_1.jb.component('itemlist.table', {
                type: 'itemlist.style',
                impl: { $: 'customStyle',
                    template: "<table>\n<thead>    \n  <tr>\n    <th *ngFor=\"let fld of fields\">{{fld.name}}</th>\n  </tr>\n</thead>\n<tbody>\n  <tr *ngFor=\"let item of items\">\n    <td *ngFor=\"let fld of fields\">{{item[fld]}}</td>\n  </tr>\n</tbody>\n</table>\n",
                    css: "[jb-item].selected { background: #337AB7; color: #fff ;}\nli { list-style: none; padding: 0; margin: 0;}\n{ list-style: none; padding: 0; margin: 0;}\n ",
                    features: { $: 'itemlist.init-table' }
                }
            });
        }
    }
});
