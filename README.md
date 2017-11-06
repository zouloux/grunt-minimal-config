# grunt-minimal-config

> Grunt plugin loading splitted Gruntfiles for more readability.
Useful if your Gruntfile.js is bloated by many plugins.

##### New simpler version !

See tag [v0.5.4](https://github.com/zouloux/grunt-minimal-config/tree/v0.5.4) for older implementation.


### About

This plugin is used in [solid web-base](https://github.com/solid-js/web-base), a grunt boilerplate for solid web applications.


### Installation

```npm i grunt-minimal-config --save-dev```


### Usage

If you want to split your config file like so :

- `Gruntfile.js` -> Default Gruntfile, nothing changes
- `Gruntfile-scripts.js` -> all scripts tasks configuration
- `Gruntfile-styles.js` -> all styles tasks configuration


Use this `Gruntfile.js` :

```javascript
module.exports = function (grunt)
{
    grunt.initConfig({
        minimalConfig: {

            // Load sub-config files
            src: 'Gruntfile-*.js'
        }
    });
    grunt.loadNpmTasks('grunt-minimal-config');
};
```

`src` is a glob path, it can target folder like so : `grunt-configs/*.js`.
But we advice to use `Gruntfile-*.js` for more readability in your file system.

Important : `grunt.loadNpmTasks` needs to be after `minimalConfig` configuration.

### Sub-config file

Here is a sub-config file example, simple :

```javascript
module.exports = function (grunt)
{
    // ------------------------------------------------------------------------- UGLIFY

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.config('uglify', {
        options: {
            mangle: true,
            report: 'gzip',
            comments: false
        }
    });


    // ....
};

```


### Shared parameters


The `__` contains all shared options. Useful if you want to share some path or parameters between sub-config files.

##### Why not using the default grunt template system ?
Because with this we have a **better error checking**, some IDE can **auto-complete** and also `__.src + 'Main.js'` is **more readable** than `<%= parameters.src %>Main.js` with syntax coloration.

More complete `Gruntfile.js` with shared parameters between sub-configs :

```javascript
module.exports = function (grunt)
{
    // ------------------------------------------------------------------------- CONFIG

    // Shared parameters
    let __ = {

        /**
         * Get --optimized CLI option.
         * If this option is added, bundles will be compressed.
         */
        optimizedTarget     : grunt.option('optimized') || false,

        // Glob extension to target all JS files
        allJsFiles          : '**/*.js',

        // Glob extension to target all Less files
        allLessFiles        : '**/*.less',

        // Assets output
        assetsDestination   : 'www/assets/',

        // Node module path
        nodeModulesPath     : 'node_modules/',

        // Project source files
        srcPath             : 'src/'
    };

    // Load and init minimal-config
    grunt.initConfig({
        minimalConfig: {

            // Load sub-config files
            src: 'Gruntfile-*.js',

            // Inject shared parameters in all loaded config files
            parameters: __
        }
    });
    grunt.loadNpmTasks('grunt-minimal-config');


    // ------------------------------------------------------------------------- TASKS

    grunt.registerTask('styles', 'less');

    // We can use shared parameters here too
    grunt.registerTask('default', (
        !__.optimizedTarget
        ? ['clean', 'styles', 'scripts']
        : ['clean', 'styles', 'scripts', 'uglify']
    ));

    grunt.registerTask('watch', ['default', 'watch']);
};
```


Shared parameters are as second argument inside sub-config files.

We advice using `__` everywhere for simplicity and auto-completion with good IDEs :


```javascript
module.exports = function (grunt, __)
{
    if (__.optimizedTarget)
    {
        // ...
    }

    // Configure less tasks
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.config('less', {

        common: {
            src: __.srcPath + 'common/Main.less',
            dest: __.assetsDestination + 'css/common.css'
        },

        myApp1: {
            src: __.srcPath + 'myApp1/Main.less',
            dest: __.assetsDestination + 'css/my-app-1.css'
        },

        myApp2: {
            src: __.srcPath + 'myApp2/Main.less',
            dest: __.assetsDestination + 'css/my-app-2.css'
        }
    });
};

```

