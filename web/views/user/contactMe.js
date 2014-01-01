glu.defView('tc.ContactMe', {
	height: '@{height}',
	width: '@{width}',
	title: '@{title}',
	layout: 'fit',
	items: [{
		xtype: 'form',
		bodyPadding: '10px',
		defaults: {
			anchor: '-20',
			labelWidth: 125
		},
		items: [{
			xtype: 'textfield',
			name: 'name'
		}, {
			xtype: 'numberfield',
			name: 'age'
		}, {
			xtype: 'combobox',
			name: 'gender',
			displayField: 'name',
			valueField: 'value'

		}, {
			xtype: 'textfield',
			name: 'phoneNumber'
		}, {
			xtype: 'textfield',
			name: 'emailAddress',
			fieldLabel: '~~emailAddress~~'
		}, {
			xtype: 'textfield',
			name: 'cancerType'
		}, {
			xtype: 'textfield',
			name: 'molecularSubType'
		}, {
			xtype: 'combobox',
			name: 'ecog',
			store: '@{ecogStore}',
			displayField: 'name',
			valueField: 'value',
			queryMode: 'local'
		}, {
			xtype: 'textarea',
			anchor: '-20 -200',
			labelAlign: 'top',
			name: 'previewText'
		}],
		buttons: ['cancel', 'contact']
	}]
})