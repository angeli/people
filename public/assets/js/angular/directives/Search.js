
define('ngDirective/Search', ['ngDirective/Abstract', 'map/Desk'], function(AbstractDir, Desk)
{
	"use strict";
	
	var Search = function()
	{
		this.restrict		= 'E';
		this.templateUrl	= '/assets/template/Search.html';
		this.replace		= true;
		
		this.scope			=
		{
			map				: '=',
			selectedDesk	: '=',
		}		
	}
	
	Search.prototype = new AbstractDir;
	
	Search.prototype.link = function(scope, element, attr)
	{
		element.on('change', function(e)
		{
			try
			{
				var desk = scope.map.getSelectedDesk();
				
				if(String(e.val).match(/^user_/))
				{
					// Select user for desk mode
					var user_id = String(e.val).replace("user_", "")|0;
					var desk_id = desk.id();
					
					scope.$emit("change_desk", [user_id, desk_id]);
				}
				else
				{
					// Select desk by user mode
					scope.map.selectDesk(e.val);
				}				
			}
			catch(e){}
			
			// Clear the value immediately after selection
			$(element).find('.select2-container').select2("val", "");
			scope.selected = null;			
		});
	}
	
	Search.prototype.controller = function($scope, PeopleApi, Debounce)
	{
		var self = this;	
		
		this.PeopleApi = PeopleApi;
				
		$scope.select2_settings = 
		{
			multiple				: true,
			maximumSelectionSize	: 1, 
						
			query : Debounce.make(function(query)
			{
				var map		= $scope.map;
				var desk	= map.getSelectedDesk();
				
				var search_empty = false;
								
				if(desk instanceof Desk && desk.isFree())
				{
					search_empty = true;					
				}
				
				
				
				self.PeopleApi.getAllDesks().then(function(users)
				{
					var result = self.searchByAny($scope, users, query.term, search_empty);
					query.callback({results: result } );
				});
				
			}, 300),
		}
		
		
				
		PeopleApi.getAllDesks().then(function(users)
		{
			$scope.users = users;
			
			//self.createBogusData($scope);						
			
			$scope.$evalAsync();			
		});	
		
		$scope.map.on("map.desk-selected", function(e, map, desk)
		{
			$scope.select2_open = (desk && desk.isFree());			
		});
		
	}
			
	/**
	 * 
	 * @param {Scope} $scope
	 * @param {String} term
	 * @returns {Array}
	 */
	Search.prototype.searchByAny = function($scope, data, term, search_empty)
	{
		var out = [];		
		var hash = {};
		
		// Default search keys
		var search_by	= ["u_name", "e-mail", "desk"];
		
		// Search by specified key
		var matches		= String(term).match(/^([a-z_-]+):(.+)/i);
		
		if(matches)
		{
			var key = matches[1].trim();
			term	= matches[2];
			
			search_by = [key];
		}
		
		
		var count = 0;
		
		for(var i in data)
		{
			var user = null;
			
			// Skip deskless
			if(!search_empty && (data[i].desk|0) == 0)
				continue;
			
			// Skip desked
			if(search_empty && data[i].desk|0 > 0)
				continue;
			
			// Search by all specified search keys
			for(var n in search_by)
			{
				var key = search_by[n];
				
				try
				{
					// Try to match key to search term
					if((data[i][key] + '').match(new RegExp(term, "i")))
					{
						var id = data[i].desk;

						// If searching for deskless users, set selection id to a prefixed u_id , 
						// so we can later distinguish between desk and user id
						if(search_empty)
						{
							id = "user_" + data[i].u_id;
						}
						
						// Create selection choice
						user = 
						{
							id		: id,
							text	: data[i].u_name + " (" + (data[i].desk|| "deskless") + ")", 
							data	: {test: 1}
						}		
						
						// Break loop on any successfull match
						break;
					}
				}
				catch(e)
				{
					// Exit on invalid expression
					return [];
				}
			}
			
			// Check if search term corresponds to an empty desk
			if(!user && term|0 > 0 && !hash[term])
			{
				var desk = $scope.map.getDesk(term|0);
								
				if(!desk.isFree())
				{
					hash[term] = true;
					continue;
				}
				// Create empty desk searh choice
				user = {
					id		: term,
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
