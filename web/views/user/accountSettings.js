glu.defView('tc.accountSettings', {
    title: '~~title~~',
    width: 400,
    height: 300,
    defaults: {
        labelWidth: 200
    },
    buttons: [{
        xtype: 'button',
        name: 'createNewMember',
        disabled: '@{!createNewMemberEnabled}'
    }],
    items: [{
        xtype: 'panel',
        html: '<div align="center" style="height:50px;" class="instructions">Update account information.</div>'
    }, {
        name: 'email',
        xtype: 'textfield',
        inputType: 'email',
        vtype: 'email',
        enterKeyHandler: '@{createNewMember}',
        focusField: true,
        plugins: ['clearbutton']
    }, {
        name: 'username',
        xtype: 'textfield',
        enterKeyHandler: '@{createNewMember}',
        plugins: ['clearbutton']
    }, {
        xtype: 'checkbox',
        handler: '@{doChangePassword}',
        fieldLabel: 'Change Password?'
    }, {
        name: 'password',
        xtype: 'textfield',
        inputType: 'password',
        enterKeyHandler: '@{createNewMember}',
        plugins: ['clearbutton'],
        hidden: '@{!changePassword}'
    }, {
        name: 'passwordConfirm',
        xtype: 'textfield',
        inputType: 'password',
        enterKeyHandler: '@{createNewMember}',
        plugins: ['clearbutton'],
        hidden: '@{!changePassword}'
    }]
});