<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Database\DatabaseManager;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index(Request $request, DatabaseManager $db)
    {
        # $host = explode('.', gethostbyaddr($request->server->get('REMOTE_ADDR')));
		# $host = $host[0];

		$host = getenv('COMPUTERNAME');

		$res = $db->table('computers')->select('u_name', 'user_id')->join('users', 'u_id', '=', 'user_id')->where('name', '=', $host)->first();

		$ret = [];

		if( $res ) {
			$ret = [
				'name' => $res->u_name,
				'success' => $this->checkUser($res->user_id)
			];
		}
		
		return response()
			->json($ret);
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
        return new Response("Not Implemented", 501);
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
