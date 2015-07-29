
define('ngController/UserInfoCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var UserInfoCtrl = function($scope)
	{
		console.log($scope);
		this.edit = true;
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
		//this.name = this.scope.name;

		var name = this.scope.name.split(" ");

		this.fname	= name[0];
		this.lname	= name[1];
	};



	return UserInfoCtrl;
});


