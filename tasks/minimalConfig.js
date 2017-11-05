module.exports = function (grunt)
{
	// Path node utils
	let path = require('path');

	// Get plugin options
	let options = grunt.config.get('minimalConfig');

	// Check options
	if (options == null)
	{
		grunt.fail.fatal( 'grunt-minimal-config // No minimalConfig node found into gurnt config. Please set config before loading this script.' );
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
};