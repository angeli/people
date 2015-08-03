
define('ngDirective/TheMap', ['ngDirective/Abstract', 'map/Map'], function(AbstractDir, Map)
{
	var TheMap = function()
	{
		this.template = "<div class='map-container'></div>";
		this.restrict = "E";
		this.replace  = true;
		
		this.scope = 
		{
			selectedDesk : '=',
		}
	}
	
	TheMap.prototype = new AbstractDir;
	
	TheMap.prototype.link = function(scope, element, attr)
	{
		var map = new Map(element);
		var src = attr.ngSrc;
		
		map.loadSVG(src).then(function()
		{
			// Emit Ready event when map is finished loading
			scope.$emit('map.ready', [map]);
			scope.$broadcast('map.ready', [map]);
		});
		
		// Change selection
		scope.$watch('selectedDesk', function(new_desk)
		{
			var selected = map.getSelectedDesk();
			
			if(!new_desk)
				return;
			try
			{
				if(!selected || selected.id() != new_desk|0)
				{
					map.selectDesk(new_desk);
				}
			}
			catch(e)
			{
				
			}
		});
		
		// Bind selection change
		map.on("map.desk-selected", function(e, map, desk)
		{
			scope.$emit("map.desk-selected", [map, desk]);
			scope.$broadcast("map.desk-selected", [map, desk]);
		});
		
		
	}
	
	return TheMap;	
});
