<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;



use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Model\Desk;


class DeskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
		$desks = Desk::leftJoin('users', 'users_id', '=', 'u_id')->where('users_id', '<>', 0)->get()->toArray();

		$ret = [];
		foreach( $desks as $k => $d )
		{
			$d['bg_name'] = mb_convert_encoding($d['bg_name'], 'UTF-8', 'cp1251');
			$ret[$k] = $d;
		}

		return response()->json($ret);
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
		if(empty($id)) {
			return new Response("Mandatory parameter(s) are missing.", 405);
		}

		try {
			$desk = Desk::findOrFail($id);
			$res = $desk->user;

			if( is_null($res ) ) {
				return response(json_encode(['u_id' => 0]), 404)
					->header('Content-Type', 'application/json');
			}

			return response()
				->json($res->toArray());

		}
		catch (\Exception $e) {
			return new Response("There was an error while processing the update request: " . $e->getMessage(), 500);
		}
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
		$user = $request->input('user', '');

		if( empty($id) || $user === '' ) {
			return new Response("Mandatory parameter(s) are missing.", 405);
		}

		try {
			$desk = Desk::findOrFail($id);
			$desk->users_id = $user;
			$desk->save();

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
