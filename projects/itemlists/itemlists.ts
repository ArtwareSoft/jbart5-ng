

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'obj-as-items' }, 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'editable-text', 
        databind :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'itemlist.obj-as-items', obj: '%$people[0]%' }, 
        controls: [
          {$: 'group', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'key', 
                databind: '%key%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'editable-text', 
                title: 'value', 
                databind: '%value%', 
                style :{$: 'editable-text.input' }
              }
            ]
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'editable-text', 
        databind :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'itemlist.obj-as-items', obj: '%$people[0]%' }, 
        controls: [
          {$: 'group', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'key', 
                databind: '%key%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'editable-text', 
                title: 'value', 
                databind: '%val%', 
                style :{$: 'editable-text.input' }
              }
            ]
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'editable-text', 
        databind :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'itemlist.obj-as-items', obj: '%$people[0]%' }, 
        controls: [
          {$: 'group', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'key', 
                databind: '%key%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'editable-text', 
                title: 'value', 
                databind: '%val%', 
                style :{$: 'editable-text.input' }
              }
            ]
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'editable-text', 
        databind :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})

jb.component('itemlists.obj-as-items', {
  type: 'control', 
  impl :{$: 'group', 
    title: 'obj-as-items', 
    controls: [
      {$: 'itemlist', 
        items :{$: 'itemlist.obj-as-items', obj: '%$people[0]%' }, 
        controls: [
          {$: 'group', 
            style :{$: 'layout.horizontal', spacing: 3 }, 
            controls: [
              {$: 'editable-text', 
                title: 'key', 
                databind: '%key%', 
                style :{$: 'editable-text.input' }
              }, 
              {$: 'editable-text', 
                title: 'value', 
                databind: '%val%', 
                style :{$: 'editable-text.input' }
              }
            ]
          }
        ], 
        style :{$: 'itemlist.ul-li' }, 
        watchItems: true, 
        itemVariable: 'item'
      }, 
      {$: 'editable-text', 
        databind :{$: 'stringify', value: '%$people[0]%', space: 2 }, 
        style :{$: 'editable-text.codemirror', 
          enableFullScreen: true, 
          debounceTime: 300
        }
      }
    ], 
    features :{$: 'group.itemlist-container' }
  }
})