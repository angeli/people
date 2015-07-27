<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Desk extends Model
{
	public $timestamps = false;

	public function user()
	{
		return $this->hasOne('App\Model\User', 'u_id', 'users_id');
	}
}
