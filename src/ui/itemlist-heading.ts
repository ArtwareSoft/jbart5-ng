import {jb} from 'jb-core/jb';;
import * as jb_rx from 'jb-ui/jb-rx';
import * as jb_ui from 'jb-ui';

jb.type('itemlist.heading','inject headings to itemlist');
jb.type('itemlist-heading.style');

jb.component('itemlist-heading', {
    type: "control",
    params: {
        title: { essential: true, dynamic: true, defaultValue: '%title%' },
        style: { type: 'itemlist-heading.style', defaultValue: { $: 'itemlist-heading.h1' }, dynamic: true },
        features: { type: 'feature[]', dynamic: true },
    },
    impl: ctx => 
      jb_ui.ctrl(ctx).jbExtend({
      beforeInit: cmp =>
        cmp.title = ctx.params.title()
    })
})

jb.component('itemlist-heading.h1', {
    type: 'itemlist-heading.style',
    impl :{$: 'customStyle', 
        template: '<h1>{{title}}</h1>',
    }
})

jb.component('itemlist.heading', {
  type: 'feature',
  params: {
    heading: { type: 'itemlist-heading', essential: true, dynamic: true },
  },
  impl: (ctx,heading) => ({
      beforeInit: function(cmp) {
        cmp.calc_heading = items =>
          heading(ctx.setData(items))
      },
    })
})

jb.component('itemlist-headings.group-by', {
  type: 'itemlist-headings',
  params: {
    itemToGroupID: { dynamic: true, defaultValue: { $: 'prefix', separator: '.', text: '%id%' } },
    promoteGroups: { type: 'data[]', as: 'array' },
  },
  impl: (ctx,itemToGroupID,promoteGroups) => {
      var items = ctx.data.map(item=>({ item: item, groupId: itemToGroupID(ctx.setData(item)) }));
      var groups = {};
      items.forEach(item=>{
        groups[item.groupId] = groups[item.groupId] || [];
        groups[item.groupId].push(item.item);
      })
      var groups_ar = jb.entries(groups).map(x=>x[0]);
      groups_ar.sort(); // lexical sort before to ensure constant order
      groups_ar.sort((x1,x2) => promoteGroups.indexOf(x1) - promoteGroups.indexOf(x2));

      var result = [].concat.apply([],groups_ar.map(group => 
        [{ title: group, heading: true }].concat(groups[group]) ));
      return result;
    }
})


