
define('ng/Factory', ['ngDirective/Abstract', 'ngService/Abstract','angular'], function(AbstractDirective, AbstractService)
{
	"use strict";
	
	/**
	 * A helper utility used to set up factory methods inside AbstractApp
	 * Should not ever need to use outside AbstracrtApp.
	 */	
	var Factory = {};
	
	Factory.wrapMethod = function(dir, method)
	{
		return function()
		{
			return method.apply(dir, arguments);
		}						
	}
	
	/**
	 * Create an instance with given constructor and parameters
	 * 
	 * @param {object} Class
	 * @param {array} args
	 * @returns {object}
	 */
	Factory.instance = function(Class, args)
	{
		var fConstructor = function(args)
		{
			Class.apply(this, args);
		}
		fConstructor.prototype = Class.prototype;

		return new fConstructor(args);
	}
	
	/**
	 * Returns a factory function for a given AbstractDirective class
	 * 
	 * @param {AbstractDirective} Directive
	 * @param {Array} args
	 * @returns {Function}
	 */
	Factory.directive = function(Directive, args)
	{
		return function($injector)
		{
			var wrap = 
			{
				controller	: true,
				link		: true,				
			};
	
			if(Directive.prototype instanceof AbstractDirective)
			{
				var dir	= Factory.instance(Directive, args);
				
				for(name in dir)
				{
					// Wrap selected methods so as to be called with the appropriate object frame.
					if(wrap[name] === true && typeof dir[name] === 'function')
					{
						var method = dir[name];
						
						// Perserve variable scope
						dir[name] = Factory.wrapMethod(dir, method);
						
						if(name == 'controller')
						{
							// Inject controller with dependencies
							dir[name].$inject = $injector.annotate(method);
						}
					}					
				}	
				
				return dir;
			}
			else
			{
				throw new Error('Directive must be instance of ngDirective/Abstract !');
			}
		}
	}
	
	/**
	 * Returns a service factory function for a given AbstractService class
	 * 
	 * @param {AbstractService} Service
	 * @returns {Factory_L2.Factory.service.factory}
	 */
	Factory.service = function(Service)
	{
		var injector = angular.injector();
		
		var factory = function()
		{
			// Init service with dependencies
			return Factory.instance(Service, arguments);			
		}
		
		// Inject factory with required dependencies
		factory.$inject = injector.annotate(Service);
				
		return factory;
	}
	
	return Factory;
	
});


