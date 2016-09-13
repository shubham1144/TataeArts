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
		//Task for concatinating the js files(Currently not used as annotate concantinates aswell)
		concat: {
			js: { //target
				src: ['./src/app.js', './src/js/*.js'],
				dest: './dist/min-safe/<%= pkg.name %>.js'
			}
		},
		//Task for concatinating annoting the code to avoid issues once minified
		ngAnnotate: {
			options: {
				singleQuotes: true
			},
			app: {
				files: {
				'./dist/min-safe/<%= pkg.name %>.js': ['./src/app.js', './src/js/*.js']
				}
			}
		},
		//Task to minify the files that are concatinated and annoted
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
				singleQuotes: true
			},
			dist: {
				files: {
				'./dist/<%= pkg.name %>.min.js': ['./dist/min-safe/<%= pkg.name %>.js']
				}
			}
		}
	});
	//Load the above npm tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	//grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//Register the above tasks
	grunt.registerTask('default', ['jshint', 'ngAnnotate', 'uglify']);
};