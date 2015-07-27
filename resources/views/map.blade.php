<!DOCTYPE html>
<html>
	<head>
		<title>Map Test</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<script src="{{ URL::asset("assets/js/vendor/require.js/require.js")}}"></script>
		
		
		<script>
			require.config(
			{
				baseUrl		: '{{ URL::asset("assets/js/") }}',
				paths		: 
				{
					'jquery' : 'vendor/jquery/jquery',					
				},
				
				shim : 
				{
					'jquery.svg' : 
					{
						deps	: ['jquery'],			
					}
				}	
			});
		</script>
		
		<style type="text/css">
			
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
		
		<div id="SvgContainer"></div>
		
		<div class="Menu">
			<button class="btn zoom-in">Zoom In</button>
			<button class="btn zoom-out">Zoom Out</button>
		</div>	
		<script>
			
			"use strict;";
			
			require(['map/Map'], function(Map)
			{
				var map = new Map("#SvgContainer");
				
				map.loadSVG('assets/svg/Office.svg').then(function(){map.zoom(150)});
				
				console.log("Map", map);
				
				var zoom = 100;
				
				$(".btn.zoom-in").click(function(e) { map.zoomIn();	});
				$(".btn.zoom-out").click(function(e){ map.zoomOut(); });
			});		
			
		</script>	
		
	</body>	
	
</html>
