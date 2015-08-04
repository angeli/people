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
    public function index(DatabaseManager $db)
    {
		$users = User::select('u_id', 'u_name', 'e-mail', 'location',
				'desks.id as desk', 'departmants.job', 'departmants.dep')
			->leftJoin('desks', 'users_id', '=', 'u_id')
			->join('departmants', 'departmants.id', '=', 'departmant_id')

			# not quit / fired
			->where('departmant_id', '!=', 21)
			->get()
			->keyBy('u_id')
			->toArray();

        # $host = explode('.', gethostbyaddr($request->server->get('REMOTE_ADDR')));
		# $host = $host[0];

		$host = getenv('COMPUTERNAME');
		$res = $db->table('computers')->select('user_id')->where('name', '=', $host)->first();

		if( $res ) {
			$users[$res->user_id]['current'] = true;
			$users[$res->user_id]['edit'] = $this->checkUser($res->user_id);
		}

		return response()->json($users);
    }


	protected function checkUser($id = 0)
	{
		$allowed = [8, 17, 18, 22, 40, 48, 76];
		if( in_array($id, $allowed) )
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

			$user = User::findOrFail($id);

			$desk = $user->desk;

			if( $desk === null )
			{
				$desk = new Desk;
				$desk->id = 0;
				$desk->users_id = $id;
			}

			if( $from != $desk->id ) {
				return new Response("Out of sync, user was moved someplace else already.", 409);
			}

			if( $to != 0 ) {
				$desk = Desk::findOrFail($to);

				if( $desk->users_id != 0 ) {
					return new Response("Out of sync, target desk is not empty.", 409);
				}
			} else {
				$id = 0;
			}

			$desk->users_id = intval($id);
			$desk->save();

			return response()->json( $desk->toArray() );


		}
		catch (\Exception $e) {
			return new Response("There was an error while processing the update request: " . $e->getMessage(), 500);
		}
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
