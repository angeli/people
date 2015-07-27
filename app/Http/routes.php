<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', 'Index@index');

// A test map view
Route::get('/map', function()
{
	return View::make('map');
});


Route::group(array('prefix' => 'api'), function() {
    # return Route::resource('get', 'Index' );
});


//App::missing(function($exception) {
//    return View::make('index');
//});
