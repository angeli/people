
define('ngController/PeopleCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	"use strict";
	
	var PeopleCtrl = function($scope, $interval, PeopleApi, $q)
	{
		var self = this;
		this.$q			= $q;
		this.PeopleApi	= PeopleApi;
		
		var def	= $q.defer();
		this.on_map_loaded = def.promise;
		
		$scope.$on("map.ready", function(e, args)
		{
			self.map = args[0];
			self.updateData($scope);
			
			def.resolve(self.map);
		});
		
		$scope.$on("update_users", function(e, args)
		{
			self.updateData($scope);
		});
		
		// Refresh data
		$interval(function()
		{
			$scope.$broadcast("update_users");
			
		}, 10000);
		
	}
	
	PeopleCtrl.prototype = new AbstractCtrl;
	
	
	PeopleCtrl.prototype.updateData = function($scope)
	{
		var self = this;
		
		var def = this.$q.defer();
		
		this.$q.all([this.on_map_loaded, this.PeopleApi.getAllDesks()])
		.then(function(args)
		{
			var map		= args[0];
			var users	= args[1];
			
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
			
			return def.resolve(users);
		});
		
		return def.promise;
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
			return this.map.getFreeDesks().length;
		}
		
		return false;
	}

	
	return PeopleCtrl;
});


