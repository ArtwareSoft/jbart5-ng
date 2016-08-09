if (!window.jbPackaged) {
  if (window.parent.jbart1) {
    ['jQuery','$','jbart','System','SystemJS','CodeMirror','Reflect','dragula','history'].forEach(x=>
        window[x] = window.parent[x])
  } else {
    window.jbart = {comps: {}, classes: {}};
    window.jbart_widgets = {};
    [
      'bower_components/jquery/dist/jquery.js',
      'src/core/core.js',
      'src/core/data-binding.js',
      'src/core/utils.js',
      'src/core/components.js',
      'src/core/functions.js',

      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/codemirror/mode/xml/xml.js',
      'bower_components/codemirror/mode/javascript/javascript.js',
      'bower_components/codemirror/mode/css/css.js',
      'bower_components/codemirror/mode/htmlmixed/htmlmixed.js',
      'bower_components/codemirror/addon/hint/show-hint.js',
      'bower_components/codemirror/addon/hint/javascript-hint.js',
      'bower_components/codemirror/addon/hint/xml-hint.js',
      'bower_components/codemirror/addon/hint/html-hint.js',
      'bower_components/codemirror/addon/fold/foldgutter.js',
      'bower_components/codemirror/addon/selection/active-line.js',

      'node_modules/es6-shim/es6-shim.min.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',

      'bower_components/dragula.js/dist/dragula.js',
      'node_modules/history/umd/history.js'
    ].forEach(file =>
      {
        document.write('<script>jbart.currentFileName = "' + file + '";</script>');
        document.write('<script src="' + (window.jbDevBase || '/') + file + '"></script>');
      }
    );
  }

  [
      'bower_components/codemirror/mode/css/css.js',
      'bower_components/codemirror/lib/codemirror.css',
      'bower_components/codemirror/theme/solarized.css',
      'bower_components/dragula.js/dist/dragula.css',
      'css/font.css', // material fonts
      'css/ng2-styles.css'
  ].forEach( file =>
        document.write('<link rel="stylesheet" type="text/css" href="' + (window.jbDevBase || '/') + file + '" />')); 
}

function jb_loadEditableFile(file) {
  document.write('<script>jbart.currentFileName = "' + file + '";</script>');
  document.write('<script src="' + file + '"></script>');
}

jb_modules = 
[
'@angular/core', '@angular/common', '@angular/platform-browser-dynamic',
'jb-core',
'jb-ui',
'jb-ui/jb-ui-utils',
'jb-ui/jb-rx',
'jb-ui/styles',
'jb-ui/tree/tree',
'jb-ui/tree/json-tree',
'jb-ui/tree/tree-undo',
'jb-ui/dialog',
'jb-ui/label',
'jb-ui/field',
'jb-ui/text',
'jb-ui/editable-text',
'jb-ui/editable-boolean',
'jb-ui/editable-number',
'jb-ui/picklist',
'jb-ui/features',
'jb-ui/group',
'jb-ui/button',
'jb-ui/itemlist',
'jb-ui/ui-common',
'jb-ui/image',
'jb-ui/pulldown-menu',
'jb-ui/itemlog',
'jb-ui/tabs',
'jb-ui/slider',
'jb-ui/sidenav',
'jb-ui/divider',
'jb-ui/http',
'jb-ui/theme',

'jb-ui/styles/group-styles',
'jb-ui/styles/editable-boolean-styles',
'jb-ui/styles/property-sheet-styles',
'jb-ui/styles/layout-styles',
'jb-ui/styles/picklist-styles',
//'jb-ui/styles/itemlist-styles',

'jb-ui/md-styles/button-md',
'jb-ui/md-styles/dialog-md',
'jb-ui/md-styles/input-md',
'jb-ui/md-styles/editable-boolean-md',
'jb-ui/md-styles/tabs-md',
'jb-ui/md-styles/card-md',
'jb-ui/md-styles/sidenav-md',

'testing/ui-testers'
];

jb_studio_modules = ['model','main','menu','toolbar','tests','popups'
,'tree','properties','properties-menu','pick-dialog','save','probe','edit-source','new-control'
,'undo','styles','style-editor','data-browse','open-project','jb-editor','jb-editor-styles','suggestions']
  .map(x=>'studio/studio-' + x)

jb_system_config = {
      map: {
        'jb-core': '/dist/src/core',
        'jb-ui': '/dist/src/ui',
        'testing': '/dist/src/testing',
        projects: '/dist/projects',
        studio: '/dist/projects/studio',
//        'rxjs' : '/node_modules/rxjs',
        '@angular2-material': '/node_modules/@angular2-material',
        '@angular':  '/node_modules/@angular'
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
        'testing': {
          defaultExtension: 'js',
        },     
        '@angular2-material': {
          format: 'cjs',
          defaultExtension: 'js',
        },
//        'rxjs': { main: 'Rx.js', defaultExtension: 'js' },
        '@angular/core': { main: 'bundles/core.umd.js', defaultExtension: 'js' },
        '@angular/common': { main: 'bundles/common.umd.js', defaultExtension: 'js' },
        '@angular/http': { main: 'bundles/http.umd.js', defaultExtension: 'js' },
        '@angular/forms': { main: 'bundles/forms.umd.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'bundles/compiler.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'bundles/platform-browser.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'bundles/platform-browser-dynamic.umd.js', defaultExtension: 'js' },
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
          console.log(x,e);
          if (loaded == modules.length) resolve(loadedModules) 
        }
      )
    }));
}

function jbBootstrap(loadedModules) {
  var bootstrap = loadedModules['@angular/platform-browser-dynamic'].bootstrap;
  jb_entries(jbart.ng.modules|| []).map(e=>e[1]).forEach(m =>
    loadedModules['@angular/platform-browser-dynamic'].bootstrapModule(m)
  )

  bootstrap(loadedModules['jb-ui'].jBartWidget, jb_entries(jbart.ng.providers).map(e=>e[1]))
    .catch(err => console.error(err))
    .then(()=>
      jbart.afterBootsrtap = true);
}
