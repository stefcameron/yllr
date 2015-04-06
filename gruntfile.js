var _ = require('lodash');

module.exports = function(grunt) {
  'use strict';

  var processChangedScripts; // @type {Function}
  var changedScriptFileMap = {}; // @type {Object<String, String>}

  // force line endings to LF on all operating systems (otherwise, defaults to
  //  CRLF on Windows)
  grunt.util.linefeed = '\n';

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

    docsBanner:
        '# API Documentation\n' +
        'Version <%= pkg.version %>\n',

    docsFile: '<%= pkg.name %>-docs.md',

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

    // @task karma
    karma: {
      // @target unit test with global deployment
      global: {
        configFile: 'test/karma-conf-unit.js'
      },

      // @target unit test with AMD deployment
      amd: {
        configFile: 'test/karma-conf-unit.js',
        // config file overrides
        options: {
          exclude: [
            'test/support/cjs/**/*.js',
            'test/unit/**/*Cjs*.js',
            'test/unit/**/*Global*.js'
          ],
          coverageReporter: {
            type: 'html',
            dir: 'coverage_reports/amd'
          }
        }
      },

      // @target unit test with CommonJS deployment
      cjs: {
        configFile: 'test/karma-conf-unit.js',
        // config file overrides
        options: {
          exclude: [
            'node_modules/almond/almond.js',
            'test/unit/**/*Amd*.js',
            'test/unit/**/*Global*.js'
          ],
          coverageReporter: {
            type: 'html',
            dir: 'coverage_reports/cjs'
          }
        }
      },

      // @target run all unit tests without code coverage and browsers (for
      //  debugging tests since code coverage mangles the source), waiting
      //  for browser connections rather than performing just a 'single run'
      debug: {
        configFile: 'test/karma-conf-unit.js',
        // config file overrides
        options: {
          singleRun: false,
          browsers: [],
          reporters: ['progress']
        }
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
          'src/**/*.jsdoc',
          'test/**/*.js'
        ],

        tasks: [
          'jshint:changed',
          'jscs:changed',
          'docs'
        ]
      }
    },

    // @task clean files
    clean: {
      build: ['<%= dir.build %>'],
      dist: ['<%= dir.dist %>'],
      docs: [
        '<%= dir.build %>/*.md',
        '<%= dir.dist %>/*.md'
      ]
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
      },

      // @target
      docs: {
        options: {
          banner: '<%= docsBanner + "\\n" %>'
        },
        src: ['<%= dir.build %>/<%= docsFile %>'],
        dest: '<%= dir.dist %>/<%= docsFile %>'
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
    },

    // @task generate markdown API documentation
    jsdoc2md: {
      options: {
        'private': false, // exclude @private content
        'heading-depth': 1
      },

      // @target
      dist: {
        src: ['src/**/*.js', 'src/**/*.jsdoc'],
        dest: '<%= dir.build %>/<%= docsFile %>'
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
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.loadNpmTasks('grunt-karma');

  //
  // Register Tasks
  //

  grunt.registerTask('lint', 'lint all code', [
    'jshint:all',
    'jscs:all'
  ]);

  grunt.registerTask('docs', 'build documentation', [
    'clean:docs',
    'jsdoc2md:dist',
    'concat:docs'
  ]);

  // @param {String} [browserList] Comma-delimited list of browser launchers for
  //  Karma to run tests. Default is 'PhantomJS'. See 'test/karma-conf-unit.js#browsers'
  //  for a list of possible values.
  grunt.registerTask('test', 'lint, then run all tests', function(browserList) {
    var browsers = browserList ? browserList.split(',') : undefined;

    if (browsers) {
      grunt.log.writeln('[test] running Karma with browsers: ' +
          browsers.join(', '));
      grunt.config('karma.global.options.browsers', browsers);
      grunt.config('karma.amd.options.browsers', browsers);
      grunt.config('karma.cjs.options.browsers', browsers);
    }

    grunt.task.run([
      'lint',
      'karma:global',
      'karma:amd',
      'karma:cjs'
    ]);
  });

  grunt.registerTask('dist', 'build distribution', [
    'clean:build',
    'clean:dist',
    'concat:dist',
    'uglify:dist',
    'docs'
  ]);

  grunt.registerTask('all', 'test and build', [
    'test',
    'dist'
  ]);

  // default task
  grunt.registerTask('default', ['all']);

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
