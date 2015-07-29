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
		<link rel="stylesheet" type="text/css" href="/assets/css/user.css"/>
		<link rel="stylesheet" type="text/css" href="/assets/css/font-awesome.min.css"/>

	</head>
    <body>
		<div id="PeopleApp" class="container">


			<the-map ng-src="assets/svg/Office.svg" selected-desk="testCtrl.desk_id"></the-map>

			<div class="user-info" ng-controller="UserInfoCtrl as uiCtrl">

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
					<div class="col-md-6">
						<div class="user-team">Team: {{uiCtrl.team}}</div>
						<div class="user-team">Departament: {{uiCtrl.departament}}</div>

						<div class="user-team" ng-if="!uiCtrl.edit">Office seat: {{uiCtrl.seat}}</div>
						<div class="user-team edit" ng-if="uiCtrl.edit">
							Office seat: <input type="text" ng-model="uiCtrl.seat" size="2">
						</div>

					</div>

					<div class="edit-ok col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.chengeSeat()"><i class="fa fa-pencil"></i></div>
						<div class="col-md-1"></div>
					<div class="edit-leave col-md-1" ng-if="uiCtrl.edit" ng-click="uiCtrl.leaveSeat()"><i class="fa fa-close"></i></div>
				</div>

				<div class="row user-mail">
					<div><a href="mailto:{{uiCtrl.mail}}">{{uiCtrl.mail}}</a></div>
				</div>

			</div>

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