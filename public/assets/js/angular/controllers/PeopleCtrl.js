
define('ngController/PeopleCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	"use strict";
	
	var PeopleCtrl = function($scope, $interval, PeopleApi)
	{
		var self = this;
		this.PeopleApi = PeopleApi;
		
		$scope.$on("map.ready", function(e, args)
		{
			self.map = args[0];
			self.updateData($scope);
		});
		
		// Refresh data
		$interval(function()
		{
			self.updateData($scope);
			
		}, 30000);
		
	}
	
	PeopleCtrl.prototype = new AbstractCtrl;
	
	
	PeopleCtrl.prototype.updateData = function($scope)
	{
		var self = this;
		
		this.PeopleApi.getAllDesks().then(function(users)
		{
			$(".Desk").addClass("free");
			
			$scope.users = users;
			
			var hash = {};

			for(var i in users)
			{
				var user = users[i];
				hash[user.id] = true;				
			}
			
			var desks = self.map.desks;
			
			for(var d in desks)
			{
				var desk = desks[d];
				
				desk.isFree(hash[desk.id()] !== true);
			}
		});
	}
	
	PeopleCtrl.prototype.isReady = function()
	{
		return typeof this.map !== "undefined";
	}
	
	/**
	 * Returns the number of desks currently free
	 * 
	 * @returns {Number}
	 */
	PeopleCtrl.prototype.freeDesksCount = function()
	{
		var count = 0;
		
		if(this.map)
		{
			for(var i in this.map.desks)
			{
				if(this.map.desks[i].isFree())
				{
					count++;
				}
			}
			
			return count;
		}
		
		return false;
	}

	
	return PeopleCtrl;
});


