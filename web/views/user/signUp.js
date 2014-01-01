glu.defView('tc.SignUp', {
	xtype: 'form',
	bodyPadding: '10px',
	defaults: {
		anchor: '-20'
	},
	items: [{
		xtype: 'label',
		text: 'Would you like to create an account?'
	}, {
		xtype: 'textfield',
		name: 'email',
		fieldLabel: '~~emailAddress~~'
	}, {
		xtype: 'textfield',
		inputType: 'password',
		name: 'password'
	}, {
			xtype: 'textfield',
			inputType: 'password',
			name: 'passwordConfirm'
		}],
	buttons: ['notnow', 'signUp']
})