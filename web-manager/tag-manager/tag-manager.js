if (Meteor.isClient) {
	Template.tagManager.events({
		'click .remove': function (e) {
			e.preventDefault();
			var value = e.currentTarget.getAttribute('data-value');
			var id = e.currentTarget.getAttribute('data-id');
			Screens.update({ _id: id }, { $pull: { tags: { value: value } }});
		}
	});
}

// Screens.update({ name: "Screen 4" }, { $addToSet: { tags: { value: "YEY" } } } );
