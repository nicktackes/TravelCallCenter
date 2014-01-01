glu.defView('tc.ContactMeDialog', {
	height: '@{height}',
	width: '@{width}',
	title: '@{title}',

	layout: 'card',
	activeItem: '@{activeCard}',
	items: '@{dialogItems}',
	listeners: {
		resize: function() {
			this.center()
		}
	}
})