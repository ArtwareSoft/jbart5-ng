jb.component('itemlist.table', {
    type: 'itemlist.style',
    impl: { $: 'customStyle',
        template: "<table>\n<thead>    \n  <tr>\n    <th *ngFor=\"let fld of fields\">{{fld.name}}</th>\n  </tr>\n</thead>\n<tbody>\n  <tr *ngFor=\"let item of items\">\n    <td *ngFor=\"let fld of fields\">{{item[fld]}}</td>\n  </tr>\n</tbody>\n</table>\n",
        css: "[jb-item].selected { background: #337AB7; color: #fff ;}\nli { list-style: none; padding: 0; margin: 0;}\n{ list-style: none; padding: 0; margin: 0;}\n ",
        features: { $: 'itemlist.init-table' }
    }
});
