var path = require("path");
var Builder = require('systemjs-builder');

   var builder = new Builder('./');
var options = {
    normalize: true,
    runtime: false,
    sourceMaps: true,
    sourceMapContents: true,
    minify: false,
    mangle: false
};
builder.config({
    paths: {
        "n:*": "node_modules/*",
        "rxjs/*": "node_modules/rxjs/*.js",
    },
    map: {
        "rxjs": "n:rxjs",
    },
    packages: {
        "rxjs": {main: "Rx.js", defaultExtension: "js"},
    }
});

builder.bundle('rxjs', 'dist/Rx.js', options)

function x() {
// optional constructor options
// sets the baseURL and loads the configuration file
var builder = new Builder('.');
builder.config({
      map: {
	        'jb-ui': 'dist/src/ui',
			'rxjs': 'node_modules/rxjs',
            'jb-core': 'dist/src/core',
	  },
      packages: {  
        'rxjs': { defaultExtension: 'js' },
        'jb-core': { defaultExtension: 'js', main: 'jb.js' },     
        'jb-ui': { defaultExtension: 'js', main: 'jb-ui.js' },    
      } 
});

builder
//.bundle('rxjs/Observable','dist/rx4jb.umd.js')
.bundle('jb-ui/jb-rx - jb-core/jb - [jb-ui/jb-rx]','dist/rx4jb.umd.js')
.then(function() {
  console.log('Build complete');
})
.catch(function(err) {
  console.log('Build error');
  console.log(err);
});

}