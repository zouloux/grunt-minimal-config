module.exports = function (pGrunt)
{
	// Get plugin options
	var options = pGrunt.config.get('minimalConfig');

	// Where grunt config files are stored, with trailing slash, relative to this file
	options.path = options.path || 'grunt-config/';

	// List of package name prefixes for task auto-load
	options.prefixes = options.prefixes || ['grunt-', 'grunt-contrib-'];

	// NPM tasks to load and config
	options.npm = options.npm || [];

	// Local tasks to load and config
	options.local = options.local || [];

	var currentConfigName;
	var currentConfigObject;
	var currentGruntMerge;
	var moduleIndex;

	// Concat all modules
	var modules = options.npm.concat(options.local);

	// Browse all modules to load options
	for (moduleIndex in modules)
	{
		// Target module name
		currentConfigName = modules[moduleIndex];

		// Load config (will throw if not found)
		try
		{
			currentConfigObject = require('./../../../' + options.path + currentConfigName);
		}
		catch (error)
		{
			pGrunt.fail.fatal('Error while loading `' + currentConfigName + '` config file : ' + error.message);
		}

		// Create a merge object
		currentGruntMerge = {};

		// Old system, config exported as 'config' key, no grunt in scope
		if (typeof currentConfigObject == 'object' && 'config' in currentConfigObject)
		{
			// Load config with the grunt module name as key
			currentGruntMerge[currentConfigName] = currentConfigObject.config;
		}

		// New system, config must export a function which is returning config. So function have grunt as first argument.
		else if (typeof currentConfigObject == 'function')
		{
			// Call function and get result
			var configResult = currentConfigObject(pGrunt);

			// If this is an array and not an object
			if ( Array.isArray(configResult) )
			{
				// First slot is the name
				// Second slot is the config
				currentGruntMerge[configResult[0]] = configResult[1];
			}
			else
			{
				// Load config with the grunt module name as key
				currentGruntMerge[currentConfigName] = configResult;
			}
		}

		// Oups
		else
		{
			pGrunt.fail.fatal('Error while loading `' + currentConfigName + '` config file, please export function returning config.');
		}

		// Merge with grunt config
		pGrunt.config.merge(currentGruntMerge);
	}

	// Show loading infos
	console.log('');
	pGrunt.log.oklns('Minimal config : ' + modules.length + ' modules loaded (' + modules.join(', ') + ')');

	// Load grunt package from config
	var gruntPackage = pGrunt.config.get('pkg');

	// If grunt package is not found in config
	if (gruntPackage == null)
	{
		pGrunt.fail.fatal('Unable to find package.json in config. Please add `pkg: grunt.file.readJSON("package.json")` in your config file.');
	}

	var currentModuleName;
	var currentPrefixIndex;
	var currentFullModuleName;
	var packageFound;

	// List of dependency node name we can found in package.json
	var packageDependencyNames = ['devDependencies', 'dependencies', 'peerDependencies', 'optionalDependencies'];

	// Browse NPM modules to load
	for (moduleIndex in options.npm)
	{
		// Target module name
		currentModuleName = options.npm[moduleIndex];

		// Package is not found here
		packageFound = false;

		// Browse prefix to search with
		for (currentPrefixIndex in options.prefixes)
		{
			// Get the full name with this prefix
			currentFullModuleName = options.prefixes[currentPrefixIndex] + currentModuleName;

			// Browser all dependenciy names available in package.json
			for (packageDepIndex in packageDependencyNames)
			{
				// Target dependency name
				currentPackageDependencyName = packageDependencyNames[packageDepIndex];

				// Check if we have this dependency node and if we have this module available with this prefix
				if (currentPackageDependencyName in gruntPackage && currentFullModuleName in gruntPackage[currentPackageDependencyName])
				{
					// We found it
					packageFound = true;

					// Load it !
					pGrunt.loadNpmTasks(currentFullModuleName);
					break;
				}
			}
		}

		// Warn if package is not found
		if (!packageFound)
		{
			pGrunt.fail.warn('Unable to load NPM task `' + currentModuleName + '`');
		}
	}
};
