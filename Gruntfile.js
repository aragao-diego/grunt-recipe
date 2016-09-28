module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: appConfig,

        express: {
            all: {
                options: {
                    port: 9011,
                    hostname: "0.0.0.0",
                    bases: ['./app/'],
                    livereload: true
                }
            },
            dist: {
                options: {
                    port: 9011,
                    hostname: "0.0.0.0",
                    bases: ['./dist/']
                }
            }
        },
        watch: {
            all: {
                files: ['**/*.js, **/*.html'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: '**/*.scss',
                tasks: ['sass:dev'],
                options: {
                    livereload: true,
                },
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [ '**']
                }]
            }
        },

        clean: {
            dist: ['<%= yeoman.dist %>']
        },

        open: {
            all: {
                path: 'http://localhost:<%= express.all.options.port %>'
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },

        protractor: {
            options: {
                noColor: false,
                args: { }
            },
            e2e: {
                options: {
                    configFile: "e2e/protractor.conf.js",
                    // Stops Grunt process if a test fails
                    keepAlive: false
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['modules/**/*.html', '*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        uglify: {
            dist: {
                options:{
                    compress: {
                        booleans: false
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['modules/**/*.js', '*.js'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        processhtml: {
            options: {
                process: true
            },
            dist: {
                files: {
                    'dist/index.html': ['dist/index.html']
                }
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: 'assets/**/*.css',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'app/assets',
                    src: ['*.scss'],
                    dest: 'app/assets',
                    ext: '.css'
                }]
            }
        },

        ngAnnotate: {
            options: {

            },
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [ 'modules/**/*.js', '*.js']
                }]
            },
        },

        bower_concat: {
            dist: {
                dest: {
                    'js': '<%= yeoman.dist %>/assets/vendor.js',
                    'css': '<%= yeoman.dist %>/assets/vendor.css'
                },
                exclude: [
                ],
                dependencies: {

                },
                bowerOptions: {
                    relative: false
                }
            }
        }

    });


    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });
    // Creates the `server` task
    grunt.registerTask('serve', [
        'express:all',
        'open',
        'watch',
        'watch:css'
    ]);
    grunt.registerTask('serve-dist',[
        'build',
        'express:dist',
        'open'
    ]);

    grunt.registerTask('serve-test', [
        'express:test',
        'open'
    ]);

    grunt.registerTask('build',[
        'clean:dist',
        'copy:dist',
        'ngAnnotate:dist',
        'uglify:dist',
        'processhtml:dist',
        'bower_concat:dist',
        'htmlmin',
        'cssmin'
    ]);

    grunt.registerTask('default', [
        'build',
        'test'
        //'e2e'
    ]);


    grunt.registerTask('test', [
        //'clean:server',
        //'concurrent:test',
        //'autoprefixer',
        //'connect:test',
        'karma'
    ]);

    grunt.registerTask('e2e', [
        'protractor:e2e'
    ]);

};
