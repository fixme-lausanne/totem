Router.route('/', function () {
	this.redirect('/tags');
});

Router.route('/tags', {
	name: 'tagManager',
	template: 'tagManager',
	data: function () {
		return Screens.find({}, { sort: { number: 1 } });
	}
});

Router.route('/processes', {
	name: 'processManager',
	template: 'processManager',
	data: function () {
		return Processes.find();
	}
});

Router.route('/manual', {
	name: 'manualMode',
	template: 'manualMode'
});
