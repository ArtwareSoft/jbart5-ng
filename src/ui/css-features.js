jbLoadModules(['jb-core','jb-ui']).then(loadedModules => { var jb = loadedModules['jb-core'].jb, jb_ui = loadedModules['jb-ui'];

jb.component('css', {
  type: 'feature,dialogFeature',
  params: [
    { id: 'css', essential: true, as: 'string' },
  ],
  impl: (context,css) => 
    ({css:css})
})

jb.component('css.width', {
  type: 'feature,dialogFeature',
  params: [
    { id: 'width', essential: true, as: 'number' },
    { id: 'overflow', as: 'string', options: ',auto,hidden,scroll'},
    { id: 'minMax', as: 'string', options: ',min,max'},
  ],
  impl: (context,width,overflow,minMax) => 
    ({css: `{ ${minMax ? minMax +'-':''}width: ${width}px ${overflow ? '; overflow-x:' + overflow + ';' : ''} }`})
})

jb.component('css.height', {
  type: 'feature,dialogFeature',
  params: [
    { id: 'height', essential: true, as: 'number' },
    { id: 'overflow', as: 'string', options: ',auto,hidden,scroll'},
    { id: 'minMax', as: 'string', options: ',min,max'},
  ],
  impl: (context,height,overflow,minMax) =>
    ({css: `{ ${minMax ? minMax +'-':''}height: ${height}px ${overflow ? '; overflow-y:' + overflow : ''} }`})
})

jb.component('css.padding', {
  type: 'feature,dialogFeature',
  params: [
    { id: 'top', as: 'number' },
    { id: 'left', as: 'number' },
    { id: 'right', as: 'number' },
    { id: 'bottom', as: 'number' },
    { id: 'selector', as: 'string' },
  ],
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
  params: [
    { id: 'top', as: 'number' },
    { id: 'left', as: 'number' },
    { id: 'right', as: 'number' },
    { id: 'bottom', as: 'number' },
    { id: 'selector', as: 'string' },
  ],
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
  params: [
    { id: 'blurRadius', as: 'number', defaultValue: 5 },
    { id: 'spreadRadius', as: 'number', defaultValue: 0 },
    { id: 'shadowColor', as: 'string', defaultValue: '#000000'},
    { id: 'opacity', as: 'number', min: 0, max: 1, defaultValue: 0.75, step: 0.01 },
    { id: 'horizontal', as: 'number', defaultValue: 10},
    { id: 'vertical', as: 'number', defaultValue: 10},
    { id: 'selector', as: 'string' },
  ],
  impl: (context,blurRadius,spreadRadius,shadowColor,opacity,horizontal,vertical,selector) => {
    var color = [parseInt(shadowColor.slice(1,3),16) || 0, parseInt(shadowColor.slice(3,5),16) || 0, parseInt(shadowColor.slice(5,7),16) || 0]
      .join(',');
    return ({css: `${selector} { box-shadow: ${horizontal}px ${vertical}px ${blurRadius}px ${spreadRadius}px rgba(${color},${opacity}) }`})
  }
})

jb.component('css.border', {
  type: 'feature,dialogFeature',
  params: [
    { id: 'width',as: 'number', defaultValue: 1},
    { id: 'side', as: 'string', options: 'top,left,bottom,right' },
    { id: 'style', as: 'string', options: 'solid,dotted,dashed,double,groove,ridge,inset,outset', defaultValue: 'solid'},
    { id: 'color', as: 'string', defaultValue: 'black' },
    { id: 'selector', as: 'string' },
  ],
  impl: (context,width,side,style,color,selector) => 
    ({css: `${selector} { border${side?'-'+side:''}: ${width}px ${style} ${color} }`})
})



})