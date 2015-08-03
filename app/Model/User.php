<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $primaryKey = 'u_id';
	public $timestamps = false;

	protected function getBgNameAttribute($value)
	{
		return mb_convert_encoding($value, 'UTF-8', 'cp1251');
	}

	public function desk()
	{
		return $this->belongsTo('App\Model\Desk', 'u_id', 'users_id');
	}


	public function department()
	{
		return $this->hasOne('App\Model\Department', 'id', 'departmant_id');
	}

}
