<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;


/**
 * Handles users @ desks tasks
 */
class Desk extends Controller
{

	public function index()
	{
		$d = new \App\Model\Desk();

		$desks = $d->leftJoin('users', 'user_id', '=', 'u_id')->get();

        return Response::json($desks);
	}


}
