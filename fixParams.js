fs = require('fs');

function walk(dir) {
    var list = fs.readdirSync(dir);
    var results = [dir];
    list.forEach( file => {
        var full_path = dir + '/' + file;
        var stat = fs.statSync(full_path);
        if (stat && stat.isDirectory()) 
          results = results.concat(walk(full_path))
        // else 
        //   results.push(full_path)
    })
    return results;
}      

function find(lines,exp) {
  for(var i=0;i<lines.length;i++)
    if (lines[i].match(exp)) {
      return i;
    }
  return -1;
}

function fixParams() {
    var dirs = walk('projects'); //['src/core','src/testing','src/ui'];
    console.log(dirs);
    dirs.forEach(projDir=>
          fs.readdirSync(projDir)
            .filter(x=>x.match(/\.js$/) || x.match(/\.ts$/))
            .forEach(srcFile=> {
                var srcPath = projDir+'/'+srcFile;
                console.log(srcPath);
                var source = ('' + fs.readFileSync(srcPath)).replace(/\r/g,'').split('\n');
                var index = 0; endIndex =0;
                while(index != -1) {
                  index = find(source.slice(endIndex+1),/^\s*params\s*:\s*{\s*$/);
                  if (index == -1)
                    break;
                  index += endIndex;

                  endIndex = find(source.slice(index),/^\s*}\s*,\s*$/);
                  if (endIndex == -1)
                    break;
                  endIndex += index;
                  for(var i=index+2;i<endIndex;i++) // title: { => { id: 'title', 
                    source[i] = source[i].replace(/(\s*)([^:]+):\s*\{/,"$1{ id: '$2',");
                  source[index+1] = source[index+1].replace(/{/,"[");
                  source[endIndex] = source[endIndex].replace(/}/,"]");
                }
                var newContent = source.join('\r\n');
//                console.log(newContent);
                fs.writeFileSync(srcPath,newContent);
            })
        )
}

fixParams()