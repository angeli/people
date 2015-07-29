<!DOCTYPE html>
<html>
	<head>
        <title>People 1.0</title>
		<meta charset="UTF-8">
		
		<script src="/assets/js/vendor/require.js/require.js"></script>
		<script src="/assets/js/require.config.js"></script>	
		
		<link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/bootstrap-theme.min.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/the-map.css"/>
		
	</head>
    <body>
		<div id="PeopleApp" class="container">
			<h1>Angular awaits!</h1>
			<h2>Create pages and shits yo!</h2>
			
			<p ng-controller="TestCtrl as testCtrl">
				{{testCtrl.test}}
			</p>
			
			<the-map ng-src="assets/svg/Office.svg" selected-desk="testCtrl.desk_id"></the-map>
			<input ng-model="testCtrl.desk_id" ng-model-options="{debounce: {default: 500}}" placeholder="Desk ID"/>
			
			
		</div>
		
		<script type="text/javascript">
			
			"use strict;";
			
			
			require(['ngApp/PeopleApp','map/Map'], function(PeopleApp, Map)
			{
				// App Boot
				var app = new PeopleApp();
				app.bootstrap('#PeopleApp');
			});
			
			
			
		</script>
	</body>
</html>