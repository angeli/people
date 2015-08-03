
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope, PeopleApi)
	{
		//var desks = PeopleApi.getDesk(140);

		console.log($scope);
		this.apiService		= PeopleApi;
		this.edit			= false;
		this.admin			= true;
		this.is_locked		= true
		this.scope			= $scope;

		this.name			= '';
		this.user_id		= '';
		this.position		= '';
		this.departament	= '';
		this.team			= '';
		this.mail			= '';
		this.seat			= '';

		this.openDesk(140);

		$scope.$parent.$on("map.desk-selected", function($e, args)
		{
			var map		= args[0];
			var desk	= args[1];

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
		var self = this;
		this.apiService.getDesk(desk).then(
			function(data)
			{
				self.name			= data.u_name;
				self.user_id		= data.u_id;
				self.position		= 'SEM Developer';
				self.departament	= 'WEB';
				self.team			= data.location;
				//self.mail			= data.e-mail;
				self.seat			= data.id;
				self.setNames();
				console.log(data);
			},
			function(fail)
			{

			}
//			,function(update)
//			{
//				self.profile		= update;
//				self.client_config	= update;
//			}
		);


	};

	UserInfoCtrl.prototype.chengeDesk = function()
	{
		console.log('въркс');

		//TODO make ajax call to change user seat
	};

	UserInfoCtrl.prototype.leaveDesk = function()
	{
		console.log('въркс too');

		this.seat = '';
		//TODO make ajax call to change user seat
	};

	return UserInfoCtrl;
});


