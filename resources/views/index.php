<!DOCTYPE html>
<html>
	<head>
        <title>People 1.0</title>
		<meta charset="UTF-8">
		
		<script src="assets/js/vendor/require.js/require.js"></script>
		<script src="assets/js/require.config.js"></script>	
		
		<link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css"/>
		
	</head>
    <body>
		<div id="PeopleApp" class="content">
			<h1>Angular awaits!</h1>
			<h2>Create pages and shits yo!</h2>
			
			<p ng-controller="TestCtrl as testCtrl">
				{{testCtrl.test}}
			</p>
			
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