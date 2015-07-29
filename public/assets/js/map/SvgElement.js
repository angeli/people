
define('map/SvgElement', ['jquery.svg'], function()
{
	"use strict";
	
	var SvgElement = function()
	{
		
	}
	
	SvgElement.prototype.init = function(element)
	{
		this.$element = $(element);		
	}
	
	/**
	 * 
	 * @param {String} cls
	 * @returns {Void}
	 */
	SvgElement.prototype.toggleClass = function(cls, force)
	{
		var cssClass	= this.$element.attr('class');
		
		if(cssClass.match(cls))
		{
			cssClass = cssClass.replace(cls, '');
		}
		else
		{
			cssClass += ' ' + cls;
		}

		this.$element.attr('class', cssClass);
	}
	
	/**
	 * Add a css class to element
	 * 
	 * @param {String} cls
	 * @returns {undefined}
	 */
	SvgElement.prototype.addClass = function(cls)
	{
		var cssClass = this.$element.attr("class");
		
		if(!cssClass.match(cls))
		{
			cssClass += " " + cls;
			
			this.$element.attr('class', cssClass);
		}
	}
	
	/**
	 * Remove a css class
	 * 
	 * @param {String} cls
	 * @returns {undefined}
	 */
	SvgElement.prototype.removeClass = function(cls)
	{
		var cssClass = this.$element.attr("class");
		
		this.$element.attr('class', cssClass.replace(cls, ''));
	}
	
	/**
	 * Add on click callback
	 * 
	 * @returns {SvgElement}
	 */
	SvgElement.prototype.on = function()
	{
		this.$element.on.apply(this.$element, arguments);
		return this;
	}
	
	/**
	 * Unbind event handler
	 * 
	 * @returns {SvgElement}
	 */
	SvgElement.prototype.unbind = function()
	{
		this.$element.unbind.apply(this.$element, arguments);
		return this;
	}
	
	/**
	 * Return element width in pixels
	 * 
	 * @returns {Int}
	 */
	SvgElement.prototype.width = function()
	{
		return this.getBBox().width;
	}
	
	/**
	 * Return element height in pixels
	 * 
	 * @returns {Int}
	 */
	SvgElement.prototype.height = function()
	{
		return this.getBBox().height;
	}
	
	/**
	 * Returns bounding box rectangle
	 * 
	 * @returns {Object}
	 */
	SvgElement.prototype.getBBox = function()
	{
		return this.$element[0].getBBox();
	}
	
	SvgElement.prototype.offset = function()
	{
		return this.$element.offset();
	}
	
	SvgElement.prototype.position = function()
	{
		var pos		= this.$element.position();
		return pos;
		
		var $parent	= this.root().parent();
		
//		return pos;
		
		var parentPos = $parent.position();
		
		pos.left += parentPos.left;
		pos.top	 += parentPos.top;
		
		return pos;
		
		
	}
	
	SvgElement.prototype.append = function(element)
	{
		var $element = $(element);
		
		var box		= this.getBBox();
		var ebox	= $element[0].getBBox(); 
		
		var pos = 
		{
			x : ebox.x - box.x,
			y : box.y + ebox.y,
		}
				
		var transform = ['translate(', pos.x, ',', pos.y, ')'].join('');
				
		$element.attr("transform", this.$element.find("DeskTemplate").attr("transform"));
		
		this.$element.append($element);
	}
	
	SvgElement.prototype.svg = function()
	{
		return this.$element.parents("svg").first().parent().svg("get");
	}
	
	SvgElement.prototype.root = function()
	{
		return this.svg().root();
	}
	
	return SvgElement;
	
});


