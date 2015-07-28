
define('ngFilter/Ordinal', ['angular'], function()
{
	"use strict";
	
	/**
	 * Returns the ordinal representation of an integer (1st, 2nd ... Nth)
	 * 
	 * @param {Int} input
	 * @returns {String}
	 */
	var Ordinal = function(input)
	{
		input = input | 0;
		
		switch(input)
		{
			case 1 : return '1st';
			case 2 : return '2nd';
			case 3 : return '3rd';
			default: return input + 'th';
		}
	}
	
	return Ordinal;
});