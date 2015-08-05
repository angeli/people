define('ngService/PeopleApi', ['ngService/Abstract'], function(AbstractService)
{
	var PeopleApi = function($http, $q)
	{
		this.http	= $http;
		this.q		= $q;

		this.loadPeople(false);
	};

	PeopleApi.prototype = new AbstractService;

	PeopleApi.prototype.loadPeople = function(forced)
	{
		var self = this;

		if(typeof self.people !== 'object' || forced)
		{
			this.getAllDesks().then(
				function(data)
				{
					console.log(data);
					self.people = data;
				},
				function(fail)
				{
					self.people = [];
				}
			);
		}
	};

	PeopleApi.prototype.getAllDesks = function()
	{
		var self	= this;
		var options = [];
		var def		= this.q.defer();

		setTimeout(function() {
			self.http.get('/api/user', options)
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
		if(typeof this.people === 'object')
		{
			for(i in this.people)
			{
				var person = this.people[i];

				if(person.desk == desk)
				{
					return person;
				}
			}
		}

		return false;
	};

	PeopleApi.prototype.changeDesk = function(user, from, to)
	{
		var self		= this;
		var options		= {};
		options.from	= parseInt(from);
		options.to		= parseInt(to);
		var def			= this.q.defer();
		var uri			= '/api/user/' + user;
console.log(options);

		setTimeout(function() {
			self.http.put(uri, options)
			.success(function(result)
			{
				console.log("Success", result);
				def.resolve(result);
			})
			.error(function(result)
			{
				self.loadPeople(true);
				console.log("Failed!", result);
				def.reject(result);
			});
		}, 1000);

		return def.promise;
	};

	PeopleApi.prototype.isAdminUser = function()
	{
		if(typeof this.people === 'object')
		{
			for(i in this.people)
			{
				var person = this.people[i];

				if( ("current" in person) && person.edit === true)
				{
					return true;
				}
			}
		}

		return false;
	};

	PeopleApi.prototype.getStandingPeople = function()
	{
		var standing_people = [];

		if(typeof this.people === 'object')
		{
			for(i in this.people)
			{
				var person = this.people[i];

				if( person.desk === null)
				{
					standing_people.push({u_id: person.u_id, u_name: person.u_name, job: person.job});
				}
			}
		}
		standing_people.sort(function(a, b){
			if(a.u_name > b.u_name)
			{
				return 1;
			}

			if(a.u_name < b.u_name)
			{
				return -1;
			}

			if(a.u_name == b.u_name)
			{
				return 0;
			}
		});
		return standing_people;
	};

	return PeopleApi;
});