define('ngApp/PeopleApp', ['ngApp/Abstract'], function(AbstractApp)
{
	var PeopleApp = function()
	{
		// Name of module inside angular
		this.module_name = 'PeopleApp';

		this.controllers =
		[
			'ngController/UserInfoCtrl',
		];

		this.directives =
		[
			'ngDirective/TheMap',
		]
	}

	PeopleApp.prototype = new AbstractApp;

	return PeopleApp;
});

