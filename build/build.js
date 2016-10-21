require('vm').runInThisContext(fs.readFileSync('../src/loader/load-jbart.js'),'load-jbart.js');

var copy_files = {
  all: {
    src: [],
    dest: '../dist/',
  },
};

var ng_bundle_files = Object.getOwnPropertyNames(jb_system_config.packages)
	.filter(pkg=>pkg.indexOf('@angular') == 0)
	.map(pkg=>jb_system_config.packages[pkg].main)
	.filter(x=>x)
	.map(x=>'/node_modules/@angular/' + x)

copy_files.all.src = js_files_to_load
	.concat(css_files_to_load)
	.concat(ng_bundle_files)
	.filter(f=>
		f.indexOf('src') != 0);

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			jbartUi: {
				src: [
					'../src/**/*.js', 
					'../dist/src/ui'
				],
				dest: '../dist/jbart-ui.js'
			},
			ngMaterial: {
				src: [
					'../node_modules/@angular2-material/**/*.js', 
				],
				dest: '../dist/ng2-material.js'
			},
		},
		copy: copy_files
	});

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['concat','copy']);
}