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
        return Response::json(Comment::get());
	}


}
