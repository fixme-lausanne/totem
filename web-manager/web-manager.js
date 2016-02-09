if (Meteor.isServer) {
	Meteor.startup(function () {
		// Launch processes
		let procs = Processes.find({ enable: true }).forEach((proc) => {
			Meteor.call('launchProcess', proc._id, proc.command);
		});
	});
}
