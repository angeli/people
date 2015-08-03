<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $table = 'departmants';

	protected function users()
	{
		return $this->hasMany('App\Model\User', 'departmant_id', 'id');
	}

}
