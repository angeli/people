<!DOCTYPE html>
<html>
	<head>
        <title>People 1.0</title>
		<meta charset="UTF-8">

		<script src="/assets/js/vendor/require.js/require.js"></script>
		<script src="/assets/js/require.config.js"></script>

		<link rel="stylesheet" type="text/css" href="/assets/css/select2.min.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/bootstrap.min.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/bootstrap-theme.min.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/the-map.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/user.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/search.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/font-awesome.min.css"/>

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
						
					</div><!-- /.navbar-collapse -->
				</div><!-- /.container-fluid -->
			</nav>


			<!--The Map-->
			<the-map ng-src="assets/svg/OfficeSmall.svg" selected-desk="testCtrl.desk_id"></the-map>		

			<div ng-show="uiCtrl.desk" class="UserCtrl" ng-controller="UserInfoCtrl as uiCtrl">
				<div class="user-info">
					<div class="row">
						<div class="col-md-4"><img src="http://sofwks0385/pic/{{uiCtrl.user_id}}.jpg" class="user-picture" /></div>

						<div class="col-md-7">
							<div class="user-name">
								<div>{{uiCtrl.fname}}</div>
								<div id="user-lname">{{uiCtrl.lname}}</div>
							</div>
							<div class="user-position">{{uiCtrl.position}}</div>
						</div>
						<div class="col-md-1">
							<div class="lock" ng-if="uiCtrl.admin" ng-click="uiCtrl.releseLock()"><i class="{{uiCtrl.is_locked? 'fa fa-lock': 'fa fa-unlock'}}"></i></div>
						</div>
					</div>

					<div class="row user-office-info">
						<div class="col-md-10">
							<div class="user-team">Team: {{uiCtrl.team}}</div>
							<div class="user-team">Department: {{uiCtrl.department}}</div>
						</div>
					</div>
					
					<div class="row user-office-info">
						<div class="col-md-6">
							<div class="user-team" ng-if="!uiCtrl.edit">Office desk: {{uiCtrl.desk}}</div>
							<div class="user-team edit" ng-if="uiCtrl.edit">
								Office desk: <input type="text" ng-model="uiCtrl.desk" size="2">
							</div>

						</div>

						<div class="edit-ok col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.chengeDesk()"><i class="fa fa-pencil"></i></div>
							<div class="col-md-1"></div>
						<div class="edit-leave col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.leaveDesk()"><i class="fa fa-close"></i></div>
					</div>

					<div class="row user-mail">
						<div><a href="mailto:{{uiCtrl.mail}}">{{uiCtrl.mail}}</a></div>
					</div>
				</div>
			</div>

									
			<search ng-if="mainCtrl.isReady()" map="mainCtrl.map"></search> 
			
			<div ng-if="mainCtrl.isReady()" class="bottom-info">
								
				<strong class="deskless">
					? people without seats 
				</strong>
				
				<strong class="free-desks">
					{{mainCtrl.freeDesksCount()}} free seats
				</strong>
				
			</div>
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
