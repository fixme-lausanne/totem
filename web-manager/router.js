Router.route('/', function () {
	this.render('manualMode');
});

Router.route('/tags', {
	name: 'tagManager',
	template: 'tagManager',
	data: function () {
		return Screens.find();
	}
});

Router.route('/processes', function () {
	this.render('processManager');
});

Router.route('/manual', function () {
	this.render('manualMode');
});
