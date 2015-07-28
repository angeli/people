
define('ngController/TestCtrl', ['ngController/Abstract'], function(AbstractCtrl)
{
	var TestCtrl = function()
	{
		this.test = "Hello, Nurse!!!";
	}
	
	TestCtrl.prototype = new AbstractCtrl;
	
	return TestCtrl;
});


