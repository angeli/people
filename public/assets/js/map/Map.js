
define('map/Map', ['map/Desk','jquery.svg', 'kinetic'], function(Desk)
{
	"use strict";
	
	var Map = function(container)
	{
		this.zoom_val	= 100;
		this.$container = $(container).first();
		
		this.max_zoom	= 200;
		this.min_zoom	= 1;
				
		if(this.$container.length != 1 )
		{
			throw new Error("Invalid container selector " + container);
		}
		
		this.desks			= null;
		this._selected_desk = null;
	}
	
	/**
	 * Prepare the svg container
	 * 
	 * @returns {undefined}
	 */
	Map.prototype.setupSVG = function()
	{
		var self = this;
		
		var def = $.Deferred();
		
		this.$container.svg(
		{
			onLoad: function()
			{
				self.$container.kinetic();
				
				// Because of Firefox
				self.$container.on("mousedown", function(e)
				{
					e.preventDefault();
				});
				
				def.resolve(self);
			}
		});
		
		return def.promise();
	}
	
	/**
	 * Load the map from a file
	 * 
	 * @param {String} path
	 * @returns {Promise}
	 */
	Map.prototype.loadSVG = function(path)
	{
		var def		= $.Deferred();
		var self	= this; 
		
		this.setupSVG().done(function(self)
		{
			self.$container.svg("get").load(path, 
			{
				addTo: true,  
				changeSize: true, 
				onLoad: function()
				{
					self.initMap();
					def.resolve(self);
				}
			});
		});
		
		return def.promise();
	}
	
	Map.prototype.svg = function()
	{
		return this.$container.svg("get");
	}
	
	/**
	 * Returns the SVG root element
	 * 
	 * @returns {JQuery}
	 */
	Map.prototype.root = function()
	{
		return $(this.svg().root());
	}
	
	/**
	 * Perform initialization once a map is loaded
	 * 
	 * @returns {undefined}
	 */
	Map.prototype.initMap = function()
	{
		var self = this;
		
		this.initTemplates();
		this.unlinkClones();
		this.setupDesks();
		
		// Unselect desk on container click
		this.$container.click(function(e)
		{
			self.clearSelection();
		});		
	}
	
	/**
	 * Unlink clones from the loaded SVG so that 
	 * everything can be manipulated properly
	 * 
	 * @returns {undefined}
	 */
	Map.prototype.unlinkClones = function()
	{
		var count = 0;
		
		while(this.root().find('.Desk use').length > 0)
		{
			this.root().find('.Desk use').each(function(i, use)
			{
				var id		= $(use).attr("xlink:href");
				var $real	= $(id).clone();
				var $use	= $(use);
				
				// <!> Apparently, bot the real object and the clone's transforms must be applied,
				// in order for the stuff to display properly
				var real_transform	= $real.attr("transform");
				var clone_transform = $use.attr("transform");			

				var transform = (real_transform || '') + ' ' + (clone_transform || '');			

				$real.attr("transform", transform);
				$use.replaceWith($real);
			});
			
			if(++count > 100)
			{
				console.error("Infinite loop!");
				break;
			}
		}
	}
	
	/**
	 * Finds the needed template objects
	 * @returns {undefined}
	 */
	Map.prototype.initTemplates = function()
	{
		this.$highlightTpl = this.root().find(".DeskHighlight").first();
		this.$highlightTpl.attr('transform', '');
	}
	
	/**
	 * Perform desk initialization
	 * 
	 * @returns {undefined}
	 */
	Map.prototype.setupDesks = function()
	{
		// Setup desks 
		this.desks = [];
		var self	= this;
		
		this.root().find('.Desk').each(function(i, desk)
		{
			var desk = new Desk(desk);
			self.initDesk(desk);
			self.desks.push(desk);
		});
	}
	
	/**
	 * Performs initialization procedures on a desk
	 * 
	 * @param {Desk} desk
	 * @returns {undefined}
	 */
	Map.prototype.initDesk = function(desk)
	{
		var map = this;
		
		// Select desk on click
		desk.on('click', function(e)
		{
			e.stopPropagation();
			map.selectDesk(desk);			
		});
		
		
	}
	
	
	
	/**
	 * Get desk by ID
	 * 
	 * @param {Int} id
	 * @returns {Desk}
	 */
	Map.prototype.getDesk = function(id)
	{
		var desks = this.desks;
		
		for(var i in desks)
		{
			if(desks[i].id() == id)
			{
				return desks[i];
			}
		}
		
		return null;
	}
	
	/**
	 * Select a desk
	 * 
	 * @param {type} desk
	 * @returns {undefined}
	 */
	Map.prototype.selectDesk = function(desk)
	{
		var $hl = this.root().find(".Marker").first();
		
		var desks		= this.desks;
		var old_desk	= this._selected_desk;
		
		if(!(desk instanceof Desk))
		{
			desk = this.getDesk(desk | 0);
		}
		
		// Unselect previous
		if(this._selected_desk instanceof Desk)
		{
			this._selected_desk.isSelected(false);
			this._selected_desk = null;
		}
		
		// Select desk
		if(desk instanceof Desk)
		{
			desk.isSelected(true);
			this._selected_desk = desk;
			this.scrollToDesk(desk);
			
			this.$container.trigger("map.desk-selected", [this, desk, old_desk]);
		}
		else
		{
			throw new Error("Invalid desk! Unable to select!");
		}
	}
	
	/**
	 * Clears selected desk
	 * 
	 * @returns {undefined}
	 */
	Map.prototype.clearSelection = function()
	{
		if(this._selected_desk instanceof Desk)
		{
			this._selected_desk.isSelected(false);			
		}
		
		this.$container.trigger("map.desk-unselected", [this, this._selected_desk]);
		this._selected_desk = null;		
	}
	
	Map.prototype.getSelectedDesk = function()
	{
		return this._selected_desk;
	}
	
	Map.prototype.on = function()
	{
		this.$container.on.apply(this.$container, arguments);
	}
	
	/**
	 * Returns only the free, completely unoccupied desks
	 * 
	 * @returns {Array}
	 */
	Map.prototype.getFreeDesks = function()
	{
		var out = [];
		
		for(var i in this.desks)
		{
			var desk = this.desks[i];
			
			if(desk.isFree())
			{
				out.push(desk);
			}
		}
		
		return out;
	}
	
	

	
	/**
	 * Get / Set the map zoom level
	 * 
	 * @param {type} zoom
	 * @returns {Int}
	 */
	Map.prototype.zoom = function(zoom)
	{
		if(typeof zoom !== "undefined")
		{
			// Constrain zoom
			if(zoom > this.max_zoom)
				zoom = this.max_zoom;
			
			if(zoom < this.min_zoom)
				zoom = this.min_zoom;
			
			var width	= this.root().attr("width");
			var height	= this.root().attr("height"); 

			var scale = 
			{
				width : (width * zoom / 100) + 'px',
				height: (height* zoom / 100) + 'px',
			}

			this.$container.find('svg').css(scale);
			
			this.zoom_val = zoom;
			
			this.$container.trigger("map.zoomed", [this, 1]);
		}
		
		return this.zoom_val;
	}
	
	Map.prototype.zoomIn = function(value)
	{
		value = this.zoom_val + (value || 10);
		this.zoom(value);
	}
	
	Map.prototype.zoomOut = function(value)
	{
		value = this.zoom_val - (value || 10);
		this.zoom(value);
	}
	
	/**
	 * Scroll the map to a given desk
	 * 
	 * @param {int|Desk} desk
	 * @returns {undefined}
	 */
	Map.prototype.scrollToDesk = function(desk)
	{
		if(typeof desk === "number")
		{
			desk = this.getDesk(desk|0);			
		}
		
		if(desk instanceof Desk)
		{
			var pos = desk.offset();
			
			var scroll =
			{
				scrollTop		: (pos.top	- this.$container.height() / 2) + this.$container.scrollTop(),
				scrollLeft		: (pos.left - this.$container.width() / 2)	+ this.$container.scrollLeft(),
			}
			
			//this.selectDesk(desk);
			this.$container.animate(scroll);			
		}	
		else
		{
			throw new Error("Invalid desk!");
		}
	}
	
	return Map;
});



