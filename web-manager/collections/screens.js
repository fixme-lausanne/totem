Screens = new Mongo.Collection("screens");

Screens.attachSchema(new SimpleSchema({
	"name" : {
		type: String,
		label: "Screen Name",
		max: 100
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
