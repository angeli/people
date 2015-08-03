
define('ngDirective/Search', ['ngDirective/Abstract'], function(AbstractDir)
{
	"use strict";
	
	var Search = function()
	{
		this.restrict		= 'E';
		this.templateUrl	= '/assets/template/Search.html';
		this.replace		= true;
		
		this.scope			=
		{
			map	: '=',
		}
	}
	
	Search.prototype = new AbstractDir;
	
	Search.prototype.link = function(scope, element, attr)
	{
		element.on('change', function(e)
		{
			scope.map.selectDesk(e.val);
			
			// Clear the value immediately after selection
			$(element).find('.select2-container').select2("val", "");
			scope.selected = null;			
		});
	}
	
	Search.prototype.controller = function($scope, PeopleApi)
	{
		console.log("Search Controller", $scope);
		
		var s2_users = [];
		
		$scope.select2_settings = 
		{
			multiple				: true,
			maximumSelectionSize	: 1, 
			data					: function()
			{
				return {results : s2_users };
			},
		}
		
		
				
		PeopleApi.getAllDesks().then(function(users)
		{
			$scope.users = users;
												
			for(var i in users)
			{
				var user = users[i];
				
				s2_users.push(
				{
					id		: user.id,
					text	: user.u_name,
				});
			}
			
			console.log("S2 users", s2_users);
			
			$scope.$evalAsync();
			
		});	
		
	}
	
	
	
	
	
	return Search;
});