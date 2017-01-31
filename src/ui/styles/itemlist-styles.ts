import {jb} from 'jb-core/jb';


// jb.component('itemlist.ul-li', {
//   type: 'itemlist.style',
//   impl :{$: 'customStyle',
//     template: `<ul class="jb-itemlist">
//   <li *ngFor="let item of items" jb-item>
//       <jb_item [item]="item"></jb_item>
//   </li>
// </ul>`,
//     css: `[jb-item].selected { background: #337AB7; color: #fff ;}
//     li { list-style: none; padding: 0; margin: 0;}
//     { list-style: none; padding: 0; margin: 0;}
//     `,
//     features :{$: 'itemlist.itemlist-init' }
//   }
// })

jb.component('itemlist.table', {
  type: 'itemlist.style',
  impl :{$: 'customStyle',
    template: `<table>
<thead>    
  <tr>
    <th *ngFor="let fld of fields">{{fld.name}}</th>
  </tr>
</thead>
<tbody>
  <tr *ngFor="let item of items">
    <td *ngFor="let fld of fields">{{item[fld]}}</td>
  </tr>
</tbody>
</table>
`,
    css: `[jb-item].selected { background: #337AB7; color: #fff ;}
li { list-style: none; padding: 0; margin: 0;}
{ list-style: none; padding: 0; margin: 0;}
 `,
    features :{$: 'itemlist.init-table' }
  }
})

