module.exports = function (grunt)
{
	// Path node utils
	let path = require('path');

	// Get plugin options
	let options = grunt.config.get('minimalConfig');

	// Check options
	if (options == null)
	{
		grunt.fail.fatal(
			"grunt-minimal-config // No minimalConfig node found into grunt config. Please set config before loading this script.\n"
			+ "This plugin have been updated recently so if this message is unexpected, you may set a legacy version into package.json.\n"
			+ "\"grunt-minimal-config\" : \"^0.5.4\" should fix it :)"
		);
	}

	// Default parameters
	let configParameters = options.parameters || {};

	// Check if src is here
	if (typeof options.src !== 'string')
	{
		grunt.fail.fatal( 'grunt-minimal-config // Please set src as a glob path at minimalConfig root.' );
	}

	// Expand files
	let configFiles = grunt.file.expand({isFile:true}, options.src);

	// No sub-config
	if (configFiles.length == 0)
	{
		grunt.log.errorlns( 'grunt-minimal-config // No sub-config file to load, is src glob ok ?' );
		return;
	}

	// Browse files
	configFiles.map( (fileName) =>
	{
		// Require config file
		let configExports = require( path.resolve( fileName ) );

		// Check if export is a function
		if (typeof configExports !== 'function')
		{
			grunt.fail.fatal( 'grunt-minimal-config // ' + fileName + ' export needs to be a function with grunt as first argument and __ as second argument.' );
		}

		// Call with parameters
		configExports( grunt, configParameters );
	});

	// Ok !
	grunt.log.oklns('Minimal config : ' + configFiles.length + ' config files loaded.');
};