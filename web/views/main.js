glu.defView('tc.Main', {
    layout: {
   		type: 'vbox',
   		align: 'stretch'
   	},
   	defaults: {
   		border: false
   	},
   	items: [{
   			flex: 1,
   			defaults: {
   				border: false,
   				hideMode: 'offsets'
   			},
   			layout: 'card',
   			activeItem: '@{currentScreen}',
   			items: '@{screenList}',
   			dockedItems: [{
   					dock: 'top',
   					border: false,
   					layout: {
   						type: 'hbox',
   						align: 'top'
   					},
   					items: [
   						{
   							flex: 1,
   							xtype: 'toolbar',
   							items: ['->', {
   									xtype: 'combobox',
   									name: 'feature',
   									hideLabel: true,
   									emptyText: '~~myFeatures~~',
   									queryMode: 'local',
   									editable: false,
   									displayField: 'name',
   									valueField: 'mtype',
   									padding: '0 10 0 0'
   								}, {
   									xtype: 'textfield',
   									name: 'email',
   									enterKeyHandler: '@{login}',
   									hideLabel: true,
   									emptyText: '~~email~~'
   								}, {
   									xtype: 'textfield',
   									inputType: 'password',
   									name: 'password',
   									enterKeyHandler: '@{login}',
   									hideLabel: true,
   									emptyText: '********'
   								}, {
   									name: 'login'
   								}, {
   									name: 'logout'
   								}
   							]
   						}
   					]
   				}
   			]
   		}
   	]
});