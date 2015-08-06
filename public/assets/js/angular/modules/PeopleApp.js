define('ngApp/PeopleApp', ['ngApp/Abstract'], function(AbstractApp)
{
	var PeopleApp = function()
	{
		// Name of module inside angular
		this.module_name = 'PeopleApp';

		this.controllers =
		[
			'ngController/UserInfoCtrl',
			'ngController/TestCtrl',
			'ngController/PeopleCtrl',
		];

		this.directives =
		[
			'ngDirective/TheMap',
			'ngDirective/Select2',
			'ngDirective/Search'
		]

		this.services =
		[
			'ngService/PeopleApi',
			'ngService/Debounce',
		];
	}

	PeopleApp.prototype = new AbstractApp;

	return PeopleApp;
});

