
define('map/Desk', ['map/SvgElement'], function(SvgElement)
{
	"use strict";
	
	var Desk = function(element)
	{
		this.init(element);
		this.initDesk();
	}
	
	Desk.prototype = new SvgElement;
	
	/**
	 * Returns the desk ID
	 * 
	 * @returns {Int}
	 */
	Desk.prototype.id = function()
	{
		return this.$element.find('text').first().text() | 0;
	}
	
	Desk.prototype.initDesk = function()
	{
		var self = this;		
		this.$element.attr('data-desk-id', this.id());	
		
		this.$element.find(".highlight").attr("style", "");
		
		this.isFree(Math.random() >= 0.5);
	}
	
	/**
	 * Get / Set the element's selected state
	 * 
	 * @param {Boolean} value
	 * @returns {Boolean}
	 */
	Desk.prototype.isSelected = function(value)
	{
		if(typeof value == "boolean")
		{
			// Toggle seleted based on value
			value ? this.addClass("selected") : this.removeClass("selected");
		}
		
		return this.$element.is('.selected');
	}
	
	/**
	 * Get / Set desk free status
	 */
	Desk.prototype.isFree = function(value)
	{
		if(typeof value === "boolean")
		{
			this.is_free = value;
			
			if(value)
			{
				this.addClass("free");
			}
			else
			{
				this.removeClass("free");
			}
		}
		
		return (this.is_free == true);
	}
	
	Desk.prototype.toString = function()
	{
		return "Desk " + this.id();
	}
	

	
	
	
	
	
	return Desk;
});

