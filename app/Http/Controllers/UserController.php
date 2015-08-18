<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Database\DatabaseManager;

use App\Model\User;
use App\Model\Desk;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(DatabaseManager $db, Request $request)
    {
		$users = User::select(	'u_id', 
								'u_name', 
								'e-mail', 
								'location',
								'skype',
								'int_phone',
								'desks.id as desk', 
								'departmants.job', 
								'departmants.dep',
								'departmants.users as dep_users',
								'rights.users as rights')
				
			->leftJoin('desks', 'users_id', '=', 'u_id')
			->leftJoin('rights', 'user_id', '=', 'u_id')
			->join('departmants', 'departmants.id', '=', 'departmant_id')

			# not quit / fired
			->where('departmant_id', '!=', 21)
			->get()
			->keyBy('u_id')
			->toArray();

		$host = getenv('COMPUTERNAME');

		if( !in_array($host, ['SOFWKS0188', 'SOFWKS0159', 'SOFWKS0140']) )
		{
			$host = explode('.', gethostbyaddr($request->server->get('REMOTE_ADDR')));
			$host = $host[0];
		}

		$res = $db->table('computers')->select('user_id')->where('name', '=', $host)->first();

		if( $res ) {
			$users[$res->user_id]['current'] = true;
			$users[$res->user_id]['edit'] = $this->checkUser($users[$res->user_id]);
		}
		
		// Apply data restrictions
		if(empty($res) || !$users[$res->user_id]['edit'])
		{
			$users = $this->filterRestrictedData($users);
		}
		
		$users = array_merge($users, $this->getSpecialUsers());
		
		return response()->json($users);
    }

	/**
	 * Filter out restricted data from users array
	 * 
	 * @param array $users
	 */
	protected function filterRestrictedData($users)
	{
		foreach($users as $key => $user)
		{
			unset($users[$key]['skype']);
			unset($users[$key]['int_phone']);
			unset($users[$key]['rights']);
		}
		
		return $users;
	}
	
	/**
	 * Retunrs a list of users for all desks currently marked for special purposes
	 * 
	 * @return type
	 */
	protected function getSpecialUsers()
	{
		$desks = Desk::select("*")->where("users_id", "<", "0")->get()->toArray();
		
		$users = [];
		$count = 0;
		
		foreach($desks as $desk)
		{
			$key = 'spec_' + $count++;
			
			// Busy Desk
			if($desk['users_id'] == -1)
			{
				$users[$key] = [
					'u_id'		=> $desk['users_id'],
					'u_name'	=> "Special Purpose",
					'desk'		=> $desk['id'],
					'job'		=> "The desk is currently used for a special, classified purpose."
				];
			}
		}
		
		return $users;
	}
	
	protected function checkUser($user)
	{
		$user = (object)$user;
		
		$allowed = 		
		[
			8,		// Dobromir Grigorov
			14,		// Dobrin Jordanov
			23,		// Nikola Stoyanov
			62,		// Dimitar Mitev
			75,		// Ivan Protopopov
			76,		// Tanko Shokerov
			80,		// Boyan Iliev
			97,		// Yordan Dichev
			107,	// Olga Malcheva
			110,	// Yasen Tursunov
			114,	// Chavdar Stefanov
			120,	// Ioana Alexova
			127,	// Katya Bogdanliyska
			137,	// Stefan Cherelikov
			155,	// Ventsislav Mneev
			160,	// Georgi Stoychev
			172,	// Kristiyan Nikolov
			180,	// Yanko Hristov
			187,	// Tsvetelina Yurukova
			194,	// Stanislav Dimitrov
			221,	// Lyuboslav Kashinov
			224,	// Nikolay Yotkov Yotov
			239,	// Stiliyan Mirchev
			253,	// Nikola Georgiev
			255,	// Todor Bonov
			335,	// Tsvetomir Milyovski
			336,	// Silviya Krasteva
			340,	// Volodya Ilchev
			376,	// Viktor Stankov
			380,	// Zheko Stefanov
			385,	// Borislav Nenkov
			386,	// Miryana Nyagolova
			390,	// Konstantin Krastev
			418,	// Georgi Dimitrov
			461,	// Nikola Shabanov
			480,	// Georgi Blagov
			532,	// Slavi Georgiev
			540,	// Georgi Milenov Tsanev
			
			17,		// Angel Iliikov
			18,		// Dimo Dimov
			22,		// Alexander Danev
			40,		// Tihomir Tsvetkov
			48		// Nikolay Dachin				
		];
		
		if( in_array($user->u_id, $allowed) )
		{
			return true;
		}
		
		if($user->rights == 1)
		{
			return true;
		}
		
		if($user->dep_users == 1)
		{
			return true;
		}
	
		return false;

	}

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return new Response("Not Implemented", 501);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        return new Response("Not Implemented", 501);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        return new Response("Not Implemented", 501);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        return new Response("Not Implemented", 501);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
		$from = $request->input('from', '');
		$to = $request->input('to', '');

		if( empty($id) || $from === '' || $to === '' ) {
			return new Response("Mandatory parameter(s) are missing.", 405);
		}

		try {

			if($id > 0)
			{
				$user = User::findOrFail($id);
				$old_desk = $user->desk;
			}
			else if($id < 0)
			{
				// Busy Flag
				$old_desk = Desk::find($from);
			}
			else
			{
				return new Response("Invalid user id.", 405);
			}

			#print_r( $old_desk->toArray() );

			if( $old_desk != null && $from != $old_desk->id ) {
				return new Response("Out of sync, user was moved someplace else already.", 409);
			}

			if( $to != 0 ) {
				$new_desk = Desk::findOrFail($to);
				
				if( !$this->checkEmptyDesk($new_desk)) 
				{
					return new Response("Out of sync, target desk is not empty.", 409);
				}
			} else {
				$id = 0;
			}

			$ret = [];

			if( $old_desk != null ) {
				$old_desk->users_id = 0;
				$old_desk->save();
				$ret['old'] = $old_desk->toArray();
			}

			if( isset($new_desk) )
			{
				$new_desk->users_id = intval($id);
				$new_desk->save();

				$ret['new'] = $new_desk->toArray();
			}

			return response()->json( $ret );


		}
		catch (\Exception $e) {
			return new Response("There was an error while processing the update request: " . $e->getMessage(), 500);
		}
    }
	
	/**
	 * Returns true if a given desk is empty 
	 * 
	 * @return boolean
	 */
	protected function checkEmptyDesk(Desk $desk)
	{
		if($desk->users_id == 0)
		{
			return true;
		}
		
		// Return true if the user sitting at the desk has been fired
		if($desk->users_id > 0 && User::find($desk->users_id)->departmant_id == 21)
		{
			return true;
		}
			
		return false;
	}
	
	/**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        return new Response("Not Implemented", 501);
    }
}
