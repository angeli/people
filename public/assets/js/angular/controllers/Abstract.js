
define('ngController/Abstract', ['angular'], function()
{
	"use strict";
	
	var AbstractController = function()
	{
		
	}
	
	/**
	 * Default notification stack
	 */
	AbstractController.notification_stack = {dir1: "down", dir2: "left"};
		
	/**
	 * Set a nested controler property by path
	 * 
	 * @param {String} path
	 * @param {Mixed} value
	 * @returns {Mixed}
	 */
	AbstractController.prototype.set = function(path, value)
	{
		var key		= null;
		var current = this;
		
		if(arguments.length > 2)
		{
			current = arguments[0];
			path	= arguments[1];
			value	= arguments[2];
		}
		
		
		path = (path  + "").split(".");
		
		while(key = path.shift())
		{
			if(path.length == 0)
			{
				current[key] = value;
				return;
			}
			
			if(typeof current[key] != "object")
			{
				current[key] = {};
			}
			
			current = current[key];
		}	
	}
	
	/**
	 * Resolve a controller nested property
	 * 
	 * @param	{String} path
	 * @returns {Abstract_L2.AbstractController|Abstract_L2.AbstractController.prototype.get.current}
	 */
	AbstractController.prototype.get = function(path)
	{
		var key = null;
		var current = this;
		
		if(arguments.length > 1)
		{
			current = arguments[0];
			path	= arguments[1];
		}		

		path = (path + "").split(".");

		while(key = path.shift())
		{
			if(typeof current == "object")
			{
				if(path.length == 0)
				{
					return current[key];
				}

				if(key in current)
				{
					current = current[key];
				}
				else
				{
					return null;
				}
			}
		}
	}
	
	/**
	 * Returns a path value as array
	 * 
	 * @param {String} path
	 * @returns {Array}
	 */
	AbstractController.prototype.getArray = function(path)
	{
		var sort	= null;
		var value	= this.get.apply(this, arguments);
		var out		= [];
		
		for(i in arguments)
		{	
			// Get sorting function if specified
			if(typeof arguments[i] == "function")
			{
				sort = arguments[i];
			}
		}
				
		
		if(value != null)
		{
			if(value instanceof Array)
			{
				out = value;
			}
			else if(typeof value == "object")
			{
				for(i in value)
				{
					out.push(value[i]);
				}				
			}
			else
			{
				out = [value];
			}
		}
		
		if(typeof sort == "function")
		{
			out.sort(sort);
		}
		
		
		return out;
	}
	
	/**
	 * Returns a copy of the given path's value
	 * 
	 * @param {String} path
	 * @returns {undefined}
	 */
	AbstractController.prototype.getCopy = function(path)
	{
		var value = this.get.apply(this, arguments);
		
		return angular.copy(value);
	}
	
	/**
	 * Returns a boolean value of given path
	 * 
	 * Regardless of the type of the actual value, it will be cast to boolean
	 * 
	 * @param {String} path
	 * @returns {Boolean}
	 */
	AbstractController.prototype.getBool = function(path)
	{
		var value = this.get.apply(this, arguments);
		
		if(value <= 0)
			return false;
		
		if(/^\s*(false|null)*\s*$/.exec(value) != null)
		{
			return false;
		}
		
		if(/^\s*(true)*\s*$/.exec(value) != null)
		{
			return true;
		}
						
		return value ? true : false;
	}
	
	
	AbstractController.prototype.getDate = function(path)
	{
		var data = this, path, format = 'YYYY-MM-DD H:mm:ss';
		
		if(arguments.length == 3)
		{
			data	= arguments[0];
			path	= arguments[1];
			format	= arguments[2];
		}
		else if(arguments.length == 2)
		{
			if(typeof arguments[0] == "object")
			{
				data = arguments[0];
				path = arguments[1];			
			}
			else
			{
				path	= arguments[0]
				format	= arguments[1]; 
			}
		}
		else
		{
			path = arguments[0];
		}
		
		var value = this.get(data, path);
		
		return moment(value, [format]);		
	}
	
	/**
	 * Gets a controller value and casts it to int
	 * 
	 * @param {String} path
	 * @returns {Number}
	 */
	AbstractController.prototype.getInt = function(path)
	{
		var value = this.get.apply(this, arguments);
		
		if(typeof value == "string")
		{
			value = value.trim();
			
			if(value == "true")
				return 1;		
		}
		
		return value | 0;
	}
	
	/**
	 * Returns the first value of and object or array
	 * 
	 * @param {String} path
	 * @returns {Mixed}
	 */
	AbstractController.prototype.getFirst = function(path)
	{
		var value = this.get.apply(this, arguments);
		
		if(typeof value == "object")
		{
			var key = Object.keys(value).shift();
			
			if(typeof key != "undefined")
			{
				return value[key];
			}
		}
		
		return null;
	}
	
	/**
	 * Imports a method onto the controller, from a specified object
	 * The method is executed throu apply as though called from the original object
	 * 
	 * Use to provide access from the controller to a particular method, without giving access to the whole scope
	 * 
	 * @param {Object} obj
	 * @param {String} method_name
	 * @returns {undefined}
	 */
	AbstractController.prototype.importMethod = function(obj, method_name)
	{
		var method = obj[method_name];
		
		if(typeof method == "function")
		{
			return function()
			{
				return method.apply(obj, arguments);
			}
		}
		else
		{
			throw new Error(method_name + " is not a function!");
		}
	}
	
	/**
	 * 
	 * @param {Object} data
	 * @returns {PNotify} Creates a notification 
	 * 
	 * @return {PNotify}
	 */
	AbstractController.prototype.notify = function(data)
	{
		if(!this.notification_stack)
		{
			this.notification_stack = AbstractController.notification_stack;
		}

		var def = 
		{
			stack	: AbstractController.notification_stack,
			
			buttons : 
			{
				closer	: true,
				sticker	: false,
			}
		}
		
		data = angular.extend(def, data);
		
		return new PNotify(data);
	}
	

	
	return AbstractController;
});


