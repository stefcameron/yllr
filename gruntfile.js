var _ = require('lodash');

module.exports = function(grunt) {
  'use strict';

  var processChangedScripts; // @type {Function}
  var changedScriptFileMap = {}; // @type {Object<String, String>}

  // metadata/task configuration
  grunt.initConfig({
    //
    // Data
    //

    pkg: grunt.file.readJSON('package.json'),

    banner:
        '/*!\n' +
        ' * <%= pkg.name %> <%= pkg.version %>\n' +
        ' * @license <%= pkg.licenses[0].type %>, <%= pkg.licenses[0].url %>\n' +
        ' */',

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
      },

      // @target lint specified added/changed files (dynamically-configured
      //  via 'watch' task)
      changed: {
        src: []
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
      },

      // @target lint specified added/changed files (dynamically-configured
      //  via 'watch' task)
      changed: {
        src: []
      }
    },

    // @task watch for changes and rebuild
    watch: {
      // @target
      dev: {
        options: {
          // keep the watch running under same context since we will dynamically
          //  modify the lint targets only check the added/modified files
          spawn: false
        },

        files: [
          'src/**/*.js',
          'test/**/*.js'
        ],

        tasks: [
          'jshint:changed',
          'jscs:changed'
        ]
      }
    },

    // @task clean files
    clean: {
      build: ['<%= dir.build %>'],
      dist: ['<%= dir.dist %>']
    },

    // @task concat/copy files
    concat: {
      // @target
      dist: {
        options: {
          banner: '<%= banner + "\\n" %>'
        },
        src: ['src/main.js'],
        dest: '<%= dir.dist %>/<%= pkg.name %>.js'
      }
    },

    // @task compress/minify library
    uglify: {
      // @target
      dist: {
        options: {
          banner: '<%= banner %>',
          preserveComments: false,
          sourceMap: true,
          sourceMapName: '<%= dir.dist %>/<%= pkg.name %>.min.js.map',
          // include original source in the map file so that the original
          //  source file doesn't also need to be shipped along side the
          //  map (keeps the map self-contained and gets around path issues
          //  when the browser attempts to load the map and resolve original
          //  file paths back to the original source files; since they're
          //  all contained within the map, these files don't need to
          //  exist anywhere)
          sourceMapIncludeSources: true
        },
        src: ['<%= dir.dist %>/<%= pkg.name %>.js'],
        dest: '<%= dir.dist %>/<%= pkg.name %>.min.js'
      }
    }
  });

  // load plugins that provides tasks from libraries we'll use
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
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
    'test',
    'concat:dist',
    'uglify:dist'
  ]);

  // default task
  grunt.registerTask('default', ['dist']);

  //
  // Register Events
  //

  // generate a function that always gets called after a 200ms delay so we
  //  don't start processing changed script files immediately if multiple
  //  files are being saved in batch
  processChangedScripts = _.debounce(function() {
    var file;
    var files = [];

    for (file in changedScriptFileMap) {
      if (changedScriptFileMap.hasOwnProperty(file)) {
        files.push(file);
      }
    }

    // update the source property of the lint targets to the changed
    //  files so that only they are linted
    grunt.config('jshint.changed.src', files);
    grunt.config('jscs.changed.src', files);

    changedScriptFileMap = {}; // reset
  }, 200);

  // called when a target within the 'watch' task notices a file change
  grunt.event.on('watch', function(action, filepath, targetName) {
    if (targetName === 'dev') {
      if (action === 'added' || action === 'changed') {
        changedScriptFileMap[filepath] = action;
        processChangedScripts();
      }
    }
  });
};
