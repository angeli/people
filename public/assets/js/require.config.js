require.config(
{
	baseUrl		: 'assets/js',
	paths		: 
	{
		'jquery'	: 'vendor/jquery/jquery',
		'kinetic'	: 'jquery.kinetic.min',
		'bootstrap'	: 'bootstrap.min',

		'ngController'	: 'angular/controllers',	// AngularJS Controllers
		'ngFilter'		: 'angular/filters',		// AngularJS Filters
		'ngService'		: 'angular/services',		// AngularJS Services
		'ngDirective'	: 'angular/directives',		// AngularJS Directives
		'ngApp'			: 'angular/modules',		// AngularJS Modules
		'ngLib'			: 'angular/lib',			// AngularJS external libraries

		'ngRoute'		: 'angular/lib/ngRoute',
		'ngResource'	: 'angular/lib/ngResource',
		'ngSanitize'	: 'angular/lib/ngSanitize',
		'ngAnimate'		: 'angular/lib/ngAnimate',

		'angular'		: 'angular.min',
		'ng'			: 'angular',
	},

	shim : 
	{
		'angular' : 
		{
			deps : ['jquery'],
		},
		
		'kinetic' :
		{
			deps : ['jquery']
		},

		'jquery.svg' : 
		{
			deps	: ['jquery'],	
			exports : '$',
		},
		
		'bootstrap' : 
		{
			deps : ['jquery']
		}
	}	
});


