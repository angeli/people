define('ngService/PeopleApi', ['ngService/Abstract'], function(AbstractService)
{
	var PeopleApi = function($http, $q)
	{
		this.http	= $http;
		this.q		= $q;
	};

	PeopleApi.prototype = new AbstractService;

	PeopleApi.prototype.getAllDesks = function()
	{
		var self = this;
		var options = [];
		var def		= this.q.defer();

		setTimeout(function() {

			self.http.get('/api/desks', options)
			.success(function(result)
			{
				console.log("Success", result);
				def.resolve(result);
			})
			.error(function(result)
			{
				console.log("Failed!", result);
				def.reject(result);
			});
		}, 1000);

		return def.promise;
	};

	PeopleApi.prototype.getDesk = function(desk)
	{
		var self	= this;
		var options	= [];
		var def		= this.q.defer();

		var uri = '/api/desks/' + desk;

		setTimeout(function() {

			self.http.get(uri, options)
			.success(function(result)
			{
				console.log("Success", result);
				def.resolve(result);
			})
			.error(function(result)
			{
				console.log("Failed!", result);
				def.reject(result);
			});
		}, 1000);

		return def.promise;
	};

	return PeopleApi;
});