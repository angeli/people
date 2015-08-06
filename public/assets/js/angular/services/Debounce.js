
define("ngService/Debounce", ['ngService/Abstract'], function(AbstractService)
{
	/**
	 * Creates a debounced versions of functions
	 * 
	 * @param {Scope} $rootScope
	 * 
	 */
	var Debounce = function($rootScope)
	{
		this.$scope = $rootScope;
	}
	
	Debounce.prototype = new AbstractService;
	
	Debounce.prototype.make = function(func, wait, apply)
	{
		var timeout		= null;
		var $scope		= this.$scope;
				
		return function()
		{
			var self = this;
			var args = arguments;
			
			// Clear prev call timeout
			if(timeout)
				clearTimeout(timeout);
			
			// Set debounce timeout
			timeout = setTimeout(function()
			{
				func.apply(self, args);
				timeout = null;
				
				if(apply)
					$scope.$evalAsync();
				
			}, wait);

		}
	}
	
	return Debounce;
});