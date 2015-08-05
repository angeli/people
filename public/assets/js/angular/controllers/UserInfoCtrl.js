
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope, PeopleApi)
	{
		console.log($scope);
		this.apiService			= PeopleApi;
		var self				= this;
		this.edit				= false;
		this.is_locked			= true
		this.scope				= $scope;
		this.desk				= false;
		this.empty				= false;
		this.destination_desk	= 0;

		//this.free_desks		= [157, 142, 140];

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
			var map = args[0];

			console.log("Da map is loaded", map);
		});
	};

	UserInfoCtrl.prototype = new AbstractCtrl;

	UserInfoCtrl.prototype.setNames = function()
	{
		var name = this.name.split(" ");

		this.fname	= name[0];
		this.lname	= name[1];
	};

	UserInfoCtrl.prototype.releseLock = function()
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

	UserInfoCtrl.prototype.openDesk = function(desk)
	{
		console.log(desk);
		this.checkAdmin();
		var person = this.apiService.getDesk(desk);
console.log(person);
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
			this.standing_people	= this.getStandingPeople();
		}

		console.log(this.empty);
	};


	UserInfoCtrl.prototype.checkAdmin = function()
	{
		this.admin = this.apiService.isAdminUser();
	};

	UserInfoCtrl.prototype.changeDesk = function()
	{
		var self = this;

		this.apiService.changeDesk(self.user_id, self.desk, self.destination_desk).then(
			function(data)
			{
				console.log('success', data);
				self.selected_desk.isFree(true);
				self.empty = false;
				self.openDesk(self.destination_desk);
			},
			function(fail)
			{
				console.log('fail', fail);
			}
		);
	};

//deprecate it - use changeDesk
	UserInfoCtrl.prototype.leaveDesk = function()
	{
		var self = this;
console.log(self.user_id, self.desk);
		this.apiService.changeDesk(self.user_id, self.desk, 0).then(
			function(data)
			{
				console.log('success', data);
				self.selected_desk.isFree(true);
				self.desk = '';
			},
			function(fail)
			{
				console.log('fail', fail);
			}
		);
	};

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

	UserInfoCtrl.prototype.getStandingPeople = function()
	{
		return this.apiService.getStandingPeople();
	};

	return UserInfoCtrl;
});


