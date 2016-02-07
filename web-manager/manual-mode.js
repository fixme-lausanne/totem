if (Meteor.isClient) {
	Template.manualMode.events({
		'click #manual-mode-button': function (e) {
			e.preventDefault();
			Meteor.call('emitJson', document.querySelector('#manual-mode-input').value);
		}
	});
}
