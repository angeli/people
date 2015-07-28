define('ngFilter/Capitalize', ['angular'], function()
{
	"use strict";

	var CapitalizeFilter = function(input, all)
	{
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}

	return CapitalizeFilter;
});