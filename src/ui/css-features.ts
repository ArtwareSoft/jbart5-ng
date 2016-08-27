import {jb} from 'jb-core';

jb.component('css', {
  type: 'feature,dialogFeature',
  params: {
    css: { essential: true, as: 'string' },
  },
  impl: (context,css) => 
    ({css:css})
})

jb.component('css.width', {
  type: 'feature,dialogFeature',
  params: {
    width: { essential: true, as: 'number' },
    overflow: { as: 'string', options: ',auto,hidden,scroll'},
    minMax: { as: 'string', options: ',min,max'},
  },
  impl: (context,width,overflow,minMax) => 
    ({css: `{ ${minMax ? minMax +'-':''}width: ${width}px ${overflow ? '; overflow-x:' + overflow + ';' : ''} }`})
})

jb.component('css.height', {
  type: 'feature,dialogFeature',
  params: {
    height: { essential: true, as: 'number' },
    overflow: { as: 'string', options: ',auto,hidden,scroll'},
    minMax: { as: 'string', options: ',min,max'},
  },
  impl: (context,height,overflow,minMax) =>
    ({css: `{ ${minMax ? minMax +'-':''}height: ${height}px ${overflow ? '; overflow-y:' + overflow : ''} }`})
})

jb.component('css.padding', {
  type: 'feature,dialogFeature',
  params: {
    top: { as: 'number' },
    left: { as: 'number' },
    right: { as: 'number' },
    bottom: { as: 'number' },
    selector: { as: 'string' },
  },
  impl: (ctx) => {
    var css = ['top','left','right','bottom']
      .filter(x=>ctx.params[x] != null)
      .map(x=> `padding-${x}: ${ctx.params[x]}px`)
      .join('; ');
    return {css: `${ctx.params.selector} {${css}}`};
  }
})

jb.component('css.margin', {
  type: 'feature,dialogFeature',
  params: {
    top: { as: 'number' },
    left: { as: 'number' },
    right: { as: 'number' },
    bottom: { as: 'number' },
    selector: { as: 'string' },
  },
  impl: (ctx) => {
    var css = ['top','left','right','bottom']
      .filter(x=>ctx.params[x] != null)
      .map(x=> `margin-${x}: ${ctx.params[x]}px`)
      .join('; ');
    return {css: `${ctx.params.selector} {${css}}`};
  }
})

jb.component('css.box-shadow', {
  type: 'feature,dialogFeature',
  params: {
    blurRadius: { as: 'number', defaultValue: 5 },
    spreadRadius: { as: 'number', defaultValue: 0 },
    shadowColor: { as: 'string', defaultValue: '#000000'},
    opacity: { as: 'number', min: 0, max: 1, defaultValue: 0.75, step: 0.01 },
    horizontal: { as: 'number', defaultValue: 10},
    vertical : { as: 'number', defaultValue: 10},
    selector: { as: 'string' },
  },
  impl: (context,blurRadius,spreadRadius,shadowColor,opacity,horizontal,vertical,selector) => {
    var color = [parseInt(shadowColor.slice(1,3),16) || 0, parseInt(shadowColor.slice(3,5),16) || 0, parseInt(shadowColor.slice(5,7),16) || 0]
      .join(',');
    return ({css: `${selector} { box-shadow: ${horizontal}px ${vertical}px ${blurRadius}px ${spreadRadius}px rgba(${color},${opacity}) }`})
  }
})

jb.component('css.border', {
  type: 'feature,dialogFeature',
  params: {
    width: {as: 'number', defaultValue: 1},
    side: { as: 'string', options: 'top,left,bottom,right' },
    style: { as: 'string', options: 'solid,dotted,dashed,double,groove,ridge,inset,outset', defaultValue: 'solid'},
    color: { as: 'string', defaultValue: 'black' },
    selector: { as: 'string' },
  },
  impl: (context,width,side,style,color,selector) => 
    ({css: `${selector} { border${side?'-'+side:''}: ${width}px ${style} ${color} }`})
})



