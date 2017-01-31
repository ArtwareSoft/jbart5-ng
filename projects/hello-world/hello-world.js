jbLoadModules(['jb-core']).then(loadedModules => { var jb = loadedModules['jb-core'].jb;

jb.component('hello-world.itemlist', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'itemlist', 
    controls: [
      {$: 'itemlist', 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }
    ], 
    features :{$: 'var', name: 'selected' }
  }
})

})