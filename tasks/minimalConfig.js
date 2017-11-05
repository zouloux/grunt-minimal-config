module.exports = function (grunt)
{
	// Path node utils
	let path = require('path');

	// Get plugin options
	let options = grunt.config.get('minimalConfig');

	// Default parameters
	let configParameters = options.parameters || {};

	// Check if src is here
	if (typeof options.src !== 'string')
	{
		grunt.fail.fatal( 'Please set src as a glob path at minimalConfig root.' );
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
			grunt.fail.fatal( fileName + ' export needs to be a function with grunt as first argument and __ as second argument.' );
		}

		// Call with parameters
		configExports( grunt, configParameters );
	});
};