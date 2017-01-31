jbLoadModules(['jb-core']).then(function (loadedModules) {
    var jb = loadedModules['jb-core'].jb;
    jb.component('hello-world.itemlist', {
        type: 'control',
        impl: { $: 'group', title: 'itemlist' }
    });
});
