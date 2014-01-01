glu.defModel('tc.user', {
    modelType:'user',
    isSaving : false,
    closeDialog:false,
    changePassword:false,
    passwordHidden:false,
    save:function(){
        this.set('isSaving', true)
        var user = this.asObject();
        user.changePassword = this.changePassword
        if(!user.changePassword){
            delete user.password
        }
        delete user.passwordConfirm
        this.ajax({
            url:'/json/users/' + this.id +'/action/save',
            method:'POST',
            params:user,
            success:function (data) {
                data = data || {}
                var response = Ext.decode(data.responseText)
                this.set('isSaving',false);
                if (response.error) {
                    this.rootVM.openError(response.error);
                    return;
                 }
                this.parentVM.refreshUser();
                this.close()
                this.rootVM.openMessage(response.success);
            }
        });
    },
    init:function(){

    },
    load:function (id) {
        this.ajax({
            url:'/json/user/' + id,
            success:function (r) {
                var response = Ext.decode(r.responseText)
                if (response.error) {
                    this.close()
                    this.rootVM.openError(response.error);
                    return;
                }
                this.loadData(response);
            }
        })
    },
    isNew:function(){
        this.set('changePassword', true)
        this.set('passwordHidden', true)
    },
    saveIsEnabled$:function(){
        return this.isDirty && this.isValid && !this.isSaving;
    },
    usernameIsValid$:function () {
        return this.get('username') && this.get('username').length > 0 ? true : this.localize('valid_nameOneCharacter');
    },

    emailIsValid$:function(){
        return Ext.data.validations.email({}, this.get('email'))?true:this.localize('valid_email');
    },

    passwordIsValid$:function(){
        var result = true
        if(this.changePassword){
            if(this.get('passwordConfirm').length == 0 || this.get('password')!=this.get('passwordConfirm')){
                result = false
            }
        }
        return result
    },
    doChangePassword:function(){
        this.set('changePassword', !this.changePassword)
        if(!this.changePassword){return;}
        // reset the password and password confirm fields
        this.set('password','')
        this.set('passwordConfirm','')
    }
});