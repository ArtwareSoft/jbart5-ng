require('vm').runInThisContext(require('fs').readFileSync('src/loader/load-jbart.js'),'load-jbart.js');

var target = '../ng2materialDemo/';

var copy_files = {
  js_css: {
    src: [],
    dest: target,
  },
  ng: {
    src: ['node_modules/@angular/**/bundles/*.js', 'node_modules/@angular2-material/**/*.js' ],
    dest: target,
  },
  jb_ts: {
    src: ['dist/src/**/*.js', 'dist/projects/material-demo/*.js', 'dist/projects/studio/*.js' ],
    dest: target,
  },
  jb_js: {
    src: ['src/core/*.js','src/loader/*.js', 'src/ui/**/*.js','projects/material-demo/**/*.js','projects/studio/**/*.css','src/**/*.css' ],
    dest: target,
  },
};

copy_files.js_css.src = js_files_to_load
	.concat(css_files_to_load)
	.filter(f=>
		f.indexOf('src') != 0)

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			// materialDemoHtml: {
			// 	src: [
			// 		'projects/material-demo/material-demo.html', 
			// 	],
			// 	dest: target + 'index.html'
			// },
		},
		copy: copy_files
	});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['copy']);
}