define('ngService/PeopleApi', ['ngService/Abstract'], function(AbstractService)
{
	var PeopleApi = function($http, $q)
	{
		this.http	= $http;
		this.q		= $q;

		this.getAllDesks(false);
	};

	PeopleApi.prototype = new AbstractService;

	/**
	 * Gets all desks and users info
	 *
	 * @param {type} forced
	 * @returns {_L1.PeopleApi.prototype.getAllDesks.q@call;defer.promise}
	 */
	PeopleApi.prototype.getAllDesks = function(forced)
	{
		var self	= this;
		var options = [];
		var def		= this.q.defer();

		if(typeof self.people !== 'object' || forced)
		{
			self.http.get('/api/user', options)
			.success(function(result)
			{
				console.log("Get Desks Success", result);
				self.people = result;
				def.resolve(result);
			})
			.error(function(result)
			{
				console.log("Get Desks Failed!", result);
				def.reject(result);
			});
		}
		else
		{
			def.resolve(self.people);
		}

		return def.promise;

	};

	/**
	 * Loads info for selected desk
	 *
	 * @param {type} desk
	 * @returns {Boolean|_L1.AbstractService.getDesk.person|_L1.PeopleApi.prototype.getDesk@arr;people}
	 */
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

	/**
	 * Make call for desk changes
	 *
	 * @param {type} user
	 * @param {type} from
	 * @param {type} to
	 * @returns {_L1.PeopleApi.prototype.changeDesk.q@call;defer.promise}
	 */
	PeopleApi.prototype.changeDesk = function(user, from, to)
	{
		var self		= this;
		var options		= {};
		options.from	= parseInt(from);
		options.to		= parseInt(to);
		var def			= this.q.defer();
		var uri			= '/api/user/' + user;
		console.log(options);

			self.http.put(uri, options)
			.success(function(result)
			{
				console.log("Change Desk Success", result);
				def.resolve(result);
			})
			.error(function(result)
			{
				self.getAllDesks(true);
				console.log("Change Desk Failed!", result);
				def.reject(result);
			});

		return def.promise;
	};

	return PeopleApi;
});