//Initial setup for GruntFile.js
module.exports = function(grunt){
	//initialize our configuration object
	grunt.initConfig({
		//pkg is needed to access the node modules to be used
		pkg: grunt.file.readJSON('package.json'),
		//All the plugins to be used go here
		concat: {
			js: { //target
				src: ['./src/app.js', './src/js/*.js'],
				dest: './dist/app.js'
			}
		}
	});
	//Load the above npm tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	//Register the above tasks
	grunt.registerTask('default', ['concat']);
};