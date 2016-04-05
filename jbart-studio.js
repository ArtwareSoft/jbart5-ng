fs = require('fs');
os = require('os');
http = require('http');
https = require('https');
child = require('child_process');
url = require('url');
pathNS = require("path");
ns_url = require('url');
ns_querystring = require('querystring');

op_get_handlers = {};
base_get_handlers = {};
op_post_handlers = {};
file_type_handlers = {};

_iswin = /^win/.test(process.platform);

http_dir = './';
port = 8081;
allowCmd = false;

for(var i=0;i<process.argv.length;i++) {
  var arg = process.argv[i];
  if (arg.indexOf('-port:') == 0)
    port = parseInt(arg.split(':')[1]);
  if (arg.indexOf('-allowCmd') == 0)
    allowCmd = true;
  if (arg.indexOf('-fiddler') == 0)
    fiddler = true;
}

// Http server
function serve(req, res) {
   try {
    var url_parts = req.url.split('#')[0].split('?');
    var path = url_parts[0].substring(1); //, query= url_parts[1] && url_parts[1].split('#')[0];
    console.log(req.url,path);
    var base = path.split('/')[0] || '';
    var file_type = path.split('.').pop();
    var op = getURLParam(req,'op');

    res.setHeader("Access-Control-Allow-Origin", "*");

    if (op && op_get_handlers[op] && req.method == 'GET') {
      return op_get_handlers[op](req,res,path);
    } else if (base_get_handlers[base] && path.indexOf('.html') == -1) {
      return base_get_handlers[base](req,res,path);
    } else if (op && op_post_handlers[op] && req.method == 'POST') {
      var body = '';
      req.on('data', function (data) {
        body += '' + data;
      });
      req.on('end', function () {
        return op_post_handlers[op](req, res,body,path);
      });
    } else if (file_type && file_type_handlers[file_type]) {
      return file_type_handlers[file_type](req,res,path);
    } else {
      endWithFailure(res,'no handler for the request ' + req.url);
    }
   } catch(e) {
      var st = e.stack || ''
  }
}
http.createServer(serve).listen(port); 
var httpsOptions = {
  key: fs.readFileSync('https/key.pem'),
  cert: fs.readFileSync('https/certificate.pem')
};
//https.createServer(httpsOptions, serve).listen(443);

console.log('Running jBart5 studio server on port ' + port);

// static file handlers
supported_ext =  ['js','gif','png','jpg','html','xml','css','xtml','txt','json','bmp','woff','jsx','prj','woff2','map','ico'];
for(i=0;i<supported_ext.length;i++)
  file_type_handlers[supported_ext[i]] = function(req, res,path) { serveFile(req,res,path); };

