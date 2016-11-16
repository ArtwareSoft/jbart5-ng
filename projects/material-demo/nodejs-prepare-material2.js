fs = require('fs');

var libDir = 'c:/material2/src/lib';
var result = [];
fs.readdirSync(libDir).forEach(dir=> {
	try {
		result.push({ id: normalize(dir), content: '' + fs.readFileSync(libDir + '/' + dir + '/README.md')})
	} catch (e) {}
})

var content = `jb_resource('material-demo','readmes',${JSON.stringify(result,null,2)})`;
fs.writeFileSync('all-readmes.js',content);

var demoDir = '/material2/src/demo-app/';
result = [];
fs.readdirSync(demoDir).forEach(dir=> {
	try {
		result.push({ 
			id: normalize(dir), 
			css: '' + fs.readFileSync(demoDir + '/' + dir + '/' + dir+'-demo.css'),
			html: '' + fs.readFileSync(demoDir + '/' + dir + '/' + dir+'-demo.html')
		})
	} catch (e) {}
})

fs.writeFileSync('all-demos.js',`jb_resource('material-demo','demos',${JSON.stringify(result,null,2)})`);

function normalize(str) {
	return str.replace(/-(.)/,(st,st2) => st2.toUpperCase())
}