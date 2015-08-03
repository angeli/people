
define('ngDirective/Select2', ['ngDirective/Abstract', 'select2'], function(AbstractDirective)
{
	"use strict";	
	
	var Select2 = function()
	{
		this.restrict	= 'E';
		this.replace	= true;
		this.require	= ['ngModel'];
		
		this.scope		=
		{
			id			: '@',
			name		: '@',
			settings	: '=',	
			select2Open	: '=',
		}
	}
	
	Select2.prototype = new AbstractDirective;
	
	Select2.prototype.link = function(scope, element, attr, ctrls)
	{
		var ngModel	= ctrls[0];		
		var settings = scope.settings;
				
		settings = angular.extend({}, settings);
		
		var $element = $(element);
		
		$element
		.select2(settings);
		
		this.setupMethods(scope, element, attr);
		
		if(ngModel != null)
		{
			// Update selection with model
			ngModel.$render = function()
			{
				$element.select2("val", ngModel.$modelValue);
				//console.log("Select2 Init Val", ngModel.$modelValue);					
			};
			
			$element.change(function(e)
			{
				// Update Model
				scope.$evalAsync(function()
				{
					ngModel.$setViewValue($element.select2('val'));
					//console.log("Select 2 Change", ngModel.$modelValue);
				});				
			});
		}
		
		// Expose to parent controller
		if(!scope.select2)
		{
			scope.select2 = {};
		}
		
		if(typeof attr.id != 'undefined')
		{
			scope.select2[attr.id] = this;
		}
	}
	
	Select2.prototype.setupMethods = function(scope, element, attr)
	{
		if(attr.hasOwnProperty('select2Open'))
		{
			element.on('select2-open', function()
			{
				scope.$evalAsync(function()
				{
					scope.select2Open = true;
				});
			});
			
			element.on('select2-close', function()
			{
				scope.$evalAsync(function()
				{
					scope.select2Open = false;
				});
			});
			
			scope.$watch('select2Open', function(new_val, ol_val)
			{
				if(new_val && new_val != ol_val)
				{
					element.select2('open');
				}
				else
				{
					element.select2('close');
				}
			})
		}
				
	}
	
	return Select2;	
});