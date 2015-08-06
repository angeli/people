
define('ngController/PeopleCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	"use strict";
	
	var PeopleCtrl = function($scope, $interval, PeopleApi, $q)
	{
		var self		= this;
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
		
		$scope.$on("map.desk-selected", function(){$scope.$evalAsync();});
		$scope.$on("map.desk-unselected", function(){$scope.$evalAsync();});
		
//		// Refresh data
//		$interval(function()
//		{
//			$scope.$broadcast("update_users");
//			
//		}, 30000);
		
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
				
				hash[user.desk] = true;				
			}
			
			var desks = self.map.desks;
			self.free_desks = 0;
			
			for(var d in desks)
			{
				var desk = desks[d];
				var free = hash[desk.id()] !== true;
				desk.isFree(free);
				
				if(free)
				{
					self.free_desks++;
				}
			}
			
			// Count Deskless users
			self.deskless_people = 0;
									
			for(var i in users)
			{
				if((users[i].desk|0) === 0)
				{
					self.deskless_people++;
				}			
			}	
			
			$scope.$evalAsync();
			
			return def.resolve(users);
		});
		
		return def.promise;
	}
	
	
	
	PeopleCtrl.prototype.isReady = function()
	{
		return typeof this.map !== "undefined";
	}
		
	return PeopleCtrl;
});


