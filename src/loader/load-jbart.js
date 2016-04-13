if (!window.jbPackaged) {

  window.jbart = {comps: {}, classes: {}};
  window.jbart_widgets = {};

  [
    'src/core/core.js',
    'src/core/data-binding.js',
    'src/core/utils.js',
    'src/core/components.js',
    'src/core/functions.js',

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

    "css/font.css", // material fonts

    "node_modules/history/umd/History.js"

  ].
  forEach(function(file) {
    if (file.substring(file.length-4) == '.css') {
      document.write('<link rel="stylesheet" type="text/css" href="' + (window.jbDevBase || '/') + file + '" />'); 
    } else {
      document.write('<script>jbart.currentFileName = "' + file + '";</script>');
      document.write('<script src="' + (window.jbDevBase || '/') + file + '"></script>');
    }
  });
}

function jb_loadEditableFile(file) {
  document.write('<script>jbart.currentFileName = "' + file + '";</script>');
  document.write('<script src="' + file + '"></script>');
}

jb_modules = 
[
'angular2/core','angular2/common', 'angular2/platform/browser',
'jb-core',
'jb-ui',
'jb-ui/jb-ui-utils',
'jb-ui/tests',
'jb-ui/jb-rx',
'jb-ui/styles',
'jb-ui/tree/tree',
'jb-ui/tree/json-tree',
'jb-ui/tree/tree-undo',
'jb-ui/dialog',
'jb-ui/label',
'jb-ui/text',
'jb-ui/editable-text',
'jb-ui/editable-boolean',
'jb-ui/editable-number',
'jb-ui/picklist',
'jb-ui/features',
'jb-ui/group',
'jb-ui/group-styles',
'jb-ui/md-layout',
'jb-ui/button',
'jb-ui/button-md-styles',
'jb-ui/itemlist',
'jb-ui/ui-common',
'jb-ui/image',
'jb-ui/pulldown-menu',
'jb-ui/itemlog',
'jb-ui/tab',
'jb-ui/slider',
];

jb_studio_modules = ['model','main','menu','toolbar','tests','popups','tree','properties','pick','save','probe']
  .map(x=>'studio/studio-' + x)

jb_system_config = {
      map: {
        'jb-core': '/dist/src/core',
        'jb-ui': '/dist/src/ui',
        projects: '/dist/projects',
        studio: '/dist/projects/studio',
        '@angular2-material': '/node_modules/@angular2-material',
      },
      packages: {  
        '/dist' : {
          defaultExtension: 'js',
        },     
        'jb-core': {
          defaultExtension: 'js',
          main: 'jb.js'
        },     
        'jb-ui': {
          defaultExtension: 'js',
          main: 'jb-ui.js'
        },     
        '@angular2-material': {
          format: 'cjs',
          defaultExtension: 'js',
        },
      }
}


function jbLoadModules(modules) { 
  System.config(jb_system_config);

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
