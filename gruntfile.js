module.exports = function(grunt) {
  'use strict';

  // metadata/task configuration
  grunt.initConfig({
    //
    // Data
    //

    pkg: grunt.file.readJSON('package.json'),

    dir: {
      build: 'build', // tmp build files
      dist: 'dist' // release directory
    },

    // {Array.<String>} all files to be linted (syntax and style)
    lintFiles: [
      'gruntfile.js',
      'src/**/*.js',
      'test/**/*.js'
    ],

    //
    // Tasks/Targets
    //

    // @task lint syntax
    jshint: {
      options: {
        jshintrc: true
      },

      // @target lint all solution-specific scripts (do NOT lint node_modules)
      all: {
        src: '<%= lintFiles %>'
      }
    },

    // @task lint style
    jscs: {
      options: {
        // reference global repository rules
        config: '.jscsrc'
        // project-specific overrides: none :)
      },

      // @target lint all solution-specific scripts (do NOT lint node_modules)
      all: {
        src: '<%= lintFiles %>'
      }
    },

    // @task clean files
    clean: {
      build: ['<%= dir.build %>'],
      dist: ['<%= dir.dist %>']
    }
  });

  // load plugins that provides tasks from libraries we'll use
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jscs');

  //
  // Register Tasks
  //

  grunt.registerTask('lint', 'lint all code', [
    'jshint:all',
    'jscs:all'
  ]);

  grunt.registerTask('test', 'lint, then run all tests', [
    'lint'
  ]);

  grunt.registerTask('dist', 'test, build the distribution', [
    'clean:build',
    'clean:dist',
    'test'
  ]);

  // default task
  grunt.registerTask('default', ['dist']);
};
