
define('ngController/PeopleCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	"use strict";
	
	var PeopleCtrl = function($scope, PeopleApi)
	{
		var self = this;
		
		$scope.$on("map.ready", function(e, args)
		{
			self.map = args[0];
		});		
	}
	
	PeopleCtrl.prototype = new AbstractCtrl;
	
	PeopleCtrl.prototype.isReady = function()
	{
		return typeof this.map !== "undefined";
	}
	
	return PeopleCtrl;
});


