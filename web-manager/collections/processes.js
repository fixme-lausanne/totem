Processes = new Mongo.Collection("processes");

Processes.attachSchema(new SimpleSchema({
	"command" : {
		type: String,
		label: "Command line launching the process"
	},
	"description" : {
		type: String,
		label: "Process description"
	},
	"enable": {
		type: Boolean,
		label: "Enable",
		defaultValue: true
	}
}));

Processes.after.insert(function (userId, doc) {
	console.log(userId);
	console.log(doc);
	Meteor.call("launchProcess", doc._id, doc.command)
});
