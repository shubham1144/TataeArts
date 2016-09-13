//Initial setup for GruntFile.js
module.exports = function(grunt){
	//initialize our configuration object
	grunt.initConfig({
		//pkg is needed to access the node modules to be used
		pkg: grunt.file.readJSON('package.json'),
		//All the plugins to be used go here
        //Task for validating the js files
		jshint: {
			files: ['gruntfile.js', './src/app.js', './src/**/*.js'],
			options: {
				// Options here to override JSHint defaults
				globals: {
				jQuery: true,
				console: true,
				module: true,
				document: true
				}
			}
		},
		//Task for concatinating the js files
		concat: {
			js: { //target
				src: ['./src/app.js', './src/js/*.js'],
				dest: './dist/app.js'
			}
		},
		//Task to minify the files that are concatinated
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
				'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
				}
			}
		}
	});
	//Load the above npm tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//Register the above tasks
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};