glu.defModel('tc.ContactMeDialog', {

	height: 600,
	width: 800,

	emailAddress: '',

	when_activeCard_changes_update_title: {
		on: ['activeCardChanged'],
		action: function() {
			this.set('title', this.activeCard.title)
			this.set('height', this.activeCard.height)
			this.set('width', this.activeCard.width)
		}
	},

	title: '',

	init: function() {
		var cancerTypeModel = this.rootVM.cancerTypeStore.findRecord('value', this.rootVM.cancerType),
			molecularSubTypeModel = this.rootVM.molecularSubTypeStore.findRecord('name', this.rootVM.molecularSubType)

			this.dialogItems.add({
				mtype: 'tc.ContactMe',
				trial: this.parentVM.searchStore.getAt(this.parentVM.mousedOverTrialIndex).data,
				cancerType: cancerTypeModel ? cancerTypeModel.get('name') : '',
				molecularSubType: molecularSubTypeModel ? molecularSubTypeModel.get('display') : ''
			})

			this.set('activeCard', this.dialogItems.getAt(0))

			if (!this.rootVM.authenticated) this.dialogItems.add({
				mtype: 'tc.SignUp'
			})
	},

	nextOrClose: function() {
		if (this.dialogItems.indexOf(this.activeCard) < this.dialogItems.length - 1) this.set('activeCard', this.dialogItems.indexOf(this.activeCard) + 1)
		else this.doClose()
	}
})