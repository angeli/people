define('ngService/PeopleApi', ['ngService/Abstract'], function(AbstractService)
{
	var PeopleApi = function($http, $q)
	{
		this.http	= $http;
		this.q		= $q;

		this.people = [];
		this.loadPeople();
	};

	PeopleApi.prototype = new AbstractService;

	PeopleApi.prototype.loadPeople = function()
	{
		var self = this;

		//self.people = [];

		this.getAllDesks().then(
			function(data)
			{
				console.log(data);
				self.people = data;
//				for (i in data)
//				{
//					var person = data[i];
//
//					self.people.push({id: person.id, name: person.name, user_id: person.user_id, position: person.job, department: person.dep, mail: person['e-mail'], desk: person.id});
//				}
			},
			function(fail)
			{
				self.people = [];
			}
			,function(update)
			{
			}
		);
	};

	PeopleApi.prototype.getAllDesks = function()
	{
		var self	= this;
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
		if(this.people.length > 0)
		{
			for(i in this.people)
			{
				var person = this.people[i];

				if(person.id == desk)
				{
					return person;
				}
			}
		}

		return false;
	};

	PeopleApi.prototype.isAdminUser = function()
	{
		var self	= this;
		var options	= [];
		var def		= this.q.defer();

		setTimeout(function() {
			self.http.get('/api/user', options)
			.success(function(result)
			{
				def.resolve(result);
			})
			.error(function(result)
			{
				def.reject(result);
			});
		}, 1000);

		return def.promise;
	}

	return PeopleApi;
});