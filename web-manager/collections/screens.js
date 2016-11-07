Screens = new Mongo.Collection("screens");

Screens.attachSchema(new SimpleSchema({
	"name" : {
		type: String,
		label: "Screen Name",
		max: 100
	},
	"number" : {
		type: Number,
		label: "From 0"
	},
	"tags.$.value": {
		type: String
	},
	"tags.$.priority": {
		type: Number,
		optional: true
	},
	"tags.$.duration": {
		type: Number,
		optional: true
	},
	"tags.$.blink": {
		type: Boolean,
		optional: true
	}
}));

// Create screens if there is none
if (Meteor.isServer) {
	if (Screens.find().count() === 0) {
		for (let i = 0; i < 4; i++) {
			Screens.insert({
				name: 'Screen ' + (i + 1),
				tags: [],
				number: i + 1
			})
		}
	}
}
