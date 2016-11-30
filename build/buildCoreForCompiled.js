var path = require("path");
var Builder = require('systemjs-builder');
var fs = require('fs');

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
    },
    map: {
        "@angular/core": "n:@angular/core",
    },
     packages: {
        "@angular/core": { defaultExtension: "js"},
    }
});
console.log('0');

var resultFile = 'dist/ngForCompiled.js';
builder.bundle(`@angular/core/src/linker/ng_module_factory 
    + @angular/core/src/di/injector 
    + @angular/core/src/linker/view
    + @angular/core/src/linker/component_factory
    + @angular/core/src/metadata/view`
, resultFile, options).then(x=>{
    console.log('1');
    var fixed = (''+fs.readFileSync(resultFile))
        .replace(/@angular/g,'_@angular')
        .replace(/n:_/g,'_')
        .replace(/.js"/g,'"');
    fs.writeFileSync(resultFile,fixed);
});


