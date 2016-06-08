# grunt-minimal-config

> Grunt plugin automatically loading NPM tasks and associated config file.
Useful if your Gruntfile.js is bloated by many plugins.


### About

This plugin is used in [solid web-base](https://github.com/solid-js/web-base), a grunt boilerplate for solid web applications.


### Usage

Config files are named like the grunt plugin, inside a `grunt-config` subdirectory. This directory can be changed with `options.path`.

Exemple for grunt-concat :
- `grunt-config/concat.js`


### GruntFile.js configuration exemple :

```javascript
module.exports = function (grunt)
{
    // Init global config parameters
    grunt.config.init({

        // Load package definitions (needed to discover grunt packages)
        pkg: grunt.file.readJSON('package.json'),

        // Path configuration exemple ...
        path: {
            // Path to the source
            src             : '../src/',

            // Path to the libs
            lib             : '../lib/'
        },

        /**
         * Load grunt sub-configurations
         * To load an NPM package, add file and name if from the plugin name in the grunt-config folder see path.config)
         * Every NPM task will be automatically loaded if present in npm array.
         * Local have to be loaded with grunt.task.loadTasks call.
         */
        minimalConfig: {
            // Load NPM tasks and config
            npm: [
                'autoprefixer',
                'clean',
                'concat',
                'cssmin',
                'deployer',
                'imagemin',
                //'json', // Will be ignored, grunt-plugin will be not loaded
                'less',
                'scaff',
                'ts',
                'uglify',
                'watch'
            ],

            // Load local tasks and config
            local: [
                'myCustomPlugin'
            ]
        }
    });

    // Init grunt minimal config loader
    grunt.loadNpmTasks('grunt-minimal-config');

    // Load local grunt tasks after config is loaded
    grunt.task.loadTasks('./grunt-tasks/');

    // Declare your grunt tasks
    grunt.registerTask('default', ['...']);
};
```


### concat.js configuration exemple :

```javascript
// Export a function which return the config object
// Note we have grunt as parameter for helper functions
module.exports = function (grunt)
{
    return {
        // Concat options
        options: {
            // Remove all comments
            stripBanners: {
                block: true,
                line: true
            },

            // Use ES5 strict mode
            banner: '"use strict"\n\n',

            // Between each concatenated file
            separator: '\n'
        },

        // Configure your concat task
        myTask : {
            ...
        }
    }
};
```