function serveFile(req,res,path) {
  var full_path = http_dir + path;
  if (path.match(/^dropbox\//))
    full_path = path.replace(/^dropbox\//,'c:\\dropbox\\public/');
  if (path.match(/^jbart\//))
    full_path = path.replace(/^jbart\//,'..\\');
  if (path.match(/^root/))
    full_path = path.replace(/^root\//,'..\\..\\');
  if (path.match(/^fonts/))
    full_path = path.replace(/^fonts\//,'..\\fonts\\');
  if (path.match(/^drive\/(.)/)) {
    var drive = path.match(/^drive\/(.)/)[1];
    full_path = path.replace(/^drive\/(.)/,drive);
  }
  var extension = path.split('.').pop();

  fs.readFile(_path(full_path), function (err, content) {
    if (err) {
      if (err.errno === 34)
        res.statusCode = 404;
      else
        res.statusCode = 500;
      return endWithFailure(res,'Can not read file ' + full_path + ' ' + err);
    } else {
      fs.stat(_path(full_path), function (err, stat) {
        if (err) {
          res.statusCode = 500;
          return endWithFailure(res,'file status code 500 ' + full_path + ' ' + err);
        } else {
          var etag = stat.size + '-' + Date.parse(stat.mtime);
          res.setHeader('Last-Modified', stat.mtime);

          if (extension == 'css') res.setHeader('Content-Type', 'text/css');
          if (extension == 'xml') res.setHeader('Content-Type', 'application/xml');
          if (extension == 'js') res.setHeader('Content-Type', 'application/javascript');
          if (extension == 'woff') res.setHeader('Content-Type', 'application/x-font-woff');
          if (extension == 'woff2') res.setHeader('Content-Type', 'application/x-font-woff2');

          if (req.headers['if-none-match'] === etag) {
            res.statusCode = 304;
            res.end();
          } else {
            res.setHeader('Content-Length', content.length);
            res.setHeader('ETag', etag);
            res.statusCode = 200;
            res.end(content);
          }
        }
      })
    }
  });     
}

extend(op_post_handlers, {   
    'saveComp': function(req, res,body,path) {
        var clientReq;
        try {
          clientReq = JSON.parse(body);
        } catch(e) {}
        if (!clientReq)
           return endWithFailure(res,'Can not parse json request');
        if (!clientReq.original) return endWithFailure(res,'missing original in request');
        if (!clientReq.toSave) return endWithFailure(res,'missing toSave in request');

        var project = getURLParam(req,'project');
        if (!project) return endWithFailure(res,'missing project param in url');
        var comp = getURLParam(req,'comp');
        if (!comp) return endWithFailure(res,'missing comp param in url');
        var projDirs = ['../projects/' + project];
        if (comp.indexOf('studio.') == 0)
          projDirs.push('../projects/studio');

        var comp_found = false;
        console.log(clientReq.original);
        projDirs.forEach(projDir=>
          fs.readdirSync(projDir)
            .filter(x=>x.match(/\.js$/) || x.match(/\.ts$/))
            .forEach(srcFile=> {
                var srcPath = projDir+'/'+srcFile;
                var source = ('' + fs.readFileSync(srcPath)).replace(/\r/g,'').split('\n');
                var toFind = clientReq.original.replace(/\r/g,'').split('\n');
                var replaceWith = clientReq.toSave.replace(/\r/g,'').split('\n');
                var found = indexOf(source,toFind);
                if (found != -1) {
                  comp_found = true;
                  console.log('splice',source,found,toFind.length,replaceWith);
                  source.splice.apply(source, [found, toFind.length].concat(replaceWith));
                  var newContent = source.join(_iswin ? '\r\n' : '\n');
                  fs.writeFileSync(srcPath,newContent);
                  endWithSuccess(res,'Comp saved to ' + srcPath + ' at index ' + found);
                }

                // var content = '' + fs.readFileSync(srcPath);
                // if (content.indexOf('\r\n') != -1)
                //   clientReq.original = clientReq.original.replace(/\n/g,'\r\n');
                // if (clientReq.toSave.indexOf('\r\n') != -1)
                //   clientReq.toSave = clientReq.toSave.replace(/\n/g,'\r\n');
                // if (content.indexOf('\r\n') != -1)
                //   content = content.replace(/\n/g,'\r\n');
                // // console.log('content',content.replace(/\r/g,'\\r').replace(/\n/g,'\\n\n'));
                // // console.log('original',clientReq.original.replace(/\r/g,'\\r').replace(/\n/g,'\\n\n'));
                // var found = content.indexOf(clientReq.original);
                // console.log(found);
                // if (found != -1) {
                //   comp_found = true;
                //   var newContent = content.substr(0,found) + clientReq.toSave + content.substr(found+clientReq.original.length+1);
                //   console.log(newContent);
                //   fs.writeFileSync(srcPath,newContent);
                //   endWithSuccess(res,'Comp saved to ' + srcPath + ' at index ' + found);
                // }
            })
          )

        if (!comp_found)
          endWithFailure(res,'Can not find comp in project')

        function indexOf(source,toFind) {
          var index = source.indexOf(toFind[0]);
          if (index != -1 && !compareArrays(source.slice(index,index+toFind.length),toFind))
            index = -1;
          return index;
        }
        function compareArrays(arr1,arr2) {
          console.log(arr1.join('#\n'));
          console.log('\n');
          console.log(arr2.join('#\n'));
          return arr1.join('\n') == arr2.join('\n')
        }
    },
    'saveFile': function(req, res,body,path) {
        var clientReq;
        try {
          clientReq = JSON.parse(body);
        } catch(e) {}
        if (!clientReq)
           return endWithFailure(res,'Can not parse json request');
        fs.writeFile(clientReq.Path || '', clientReq.Contents || '' , function (err) {
          if (err) 
            endWithFailure(res,'Can not write to file ' + clientReq.Path);
          else
            endWithSuccess(res,'File saved to ' + clientReq.Path);
        });
    }
});

extend(base_get_handlers, {   
  'ng-studio': function(req,res,path) {
      return file_type_handlers.html(req,res,'../ng-studio/ng-studio.html');
  },
  'project': function(req,res,path) {
      var project = req.url.split('/')[2];
      return file_type_handlers.html(req,res,`../projects/${project}/${project}.html`);
  }
});

extend(op_get_handlers, {   
    'runCmd': function(req,res,path) {
      if (!allowCmd) return endWithFailure(res,'no permission to run cmd. Use -allowCmd');

      var cmd = getURLParam(req,'cmd');
      if (!cmd) return endWithFailure(res,'missing cmd param in url');
      var cwd = getURLParam(req,'dir');
      if (!cwd) return endWithFailure(res,'missing dir param in url');
      cwd += '/';

      child.exec(cmd,cwd ? { cwd: cwd } : {},function (error, stdout, stderr) {
        if (error) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({type:'error', desc:'Can not run cmd', cmd: cmd, stdout: stdout, stderr: stderr, exitcode: error }));
        } else {
          var out = { 
            type: 'success',
            outfiles: {},
            stdout: stdout, stderr: stderr
          };
          (getURLParam(req,'outfiles') || '').split(',').forEach(function(outfile) { 
              var content = '';
              try { content = '' + fs.readFileSync(outfile); } catch(e) {}
              out.outfiles[outfile] = content;
          });          
          res.setHeader('Content-Type', 'application/json; charset=utf8');
          res.end(JSON.stringify(out));
        }
      });
    },
    'getFile': function(req,res,path) {
      var path = getURLParam(req,'path');
      var full_path = http_dir + path;
      fs.readFile(_path(full_path), function (err, content) {
        if (err) {
          if (err.errno === 34)
            res.statusCode = 404;
          else
            res.statusCode = 500;
          return endWithFailure(res,'Can not read file ' + full_path + ' ' + err);
        } else {
          res.setHeader('Content-Length', content.length);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/text;charset=utf8');
          res.end(content);
        }
      });     
    },
    'download': function(req,res,path) {
      res.writeHead(200, {'Content-Type': 'application/csv', 'Content-disposition': 'attachment; filename=' + path });
      var content = getURLParam(req,'data');
      res.end(content);
    },
    'projects': function(req,res,path) {
      var out = [];
      fs.readdirSync('../projects').forEach(function(widgetFile) {
        if (fs.lstatSync('../projects/'+widgetFile).isDirectory())
          out = out.concat(fs.readdirSync('../projects/'+widgetFile).filter(function(file) { return file.indexOf('.html') >= 0; }));
      });
      res.end(out.join(','));
    }
});


process.on('uncaughtException', function(err) {
 console.log(err);
});


// *************** utils ***********

function _path(path) { return path.replace(/[\\\/]/g,'/'); }

function getURLParam(req,name) {
  try {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(req.url)||[,""])[1].replace(/\+/g, '%20'))||null;
  } catch(e) {}
}

function endWithFailure(res,desc) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({type:'error', desc:desc }));
  console.log(desc);
}
function endWithSuccess(res, message) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({type:'success', message: message}));
}

function extend(object,ext) {
  for(i in ext)
    if (ext.hasOwnProperty(i))
      object[i] = ext[i];
}

function now() {
  var t = new Date();
  return pad(date.getDate()) + '/' + pad(date.getMonth()+1) + '/' + date.getFullYear() + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds())
}
function pad(i) { return i<10?'0'+i:i; }
