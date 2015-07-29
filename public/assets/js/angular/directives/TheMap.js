
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
		
		map.loadSVG(src);
		
		// Change selection
		scope.$watch('selectedDesk', function(new_desk)
		{
			var selected = map.getSelectedDesk();
			
			if(!selected || selected.id() != new_desk|0)
			{
				map.selectDesk(new_desk);
			}
		});
	}
	
	return TheMap;	
});