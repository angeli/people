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
		<div id="PeopleApp" ng-controller="PeopleCtrl as mainCtrl">
			
			<!--Navigation Bar-->
			<nav class="navbar navbar-default">
				<div class="container-fluid">
					<!-- Brand and toggle get grouped for better mobile display -->
					<div class="navbar-header">
						<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						</button>
						<a class="navbar-brand" href="#">People 1.0</a>
					</div>

					<!-- Collect the nav links, forms, and other content for toggling -->
					<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

						<ul class="nav navbar-nav">
							<!--Possible nav buttons here-->
						</ul>
						
						<form class="navbar-form navbar-left" role="search"> 
							<div class="form-group">
								<input ng-model="testCtrl.desk_id" ng-model-options="{debounce: {default: 500}}" placeholder="Desk ID" class="form-control"/>
							</div>							
						</form>
						
					</div><!-- /.navbar-collapse -->
				</div><!-- /.container-fluid -->
			</nav>
			
			
				
			<the-map ng-src="assets/svg/Office.svg" selected-desk="testCtrl.desk_id"></the-map>			
			
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