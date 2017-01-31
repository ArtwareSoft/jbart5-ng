import {jb} from 'jb-core';
import * as jb_ui from 'jb-ui';

jb.type('md-layout-child')
jb.type('md-layout-child-responsive')

var flexOptions = 'none,initial,auto,grow,nogrow,noshrink,0,1,1/2,1/3,2/3,1/4,3/4,1/5,2/5,3/5,4/5,1/10,3/10,7/10,9/10,1/20,3/20,7/20,9/20,11/20,13/20,17/20,19/20';
var offsetOptions = '0,1,1/2,1/3,2/3,1/4,3/4,1/5,2/5,3/5,4/5,1/10,3/10,7/10,9/10,1/20,3/20,7/20,9/20,11/20,13/20,17/20,19/20';
var responsiveSelectors = '<600,>600,600-960,>960,960-1280,>1280,1280-1920,>1920';

jb.component('layout.md',{
  type: 'group.style,md-layout',
  params: [
    { id: 'layout', as:'string', options: 'row,column' },
    { id: 'align', as:'string', options: 'start,center,end,space-around,space-between,' },
    { id: 'subAlign', as:'string', options: 'start,center,end,' },
    { id: 'margin', type: 'boolean' },
    { id: 'fill', type: 'boolean' },
    { id: 'padding', type: 'boolean' },
    { id: 'wrap', type: 'boolean' },
    { id: 'children', type: 'md-layout-child[]'},
    { id: 'responsive', type: 'md-layout-responsive-layout[]'},
  ],
  impl: function(context) { 
    var responsiveSelector = context.vars.responsiveSelector || '';
    var atts = {}
    if (context.params.layout) atts['layout'+responsiveSelector] = context.params.layout;
    ['margin','fill','padding','wrap'].forEach(p=>{
      if(context.params[p])
        atts['layout-' + p+ responsiveSelector] = context.params[p];
    })
    if (context.params.align)
      atts['layout-align'+responsiveSelector] = context.params.align + (context.params.subAlign ? (' ' + context.params.subAlign) : '' )

    context.params.responsive.forEach(responsive=>jb.extend(atts,responsive))

    return {
      init: function(cmp) { 
        cmp.initGroup();
        context.params.children.forEach((child,index)=>
          cmp.extendChild(index,{atts: child}))
      },
        template: `<div class="md-layout">
            <div *ngFor="let ctrl of ctrls"><div *jbComp="ctrl"></div></div>
          </div>`,
      atts: atts
    }
  }
})

jb.component('md-layout-child',{
  type: 'md-layout-child',
  params: [
    { id: 'flex', as:'string', options: flexOptions },
    { id: 'marginLeft', as: 'string', options: offsetOptions },
    { id: 'order', as: 'string' },
    { id: 'show', type: 'boolean' },
    { id: 'hide', type: 'boolean' },
    { id: 'responsive', type: 'md-layout-child-responsive-child[]', as: 'array'},
  ],
  impl: ctx => { 
    var responsiveSelector = ctx.vars.responsiveSelector || '';
    var atts = {};
    atts['flex'+responsiveSelector] = percentage_dictionary[ctx.params.flex] || ctx.params.flex || '';
    if (ctx.params.marginLeft && percentage_dictionary[ctx.params.marginLeft])
      atts['flex-offset'+responsiveSelector] = percentage_dictionary[ctx.params.marginLeft];
    if (ctx.params.order) atts['flex-order'+responsiveSelector] = ctx.params.order;
    if (ctx.params.show) atts['show'+responsiveSelector] = ctx.params.show;
    if (ctx.params.hide) atts['hide'+responsiveSelector] = ctx.params.hide;
    ctx.params.responsive.forEach(responsive=>jb.extend(atts,responsive))
    return atts;
  }
})

jb.component('md-layout-responsive-layout', {
  type: 'md-layout-responsive-layout',
  params: [
    { id: 'selector', as: 'string', options: responsiveSelectors, essential: true },
    { id: 'layout', type: 'md-layout', essential: true, dynamic: true}
  ],
  impl: ctx => 
    ctx.params.layout(ctx.setVars({responsiveSelector: '-' + responsive_dictionary[ctx.params.selector]}))
})

jb.component('md-layout-child-responsive-child', {
  type: 'md-layout-child-responsive-child',
  params: [
    { id: 'selector', as: 'string', options: responsiveSelectors, essential: true },
    { id: 'child', type: 'md-layout-child', essential: true, dynamic: true}
  ],
  impl: ctx =>
    ctx.params.child(ctx.setVars({responsiveSelector: '-' + responsive_dictionary[ctx.params.selector]}))
})


var responsive_dictionary = {
  '<600': 'xs',
  '>600': 'gt-xs',
  '600-960': 'sm',
  '>960': 'gt-sm',
  '960-1280': 'md',
  '>1280': 'gt-md',
  '1280-1920': 'lg',
  '>1920': 'gt-lg',
}

var percentage_dictionary = {
  '0': '0', '1': '100', '1/2': '50', '1/3': '33', '2/3': '63', '1/4': '25', '3/4': '75', '1/5': '20', '2/5': '40',
  '3/5': '60', '4/5': '80', '1/10': '10', '3/10': '30', '7/10': '70', '9/10': '90', '1/20': '5', '3/20': '15', '7/20': '35', '9/20': '45', '11/20': '55', '13/20': '65', '17/20': '85', '19/20': '95'
}


