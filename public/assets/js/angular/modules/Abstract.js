
define('ngApp/Abstract', ['angular', 'jquery'], function()
{
	"use strict";

	var AbstractApp = function()
	{
		this.module_name	= 'AbstractApp'

		this.modules		= [];
		this.controllers	= [];
		this.directives		= [];
		this.services		= [];
		this.filters		= [];

		this.run_functions		= [];
		this.config_functions	= [];
	}

	/**
	 * Initialize the Angular App
	 *
	 * @param jQuery  element
	 *
	 * @return {Promise} description
	 */

	AbstractApp.prototype.bootstrap = function(element, cb)
	{
		var self			= this;
		var dependencies	= this.collectDependencies();

		self.root_element = angular.element(element);
		self.root_element.data('ngApp', self);

		var def = new angular.element.Deferred();

		require(dependencies, function(AbstractController, AbstractDirective, AbstractService, Factory)
		{
			// Build Module
			var modules = self.formatNameArray(self.modules)

			console.log('Init Module: ', self.module_name, modules);

			var module	= angular.module(self.module_name, modules);
			
			// Build Dependencies
			for(i in arguments)
			{
				var name  = dependencies[i];
				var Class = arguments[i];

				if(typeof Class === 'undefined')
					continue;

				if(Class.prototype instanceof AbstractController)
				{
					module.controller(self.formatName(name), Class);
					continue;
				}

				if(Class.prototype instanceof AbstractDirective)
				{
					module.directive(self.formatName(name, true), Factory.directive(Class));
					continue;
				}

				if(Class.prototype instanceof AbstractService)
				{
					module.factory(self.formatName(name), Factory.service(Class));
					continue;
				}
				
				// If nothing else, it is a filter
				if(typeof Class == "function" && name.indexOf('ngFilter/') === 0)
				{
					(function(Class){
						// Need to wrap the stuff twice so the correct refference to Class is returned by the filter provider
						module.filter(self.formatName(name, true), function()
						{
							return Class;
						});
					})(Class);
					continue;
				}
			}			
			
			// Set config functions
			for(var i in self.config_functions)
			{
				var fn = self.config_functions[i];
				module.config(fn);
			}

			// Set run functions
			for(var i in self.run_functions)
			{
				var fn = self.run_functions[i];
				module.run(fn);
			}

			self.initModule();

			// Initialize Application
			if(!element)
			{
				element = document;
			}

			try
			{
				angular.bootstrap(element, [self.module_name]);
				def.resolve(this);

			}
			catch(error)
			{
				console.error(error);
				def.reject(error);
			}
		});

		return def.promise();

	}

	console.log("Test");

	/**
	 * Perform module initialization procedures
	 *
	 * @returns {undefined}
	 */
	AbstractApp.prototype.initModule = function()
	{
		var module = this.module();

		module.run(this.setupHTTPHeaders);
	}

	/**
	 * Set some default http headers
	 *
	 * @param {$httpProvider} $http
	 * @returns {undefined}
	 */
	AbstractApp.prototype.setupHTTPHeaders = function($http)
	{
		$http.defaults.headers.common['IS-AJAX'] = 'true';
	}

	AbstractApp.prototype.module = function()
	{
		return angular.module(this.module_name);
	}

	/**
	 * Set a callback on module load
	 *
	 * @param {Function} cb
	 * @returns {undefined}
	 */
	AbstractApp.prototype.run = function(cb)
	{
		if(typeof cb == 'function')
		{
			// Buffer the callbacks as the module will not be actually created until bootstap() is called
			this.run_functions.push(cb);
		}
	}

	/**
	 * Set a configuration callback
	 *
	 * @param {Function} cb
	 * @returns {undefined}
	 */
	AbstractApp.prototype.config = function(cb)
	{
		if(typeof cb == 'function')
		{
			this.config_functions.push(cb);
		}
	}

	/**
	 * Format a dependency name into camel case convention
	 *
	 * @param {string}	name
	 * @param {bool}	camelize
	 * @returns {string}
	 */
	AbstractApp.prototype.formatName = function(name, camelize)
	{
		// Do not modify if it is not a convention namespace
		if(!name.match(/^ng[a-z0-9_]+[/]/i))
			return name;

		var parts = name.replace(/^(ng[a-z0-9_]+[/])/gi, '').split('/');
		var first = true;

		for(var i in parts)
		{
			var part = parts[i];

			if(first && camelize === true)
			{
				// Lower First
				parts[i]	= part.replace(/^(.)/g, function(match, group1) { return ('' + group1).toLowerCase(); });
				first		= false;
			}
			else
			{
				// Upper First
				parts[i] = part.replace(/^(.)/g, function(match, group1) { return ('' + group1).toUpperCase(); });
			}

		}


		return parts.join('');

	}

	/**
	 * Format an array of names
	 *
	 * @param {array} names
	 * @param {bool} camelize
	 * @returns {String}
	 */
	AbstractApp.prototype.formatNameArray = function(names, camelize)
	{
		var out = names;

		for(i in out)
		{
			out[i] = this.formatName(out[i], camelize);
		}

		return out;
	}

	/**
	 * Combines all dependencies into a single object
	 *
	 * @returns {Array}
	 */
	AbstractApp.prototype.collectDependencies = function()
	{
		// Core Dependencies
		var all = ['ngController/Abstract','ngDirective/Abstract', 'ngService/Abstract', 'ng/Factory'];

		// Collect Modules
//		for(var i in this.modules)
//		{
//			var module = this.modules[i];
//			all.push(module);
//		}

		// Collect Controllers
		for(var i in this.controllers)
		{
			var controller = this.controllers[i];

			if(controller.indexOf('ngController/') !== 0)
			{
				controller = 'ngController/' + controller;
			}

			all.push(controller);
		}

		// Collect Directives
		for(var i in this.directives)
		{
			var directive = this.directives[i];

			if(directive.indexOf('ngDirective/') !== 0)
			{
				directive = 'ngDirective/' + directive;
			}

			all.push(directive);
		}

		// Collect Services
		for(var i in this.services)
		{
			var service = this.services[i];

			if(service.indexOf('ngService/') !== 0)
			{
				service = 'ngService/' + service;
			}

			all.push(service);
		}
		
		// Collect Filters
		for(var i in this.filters)
		{
			var filter = this.filters[i];

			if(filter.indexOf('ngFilter/') !== 0)
			{
				filter = 'ngFilter/' + filter;
			}

			all.push(filter);
		}
		
		
		return all;
	}

	/**
	 * Compile a given element into angular
	 *
	 * @param {jQuery} element
	 * @returns {Promise}
	 */
	AbstractApp.prototype.compile = function(element)
	{
		if(!element)
		{
			element = this.root_element;
		}

		var $element	= angular.element(element);
		var def		= angular.element.Deferred();
		var scope	= $element.scope();

		try
		{
			var $injector = this.root_element.injector();

			$injector.invoke(function($compile, $rootScope)
			{
				if(scope == null)
					scope = $rootScope;

				$compile($element)(scope);
				$rootScope.$apply();

				def.resolve();
			});
		}
		catch(e)
		{
			def.fail(e);
		}

		return def.promise();
	}

	return AbstractApp;
});

