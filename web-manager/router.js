Router.route('/', function () {
	this.render('manualMode');
});

Router.route('/tags', function () {
	this.render('tagManager');
});

Router.route('/processes', function () {
	this.render('processes');
});

Router.route('/manual', function () {
	this.render('manualMode');
});
