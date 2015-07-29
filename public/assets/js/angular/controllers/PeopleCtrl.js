
define('ngController/PeopleCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var PeopleCtrl = function($scope)
	{
		// Test desk selection event
		$scope.$on("map.desk-selected", function(e, args)
		{
			var map		= args[0];
			var desk	= args[1];
			
			console.log("A desk is being selected", map, desk);
			$scope.desk_id = desk.id();
		});
		
		$scope.$on("map.ready", function(e, args)
		{
			var map = args[0];
			
			console.log("Da map is loaded", map);
		});
	}
	
	PeopleCtrl.prototype = new AbstractCtrl;
	
	return PeopleCtrl;
});


