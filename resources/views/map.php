<!DOCTYPE html>
<html>
	<head>
		<title>Map Test</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<script src="assets/js/vendor/require.js/require.js"></script>
		<script src="assets/js/require.config.js"></script>	
		
		<style type="text/css">
			
			#MapContainer
			{
				border	: 4px double black;
				width	: 1024px;
				height	: 768px;
				overflow: scroll;				
			}
			
			.Desk
			{
				cursor: pointer;
			}
			
			.Desk .highlight
			{
				display: none;
			}
			
			.Desk.selected .highlight
			{
				display:initial;
			}
			
			.Desk.selected rect
			{
				fill : Red !important;
			}
			
			.Desk.free rect
			{
				fill: Lime !important;
			}
			
			.Menu
			{
				position: fixed;
				top: 20px;
			}		
			
			
		</style>
			
	</head>
	
	<body>
		
		<div id="PeopleApp" ng-controller="TestCtrl as testCtrl">
			
			<div>
				{{testCtrl.test}}
			</div>
			
			<div id="MapContainer"></div>
		</div>
		
		
		<script>
			
			"use strict;";
			
			require(['ngApp/PeopleApp','map/Map'], function(PeopleApp, Map)
			{
				// App Boot
				var app = new PeopleApp();
				app.bootstrap('#PeopleApp');
		
		
				var map = new Map("#MapContainer");
				
				map.loadSVG('assets/svg/Office.svg').then(function(){map.zoom(150)});
				
				console.log("Map", map);
				
				$(".btn.zoom-in").click(function(e) { map.zoomIn();	});
				$(".btn.zoom-out").click(function(e){ map.zoomOut(); });
				
				map.on("map.zoomed", function(e, map)
				{
					console.log("Map Zoomed", e, map);
					$("#ZoomVal").html(map.zoom() + "%");
				});
				
				map.on("map.desk-selected", function(e, map, desk, old)
				{
					console.log("Desk selected", desk, old);
				});	
				
			});	
			
			
			
		</script>	
		
	</body>	
	
</html>
