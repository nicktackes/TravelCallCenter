glu.defModel('tc.ContactMe', {

	height: 500,
	width: 800,

	age: 0,
	gender: '',
	cancerType: '',
	molecularSubType: '',
	name: '',
	phoneNumber: '',

	emailAddress: '',
	ecog: '0',
	ecogStore: {
		mtype: 'store',
		fields: ['name', 'value'],
		proxy: {
			type: 'memory',
			reader: {
				type: 'json'
			}
		},
		data: [{
			name: '0 - Fully active',
			value: '0'
		}, {
			name: '1 - Restricted in strenuous activity',
			value: '1'
		}, {
			name: '2 - 	Capable of all selfcare but can’t work',
			value: '2'
		}, {
			name: '3 - confined to chair > 50%',
			value: '3'
		}, {
			name: '4 - Cannot carry on any selfcare',
			value: '4'
		}, {
			name: '5 - Dead',
			value: '5'
		}]
	},

	trial: {},

	title$: function() {
		return this.localize('contactMeTitle') + ' ' + this.localize('about') + ' ' + this.trial.title
	},

	contactInformation$: function() {
		if (this.phoneNumber && this.emailAddress) return this.phoneNumber + ' or ' + this.emailAddress
		if (this.phoneNumber && !this.emailAddress) return this.phoneNumber
		if (this.emailAddress && !this.phoneNumber) return this.emailAddress
		return ''
	},

	previewText$: function() {
		return Ext.String.format('Hello, my name is {0}.  I am a {1} year old {2} with an ecog of {7} with {5}{3} cancer.  I found your trial through Molecular Match and would like more information about your trial "{6}."  Please contact me at {4} at your earliest convenience.\n\nThank you,\n{0}', this.name || '{your name}', this.age || '{your age}', this.gender || '{your gender}', this.cancerType || '{your cancer type}', this.contactInformation || '{your phone and/or email address}', this.molecularSubType ? this.molecularSubType + ' mutated ' : '', this.trial.title, this.ecog)
	},

	init: function() {},

	contact: function() {
		//TODO: Send contact email to the clinical trial
		this.nextOrClose()
	},
	cancel: function() {
		this.doClose()
	},

	nextOrClose: function() {
		if (!this.rootVM.authenticated) this.parentVM.open({
			mtype: 'tc.SignUp'
		})
		this.doClose()
	}
})