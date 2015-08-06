
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope, PeopleApi)
	{
		console.log($scope);
		this.apiService			= PeopleApi;
		this.scope				= $scope;
		var self				= this;
		this.edit				= false;
		this.is_locked			= true
		this.scope				= $scope;
		this.desk				= false;
		this.empty				= false;
		this.loader				= false;
		this.destination_desk	= 0;
		this.getCurrentUser();

		//desk selection event
		$scope.$parent.$on("map.desk-selected", function($e, args)
		{
			var map				= args[0];
			var desk			= args[1];
			var desk_id			= desk.id();
			self.selected_desk	= desk;
			self.free_desks		= self.getFreeDesks(map.getFreeDesks());

			self.openDesk(desk_id);

			$scope.$evalAsync();

			console.log("User Info Desk Selected: " + desk.id(), map, desk);
		});

		$scope.$parent.$on("map.ready", function($e, args)
		{
			var map		= args[0];
			self.map	= map;

			console.log("Da map is loaded", map);
		});

		//change desk event
		$scope.$parent.$on("change_desk", function(e, args)
		{
			var user_id = args[0];
			var desk_id = args[1];

			self.user_id			= user_id;
			self.desk				= 0;
			self.destination_desk	= desk_id;

			self.changeDesk();

			console.log("Change Desk", user_id, desk_id);
		});

		//clear map
		$scope.$parent.$on("map.desk-unselected", function($e, args)
		{
			self.name				= '';
			self.user_id			= '';
			self.position			= '';
			self.department			= '';
			self.team				= '';
			self.mail				= '';
			self.desk				= 0;
			self.fname				= '';
			self.lname				= '';
			self.empty				= true;
			self.destination_desk	= 0;
		});
	};

	UserInfoCtrl.prototype = new AbstractCtrl;

	/**
	 * Set current user and admin rights
	 *
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.getCurrentUser = function()
	{
		var self = this;

		this.apiService.getAllDesks(true).then(
			function(people)
			{
				for(i in people)
				{
					var person = people[i];

					if( ("current" in person))
					{
						self.current_user =  person.u_name;

						if(person.edit === true)
						{
							self.admin = true;
						}
					}
				}
			}
		);
	};

	/**
	 * Split name on first and Last
	 *
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.setNames = function()
	{
		var name = this.name.split(" ");

		this.fname	= name[0];
		this.lname	= name[1];
	};

	/**
	 * Changes edit lock
	 *
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.changeLock = function()
	{
		if(this.admin == true)
		{
			if(this.is_locked == true)
			{
				this.is_locked = false;
				this.edit = true;
			}
			else
			{
				this.is_locked = true;
				this.edit = false;
			}
		}
	};

	/**
	 * Loads selected desk and user info
	 *
	 * @param int desk
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.openDesk = function(desk)
	{
		console.log(desk);

		this.edit		= false;
		this.is_locked	= true
		var person		= this.apiService.getDesk(desk);

		if(typeof person === 'object')
		{
			this.name		= person.u_name;
			this.user_id	= person.u_id;
			this.position	= person.job;
			this.department	= person.dep;
			this.team		= person.location;
			this.mail		= person['e-mail'];
			this.desk		= desk;
			this.empty		= false;
			this.setNames();
		}
		else
		{
			this.name				= '';
			this.user_id			= '';
			this.position			= '';
			this.department			= '';
			this.team				= '';
			this.mail				= '';
			this.desk				= 0;
			this.fname				= '';
			this.lname				= '';
			this.empty				= true;
			this.destination_desk	= desk;
		}
	};

	/**
	 * Changes user desk
	 *
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.changeDesk = function()
	{
		var self	= this;
		this.loader	= true;

		this.apiService.changeDesk(self.user_id, self.desk, self.destination_desk).then(
			function(data)
			{
				console.log('success', data);

				self.apiService.getAllDesks(true).then(
					function(people)
					{
						if(self.desk != 0)
						{
							self.selected_desk.isFree(true);
						}

						self.empty = false;

						var desk_to_open = self.desk;
						if(self.destination_desk > 0)
						{
							desk_to_open = self.destination_desk;
						}

						self.openDesk(desk_to_open);

						var new_desk = self.map.getDesk(self.destination_desk);

						new_desk.isFree(false);

						self.map.selectDesk(self.destination_desk);

						self.scope.$evalAsync();
						self.loader = false;
					}
				);


			},
			function(fail)
			{
				console.log('Desk Change FAILED!', fail);
			}
		);
	};

	/**
	 * Removes user from the desk
	 *
	 * @returns {undefined}
	 */
	UserInfoCtrl.prototype.leaveDesk = function()
	{
		var self	= this;
		this.loader	= true;

		this.apiService.changeDesk(self.user_id, self.desk, 0).then(
			function(data)
			{
				console.log('success', data);

				self.apiService.getAllDesks(true).then(
					function(people)
					{
						self.selected_desk.isFree(true);
						self.empty = false;

						if(self.desk > 0)
						{
							self.openDesk(self.desk);
						}

						self.map.clearSelection();
						self.desk = '';
						self.scope.$evalAsync();
						self.loader = false;
					}
				);
			},
			function(fail)
			{
				console.log('Removing user from desk FAILED!', fail);
			}
		);
	};

	/**
	 * Returns the free desks
	 *
	 * @param {type} desks
	 * @returns {_L2.AbstractCtrl.getFreeDesks.free_desks|Array}
	 */
	UserInfoCtrl.prototype.getFreeDesks = function(desks)
	{
		var free_desks = [];

		for(i in desks)
		{
			var desk = desks[i];

			var desk_id	= desk.id();

			free_desks[desk_id] = desk_id;
		}

		free_desks = free_desks.filter(function(n){return n != undefined});

		return free_desks;
	};

	return UserInfoCtrl;
});


