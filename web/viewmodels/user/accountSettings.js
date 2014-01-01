glu.defModel('tc.accountSettings', {
    modelType: 'user',
    createNewMemberEnabled: false,
    closeDialog: false,
    changePassword: false,
    cancelNewMember: function() {
        this.parentVM.hideNewMemberDialog()

    },
    createNewMember: function() {
        if (!this.createNewMemberEnabled) {
            return;
        }
        var account = this.asObject();
        account.changePassword = this.changePassword
        this.ajax({
            url: '/json/users' + this.get('id') + '/action/save',
            method: 'POST',
            params: account,
            success: function(data) {
                data = data || {}
                var response = Ext.decode(data.responseText)
                if (response.error) {
                    this.parentVM.openError(response.error);
                } else {
                    this.doClose()
                    this.parentVM.openMessage('Your account has been saved.');
                }
            }
        });
    },
    init: function() {

    },
    doChangePassword: function() {
        this.set('changePassword', !this.changePassword)
        if (!this.changePassword) {
            return;
        }
        // reset the password and password confirm fields
        this.set('password', '')
        this.set('passwordConfirm', '')
    },
    when_new_user_attributes_changes: {
        on: ['usernameChanged', 'passwordChanged', 'passwordConfirmChanged', 'emailChanged', 'changePasswordChanged'],
        action: function() {
            var result = this.get('username').length > 0
            if (result) {
                result = this.get('email').length > 0 && Ext.data.validations.email({}, this.get('email'))
            }
            if (this.changePassword) {
                if (result) {
                    result = this.get('passwordConfirm').length > 0
                }
                if (result) {
                    result = this.get('password') == this.get('passwordConfirm')
                }
            }
            this.set('createNewMemberEnabled', result)
        }
    }
});