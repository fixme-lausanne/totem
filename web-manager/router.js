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

Router.route('/processes', {
	name: 'processManager',
	template: 'processManager',
	data: function () {
		return Processes.find();
	}
});

Router.route('/manual', function () {
	this.render('manualMode');
});
