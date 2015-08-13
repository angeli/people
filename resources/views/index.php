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
						<a class="navbar-brand" href="#">People 1.1</a>
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

			<div class="instruction" ng-if="mainCtrl.current_user.edit && mainCtrl.map.getSelectedDesk().isFree()" ng-cloak>
				<h1>Select user for desk {{mainCtrl.map.getSelectedDesk().id()}}</h1>
			</div>

			<div ng-controller="UserInfoCtrl as uiCtrl">
				<div ng-show="uiCtrl.desk !== false && uiCtrl.desk > 0 && !uiCtrl.loader" class="UserCtrl" ng-cloak>
					<div class="row">
						<div class="col-md-4">
							<img src="http://sofwks0385/pic/{{uiCtrl.user_id}}.jpg" class="user-picture" ng-if="uiCtrl.user_id > 0"/>
							<i ng-if="uiCtrl.user_id < 0" class="fa fa-user-secret"></i>
						</div>

						<div class="col-md-7">
							<div class="user-name">
								<div>{{uiCtrl.fname}}</div>
								<div id="user-lname">{{uiCtrl.lname}}</div>
							</div>
							<div class="user-position">{{uiCtrl.position}}</div>
						</div>
						<div class="col-md-1">
							<div class="lock" ng-if="uiCtrl.admin" ng-click="uiCtrl.changeLock()"><i class="{{uiCtrl.is_locked? 'fa fa-lock': 'fa fa-unlock'}}"></i></div>
						</div>
					</div>

					<div class="row user-office-info">
						
						<div class="row user-team" ng-if="uiCtrl.user_id > 0">
							<span class="col-md-4">Team:</span> 
							<span class="col-md-8">{{uiCtrl.team}}</span>
						</div>
						
						<div class="row user-team" ng-if="uiCtrl.user_id > 0">
							<span class="col-md-4">Department:</span> 
							<span class="col-md-8">{{uiCtrl.department}}</span>
						</div>
												
						<div class="row user-team" ng-if="uiCtrl.admin && uiCtrl.user_id > 0">
							<span class="col-md-4">Skype:</span> 
							<span class="col-md-8">{{uiCtrl.skype}}</span>
						</div>
						
						<div class="row user-team" ng-if="uiCtrl.admin && uiCtrl.user_id > 0">
							<span class="col-md-4">Int. Phone:</span> 
							<span class="col-md-8">{{uiCtrl.int_phone}}</span>
						</div>
						
						<div class="row">
							<span class="col-md-4">
								Office Desk:
							</span>
							
							<div class="col-md-8">	
								<span class="user-team" ng-if="!uiCtrl.edit">{{uiCtrl.desk}}</span>
								
								<div class="user-team edit" ng-if="uiCtrl.edit">
									
									<select ng-model="uiCtrl.destination_desk">
										<option ng-repeat="free_desk in uiCtrl.free_desks" value="{{free_desk}}">{{free_desk}}</option>
									</select>
								</div>
							</div>
						</div>
					</div>

					<div class="row user-office-info">
						

						<div class="edit-ok col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.changeDesk()"><i class="fa fa-pencil"></i></div>
							<div class="col-md-1"></div>
						<div class="edit-leave col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.leaveDesk()"><i class="fa fa-close"></i></div>
					</div>

					<div class="row user-mail">
						<div><a href="mailto:{{uiCtrl.mail}}">{{uiCtrl.mail}}</a></div>
					</div>

				</div>
				<div ng-if="uiCtrl.loader" class="loader" ng-cloak><img src="/assets/images/hex-loader2.gif" alt="" class="loader-image"/></div>

				<div class="free-desks-select" ng-if="uiCtrl.edit && uiCtrl.desk !== false && uiCtrl.desk > 0 && uiCtrl.free_desks.length > 0 && !uiCtrl.loader" ng-cloak>
					Available desks:
					<div ng-repeat="free_desk in uiCtrl.free_desks">
						<div ng-model="uiCtrl.destination_desk" ng-click="uiCtrl.destination_desk = free_desk; uiCtrl.changeDesk()" class="free_desk">{{free_desk}}</div>
					</div>
				</div>

				<div class="current-user">{{uiCtrl.current_user}}</div>
			</div>


			<search ng-if="mainCtrl.isReady()" map="mainCtrl.map" current-user="mainCtrl.current_user"></search>

			<div ng-if="mainCtrl.isReady()" class="bottom-info ng-cloak">

				<strong ng-if="mainCtrl.deskless_people > 0" class="deskless">
					{{mainCtrl.deskless_people}} people without seats
				</strong>

				<strong ng-if="mainCtrl.free_desks > 0" class="free-desks">
					{{mainCtrl.free_desks}} free seats
				</strong>

				<strong ng-if="mainCtrl.free_desks == 0" class="no-free-desks">
					<i class="fa fa-warning"></i>
					No free desks
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
