if (Meteor.isClient) {
	Template.tagManager.events({
		'click .remove': function (e) {
			e.preventDefault();
			var value = e.currentTarget.getAttribute('data-value');
			var id = e.currentTarget.getAttribute('data-id');
			Screens.update({ _id: id }, { $pull: { tags: { value: value } }});
		},
		'click .add': function (e) {
			e.preventDefault();
			var id = e.currentTarget.getAttribute('data-id');
			var value = document.querySelector('.new-tag-' + id).value;
			Screens.update({ _id: id }, { $addToSet: { tags: { value: value } } } );
			document.querySelector('.new-tag-' + id).value = "";
		}
	});
}

