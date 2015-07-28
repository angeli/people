<!DOCTYPE html>
<html>
	<head>
		<title>Map Test</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<script src="assets/js/vendor/require.js/require.js"></script>
		
		
		<script>
			require.config(
			{
				baseUrl		: 'assets/js',
				paths		: 
				{
					'jquery'	: 'vendor/jquery/jquery',
					'kinetic'	: 'jquery.kinetic.min',
				},
				
				shim : 
				{
					'kinetic' :
					{
						deps : ['jquery']
					},
					
					'jquery.svg' : 
					{
						deps	: ['jquery'],	
						exports : '$',
					}
				}	
			});
		</script>
		
		<style type="text/css">
			
			#MapContainer
			{
				border	: 4px double black;
				width	: 1024px;
				height	: 768px;
				overflow: scroll;
				
				top		: 20px;
				left	: 20px;
				
				position: relative;
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
		
		<div id="MapContainer"></div>
		
		<div class="Menu">
			<button class="btn zoom-in">Zoom In</button>
			<span id="ZoomVal"></span>
			<button class="btn zoom-out">Zoom Out</button>
		</div>	
		<script>
			
			"use strict;";
			
			require(['map/Map'], function(Map)
			{
				var map = new Map("#MapContainer");
				
				map.loadSVG('assets/svg/Office.svg').then(function(){map.zoom(150)});
				
				console.log("Map", map);
				
				var zoom = 100;
				
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
