var js_files_to_load = [
      'bower_components/jquery/dist/jquery.js',
      'src/core/core.js',
      'src/core/data-binding.js',
      'src/core/utils.js',
      'src/core/pretty-print.js',
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

      'bower_components/showdown/dist/showdown.min.js',

      'node_modules/core-js/client/shim.min.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/systemjs/dist/system.src.js',
//      'node_modules/rxjs/bundles/Rx.js',
      'dist/Rx.js',

      'bower_components/dragula.js/dist/dragula.js',
      'node_modules/history/umd/history.js',
];
var css_files_to_load = [
    'bower_components/codemirror/mode/css/css.js',
    'bower_components/codemirror/lib/codemirror.css',
    'bower_components/codemirror/theme/solarized.css',
    'bower_components/dragula.js/dist/dragula.css',
    'css/font.css', // material fonts
    'css/ng2-styles.css'
];

if (typeof window != 'undefined' && !window.jbPackaged) {
  if (window.parent.jbart1) {
    ['jQuery','$','jbart','System','SystemJS','CodeMirror','Reflect','dragula','history'].forEach(x=>
        window[x] = window.parent[x])
  } else {
    window.jbart = {comps: {}, classes: {}};
    window.jbart_widgets = {};
    js_files_to_load.forEach(file =>
      {
        document.write('<script>jbart.currentFileName = "' + file + '";<' + '/script>');
        document.write('<script src="' + (window.jbLoaderRelativePath ? '' : '/') + file + '"></script>');
      }
    );
  }

  css_files_to_load.forEach( file =>
        document.write('<link rel="stylesheet" type="text/css" href="' + (window.jbLoaderRelativePath ? '' : '/') + file + '" />')); 
}

function jb_loadEditableFile(file) {
  document.write('<script>jbart.currentFileName = "' + file + '";</script>');
  document.write('<script src="' + file + '"></script>');
}

jb_modules = 
[
//'rxjs/Subject',
'@angular/core', '@angular/common', '@angular/platform-browser-dynamic',
'jb-core',
'jb-ui',
'ui-ts/jb-ui-utils',
'ui-ts/jb-rx',
'ui-ts/http',
'ui-ts/editable-number',
'ui-ts/tree/tree',
'ui-ts/tree/json-tree',
'ui-ts/slider',

'ui/styles.js',
'ui/dialog.js',
'ui/label.js',
'ui/field.js',
'ui/text.js',
'ui/editable-text.js',
'ui/editable-boolean.js',
'ui/picklist.js',
'ui/features.js',
'ui/css-features.js',
'ui/group.js',
'ui/button.js',
'ui/itemlist.js',
'ui/itemlist-with-groups.js',
'ui/ui-common.js',
'ui/image.js',
'ui/pulldown-menu.js',
'ui/itemlog.js',
'ui/tabs.js',
'ui/sidenav.js',
'ui/divider.js',
'ui/theme.js',
'ui/markdown.js',

'ui-ts/styles/group-styles',
'ui-ts/styles/editable-boolean-styles',
'ui-ts/styles/property-sheet-styles',
'ui-ts/styles/layout-styles',
'ui-ts/styles/picklist-styles',
'ui-ts/styles/codemirror-styles',
//'ui-ts/styles/itemlist-styles',

'ui-ts/md-styles/button-md',
'ui-ts/md-styles/dialog-md',
'ui-ts/md-styles/input-md',
'ui-ts/md-styles/editable-boolean-md',
'ui-ts/md-styles/tabs-md',
'ui-ts/md-styles/card-md',
'ui-ts/md-styles/sidenav-md',

'testing/ui-testers',
'testing/ui-testers-ctrls',
];

jb_studio_modules = ['tgp-model','model-components','path','utils','main','menu','toolbar','tests','popups'
,'tree','properties','properties-menu','pick-dialog','save','probe','edit-source','new-control','testers'
,'undo','styles','style-editor','data-browse','open-project','jb-editor','jb-editor-styles','suggestions','context-viewer']
  .map(x=>'studio/studio-' + x)

jb_system_config = {
      map: {
        'jb-core': '/dist/src/core',
        'ui': '/src/ui',
        'ui-ts': '/dist/src/ui',
        'jb-ui': '/dist/src/ui',
        'testing': '/dist/src/testing',
        projects: '/dist/projects',
        studio: '/dist/projects/studio',
//        'rxjs': '/node_modules/rxjs',
//        'hammerjs' : '/node_modules/hammerjs',
        '@angular2-material': '/node_modules/@angular2-material',
        '@angular':  '/node_modules/@angular'
      },
      packages: {  
        'dist' : {
          defaultExtension: 'js',
        },     
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
//        'rxjs': { main1: '/dist/rx4jbart.umd.js', defaultExtension: 'js' },
        '@angular/core': { main: 'bundles/core.umd.js', defaultExtension: 'js' },
        '@angular/common': { main: 'bundles/common.umd.js', defaultExtension: 'js' },
        '@angular/http': { main: 'bundles/http.umd.js', defaultExtension: 'js' },
        '@angular/forms': { main: 'bundles/forms.umd.js', defaultExtension: 'js' },
        '@angular/compiler': { main: 'bundles/compiler.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser': { main: 'bundles/platform-browser.umd.js', defaultExtension: 'js' },
        '@angular/platform-browser-dynamic': { main: 'bundles/platform-browser-dynamic.umd.js', defaultExtension: 'js' },
        '@angular/material': { main: 'material.umd.js', defaultExtension: 'js' },
      }
}

function jbLoadModules(modules) { 
  System.config(jb_system_config);

  var loaded = 0, loadedModules= {};

  return new Promise(resolve=>
    modules.map(x=>{
      System.import(x).then(
        (res)=>{
          //console.log(x+ ' loaded successfuly');
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
  var platform = loadedModules['@angular/platform-browser-dynamic'].platformBrowserDynamic();
  var jbartModule = loadedModules['jb-ui'].jBartWidgetModule;
  platform.bootstrapModule(jbartModule)
    .catch(err => console.error(err))
  // jb_entries(jbart.ng.modules|| []).map(e=>e[1]).forEach(m =>
  //   loadedModules['@angular/platform-browser-dynamic'].bootstrapModule(m)
  // )

  // bootstrap(loadedModules['jb-ui'].jBartWidget, jb_entries(jbart.ng.providers).map(e=>e[1]))
  //   .catch(err => console.error(err))
    // .then(()=>
    //   jbart.afterBootsrtap = true);
}

// for tests

if (typeof jbart != 'undefined')
  jbart.testProjects = ['ui-tests','studio-helper','data-tests'];

// guess the modules used by a project by parsing the html file
function jbProjectModules(project) {
  return $.get('/projects/'+project+'/'+project+'.html').then(function(html){
    return (html.split('jbLoadModules(')[1] || '')
      .split('[')[1]
      .split(']')[0]
      .replace(/'|"/g,'')
      .replace(/\s/g,'')
      .split(',')
  })
}

function jbProjectsModules(projects) {
  return projects.reduce((def,project)=>
      def.then(modules=>
        jbProjectModules(project).then(more_modules=>
          modules.concat(more_modules))), 
      Promise.resolve([]) )
}

