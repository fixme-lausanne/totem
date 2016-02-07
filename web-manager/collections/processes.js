Processes = new Mongo.Collection("processes");

Processes.attachSchema(new SimpleSchema({
	"command" : {
		type: String,
		label: "Command line launching the process"
	},
	"description" : {
		type: String,
		label: "Process description"
	}
}));
