
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
			try
			{
				scope.map.selectDesk(e.val);
			}
			catch(e){}
			
			// Clear the value immediately after selection
			$(element).find('.select2-container').select2("val", "");
			scope.selected = null;			
		});
	}
	
	Search.prototype.controller = function($scope, PeopleApi)
	{
		var self = this;	
		
		this.PeopleApi = PeopleApi;
		
		$scope.select2_settings = 
		{
			multiple				: true,
			maximumSelectionSize	: 1, 
			
			query : function(query)
			{
				self.PeopleApi.getAllDesks().then(function(users)
				{
					var result = self.searchByAny($scope, users, query.term);
					query.callback({results: result} );
				});		
			},
		}
		
		
				
		PeopleApi.getAllDesks().then(function(users)
		{
			$scope.users = users;
			
			//self.createBogusData($scope);						
			
			$scope.$evalAsync();			
		});	
		
	}
	
	/**
	 * Fill the users with bogus data for testing purposes
	 * 
	 * @param {type} $scope
	 * @returns {undefined}
	 */
	Search.prototype.createBogusData = function($scope)
	{
		for(var i = 0; i < 400; i++)
		{
			if(i >= 138 && i <= 145 || i == 157 )
				continue;

			$scope.users.push(
			{
				id			: i,
				u_name		: "Some User Name " + i,
				name		: "Some bogus name " + i,
				department	: "Department " + i,
				position	: "Some Position " + i,
			});
		}
	}
	
	/**
	 * 
	 * @param {Scope} $scope
	 * @param {String} term
	 * @returns {Array}
	 */
	Search.prototype.searchByAny = function($scope, data, term)
	{
		var out = [];
		
		var hash = {};
		
		for(var i in data)
		{
			var user = null;
			
			// Search by pretty much anything
			for(var key in data[i])
			{
				if((data[i][key] + '').match(term))
				{
					user = {
						id		: data[i].id,
						text	: data[i].u_name, 
					}					
					break;
				}
			}
			
			// Check if search terms corresponds to an empty desk
			var desk = $scope.map.getDesk(term|0);
			
			if(!user && term|0 > 0 && desk !== null)
			{
				if(hash[term] || !desk.isFree())
					continue;
				
				user = {
					id		: term|0,
					text	: "Free Desk (" + term + ")"
				}
			}
			
			// Add user if user is object
			if(user)
			{
				out.push(user);
				hash[user.id] = true;
			}
		}
		
		return out;
	}
	
	
	
	
	
	return Search;
});