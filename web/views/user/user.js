glu.defView('tc.user', {
    xtype: 'panel',
    layout: 'fit',
    items: [{
        xtype: 'form',
        defaultType: 'autofield',
        defaults: {
            width: 350,
            labelWidth: 160
        },
        items: [{
            name: 'email',
            xtype: 'textfield',
            inputType: 'email',
            vtype: 'email',
            enterKeyHandler: '@{save}',
            focusField: true
        }, {
            name: 'username',
            xtype: 'textfield',
            enterKeyHandler: '@{save}'
        }, {
            name: 'type',
            emptyText: '~~accountType~~',
            xtype: 'combo',
            store: '@{..accountTypeStore}',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'value'
        }, {
            xtype: 'checkbox',
            handler: '@{doChangePassword}',
            fieldLabel: 'Change Password?',
            hidden: '@{passwordHidden}'
        }, {
            name: 'password',
            xtype: 'textfield',
            inputType: 'password',
            enterKeyHandler: '@{save}',
            hidden: '@{!changePassword}'
        }, {
            name: 'passwordConfirm',
            xtype: 'textfield',
            inputType: 'password',
            enterKeyHandler: '@{save}',
            hidden: '@{!changePassword}'
        }]
    }],
    defaults: {
        bodyPadding: 20
    },
    buttons: ['save'],
    //settings when in window mode
    asWindow: {
        defaults: {
            header: false,
            border: false
        },
        title: '~~title~~',
        width: 400,
        height: 300
    }
});