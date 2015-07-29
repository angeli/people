
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope)
	{
		console.log($scope);
		this.edit			= false;
		this.admin			= true;
		this.is_locked		= true
		this.scope			= $scope;
		this.scope.name		= 'Tihomir Tsvetkov';
		this.user_id		= 40;
		this.position		= 'SEM Developer';
		this.departament	= 'WEB';
		this.team			= 'SEM';
		this.mail			= 'tihomir.tsvetkov@gameloft.com';
		this.seat			= 140;
		this.setNames();
	};

	UserInfoCtrl.prototype = new AbstractCtrl;

	UserInfoCtrl.prototype.setNames = function()
	{
		var name = this.scope.name.split(" ");

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

	UserInfoCtrl.prototype.chengeSeat = function()
	{
		console.log('въркс');

		//TODO make ajax call to change user seat
	};

	UserInfoCtrl.prototype.leaveSeat = function()
	{
		console.log('въркс too');

		this.seat = '';
		//TODO make ajax call to change user seat
	};

	return UserInfoCtrl;
});


