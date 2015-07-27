<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
# use Illuminate\Http\Response;

# use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Model\Desk;

class Index extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
		$d = new Desk();

		$desks = $d->leftJoin('users', 'users_id', '=', 'u_id')->where('users_id', '<>', 0)->get()->toArray();

		$ret = [];
		foreach( $desks as $k => $d )
		{
			$d['bg_name'] = mb_convert_encoding($d['bg_name'], 'UTF-8', 'cp1251');
			$ret[$k] = $d;
		}
//
//		echo '<pre>';
//		print_r( $ret );
//		echo '</pre>';
//		die();


	    return response()->json($ret);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
