if (!window.jbPackaged) {

  window.jbart = {comps: {}, classes: {}};
  window.jbart_widgets = {};

  [
    'js/core.js',
    'js/ng-data-binding.js',
    'js/utils.js',
    'js/components.js',
    'js/functions.js',

     // code mirror
    "bower_components/codemirror/lib/codemirror.js",
    "bower_components/codemirror/mode/xml/xml.js",
    "bower_components/codemirror/mode/javascript/javascript.js",
    "bower_components/codemirror/mode/css/css.js",
    "bower_components/codemirror/mode/htmlmixed/htmlmixed.js",
    "bower_components/codemirror/addon/hint/show-hint.js",
    "bower_components/codemirror/addon/hint/javascript-hint.js",
    "bower_components/codemirror/addon/hint/xml-hint.js",
    "bower_components/codemirror/addon/hint/html-hint.js",
    "bower_components/codemirror/addon/fold/foldgutter.js",
    "bower_components/codemirror/addon/selection/active-line.js",
    "bower_components/codemirror/lib/codemirror.css",
    "bower_components/codemirror/theme/solarized.css",

    "bower_components/dragula.js/dist/dragula.js",
    "bower_components/dragula.js/dist/dragula.css",

    "node_modules/history/umd/History.js"

  ].
  forEach(function(file) {
    if (file.substring(file.length-4) == '.css') {
      document.write('<link rel="stylesheet" type="text/css" href="' + (window.jbDevBase || '/jbart/') + file + '" />'); 
    } else {
      document.write('<script>jbart.currentFileName = "' + file + '";</script>');
      document.write('<script src="' + (window.jbDevBase || '/jbart/') + file + '"></script>');
    }
  });
}

function jb_loadEditableFile(file) {
  document.write('<script>jbart.currentFileName = "' + file + '";</script>');
  document.write('<script src="' + file + '"></script>');
}

jb_modules = 
['js/jb','angular2/core','angular2/common', '/jbart/node_modules/angular2/platform/browser',
 '/jbart/node_modules/ng2-material/dist/ng2-material',
'ui/jb-ui',
'ui/jb-ui-utils',
'ui/tests',
'ui/jb-rx',
'ui/styles',
'ui/tree/tree',
'ui/tree/json-tree',
'ui/tree/tree-undo',
'ui/dialog',
'ui/label',
'ui/text',
'ui/editable-text',
'ui/editable-boolean',
'ui/picklist',
'ui/features',
'ui/group',
'ui/group-styles',
'ui/md-layout',
'ui/button',
'ui/itemlist',
'ui/ui-common',
'ui/image',
'ui/pulldown-menu',
'ui/itemlog',
'ui/tab',
];

jb_studio_modules = ['model','main','menu','toolbar','tests','popups','tree','properties','pick','save','probe']
  .map(x=>'studio/studio-' + x)

function loadJbModules(modules) { 
  var loaded = 0, loadedModules= {};
  return new Promise(resolve=>
    modules.map(x=>{
      System.import(x).then(
        (res)=>{
          loadedModules[x] = res;
          loaded++;
          if (loaded == modules.length) resolve(loadedModules) 
        },
        (e)=>{
          loaded++;
          console.log(e);
          if (loaded == modules.length) resolve(loadedModules) 
        }
      )
    }));
}
