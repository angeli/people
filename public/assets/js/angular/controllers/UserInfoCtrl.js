
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope, PeopleApi)
	{
		console.log($scope);
		this.apiService		= PeopleApi;
		var self			= this;
		this.edit			= false;
		this.is_locked		= true
		this.scope			= $scope;
		this.desk			= false;
		this.empty			= false;

		this.checkAdmin();

		$scope.$parent.$on("map.desk-selected", function($e, args)
		{
			var map		= args[0];
			var desk	= args[1];
			var desk_id = desk.id();

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
		var person = this.apiService.getDesk(desk);

		if(typeof person === 'object')
		{
			this.name		= person.u_name;
			this.user_id	= person.u_id;
			this.position	= person.job;
			this.department	= person.dep;
			this.team		= person.location;
			this.mail		= person['e-mail'];
			this.desk		= desk;
			this.setNames();
		}
		else
		{
			this.empty = true;
		}

		console.log(this.desk);
	};


	UserInfoCtrl.prototype.checkAdmin = function()
	{
		var self = this;

		self.admin = false;

		this.apiService.isAdminUser().then(
			function(data)
			{
				if(data.success == true)
				{
					self.admin = true;
				}
			},
			function(fail)
			{
				self.admin = false;
			}
//			,function(update)
//			{
//			}
		);
	}

	UserInfoCtrl.prototype.chengeDesk = function()
	{
		console.log('въркс');

		//TODO make ajax call to change user desk
	};

	UserInfoCtrl.prototype.leaveDesk = function()
	{
		console.log('въркс too');

		this.desk = '';
		//TODO make ajax call to change user desk
	};

	return UserInfoCtrl;
});


