jb.component('studio.main-menu', {
  type: 'menu.option', 
  impl :{$: 'menu.menu', 
    title: 'main', 
    options: [
      {$: 'menu.menu', 
        title: 'File', 
        options: [
          {$: 'menu.action', 
            title: 'New Project', 
            action :{$: 'studio.save-components' }, 
            icon: 'new'
          }, 
          {$: 'menu.action', 
            title: 'Open Project ...', 
            action :{$: 'studio.open-project' }
          }, 
          {$: 'menu.action', 
            title: 'Save', 
            action :{$: 'studio.save-components' }, 
            icon: 'save', 
            shortcut: 'Ctrl+S'
          }, 
          {$: 'menu.action', 
            title: 'Force Save', 
            action :{$: 'studio.save-components', force: true }, 
            icon: 'save'
          }, 
          {$: 'menu.action', 
            title: 'Source ...', 
            action :{$: 'studio.open-source-dialog' }
          }
        ]
      }, 
      {$: 'menu.menu', 
        title: 'View', 
        options: [
          {$: 'menu.action', 
            title: 'Refresh Preview', 
            action :{$: 'studio.refresh-preview' }
          }, 
          {$: 'menu.action', 
            title: 'Redraw Studio', 
            action :{$: 'studio.redraw-studio' }
          }, 
          {$: 'menu.action', 
            title: 'Edit source', 
            action :{$: 'studio.editSource' }
          }, 
          {$: 'menu.action', 
            title: 'Outline', 
            action :{$: 'studio.open-control-tree' }
          }, 
          {$: 'menu.action', 
            title: 'jbEditor', 
            action :{$: 'studio.openjbEditor' }
          }
        ]
      }, 
      {$: 'studio.insert-control-menu' }, 
      {$: 'studio.data-resource-menu' }
    ], 
    style :{$: 'menu.pulldown' }, 
    features :{$: 'css.margin', top: '3' }
  }
})
